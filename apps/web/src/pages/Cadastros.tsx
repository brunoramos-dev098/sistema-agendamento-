import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useLista } from "../hooks/useLista";
import { api } from "../services/api";
import { Registro, Periodo } from "../types";
import { diasSemana, hora } from "../services/disponibilidade";
import { Formulario } from "../components/Formulario";
export function Cadastros({ tipo }: { tipo: string }) {
  const navigate = useNavigate();
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
            const salvo = await api<Registro>(
              tipo + (edit ? "/" + edit.id : ""),
              edit ? "PUT" : "POST",
              d,
            );
            await qc.invalidateQueries();
            if (tipo === "clientes" && !edit) {
              sessionStorage.setItem("checkapp.clienteId", salvo.id);
              navigate("/novo");
            }
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
                      {tipo === "servicos" && (
                        <a
                          className="service-book-link"
                          href={"/novo?servicoId=" + r.id}
                        >
                          Agendar este serviço →
                        </a>
                      )}
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
  const [periodoEditado, setPeriodoEditado] = useState<Periodo>();
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
        await api(
          "disponibilidades" + (periodoEditado ? "/" + periodoEditado.id : ""),
          periodoEditado ? "PUT" : "POST",
          {
            profissionalId: d.profissionalId,
            diaSemana: Number(d.diaSemana),
            inicioMinuto: String(d.horaInicio)
              .split(":")
              .reduce((h, v) => h * 60 + Number(v), 0),
            fimMinuto: String(d.horaFim)
              .split(":")
              .reduce((h, v) => h * 60 + Number(v), 0),
          },
        );
      await qc.invalidateQueries();
      setMsg("Configuração salva");
      if (!d.servicoId) setPeriodoEditado(undefined);
    } catch (e) {
      setMsg((e as Error).message);
    }
  }
  const select = (profissionalId = "") => (
    <label>
      Profissional
      <select name="profissionalId" defaultValue={profissionalId} required>
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
    <section id="servicos-disponibilidade">
      <h2>Serviços e disponibilidade</h2>
      <p>
        Associe cada profissional aos serviços que ele realiza para poder
        selecioná-lo em um novo agendamento.
      </p>
      <form onSubmit={save}>
        {select()}
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
      <ul>
        {p.data?.map((profissional) => (
          <li key={profissional.id}>
            <strong>{profissional.nome}</strong>:{" "}
            {profissional.servicos?.length
              ? profissional.servicos
                  .map(
                    (v) =>
                      s.data?.find((servico) => servico.id === v.servicoId)
                        ?.nome ?? "Carregando serviço…",
                  )
                  .join(", ")
              : "Nenhum serviço associado"}
          </li>
        ))}
      </ul>
      <h2>Disponibilidade semanal</h2>
      <p>
        Cadastre um período que comporte toda a duração do atendimento. Os
        horários usam o horário de São Luís (MA).
      </p>
      <form key={periodoEditado?.id ?? "novo-periodo"} onSubmit={save}>
        <h3>{periodoEditado ? "Editar período" : "Novo período"}</h3>
        {select(periodoEditado?.profissionalId)}
        <label>
          Dia da semana
          <select
            name="diaSemana"
            defaultValue={periodoEditado?.diaSemana ?? ""}
            required
          >
            <option value="">Selecione</option>
            {diasSemana.map((dia, i) => (
              <option key={dia} value={i + 1}>
                {dia}
              </option>
            ))}
          </select>
        </label>
        <label>
          Horário inicial
          <input
            name="horaInicio"
            defaultValue={
              periodoEditado ? hora(periodoEditado.inicioMinuto) : ""
            }
            type="time"
            step="60"
            required
          />
        </label>
        <label>
          Horário final
          <input
            name="horaFim"
            defaultValue={periodoEditado ? hora(periodoEditado.fimMinuto) : ""}
            type="time"
            step="60"
            required
          />
        </label>
        <button>
          {periodoEditado
            ? "Salvar disponibilidade"
            : "Registrar disponibilidade"}
        </button>
        {periodoEditado && (
          <button
            type="button"
            className="secondary"
            onClick={() => setPeriodoEditado(undefined)}
          >
            Cancelar edição
          </button>
        )}
      </form>
      <p role="status">{msg}</p>
      <p>Períodos cadastrados</p>
      <Disponibilidades onEdit={setPeriodoEditado} />
    </section>
  );
}
function Disponibilidades({ onEdit }: { onEdit: (periodo: Periodo) => void }) {
  const q = useLista<Periodo>("disponibilidades");
  const p = useLista<Registro>("profissionais");
  return (
    <ul>
      {q.data?.map((d) => (
        <li key={d.id}>
          {p.data?.find((v) => v.id === d.profissionalId)?.nome} ·{" "}
          {diasSemana[d.diaSemana - 1]} · {hora(d.inicioMinuto)}–
          {hora(d.fimMinuto)}{" "}
          <button type="button" className="secondary" onClick={() => onEdit(d)}>
            Editar período
          </button>
        </li>
      ))}
    </ul>
  );
}
