import { Actor, exigirDono } from "../auth/access.js";
import {
  ForbiddenException,
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { DateTime } from "luxon";
import { AgendaRepository } from "./agenda.repository.js";
import { AgendamentoDto } from "../common/dto.js";
import { validarAgenda, ZONE } from "../domain/agenda.js";
import { StatusAgendamento } from "../domain/model.js";
@Injectable()
export class AgendaService {
  constructor(private readonly repo: AgendaRepository) {}
  list(user: Actor) {
    return this.repo.list(user);
  }
  async salvar(dto: AgendamentoDto, user: Actor, id?: string) {
    if (
      user.perfil === "PROFISSIONAL" ||
      (user.perfil === "CLIENTE" && dto.clienteId !== user.clienteId)
    )
      throw new ForbiddenException("Você só pode agendar para seu cadastro");
    return this.executar(() =>
      this.repo.transaction(async (tx) => {
        const anterior = id
          ? await tx.agendamento.findUnique({ where: { id } })
          : null;
        if (id && !anterior)
          throw new NotFoundException("Agendamento não encontrado");
        if (anterior) {
          exigirDono(anterior, user);
          if (
            user.perfil === "CLIENTE" &&
            ["CANCELADO", "CONCLUIDO"].includes(anterior.status)
          )
            throw new ForbiddenException(
              "Atendimento encerrado não pode ser reagendado",
            );
        }
        const [cliente, p, s] = await Promise.all([
          tx.cliente.findUnique({ where: { id: dto.clienteId } }),
          tx.profissional.findUnique({
            where: { id: dto.profissionalId },
            include: { servicos: true, disponibilidades: true },
          }),
          tx.servico.findUnique({ where: { id: dto.servicoId } }),
        ]);
        if (!cliente || !p || !s)
          throw new BadRequestException(
            "Cliente, profissional e serviço são obrigatórios e devem existir",
          );
        const inicio = new Date(dto.inicio);
        const local = DateTime.fromJSDate(inicio, { zone: ZONE });
        if (
          local.minute % 30 !== 0 ||
          local.second !== 0 ||
          local.millisecond !== 0
        )
          throw new BadRequestException(
            "Escolha um horário em blocos de 30 minutos, como 09:00 ou 09:30",
          );
        const ocupados = await tx.agendamento.findMany({
          where: { profissionalId: p.id },
        });
        let fim: Date;
        try {
          fim = validarAgenda(
            inicio,
            s.duracao,
            p.servicos.some((v) => v.servicoId === s.id),
            p.disponibilidades,
            ocupados,
            id,
          );
        } catch (e) {
          throw new BadRequestException((e as Error).message);
        }
        const data = {
          clienteId: cliente.id,
          profissionalId: p.id,
          servicoId: s.id,
          inicio,
          fim,
        };
        return id
          ? tx.agendamento.update({ where: { id }, data })
          : tx.agendamento.create({ data });
      }),
    );
  }
  async status(id: string, status: StatusAgendamento, user: Actor) {
    return this.executar(() =>
      this.repo.transaction(async (tx) => {
        const a = await tx.agendamento.findUnique({ where: { id } });
        if (!a) throw new NotFoundException("Agendamento não encontrado");
        exigirDono(a, user);
        if (
          user.perfil === "CLIENTE" &&
          (status !== "CANCELADO" || a.status === "CONCLUIDO")
        )
          throw new ForbiddenException(
            "Cliente pode apenas cancelar seus atendimentos não concluídos",
          );
        if (
          user.perfil === "PROFISSIONAL" &&
          (!["CONFIRMADO", "CONCLUIDO"].includes(status) ||
            ["CANCELADO", "CONCLUIDO"].includes(a.status))
        )
          throw new ForbiddenException(
            "Profissional pode confirmar ou concluir seus atendimentos ativos",
          );
        // Reativação reavalia disponibilidade e conflitos usando o intervalo histórico.
        if (a.status === "CANCELADO" && status !== "CANCELADO") {
          const p = await tx.profissional.findUniqueOrThrow({
            where: { id: a.profissionalId },
            include: { servicos: true, disponibilidades: true },
          });
          try {
            validarAgenda(
              a.inicio,
              (+a.fim - +a.inicio) / 60000,
              p.servicos.some((v) => v.servicoId === a.servicoId),
              p.disponibilidades,
              await tx.agendamento.findMany({
                where: { profissionalId: p.id },
              }),
              id,
            );
          } catch (e) {
            throw new BadRequestException((e as Error).message);
          }
        }
        return tx.agendamento.update({ where: { id }, data: { status } });
      }),
    );
  }
  async horarios(
    profissionalId: string,
    servicoId: string,
    data: string,
    user: Actor,
    ignorar?: string,
  ) {
    const dia = DateTime.fromISO(data, { zone: ZONE });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || !dia.isValid)
      throw new BadRequestException("Data inválida");
    return this.repo.transaction(async (tx) => {
      const p = await tx.profissional.findUnique({
        where: { id: profissionalId },
        include: { servicos: true, disponibilidades: true },
      });
      const s = await tx.servico.findUnique({ where: { id: servicoId } });
      if (!p || !s) throw new NotFoundException();
      if (ignorar) {
        const atual = await tx.agendamento.findUnique({
          where: { id: ignorar },
        });
        if (!atual) throw new NotFoundException();
        exigirDono(atual, user);
      }
      const ocupados = await tx.agendamento.findMany({
        where: { profissionalId },
      });
      const result: string[] = [];
      for (let m = 0; m < 1440; m += 30) {
        const inicio = dia.startOf("day").plus({ minutes: m }).toJSDate();
        try {
          validarAgenda(
            inicio,
            s.duracao,
            p.servicos.some((v) => v.servicoId === s.id),
            p.disponibilidades,
            ocupados,
            ignorar,
          );
          result.push(inicio.toISOString());
        } catch {
          /* horário indisponível */
        }
      }
      return result;
    });
  }
  private async executar<T>(fn: () => Promise<T>): Promise<T> {
    for (let i = 0; i < 3; i++) {
      try {
        return await fn();
      } catch (e) {
        const error = e as { code?: string; message?: string };
        if (error.code === "P2034" && i < 2) continue;
        if (
          error.code === "P2034" ||
          error.code === "P2004" ||
          error.message?.includes("23P01")
        )
          throw new ConflictException("Horário ocupado por outra reserva");
        throw e;
      }
    }
    throw new ConflictException();
  }
}
