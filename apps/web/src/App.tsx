import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import { Cadastros } from "./pages/Cadastros";
import { Agenda } from "./pages/Agenda";
import { Novo } from "./pages/Novo";
import { AuthProvider, useAuth } from "./auth/Auth";
import { Login } from "./auth/Login";
import { MeuCadastro } from "./auth/MeuCadastro";
import { Acessos } from "./auth/Acessos";
import { useLista } from "./hooks/useLista";
import { Registro } from "./types";
import { diasSemana, hora } from "./services/disponibilidade";
import { useState } from "react";
function Catalogo() {
  const { user } = useAuth();
  const servicos = useLista<Registro>("servicos");
  const profissionais = useLista<Registro>("profissionais");
  const proprio = profissionais.data?.find(
    (p) => p.id === user?.profissionalId,
  );
  const lista =
    user?.perfil === "PROFISSIONAL"
      ? servicos.data?.filter((s) =>
          proprio?.servicos?.some((p) => p.servicoId === s.id),
        )
      : servicos.data;
  return (
    <>
      <h1>
        {user?.perfil === "PROFISSIONAL"
          ? "Meus serviços e horários"
          : "Serviços disponíveis"}
      </h1>
      <p className="subtitle">
        {user?.perfil === "PROFISSIONAL"
          ? "Serviços associados ao seu cadastro e seus períodos de atendimento."
          : "Escolha um serviço para consultar profissionais e horários livres."}
      </p>
      {servicos.error && <p role="alert">{servicos.error.message}</p>}
      <div className="choice-grid">
        {lista?.map((s) => (
          <section key={s.id}>
            <h2>{s.nome}</h2>
            <p>{s.descricao}</p>
            <p>
              {s.duracao} minutos · R$ {s.preco}
            </p>
            {user?.perfil === "CLIENTE" && (
              <a href={"/novo?servicoId=" + s.id}>
                <u>Escolher profissional e agendar →</u>
              </a>
            )}
          </section>
        ))}
      </div>
      {user?.perfil === "PROFISSIONAL" && (
        <section>
          <h2>Minha disponibilidade</h2>
          <ul>
            {proprio?.disponibilidades?.map((p) => (
              <li key={p.id}>
                {diasSemana[p.diaSemana - 1]} · {hora(p.inicioMinuto)}–
                {hora(p.fimMinuto)}
              </li>
            ))}
          </ul>
          <p>Solicite alterações ao administrador.</p>
        </section>
      )}
    </>
  );
}
function Shell() {
  const { user, loading, logout } = useAuth();
  const [erro, setErro] = useState("");
  if (loading)
    return (
      <main>
        <p role="status">Verificando sua sessão…</p>
      </main>
    );
  if (!user) return <Login />;
  const admin = user.perfil === "ADMINISTRADOR";
  const profissional = user.perfil === "PROFISSIONAL";
  const nomePerfil = admin
    ? "Administrador"
    : profissional
      ? "Profissional"
      : "Cliente";
  const links = [
    ["/", "Meu painel"],
    ["/agenda", admin ? "Agenda completa" : "Meus agendamentos"],
    ["/historico", admin ? "Histórico geral" : "Meu histórico"],
    ...(!profissional ? [["/novo", "Agendar atendimento"]] : []),
    ...(admin
      ? [
          ["/clientes", "Clientes"],
          ["/profissionais", "Profissionais"],
          ["/servicos", "Gerenciar serviços"],
          ["/acessos", "Contas e acessos"],
        ]
      : [
          [
            "/servicos",
            profissional ? "Meus serviços" : "Serviços disponíveis",
          ],
        ]),
    ["/meu-cadastro", "Meu cadastro"],
  ];
  return (
    <div className="shell">
      <aside>
        <a className="brand" href="/">
          ✓ checkapp<span>{nomePerfil.toUpperCase()}</span>
        </a>
        <nav>
          {links.map(([url, t]) => (
            <NavLink key={url} end to={url}>
              {t}
            </NavLink>
          ))}
        </nav>
        <p className="aside-footer">
          {user.dados.nome}
          <br />
          {nomePerfil}
        </p>
      </aside>
      <div className="content">
        <header>
          <span>Painel de {nomePerfil.toLowerCase()}</span>
          <div className="session-header">
            <span>{user.dados.nome}</span>
            <button
              className="secondary"
              onClick={() =>
                logout().catch((e) => setErro((e as Error).message))
              }
            >
              Sair
            </button>
          </div>
        </header>
        <main>
          {erro && <p role="alert">{erro}</p>}
          <Routes>
            <Route path="/" element={<Agenda dashboard />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/historico" element={<Agenda history />} />
            <Route
              path="/novo"
              element={!profissional ? <Novo /> : <Navigate to="/" replace />}
            />
            <Route path="/meu-cadastro" element={<MeuCadastro />} />
            <Route
              path="/acessos"
              element={admin ? <Acessos /> : <Navigate to="/" replace />}
            />
            <Route
              path="/servicos"
              element={admin ? <Cadastros tipo="servicos" /> : <Catalogo />}
            />
            {["clientes", "profissionais"].map((t) => (
              <Route
                key={t}
                path={"/" + t}
                element={
                  admin ? (
                    <Cadastros key={t} tipo={t} />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
