import { describe, it, expect } from "vitest";
import { validarAgenda } from "./agenda.js";
import {
  Cliente,
  Profissional,
  Servico,
  Agendamento,
  StatusAgendamento,
} from "./model.js";
const dia = new Date("2030-01-07T13:00:00Z");
const agora = new Date("2029-01-01");
const periodo = [{ diaSemana: 1, inicioMinuto: 540, fimMinuto: 1080 }];
const ocupado = {
  id: "a",
  inicio: dia,
  fim: new Date("2030-01-07T14:00:00Z"),
  status: "AGENDADO",
};
const validar = (
  inicio = dia,
  associado = true,
  periodos = periodo,
  ocupados = [ocupado],
  ignorar?: string,
) => validarAgenda(inicio, 60, associado, periodos, ocupados, ignorar, agora);
describe("regras de agenda RN01–RN07", () => {
  it("recusa profissional não associado", () =>
    expect(() => validar(dia, false)).toThrow("associado"));
  it("recusa passado", () =>
    expect(() => validar(new Date("2020-01-01"))).toThrow("passada"));
  it("recusa fora da disponibilidade e intervalo que ultrapassa o fim", () => {
    expect(() => validar(dia, true, [])).toThrow("disponibilidade");
    expect(() => validar(new Date("2030-01-07T20:30:00Z"))).toThrow(
      "disponibilidade",
    );
  });
  it("10h30 conflita com atendimento de 10h às 11h", () =>
    expect(() => validar(new Date("2030-01-07T13:30:00Z"))).toThrow(
      "Conflito",
    ));
  it("11h é permitido", () =>
    expect(validar(new Date("2030-01-07T14:00:00Z")).toISOString()).toBe(
      "2030-01-07T15:00:00.000Z",
    ));
  it("cancelado libera horário e mantém registro", () => {
    const cancelado = { ...ocupado, status: "CANCELADO" };
    expect(() => validar(dia, true, periodo, [cancelado])).not.toThrow();
    expect(cancelado.id).toBe("a");
  });
  it("alteração ignora próprio registro", () =>
    expect(() => validar(dia, true, periodo, [ocupado], "a")).not.toThrow());
  it("associação bidirecional é protegida por cópias", () => {
    const p = new Profissional("p", "P", "1", "p@a.com", "Cabelo");
    const s = new Servico("s", "Corte", "", "25.50", 60);
    p.adicionarServico(s);
    expect(s.profissionais).toEqual([p]);
    p.servicos.pop();
    expect(p.servicos).toEqual([s]);
    s.removerProfissional(p);
    expect(p.servicos).toHaveLength(0);
  });
  it.each(["cliente", "profissional", "servico"])("exige %s", (campo) => {
    const c = new Cliente("c", "C", "1", "c@a.com");
    const p = new Profissional("p", "P", "1", "p@a.com", "");
    const s = new Servico("s", "S", "", "1", 60);
    const refs = { cliente: c, profissional: p, servico: s };
    Reflect.set(refs, campo, undefined);
    expect(
      () =>
        new Agendamento(
          "a",
          dia.toISOString(),
          ocupado.fim.toISOString(),
          StatusAgendamento.AGENDADO,
          refs.cliente,
          refs.profissional,
          refs.servico,
        ),
    ).toThrow("obrigatórias");
  });
});
