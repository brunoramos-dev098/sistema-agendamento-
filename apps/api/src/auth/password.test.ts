import { it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password.js";
it("senhas iguais recebem salts diferentes e exigem a senha correta", async () => {
  const senha = "Senha-longa-para-teste-123";
  const a = await hashPassword(senha),
    b = await hashPassword(senha);
  expect(a).not.toContain(senha);
  expect(a).not.toBe(b);
  expect(await verifyPassword(senha, a)).toBe(true);
  expect(await verifyPassword("outra senha", a)).toBe(false);
  expect(await verifyPassword(senha, "hash inválido")).toBe(false);
});
