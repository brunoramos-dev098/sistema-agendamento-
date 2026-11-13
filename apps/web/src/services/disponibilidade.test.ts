import { expect, it } from "vitest";
import { motivoSemHorario } from "./disponibilidade";
const periodo = {
  id: "p",
  profissionalId: "r",
  diaSemana: 2,
  inicioMinuto: 810,
  fimMinuto: 840,
};
const hoje = "2026-11-13";
it("explica profissional sem disponibilidade", () => {
  expect(motivoSemHorario([], "2026-12-21", 30, hoje)).toContain(
    "ainda não tem disponibilidade",
  );
});
it("explica dia diferente do período semanal cadastrado", () => {
  expect(motivoSemHorario([periodo], "2026-12-21", 30, hoje)).toContain(
    "segunda-feira",
  );
});
it("explica período menor que a duração do serviço", () => {
  expect(
    motivoSemHorario([{ ...periodo, fimMinuto: 820 }], "2026-12-22", 30, hoje),
  ).toContain("não comportam os 30 minutos");
});
it("distingue ocupação ou passado de ausência de configuração", () => {
  expect(motivoSemHorario([periodo], "2026-12-22", 30, hoje)).toContain(
    "ocupados ou já passaram",
  );
  expect(motivoSemHorario([periodo], "2026-11-10", 30, hoje)).toContain(
    "data selecionada já passou",
  );
});
