import pg from "pg";
import { hashPassword } from "../auth/password.js";
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
    let cookie = "";
    const request = async (path: string, method = "GET", data?: unknown) =>
      fetch("http://127.0.0.1:3199/" + path, {
        method,
        headers: {
          "Content-Type": "application/json",
          Origin: "http://127.0.0.1:5173",
          Cookie: cookie,
        },
        body: data ? JSON.stringify(data) : undefined,
      });
    try {
      let ready = false;
      for (let n = 0; n < 100; n++) {
        try {
          if ((await request("auth/health")).ok) {
            ready = true;
            break;
          }
        } catch {
          /* aguarda bootstrap */
        }
        await new Promise((r) => setTimeout(r, 100));
      }
      if (!ready) throw new Error("API não iniciou: " + logs);
      const seed = new pg.Client({
        connectionString: process.env.TEST_DATABASE_URL,
      });
      await seed.connect();
      const adminId = randomUUID(),
        contaId = randomUUID();
      const adminEmail = adminId + "@test.local";
      const password = "Senha-inicial-segura-123";
      try {
        await seed.query(
          'INSERT INTO "Administrador" (id,nome,telefone,email) VALUES ($1,$2,$3,$4)',
          [adminId, "Admin teste", "1", adminEmail],
        );
        await seed.query(
          'INSERT INTO "Conta" (id,email,"senhaHash",perfil,"administradorId") VALUES ($1,$2,$3,$4,$5)',
          [
            contaId,
            adminEmail,
            await hashPassword(password),
            "ADMINISTRADOR",
            adminId,
          ],
        );
      } finally {
        await seed.end();
      }
      const login = await request("auth/login", "POST", {
        email: adminEmail,
        senha: password,
      });
      expect(login.status).toBe(201);
      cookie = login.headers.get("set-cookie")!.split(";")[0];
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

      // Autorização real: clientes e profissionais não herdam o acesso administrativo.
      const call = async (
        path: string,
        method = "GET",
        data?: unknown,
        session = "",
        origin = "http://127.0.0.1:5173",
      ) =>
        fetch("http://127.0.0.1:3199/" + path, {
          method,
          headers: {
            "Content-Type": "application/json",
            Origin: origin,
            Cookie: session,
          },
          body: data ? JSON.stringify(data) : undefined,
        });
      expect((await call("agendamentos")).status).toBe(401);
      const register = async (tag: string) => {
        const r = await call("auth/registro", "POST", {
          nome: "Privado " + tag,
          telefone: "1",
          email: tag + suffix + "@test.local",
          senha: password,
        });
        expect(r.status).toBe(201);
        const session = r.headers.get("set-cookie")!.split(";")[0];
        const me = await (
          await call("auth/me", "GET", undefined, session)
        ).json();
        expect(me.perfil).toBe("CLIENTE");
        return { session, me };
      };
      const um = await register("um"),
        dois = await register("dois");
      expect(
        (
          await call("auth/registro", "POST", {
            nome: "Tentativa",
            telefone: "1",
            email: "tentativa" + suffix + "@test.local",
            senha: password,
            perfil: "ADMINISTRADOR",
          })
        ).status,
      ).toBe(400);
      expect(
        (await call("auth/registro", "POST", { ...pessoa, senha: password }))
          .status,
      ).toBe(409);
      expect(
        (
          await call("auth/login", "POST", {
            email: adminEmail,
            senha: "incorreta",
          })
        ).status,
      ).toBe(401);
      const ownDto = {
        clienteId: um.me.clienteId,
        profissionalId: p.id,
        servicoId: s.id,
        inicio: "2031-01-09T12:00:00Z",
      };
      const ownR = await call("agendamentos", "POST", ownDto, um.session);
      expect(ownR.status).toBe(201);
      const own = await ownR.json();
      expect(
        (
          await call(
            "agendamentos",
            "POST",
            { ...ownDto, clienteId: um.me.clienteId },
            dois.session,
          )
        ).status,
      ).toBe(403);
      expect(
        (await call("agendamentos/" + own.id, "PUT", ownDto, dois.session))
          .status,
      ).toBe(403);
      expect(
        (
          await call(
            "agendamentos/" + own.id + "/status",
            "PATCH",
            { status: "CANCELADO" },
            dois.session,
          )
        ).status,
      ).toBe(403);
      const otherList = await (
        await call("agendamentos", "GET", undefined, dois.session)
      ).json();
      expect(otherList).toEqual([]);
      const privateClients = await (
        await call("clientes", "GET", undefined, um.session)
      ).json();
      expect(privateClients).toHaveLength(1);
      expect(privateClients[0].id).toBe(um.me.clienteId);
      const publicProfessionals = await (
        await call("profissionais", "GET", undefined, um.session)
      ).json();
      expect(publicProfessionals[0]).not.toHaveProperty("email");
      expect(publicProfessionals[0]).not.toHaveProperty("telefone");
      for (const resource of [
        "servicos",
        "profissionais",
        "disponibilidades",
        "auth/contas",
      ])
        expect((await call(resource, "POST", {}, um.session)).status).toBe(403);
      expect(
        (await call("auth/contas", "GET", undefined, um.session)).status,
      ).toBe(403);
      expect(
        (
          await call(
            "agendamentos/" + own.id + "/status",
            "PATCH",
            { status: "CONCLUIDO" },
            um.session,
          )
        ).status,
      ).toBe(403);
      expect(
        (
          await call(
            "auth/perfil",
            "PUT",
            {
              nome: "Outra pessoa",
              email: um.me.email,
              telefone: "1",
              perfil: "ADMINISTRADOR",
            },
            um.session,
          )
        ).status,
      ).toBe(400);
      expect(
        (
          await call(
            "auth/logout",
            "POST",
            undefined,
            um.session,
            "https://origem-invalida.test",
          )
        ).status,
      ).toBe(403);
      await request("auth/contas", "POST", {
        perfil: "PROFISSIONAL",
        entidadeId: p.id,
        senha: password,
      });
      const proLogin = await call("auth/login", "POST", {
        email: pessoa.email,
        senha: password,
      });
      expect(proLogin.status).toBe(201);
      const proCookie = proLogin.headers.get("set-cookie")!.split(";")[0];
      const outroProf = await (
        await request("profissionais", "POST", {
          ...pessoa,
          email: "prof2" + suffix + "@test.local",
          especialidade: "Outro profissional",
        })
      ).json();
      await request(
        "profissionais/" + outroProf.id + "/servicos/" + s.id,
        "PUT",
      );
      const outroAgendamento = await (
        await request("agendamentos", "POST", {
          clienteId: dois.me.clienteId,
          profissionalId: outroProf.id,
          servicoId: s.id,
          inicio: "2031-01-09T13:00:00Z",
        })
      ).json();
      expect(
        (
          await call(
            "agendamentos/" + outroAgendamento.id + "/status",
            "PATCH",
            { status: "CONCLUIDO" },
            proCookie,
          )
        ).status,
      ).toBe(403);
      expect(
        (await call("agendamentos", "POST", ownDto, proCookie)).status,
      ).toBe(403);
      const proRows = await (
        await call("agendamentos", "GET", undefined, proCookie)
      ).json();
      expect(
        proRows.every(
          (v: { profissionalId: string }) => v.profissionalId === p.id,
        ),
      ).toBe(true);
      expect(
        (
          await call(
            "agendamentos/" + own.id + "/status",
            "PATCH",
            { status: "CONFIRMADO" },
            proCookie,
          )
        ).status,
      ).toBe(200);
      expect(
        (
          await call(
            "agendamentos/" + own.id + "/status",
            "PATCH",
            { status: "CONCLUIDO" },
            proCookie,
          )
        ).status,
      ).toBe(200);
      expect(
        (
          await call(
            "agendamentos/" + own.id + "/status",
            "PATCH",
            { status: "CANCELADO" },
            um.session,
          )
        ).status,
      ).toBe(403);
      expect(
        (
          await call(
            "auth/senha",
            "POST",
            { senhaAtual: password, novaSenha: "Nova-senha-super-segura-123" },
            dois.session,
          )
        ).status,
      ).toBe(201);
      expect(
        (await call("auth/me", "GET", undefined, dois.session)).status,
      ).toBe(401);
      await call("auth/logout", "POST", undefined, um.session);
      expect((await call("auth/me", "GET", undefined, um.session)).status).toBe(
        401,
      );
    } finally {
      child.kill();
    }
  },
  30000,
);
