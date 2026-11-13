import { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./Auth";
export function Login() {
  const [registro, setRegistro] = useState(false);
  const [erro, setErro] = useState("");
  const [busy, setBusy] = useState(false);
  const { refresh } = useAuth();
  return (
    <div className="login-shell">
      <div className="login-brand">
        <a className="brand" href="/">
          ✓ checkapp
        </a>
        <h1>
          Seu tempo.
          <br />
          Seu atendimento.
          <br />
          Do seu jeito.
        </h1>
        <p>Agende com facilidade e acompanhe cada atendimento em São Luís.</p>
      </div>
      <main className="login-card">
        <span className="eyebrow">BEM-VINDO AO CHECKAPP</span>
        <h1>{registro ? "Crie sua conta de cliente" : "Entre na sua conta"}</h1>
        <p>Seu painel será aberto conforme seu perfil de acesso.</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setErro("");
            const d = Object.fromEntries(new FormData(e.currentTarget));
            try {
              await api(registro ? "auth/registro" : "auth/login", "POST", d);
              await refresh();
            } catch (e) {
              setErro((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {registro && (
            <>
              <label>
                Nome
                <input name="nome" autoComplete="name" required />
              </label>
              <label>
                Telefone
                <input name="telefone" autoComplete="tel" required />
              </label>
            </>
          )}
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Senha
            <input
              name="senha"
              type="password"
              autoComplete={registro ? "new-password" : "current-password"}
              minLength={registro ? 12 : 1}
              maxLength={128}
              required
            />
          </label>
          {registro && (
            <small>
              Use pelo menos 12 caracteres. O cadastro público é exclusivo para
              clientes.
            </small>
          )}
          <button disabled={busy}>
            {busy ? "Aguarde…" : registro ? "Criar conta" : "Entrar"}
          </button>
          <p role="alert">{erro}</p>
        </form>
        <button
          className="secondary"
          onClick={() => {
            setRegistro(!registro);
            setErro("");
          }}
        >
          {registro
            ? "Já tenho conta"
            : "Primeira visita? Criar conta de cliente"}
        </button>
        <p className="slots-note">
          Já foi cadastrado pela equipe? Solicite seu acesso ao administrador.
        </p>
      </main>
    </div>
  );
}
