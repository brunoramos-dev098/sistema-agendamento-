import { useState } from "react";
import { useLista } from "../hooks/useLista";
import { Registro } from "../types";
import { api } from "../services/api";
import { useQueryClient } from "@tanstack/react-query";
export function Acessos() {
  const clientes = useLista<Registro>("clientes");
  const profissionais = useLista<Registro>("profissionais");
  const contas = useLista<{ id: string; email: string; perfil: string }>(
    "auth/contas",
  );
  const [perfil, setPerfil] = useState("PROFISSIONAL");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  return (
    <>
      <h1>Contas e acessos</h1>
      <p className="subtitle">
        Ative o acesso de clientes e profissionais já cadastrados.
      </p>
      <section>
        <h2>Criar acesso</h2>
        <p>
          O email do cadastro será usado para entrar. Entregue a senha inicial
          diretamente à pessoa; ela poderá alterá-la em Meu cadastro.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setMsg("");
            const form = e.currentTarget;
            try {
              await api(
                "auth/contas",
                "POST",
                Object.fromEntries(new FormData(form)),
              );
              form.reset();
              await qc.invalidateQueries({ queryKey: ["auth/contas"] });
              setMsg(
                "Acesso criado. Informe o email e a senha inicial à pessoa.",
              );
            } catch (e) {
              setMsg((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Perfil
            <select
              name="perfil"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
            >
              <option value="PROFISSIONAL">Profissional</option>
              <option value="CLIENTE">Cliente</option>
            </select>
          </label>
          <label>
            Cadastro
            <select key={perfil} name="entidadeId" required>
              <option value="">Selecione</option>
              {(perfil === "CLIENTE" ? clientes.data : profissionais.data)?.map(
                (p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} — {p.email}
                  </option>
                ),
              )}
            </select>
          </label>
          <label>
            Senha inicial
            <input
              name="senha"
              type="password"
              minLength={12}
              maxLength={128}
              autoComplete="new-password"
              required
            />
          </label>
          <button disabled={busy}>Criar acesso</button>
          <p role="status">{msg}</p>
        </form>
      </section>
      <section>
        <h2>Acessos ativos</h2>
        {contas.error && <p role="alert">{contas.error.message}</p>}
        <ul>
          {contas.data?.map((c) => (
            <li key={c.id}>
              {c.email} · {c.perfil}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
