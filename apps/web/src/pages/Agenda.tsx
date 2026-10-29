import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
            <strong className="timezone">Fortaleza · UTC−3</strong>
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
export function Novo() {
  const clientes = useLista<Registro>("clientes");
  const servicos = useLista<Registro>("servicos");
  const profissionais = useLista<Registro>("profissionais");
  const agenda = useLista<Atendimento>("agendamentos");
  const id = new URLSearchParams(location.search).get("id");
  const anterior = agenda.data?.find((a) => a.id === id);
  const [c, setC] = useState("");
  const [s, setS] = useState("");
  const [p, setP] = useState("");
  const [d, setD] = useState("");
  const [h, setH] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();
  const horarios = useQuery({
    queryKey: ["horarios", p, s, d],
    enabled: !!p && !!s && !!d,
    queryFn: () =>
      api<string[]>(
        "agendamentos/horarios?" +
          new URLSearchParams({ profissionalId: p, servicoId: s, data: d }),
      ),
  });
  return (
    <>
      <h1>{id ? "Reagendar atendimento" : "Um novo atendimento"}</h1>
      <p className="subtitle">Escolha o serviço e encontre o melhor horário.</p>
      {anterior && (
        <p>
          Alterando: {anterior.cliente.nome}, {local(anterior.inicio)}.
          Selecione os novos dados completos.
        </p>
      )}
      <section>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            try {
              await api(
                "agendamentos" + (id ? "/" + id : ""),
                id ? "PUT" : "POST",
                { clienteId: c, servicoId: s, profissionalId: p, inicio: h },
              );
              await qc.invalidateQueries();
              setH("");
              setMsg("Agendamento salvo com sucesso.");
            } catch (e) {
              setMsg((e as Error).message);
            } finally {
              setSaving(false);
            }
          }}
        >
          <div className="form-grid">
            <label>
              Cliente
              <select required value={c} onChange={(e) => setC(e.target.value)}>
                <option value="">Selecione</option>
                {clientes.data?.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nome}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Serviço
              <select
                required
                value={s}
                onChange={(e) => {
                  setS(e.target.value);
                  setP("");
                  setH("");
                }}
              >
                <option value="">Selecione</option>
                {servicos.data?.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nome} · {v.duracao} min
                  </option>
                ))}
              </select>
            </label>
            <label>
              Profissional
              <select
                required
                value={p}
                onChange={(e) => {
                  setP(e.target.value);
                  setH("");
                }}
              >
                <option value="">Selecione</option>
                {profissionais.data
                  ?.filter((v) => v.servicos?.some((x) => x.servicoId === s))
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nome}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Data
              <input
                required
                type="date"
                value={d}
                onChange={(e) => {
                  setD(e.target.value);
                  setH("");
                }}
              />
            </label>
          </div>
          <label>
            Horário em Fortaleza
            <select required value={h} onChange={(e) => setH(e.target.value)}>
              <option value="">Selecione um horário disponível</option>
              {horarios.data?.map((v) => (
                <option key={v} value={v}>
                  {local(v)}
                </option>
              ))}
            </select>
          </label>
          {horarios.isFetching && <p>Consultando horários…</p>}
          {horarios.error && <p role="alert">{horarios.error.message}</p>}
          {horarios.data?.length === 0 && (
            <p>Sem horários disponíveis para esta seleção.</p>
          )}
          <button disabled={saving}>Confirmar agendamento</button>
          <p role="status">{msg}</p>
        </form>
      </section>
    </>
  );
}
