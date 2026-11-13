import { describe, it, expect } from "vitest";
import { pessoa, servico } from "./Formulario";
describe("formulários", () => {
  it("recusa dados ausentes e email inválido", () => {
    expect(
      pessoa.safeParse({ nome: "", telefone: "", email: "a" }).success,
    ).toBe(false);
  });
  it("recusa dinheiro impreciso e duração inválida", () => {
    expect(
      servico.safeParse({
        nome: "Corte",
        descricao: "",
        preco: "1.001",
        duracao: 0,
      }).success,
    ).toBe(false);
  });
});
