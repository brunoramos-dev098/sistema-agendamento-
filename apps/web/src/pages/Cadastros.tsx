import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLista } from "../hooks/useLista";
import { api } from "../services/api";
import { Registro } from "../types";
import { Formulario } from "../components/Formulario";
export function Cadastros({ tipo }: { tipo: string }) {
  const lista = useLista<Registro>(tipo);
  const [edit, setEdit] = useState<Registro>();
  const qc = useQueryClient();
  return (
    <>
      <h1>
        {tipo === "servicos"
          ? "Serviços"
          : tipo === "clientes"
            ? "Clientes"
            : "Profissionais"}
      </h1>
      <p className="subtitle">
        Organize os detalhes que fazem cada atendimento acontecer.
      </p>
      <section>
        <h2>{edit ? "Editar registro" : "Novo cadastro"}</h2>
        <Formulario
          key={edit?.id ?? tipo}
          tipo={tipo}
          valor={edit as unknown as Record<string, unknown>}
          onSave={async (d) => {
            await api(
              tipo + (edit ? "/" + edit.id : ""),
              edit ? "PUT" : "POST",
              d,
            );
            await qc.invalidateQueries();
            setEdit(undefined);
          }}
        />
      </section>
      <section>
        <h2>Todos os registros</h2>
        {lista.isPending ? (
          <p>Carregando…</p>
        ) : lista.error ? (
          <p role="alert">{lista.error.message}</p>
        ) : !lista.data?.length ? (
          <p>Nenhum cadastro ainda. Comece pelo formulário acima.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Contato / detalhes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lista.data.map((r) => (
                  <tr key={r.id}>
                    <td>{r.nome}</td>
                    <td>
                      {r.email ?? "R$ " + r.preco + " · " + r.duracao + " min"}
                    </td>
                    <td>
                      <button className="secondary" onClick={() => setEdit(r)}>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {tipo === "profissionais" && <Vinculos />}
    </>
  );
}
function Vinculos() {
  const p = useLista<Registro>("profissionais");
  const s = useLista<Registro>("servicos");
  const qc = useQueryClient();
  const [msg, setMsg] = useState("");
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (d.servicoId)
        await api(
          "profissionais/" + d.profissionalId + "/servicos/" + d.servicoId,
          "PUT",
        );
      else
        await api("disponibilidades", "POST", {
          profissionalId: d.profissionalId,
          diaSemana: Number(d.diaSemana),
          inicioMinuto: Number(d.inicioMinuto),
          fimMinuto: Number(d.fimMinuto),
        });
      await qc.invalidateQueries();
      setMsg("Configuração salva");
    } catch (e) {
      setMsg((e as Error).message);
    }
  }
  const select = (
    <label>
      Profissional
      <select name="profissionalId" required>
        <option value="">Selecione</option>
        {p.data?.map((r) => (
          <option key={r.id} value={r.id}>
            {r.nome}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <section>
      <h2>Serviços e disponibilidade</h2>
      <form onSubmit={save}>
        {select}
        <label>
          Serviço
          <select name="servicoId" required>
            <option value="">Selecione</option>
            {s.data?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nome}
              </option>
            ))}
          </select>
        </label>
        <button>Associar serviço</button>
      </form>
      <form onSubmit={save}>
        {select}
        <label>
          Dia da semana (1 segunda, 7 domingo)
          <input name="diaSemana" type="number" min="1" max="7" required />
        </label>
        <label>
          Início em minutos desde 00h
          <input
            name="inicioMinuto"
            type="number"
            min="0"
            max="1439"
            required
          />
        </label>
        <label>
          Fim em minutos desde 00h
          <input name="fimMinuto" type="number" min="1" max="1440" required />
        </label>
        <button>Registrar disponibilidade</button>
      </form>
      <p role="status">{msg}</p>
      <p>Períodos cadastrados</p>
      <Disponibilidades />
    </section>
  );
}
function Disponibilidades() {
  const q = useLista<{
    id: string;
    profissionalId: string;
    diaSemana: number;
    inicioMinuto: number;
    fimMinuto: number;
  }>("disponibilidades");
  const p = useLista<Registro>("profissionais");
  return (
    <ul>
      {q.data?.map((d) => (
        <li key={d.id}>
          {p.data?.find((v) => v.id === d.profissionalId)?.nome} · dia{" "}
          {d.diaSemana} · {Math.floor(d.inicioMinuto / 60)}:
          {String(d.inicioMinuto % 60).padStart(2, "0")} –{" "}
          {Math.floor(d.fimMinuto / 60)}:
          {String(d.fimMinuto % 60).padStart(2, "0")}
        </li>
      ))}
    </ul>
  );
}
