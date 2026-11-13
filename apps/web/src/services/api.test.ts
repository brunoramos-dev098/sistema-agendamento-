import { afterEach, expect, it, vi } from "vitest";
import { api } from "./api";

afterEach(() => vi.unstubAllGlobals());

it("explica indisponibilidade quando o proxy retorna erro sem JSON", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
  );
  await expect(api("clientes")).rejects.toThrow("O serviço está indisponível");
});

it("preserva mensagens de validação da API", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ message: ["Email inválido"] }), {
          status: 400,
        }),
      ),
  );
  await expect(api("clientes")).rejects.toThrow("Email inválido");
});

it("retorna os dados JSON em uma consulta bem-sucedida", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("[]")));
  await expect(api("clientes")).resolves.toEqual([]);
});
