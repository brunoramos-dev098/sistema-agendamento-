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
          duracao: 30,
        })
      ).json();
      expect(
        (await request("profissionais/" + p.id + "/servicos/" + s.id, "PUT"))
          .ok,
      ).toBe(true);
      const profissionais = await (await request("profissionais")).json();
      const cadastrado = profissionais.find(
        (v: { id: string }) => v.id === p.id,
      );
      expect(cadastrado.disponibilidades).toHaveLength(6);
      expect(
        cadastrado.disponibilidades.every(
          (v: { inicioMinuto: number; fimMinuto: number }) =>
            v.inicioMinuto === 540 && v.fimMinuto === 1170,
        ),
      ).toBe(true);
      const consultar = async (data: string): Promise<string[]> =>
        (
          await request(
            "agendamentos/horarios?" +
              new URLSearchParams({
                profissionalId: p.id,
                servicoId: s.id,
                data,
              }),
          )
        ).json();
      const quinta = "2030-01-10";
      const livres = await consultar(quinta);
      expect(livres).toHaveLength(21);
      expect(livres[0]).toBe(quinta + "T12:00:00.000Z");
      expect(livres.at(-1)).toBe(quinta + "T22:00:00.000Z");
      const cliente2 = await (
        await request("clientes", "POST", {
          ...pessoa,
          email: "outro-" + suffix + "@test.local",
        })
      ).json();
      const reservar = (inicio: string, clienteId = c.id) =>
        request("agendamentos", "POST", {
          clienteId,
          profissionalId: p.id,
          servicoId: s.id,
          inicio,
        });
      const primeira = await reservar(quinta + "T12:00:00Z");
      expect(primeira.status).toBe(201);
      expect((await reservar(quinta + "T12:30:00Z", cliente2.id)).status).toBe(
        201,
      );
      expect((await consultar(quinta))[0]).toBe(quinta + "T13:00:00.000Z");
      const concorrentes = await Promise.all([
        reservar(quinta + "T15:00:00Z"),
        reservar(quinta + "T15:00:00Z", cliente2.id),
      ]);
      expect(concorrentes.filter((r) => r.status === 201)).toHaveLength(1);
      expect(
        concorrentes.filter((r) => r.status === 400 || r.status === 409),
      ).toHaveLength(1);
      expect(await consultar(quinta)).not.toContain(quinta + "T15:00:00.000Z");
      const primeiraId = (await primeira.json()).id;
      await request("agendamentos/" + primeiraId + "/status", "PATCH", {
        status: "CANCELADO",
      });
      expect((await consultar(quinta))[0]).toBe(quinta + "T12:00:00.000Z");
      expect(await consultar("2030-01-13")).toEqual([]);
      expect((await reservar(quinta + "T12:15:00Z")).status).toBe(400);
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
            inicio: "2030-01-07T13:00:00Z",
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
