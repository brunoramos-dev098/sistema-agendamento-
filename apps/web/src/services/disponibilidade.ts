import { Periodo } from "../types";

export const diasSemana = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];
export const hora = (minutos: number) =>
  `${String(Math.floor(minutos / 60)).padStart(2, "0")}:${String(minutos % 60).padStart(2, "0")}`;

export function motivoSemHorario(
  periodos: Periodo[],
  data: string,
  duracao: number,
  hoje: string,
) {
  if (data < hoje)
    return "A data selecionada já passou. Escolha uma data futura.";
  if (!periodos.length)
    return "Este profissional ainda não tem disponibilidade cadastrada.";
  const dia = new Date(data + "T12:00:00Z").getUTCDay() || 7;
  const doDia = periodos.filter((p) => p.diaSemana === dia);
  if (!doDia.length)
    return `Este profissional não tem disponibilidade cadastrada para ${diasSemana[dia - 1].toLocaleLowerCase("pt-BR")}.`;
  if (!doDia.some((p) => p.fimMinuto - p.inicioMinuto >= duracao))
    return `Os períodos cadastrados neste dia não comportam os ${duracao} minutos do serviço.`;
  return "Os horários deste dia estão ocupados ou já passaram. Escolha outra data ou revise a disponibilidade.";
}
