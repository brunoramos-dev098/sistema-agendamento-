import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLista } from "../hooks/useLista";
import { api } from "../services/api";
import { Atendimento, Registro } from "../types";
import { Formulario } from "../components/Formulario";
import { motivoSemHorario } from "../services/disponibilidade";

const zone = "America/Fortaleza";
const hojeLocal = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: zone }).format(new Date());
export function somarDias(data: string, dias: number) {
  const d = new Date(data + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}
const domingo = (d: string) => new Date(d + "T12:00:00Z").getUTCDay() === 0;
const dataLocal = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    weekday: "long",
    timeZone: zone,
  }).format(new Date(iso + "T12:00:00Z"));
const horaLocal = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: zone,
  }).format(new Date(iso));

export function Novo() {
  const clientes = useLista<Registro>("clientes");
  const servicos = useLista<Registro>("servicos");
  const profissionais = useLista<Registro>("profissionais");
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const agenda = useQuery({
    queryKey: ["agendamentos"],
    enabled: !!id,
    queryFn: () => api<Atendimento[]>("agendamentos"),
  });
  const anterior = agenda.data?.find((a) => a.id === id);
  const hoje = hojeLocal();
  const inicial = domingo(hoje) ? somarDias(hoje, 1) : hoje;
  const [c, setC] = useState(
    sessionStorage.getItem("checkapp.clienteId") ?? "",
  );
  const [s, setS] = useState(params.get("servicoId") ?? "");
  const [p, setP] = useState("");
  const [d, setD] = useState(inicial);
  const [primeiroDia, setPrimeiroDia] = useState(inicial);
  const [h, setH] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();
  useEffect(() => {
    if (anterior) {
      setC(anterior.cliente.id);
      setS(anterior.servico.id);
      setP(anterior.profissional.id);
      const data = new Intl.DateTimeFormat("en-CA", { timeZone: zone }).format(
        new Date(anterior.inicio),
      );
      setD(data);
      setPrimeiroDia(data < hojeLocal() ? hojeLocal() : data);
    }
  }, [anterior]);
  const cliente = clientes.data?.find((v) => v.id === c);
  const servico = servicos.data?.find((v) => v.id === s);
  const profissional = profissionais.data?.find((v) => v.id === p);
  const horarios = useQuery({
    queryKey: ["horarios", p, s, d, id],
    enabled: !!p && !!s && !!d && d >= hoje && !domingo(d),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    queryFn: () =>
      api<string[]>(
        "agendamentos/horarios?" +
          new URLSearchParams({
            profissionalId: p,
            servicoId: s,
            data: d,
            ...(id ? { ignorar: id } : {}),
          }),
      ),
  });
  const trocarDia = (data: string) => {
    if (!data) return;
    setD(data);
    setH("");
    setMsg("");
  };
  const escolherCliente = (value: string) => {
    setC(value);
    if (value) sessionStorage.setItem("checkapp.clienteId", value);
    else sessionStorage.removeItem("checkapp.clienteId");
  };
  const confirmar = async () => {
    if (
      !cliente ||
      !servico ||
      !profissional ||
      !h ||
      !horarios.data?.includes(h)
    )
      return;
    setSaving(true);
    setMsg("");
    try {
      await api("agendamentos" + (id ? "/" + id : ""), id ? "PUT" : "POST", {
        clienteId: c,
        profissionalId: p,
        servicoId: s,
        inicio: h,
      });
      setH("");
      setMsg(
        "Agendamento confirmado! Você pode acompanhar os detalhes na agenda.",
      );
      await qc.invalidateQueries({ queryKey: ["agendamentos"] });
      await qc.invalidateQueries({ queryKey: ["horarios"] });
    } catch (e) {
      setH("");
      setMsg(
        (e as Error).message +
          " Confira os horários atualizados e escolha novamente.",
      );
      await horarios.refetch();
    } finally {
      setSaving(false);
    }
  };
  const erro =
    clientes.error ?? servicos.error ?? profissionais.error ?? agenda.error;
  return (
    <>
      <div className="booking-heading">
        <div>
          <span className="eyebrow">RESERVE SEU MOMENTO</span>
          <h1>{id ? "Reagendar atendimento" : "Seu próximo atendimento"}</h1>
          <p className="subtitle">
            Escolha o serviço, o profissional e o melhor horário para você.
          </p>
        </div>
        <span className="booking-location">São Luís · MA</span>
      </div>
      <div className="booking-banner">
        <strong>30 minutos para cuidar de você</strong>
        <span>Segunda a sábado · 09h às 19h30 · Último início às 19h</span>
      </div>
      {erro && <p role="alert">{erro.message}</p>}
      <section className="booking-step">
        <h2>
          <span className="step-number">1</span> Seu cadastro
        </h2>
        {cliente ? (
          <div className="customer-selected">
            <div>
              <strong>{cliente.nome}</strong>
              <small>Agendando para este cadastro</small>
            </div>
            <button className="secondary" onClick={() => escolherCliente("")}>
              Trocar cliente
            </button>
          </div>
        ) : (
          <>
            <label>
              Já possui cadastro?
              <select
                aria-label="Cliente"
                value={c}
                onChange={(e) => escolherCliente(e.target.value)}
              >
                <option value="">
                  Selecione seu nome ou cadastre-se abaixo
                </option>
                {clientes.data?.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nome}
                  </option>
                ))}
              </select>
            </label>
            <details open={!clientes.data?.length}>
              <summary>Primeira visita? Cadastre-se aqui</summary>
              <Formulario
                tipo="clientes"
                onSave={async (dados) => {
                  const criado = await api<Registro>("clientes", "POST", dados);
                  escolherCliente(criado.id);
                  await qc.invalidateQueries({ queryKey: ["clientes"] });
                }}
              />
            </details>
          </>
        )}
      </section>
      <section className="booking-step">
        <h2>
          <span className="step-number">2</span> Qual serviço você procura?
        </h2>
        {servicos.isPending ? (
          <p>Carregando serviços…</p>
        ) : !servicos.data?.length ? (
          <p>Nenhum serviço cadastrado ainda.</p>
        ) : (
          <div className="choice-grid">
            {servicos.data.map((v) => (
              <button
                type="button"
                key={v.id}
                className={"choice-card " + (s === v.id ? "selected" : "")}
                aria-pressed={s === v.id}
                onClick={() => {
                  setS(v.id);
                  setP("");
                  setH("");
                  setMsg("");
                }}
              >
                <span className="choice-icon">✂</span>
                <strong>{v.nome}</strong>
                <span>{v.descricao}</span>
                <small>
                  30 min ·{" "}
                  {Number(v.preco).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </small>
              </button>
            ))}
          </div>
        )}
      </section>
      <section className="booking-step">
        <h2>
          <span className="step-number">3</span> Com quem será o atendimento?
        </h2>
        {!s ? (
          <p>Escolha um serviço acima para ver os profissionais.</p>
        ) : profissionais.isPending ? (
          <p>Carregando profissionais…</p>
        ) : (
          <div className="choice-grid">
            {profissionais.data
              ?.filter((v) => v.servicos?.some((x) => x.servicoId === s))
              .map((v) => (
                <button
                  type="button"
                  key={v.id}
                  className={
                    "choice-card professional-card " +
                    (p === v.id ? "selected" : "")
                  }
                  aria-pressed={p === v.id}
                  onClick={() => {
                    setP(v.id);
                    setH("");
                    setMsg("");
                  }}
                >
                  <span className="avatar">{v.nome.slice(0, 1)}</span>
                  <strong>{v.nome}</strong>
                  <span>{v.especialidade}</span>
                  <small>Ver horários disponíveis →</small>
                </button>
              ))}
          </div>
        )}
        {s &&
          !profissionais.isPending &&
          !profissionais.error &&
          !profissionais.data?.some((v) =>
            v.servicos?.some((x) => x.servicoId === s),
          ) && (
            <p>
              Nenhum profissional oferece este serviço ainda.{" "}
              <a href="/profissionais#servicos-disponibilidade">
                <u>Gerenciar associações</u>
              </a>
            </p>
          )}
      </section>
      <section className="booking-step">
        <div className="section-head">
          <h2>
            <span className="step-number">4</span> Escolha o dia e o horário
          </h2>
          <span>Horário de São Luís (MA)</span>
        </div>
        <div className="calendar-controls">
          <div>
            <button
              className="secondary"
              aria-label="Semana anterior"
              disabled={primeiroDia <= hoje}
              onClick={() =>
                setPrimeiroDia(
                  somarDias(primeiroDia, -7) < hoje
                    ? hoje
                    : somarDias(primeiroDia, -7),
                )
              }
            >
              ←
            </button>
            <strong>
              {new Date(primeiroDia + "T12:00:00Z").toLocaleDateString(
                "pt-BR",
                { month: "long", year: "numeric", timeZone: zone },
              )}
            </strong>
            <button
              className="secondary"
              aria-label="Próxima semana"
              onClick={() => setPrimeiroDia(somarDias(primeiroDia, 7))}
            >
              →
            </button>
          </div>
          <label>
            Ir para uma data
            <input
              aria-label="Data do atendimento"
              type="date"
              min={hoje}
              value={d}
              onChange={(e) => {
                trocarDia(e.target.value);
                if (e.target.value) setPrimeiroDia(e.target.value);
              }}
            />
          </label>
        </div>
        <div className="day-strip" aria-label="Dias para agendamento">
          {Array.from({ length: 7 }, (_, i) => somarDias(primeiroDia, i)).map(
            (data) => (
              <button
                type="button"
                key={data}
                className={"day-card " + (d === data ? "selected" : "")}
                aria-label={dataLocal(data)}
                aria-pressed={d === data}
                disabled={data < hoje || domingo(data)}
                onClick={() => trocarDia(data)}
              >
                <span>
                  {new Date(data + "T12:00:00Z").toLocaleDateString("pt-BR", {
                    weekday: "short",
                    timeZone: zone,
                  })}
                </span>
                <strong>{data.slice(8)}</strong>
                <small>
                  {domingo(data)
                    ? "Fechado"
                    : new Date(data + "T12:00:00Z").toLocaleDateString(
                        "pt-BR",
                        { month: "short", timeZone: zone },
                      )}
                </small>
              </button>
            ),
          )}
        </div>
        <h3 className="slots-heading">{dataLocal(d)}</h3>
        {!p || !s ? (
          <p>
            Selecione um serviço e um profissional para consultar os horários
            deste dia.
          </p>
        ) : domingo(d) ? (
          <p>Não há expediente aos domingos. Escolha de segunda a sábado.</p>
        ) : d < hoje ? (
          <p>Escolha uma data a partir de hoje.</p>
        ) : horarios.isPending ? (
          <p role="status">Consultando horários…</p>
        ) : horarios.error ? (
          <p role="alert">{horarios.error.message}</p>
        ) : horarios.data?.length ? (
          <>
            <p className="slots-note">
              Toque em um horário livre. Reservas confirmadas saem da lista
              automaticamente.
            </p>
            <div className="slot-grid" aria-label="Horários disponíveis">
              {horarios.data.map((iso) => (
                <button
                  type="button"
                  key={iso}
                  className={"slot " + (h === iso ? "selected" : "")}
                  aria-pressed={h === iso}
                  onClick={() => {
                    setH(iso);
                    setMsg("");
                  }}
                >
                  {horaLocal(iso)}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p role="status">
            {motivoSemHorario(
              profissional?.disponibilidades ?? [],
              d,
              servico?.duracao ?? 30,
              hoje,
            )}
          </p>
        )}
        <p className="slots-note">
          Disponibilidade atualizada automaticamente a cada 5 segundos. O
          horário é garantido após a confirmação.
        </p>
      </section>
      <section className="booking-confirm">
        <div>
          <h2>Seu atendimento</h2>
          <p>
            {servico?.nome ?? "Escolha um serviço"} ·{" "}
            {profissional?.nome ?? "Escolha um profissional"}
          </p>
          <strong>
            {h && horarios.data?.includes(h)
              ? `${dataLocal(d)} às ${horaLocal(h)}`
              : "Selecione um horário disponível"}
          </strong>
        </div>
        <button
          onClick={confirmar}
          disabled={
            saving ||
            !cliente ||
            !servico ||
            !profissional ||
            !h ||
            !horarios.data?.includes(h)
          }
        >
          {saving
            ? "Confirmando…"
            : id
              ? "Confirmar alteração"
              : "Confirmar agendamento"}
        </button>
        <p role="status">{msg}</p>
        {msg.startsWith("Agendamento confirmado") && (
          <a href="/agenda">
            <u>Ver agenda</u>
          </a>
        )}
      </section>
    </>
  );
}
