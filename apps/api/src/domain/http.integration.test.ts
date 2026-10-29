import { it, expect } from "vitest";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
it.skipIf(!process.env.TEST_DATABASE_URL)(
  "API NestJS cria, valida, altera e cancela atendimento persistido",
  async () => {
    const child = spawn(process.execPath, ["dist/main.js"], {
      env: {
        ...process.env,
        DATABASE_URL: process.env.TEST_DATABASE_URL,
        PORT: "3199",
      },
      stdio: "pipe",
    });
    let logs = "";
    child.stdout.on("data", (d) => (logs += d));
    child.stderr.on("data", (d) => (logs += d));
    const request = async (path: string, method = "GET", data?: unknown) =>
      fetch("http://127.0.0.1:3199/" + path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: data ? JSON.stringify(data) : undefined,
      });
    try {
      let ready = false;
      for (let n = 0; n < 100; n++) {
        try {
          if ((await request("clientes")).ok) {
            ready = true;
            break;
          }
        } catch {
          /* aguarda bootstrap */
        }
        await new Promise((r) => setTimeout(r, 100));
      }
      if (!ready) throw new Error("API não iniciou: " + logs);
      const suffix = randomUUID();
      const pessoa = {
        nome: "Integração",
        telefone: "85999999999",
        email: suffix + "@test.local",
      };
      const c = await (await request("clientes", "POST", pessoa)).json();
      const p = await (
        await request("profissionais", "POST", {
          ...pessoa,
          especialidade: "Teste",
        })
      ).json();
      const s = await (
        await request("servicos", "POST", {
          nome: "Teste",
          descricao: "Integração",
          preco: "50.00",
          duracao: 60,
        })
      ).json();
      expect(
        (await request("profissionais/" + p.id + "/servicos/" + s.id, "PUT"))
          .ok,
      ).toBe(true);
      expect(
        (
          await request("disponibilidades", "POST", {
            profissionalId: p.id,
            diaSemana: 1,
            inicioMinuto: 540,
            fimMinuto: 1080,
          })
        ).ok,
      ).toBe(true);
      const dto = {
        clienteId: c.id,
        profissionalId: p.id,
        servicoId: s.id,
        inicio: "2030-01-07T13:00:00Z",
      };
      expect((await request("agendamentos", "POST", {})).status).toBe(400);
      const created = await request("agendamentos", "POST", dto);
      expect(created.status).toBe(201);
      const a = await created.json();
      expect(
        (
          await request("agendamentos", "POST", {
            ...dto,
            inicio: "2030-01-07T13:30:00Z",
          })
        ).status,
      ).toBe(400);
      expect((await request("agendamentos/" + a.id, "PUT", dto)).ok).toBe(true);
      expect(
        (
          await request("agendamentos/" + a.id + "/status", "PATCH", {
            status: "CANCELADO",
          })
        ).ok,
      ).toBe(true);
      expect((await request("agendamentos", "POST", dto)).status).toBe(201);
      const historico = await (await request("agendamentos")).json();
      expect(
        historico.some(
          (v: { id: string; status: string }) =>
            v.id === a.id && v.status === "CANCELADO",
        ),
      ).toBe(true);
    } finally {
      child.kill();
    }
  },
  30000,
);
