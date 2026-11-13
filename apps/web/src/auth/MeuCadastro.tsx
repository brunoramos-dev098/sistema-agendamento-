import { useState } from "react";
import { useAuth } from "./Auth";
import { api } from "../services/api";
import { Formulario } from "../components/Formulario";
export function MeuCadastro() {
  const { user, refresh } = useAuth();
  const [msg, setMsg] = useState("");
  if (!user) return null;
  return (
    <>
      <h1>Meu cadastro</h1>
      <p className="subtitle">Seus dados e a segurança da sua conta.</p>
      <section>
        <h2>Dados pessoais</h2>
        <Formulario
          tipo="clientes"
          valor={{
            nome: user.dados.nome,
            email: user.email,
            telefone: user.dados.telefone,
          }}
          onSave={async (d) => {
            await api("auth/perfil", "PUT", d);
            await refresh();
          }}
        />
      </section>
      <section>
        <h2>Alterar senha</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const d = Object.fromEntries(new FormData(e.currentTarget));
            try {
              await api("auth/senha", "POST", d);
              location.assign("/");
            } catch (e) {
              setMsg((e as Error).message);
            }
          }}
        >
          <label>
            Senha atual
            <input
              name="senhaAtual"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <label>
            Nova senha
            <input
              name="novaSenha"
              type="password"
              autoComplete="new-password"
              minLength={12}
              maxLength={128}
              required
            />
          </label>
          <button>Alterar senha e entrar novamente</button>
          <p role="status">{msg}</p>
        </form>
      </section>
    </>
  );
}
