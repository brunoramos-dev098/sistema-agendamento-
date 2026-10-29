import { NavLink, Routes, Route } from "react-router-dom";
import { Cadastros } from "./pages/Cadastros";
import { Agenda, Novo } from "./pages/Agenda";
export default function App() {
  return (
    <div className="shell">
      <aside>
        <a className="brand" href="/">
          ✓ checkapp<span>GESTÃO DE ATENDIMENTOS</span>
        </a>
        <nav>
          {[
            ["/", "Visão geral"],
            ["/agenda", "Agenda"],
            ["/clientes", "Clientes"],
            ["/profissionais", "Profissionais"],
            ["/servicos", "Serviços"],
            ["/novo", "+ Novo agendamento"],
          ].map(([url, t]) => (
            <NavLink key={url} end to={url}>
              {t}
            </NavLink>
          ))}
        </nav>
        <p className="aside-footer">
          Seu tempo bem cuidado.
          <br />
          Checkapp · Projeto acadêmico
        </p>
      </aside>
      <div className="content">
        <header>
          <span>Seu estabelecimento</span>
          <span className="dot">● Workspace local</span>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Agenda dashboard />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/novo" element={<Novo />} />
            {["clientes", "profissionais", "servicos"].map((t) => (
              <Route
                key={t}
                path={"/" + t}
                element={<Cadastros key={t} tipo={t} />}
              />
            ))}
            <Route path="*" element={<p>Página não encontrada.</p>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
