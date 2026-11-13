import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  HttpException,
  NotFoundException,
} from "@nestjs/common";
import { randomBytes, createHash } from "node:crypto";
import { PrismaService } from "../prisma/prisma.service.js";
import { hashPassword, verifyPassword } from "./password.js";
import { Actor } from "./access.js";
import { RegistroDto, CriarAcessoDto } from "./auth.dto.js";
export const tokenHash = (token: string) =>
  createHash("sha256").update(token).digest("hex");
@Injectable()
export class AuthService {
  constructor(private readonly db: PrismaService) {}
  private tentativas = new Map<string, { vezes: number; ate: number }>();
  limitar(key: string) {
    const now = Date.now();
    for (const [k, v] of this.tentativas)
      if (v.ate < now) this.tentativas.delete(k);
    const item = this.tentativas.get(key) ?? {
      vezes: 0,
      ate: now + 15 * 60 * 1000,
    };
    if (item.vezes >= 20)
      throw new HttpException(
        "Muitas tentativas. Tente novamente em 15 minutos.",
        429,
      );
    item.vezes++;
    this.tentativas.set(key, item);
  }
  async login(email: string, senha: string) {
    const conta = await this.db.conta.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    const hash = conta?.senhaHash ?? (await hashPassword("conta-inexistente"));
    if (!(await verifyPassword(senha, hash)) || !conta)
      throw new UnauthorizedException("Email ou senha inválidos");
    return this.sessao(conta.id);
  }
  async registrar(dto: RegistroDto) {
    const email = dto.email.trim().toLowerCase();
    if (
      await this.db.cliente.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
      })
    )
      throw new ConflictException(
        "Já existe um cadastro com este email. Solicite seu acesso ao administrador.",
      );
    const senhaHash = await hashPassword(dto.senha);
    const conta = await this.db.$transaction(async (tx) => {
      const cliente = await tx.cliente.create({
        data: { nome: dto.nome, telefone: dto.telefone, email },
      });
      return tx.conta.create({
        data: { email, senhaHash, perfil: "CLIENTE", clienteId: cliente.id },
      });
    });
    return this.sessao(conta.id);
  }
  private async sessao(contaId: string) {
    const token = randomBytes(32).toString("hex");
    await this.db.sessao.deleteMany({
      where: { expiraEm: { lt: new Date() } },
    });
    await this.db.sessao.create({
      data: {
        tokenHash: tokenHash(token),
        contaId,
        expiraEm: new Date(Date.now() + 12 * 3600 * 1000),
      },
    });
    return token;
  }
  async autenticar(token?: string): Promise<Actor> {
    if (!token || !/^[a-f0-9]{64}$/.test(token))
      throw new UnauthorizedException("Entre na sua conta");
    const sessao = await this.db.sessao.findUnique({
      where: { tokenHash: tokenHash(token) },
      include: { conta: true },
    });
    if (!sessao || sessao.expiraEm < new Date())
      throw new UnauthorizedException("Sessão expirada. Entre novamente");
    const { id, email, perfil, clienteId, profissionalId, administradorId } =
      sessao.conta;
    return { id, email, perfil, clienteId, profissionalId, administradorId };
  }
  async sair(token?: string) {
    if (token)
      await this.db.sessao.deleteMany({
        where: { tokenHash: tokenHash(token) },
      });
  }
  async perfil(u: Actor) {
    const dados =
      u.perfil === "CLIENTE"
        ? await this.db.cliente.findUnique({ where: { id: u.clienteId! } })
        : u.perfil === "PROFISSIONAL"
          ? await this.db.profissional.findUnique({
              where: { id: u.profissionalId! },
            })
          : await this.db.administrador.findUnique({
              where: { id: u.administradorId! },
            });
    return { ...u, dados };
  }
  async criarAcesso(dto: CriarAcessoDto) {
    const pessoa =
      dto.perfil === "CLIENTE"
        ? await this.db.cliente.findUnique({ where: { id: dto.entidadeId } })
        : await this.db.profissional.findUnique({
            where: { id: dto.entidadeId },
          });
    if (!pessoa) throw new NotFoundException("Cadastro não encontrado");
    return this.db.conta.create({
      data: {
        email: pessoa.email.trim().toLowerCase(),
        senhaHash: await hashPassword(dto.senha),
        perfil: dto.perfil,
        ...(dto.perfil === "CLIENTE"
          ? { clienteId: pessoa.id }
          : { profissionalId: pessoa.id }),
      },
      select: { id: true, email: true, perfil: true },
    });
  }
  contas() {
    return this.db.conta.findMany({
      select: {
        id: true,
        email: true,
        perfil: true,
        cliente: { select: { nome: true } },
        profissional: { select: { nome: true } },
      },
    });
  }
  async trocarSenha(u: Actor, atual: string, nova: string) {
    const conta = await this.db.conta.findUniqueOrThrow({
      where: { id: u.id },
    });
    if (!(await verifyPassword(atual, conta.senhaHash)))
      throw new UnauthorizedException("Senha atual inválida");
    const senhaHash = await hashPassword(nova);
    await this.db.$transaction([
      this.db.conta.update({ where: { id: u.id }, data: { senhaHash } }),
      this.db.sessao.deleteMany({ where: { contaId: u.id } }),
    ]);
    return { message: "Senha alterada. Entre novamente." };
  }
  async atualizarPerfil(
    u: Actor,
    d: { nome: string; telefone: string; email: string },
  ) {
    const data = { ...d, email: d.email.trim().toLowerCase() };
    await this.db.$transaction(async (tx) => {
      if (u.perfil === "CLIENTE")
        await tx.cliente.update({ where: { id: u.clienteId! }, data });
      else if (u.perfil === "PROFISSIONAL")
        await tx.profissional.update({
          where: { id: u.profissionalId! },
          data,
        });
      else
        await tx.administrador.update({
          where: { id: u.administradorId! },
          data,
        });
      await tx.conta.update({
        where: { id: u.id },
        data: { email: data.email },
      });
    });
    return this.perfil({ ...u, email: data.email });
  }
}
