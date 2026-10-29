import { it, expect } from "vitest";
import pg from "pg";
import { randomUUID } from "node:crypto";
it.skipIf(!process.env.TEST_DATABASE_URL)(
  "PostgreSQL impede duas reservas simultâneas e mantém cancelamento",
  async () => {
    const pool = new pg.Pool({
      connectionString: process.env.TEST_DATABASE_URL,
    });
    const p = randomUUID(),
      c = randomUUID(),
      s = randomUUID();
    const a = randomUUID(),
      b = randomUUID();
    try {
      await pool.query(
        'INSERT INTO "Cliente" (id,nome,telefone,email) VALUES ($1,$2,$3,$4)',
        [c, "Teste", "1", c + "@test.local"],
      );
      await pool.query(
        'INSERT INTO "Profissional" (id,nome,telefone,email,especialidade) VALUES ($1,$2,$3,$4,$5)',
        [p, "Teste", "1", p + "@test.local", "Teste"],
      );
      await pool.query(
        'INSERT INTO "Servico" (id,nome,descricao,preco,duracao) VALUES ($1,$2,$3,10,60)',
        [s, "Teste", "Teste"],
      );
      const reservar = (id: string) =>
        pool.query(
          'INSERT INTO "Agendamento" (id,inicio,fim,status,"clienteId","profissionalId","servicoId") VALUES ($1,$2,$3,$4,$5,$6,$7)',
          [
            id,
            "2030-01-07T13:00:00Z",
            "2030-01-07T14:00:00Z",
            "AGENDADO",
            c,
            p,
            s,
          ],
        );
      const results = await Promise.allSettled([reservar(a), reservar(b)]);
      expect(results.filter((v) => v.status === "fulfilled")).toHaveLength(1);
      expect(results.filter((v) => v.status === "rejected")).toHaveLength(1);
      await pool.query(
        'UPDATE "Agendamento" SET status=$1 WHERE "profissionalId"=$2',
        ["CANCELADO", p],
      );
      await reservar(randomUUID());
      const historico = await pool.query(
        'SELECT status FROM "Agendamento" WHERE "profissionalId"=$1',
        [p],
      );
      expect(historico.rows).toHaveLength(2);
      expect(historico.rows.some((v) => v.status === "CANCELADO")).toBe(true);
    } finally {
      await pool.query('DELETE FROM "Agendamento" WHERE "profissionalId"=$1', [
        p,
      ]);
      await pool.query('DELETE FROM "Profissional" WHERE id=$1', [p]);
      await pool.query('DELETE FROM "Cliente" WHERE id=$1', [c]);
      await pool.query('DELETE FROM "Servico" WHERE id=$1', [s]);
      await pool.end();
    }
  },
  20000,
);
