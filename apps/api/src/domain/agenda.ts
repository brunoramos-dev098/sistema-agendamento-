import { DateTime } from "luxon";
export const ZONE = "America/Fortaleza";
export type Ocupacao = { id: string; inicio: Date; fim: Date; status: string };
export function validarAgenda(
  inicio: Date,
  duracao: number,
  associado: boolean,
  periodos: { diaSemana: number; inicioMinuto: number; fimMinuto: number }[],
  ocupados: Ocupacao[],
  ignorar?: string,
  agora = new Date(),
) {
  if (!Number.isFinite(+inicio) || +inicio < +agora)
    throw new Error("Data passada ou inválida");
  if (!associado) throw new Error("Profissional não associado ao serviço");
  const local = DateTime.fromJSDate(inicio, { zone: ZONE });
  const fim = new Date(+inicio + duracao * 60000);
  const minuto =
    local.hour * 60 +
    local.minute +
    local.second / 60 +
    local.millisecond / 60000;
  if (
    !periodos.some(
      (p) =>
        p.diaSemana === local.weekday &&
        minuto >= p.inicioMinuto &&
        minuto + duracao <= p.fimMinuto,
    )
  )
    throw new Error("Fora da disponibilidade");
  if (
    ocupados.some(
      (a) =>
        a.id !== ignorar &&
        a.status !== "CANCELADO" &&
        +a.inicio < +fim &&
        +a.fim > +inicio,
    )
  )
    throw new Error("Conflito de horário");
  return fim;
}
