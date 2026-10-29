# Checkapp

Sistema de Gerenciamento e Agendamento de Serviços para Pequenos Estabelecimentos. Projeto acadêmico de Programação Orientada a Objetos para barbearias, salões, manicures, clínicas de estética e profissionais autônomos.

## Stack e arquitetura

Node.js 24 LTS, TypeScript strict 5.9, React 19, Vite 7, Tailwind CSS 4, React Router 7, TanStack Query 5, React Hook Form 7 e Zod 4. API REST NestJS 12, Prisma ORM 7 com adapter PostgreSQL e PostgreSQL local ou Supabase. Versões resolvidas no único package-lock.json. ESLint 10, Prettier 3 e Vitest 5.

Controller → Service → Repository → PostgreSQL; domínio TypeScript independente dos modelos de persistência. Usuario abstrato preserva herança e encapsulamento. React consome a API, sem dados fictícios. Transações Serializable e restrição de exclusão PostgreSQL impedem reservas sobrepostas.

## Estrutura

```text
apps/web/src/    components, pages, hooks, services, types, App.tsx
apps/api/src/    common, domain, modules, prisma, main.ts
apps/api/prisma/ schema.prisma e migrations versionadas
docs/           requisitos, arquitetura, fluxos e registro da migração
diagramas/      classes, arquitetura e entidade-relacionamento
database/       estratégia PostgreSQL
```

## Execução local

Instale Node.js 24 com npm e PostgreSQL com extensão btree_gist disponível. Crie usuário/banco local checkapp (credenciais ilustrativas no exemplo). Na raiz:

```sh
npm ci
cp .env.example .env
npm run db:generate
npm run db:validate
npm run db:migrate
npm run dev
```

No PowerShell use Copy-Item .env.example .env. Ajuste DATABASE_URL (API) e DIRECT_DATABASE_URL (migrations) antes de migrar. Scripts carregam .env da raiz. Nunca commitar credenciais. Supabase é opcional: use conexão PostgreSQL do projeto, conexão direta para migrations e TLS validado. Não execute operações destrutivas em banco remoto.

Web: http://localhost:5173. API: http://127.0.0.1:3000. Individualmente: npm run dev -w apps/web e npm run dev -w apps/api. Desenvolvimento da API compila antes de iniciar; após editar TypeScript execute build novamente. PORT e WEB_ORIGIN são opcionais. Proxy Vite encaminha /api para o servidor local; produção deve configurar um reverse proxy equivalente. DATABASE_URL nunca é exposta no frontend.

## Verificação

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run db:validate
```

Teste concorrente real exige banco de teste migrado e TEST_DATABASE_URL. Ele cria registros isolados e remove apenas seus próprios dados. Sem essa variável, é marcado como ignorado. Veja [resultados reais](docs/verificacao.md).

## Situação da implementação

Base funcional com cadastros e edição, associação profissional/serviço, disponibilidade semanal, consulta de horários, criação e alteração de agendamentos, status, cancelamento e histórico. Interface inclui dashboard, clientes, profissionais, serviços, agenda com filtros e formulário de agendamento. Slots em passos de 15 minutos; API valida intervalo completo. Cancelamentos não apagam registros. Reagendamento via API ignora o próprio ID. Autenticação e autorização não foram definidas: executar localmente, sem exposição pública até implementá-las.

Pendências: validar imersão, permissões e transições com usuários; aprimorar edição de disponibilidade e vínculos na interface, paginação, auditoria e testes completos de navegação. A execução de integrações depende de PostgreSQL disponível. Consulte [migração e histórico](docs/migracao.md).

## Documentação

- [Documentação geral](docs/documentacao.md)
- [Arquitetura](docs/arquitetura.md)
- [Fluxo da interface](docs/fluxo-interface.md) e [API/endpoints](docs/fluxo-backend.md)
- [Entidades](docs/entidades.md), [relações](docs/relacoes.md) e [dados](docs/dados.md)
- [Requisitos RF01–RF11 e RN01–RN07](docs/requisitos.md)
- [Imersão na comunidade](docs/imersao.md)
- [Modelo PostgreSQL](database/modelo-dados.md)
- [Diagramas](diagramas/README.md)

## Equipe

| Integrante              | GitHub                                                            | Papel     |
| ----------------------- | ----------------------------------------------------------------- | --------- |
| Bruno Ramos             | [@brunoramos-dev098](https://github.com/brunoramos-dev098)        | Team Lead |
| Luciano Henrique        | [lucianohoalmeida@gmail.com](https://github.com/lucianohenriquue) | Back-end  |
| Thyago Baima            | [Thyago098](https://github.com/Thyago098)                         | DevOps    |
| Carlos Eduardo Sá Costa | [carloseduardo-Eng](https://github.com/carloseduardo-Eng)         | Front-end |
