import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLista } from "../hooks/useLista";
import { api } from "../services/api";
import { Atendimento, Registro } from "../types";
export const local = (s: string) =>
  new Date(s).toLocaleString("pt-BR", { timeZone: "America/Fortaleza" });
export function Agenda({ dashboard = false }: { dashboard?: boolean }) {
  const q = useLista<Atendimento>("agendamentos");
  const prof = useLista<Registro>("profissionais");
  const qc = useQueryClient();
  const [data, setData] = useState("");
  const [p, setP] = useState("");
  const [msg, setMsg] = useState("");
  const rows = q.data?.filter(
    (a) =>
      (!p || a.profissional.id === p) &&
      (!data ||
        new Intl.DateTimeFormat("en-CA", {
          timeZone: "America/Fortaleza",
        }).format(new Date(a.inicio)) === data) &&
      (!dashboard ||
        (+new Date(a.inicio) >= Date.now() && a.status !== "CANCELADO")),
  );
  return (
    <>
      <h1>{dashboard ? "Sua agenda, em dia." : "Agenda e histórico"}</h1>
      <p className="subtitle">
        Um espaço para cuidar do seu tempo e de quem conta com você.
      </p>
      {dashboard && (
        <div className="stats">
          <section>
            <p>Próximos atendimentos</p>
            <strong>{rows?.length ?? "—"}</strong>
          </section>
          <section>
            <p>Profissionais cadastrados</p>
            <strong>{prof.data?.length ?? "—"}</strong>
          </section>
          <section>
            <p>Fuso do estabelecimento</p>
            <strong className="timezone">São Luís (MA) · UTC−3</strong>
          </section>
        </div>
      )}
      <section>
        <div className="section-head">
          <h2>{dashboard ? "O que vem a seguir" : "Todos os atendimentos"}</h2>
          <a href="/novo">+ Novo agendamento</a>
        </div>
        {!dashboard && (
          <div className="form-grid">
            <label>
              Data
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </label>
            <label>
              Profissional
              <select value={p} onChange={(e) => setP(e.target.value)}>
                <option value="">Todos</option>
                {prof.data?.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nome}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        {q.isPending ? (
          <p>Carregando agenda…</p>
        ) : q.error ? (
          <p role="alert">Não foi possível carregar: {q.error.message}</p>
        ) : !rows?.length ? (
          <div className="empty">
            Sua agenda tem espaço para novas histórias.
            <p>Cadastre clientes, profissionais e serviços para começar.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Quando</th>
                  <th>Cliente / serviço</th>
                  <th>Profissional</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td>{local(a.inicio)}</td>
                    <td>
                      {a.cliente.nome}
                      <small>{a.servico.nome}</small>
                    </td>
                    <td>{a.profissional.nome}</td>
                    <td>
                      <span className={"badge " + a.status}>{a.status}</span>
                    </td>
                    <td>
                      <select
                        aria-label="Alterar status"
                        value={a.status}
                        onChange={async (e) => {
                          try {
                            await api(
                              "agendamentos/" + a.id + "/status",
                              "PATCH",
                              { status: e.target.value },
                            );
                            await qc.invalidateQueries();
                            setMsg("Status atualizado");
                          } catch (e) {
                            setMsg((e as Error).message);
                          }
                        }}
                      >
                        {[
                          "AGENDADO",
                          "CONFIRMADO",
                          "CANCELADO",
                          "CONCLUIDO",
                        ].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <a href={"/novo?id=" + a.id}>Reagendar</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p role="status">{msg}</p>
      </section>
    </>
  );
}
