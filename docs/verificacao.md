# Verificação da migração

Executado no Windows com Node.js 24.22.1 e npm 11.6.2.

- Prisma Client gerado e schema validado (Prisma 7.10.1).
- TypeScript strict: API e web aprovados.
- ESLint: aprovado.
- Builds NestJS e Vite: aprovados. Rollup informa duas anotações PURE de Zod descartadas, sem impedir build.
- Vitest: 11 testes de domínio e 2 de formulários aprovados.
- Teste PostgreSQL concorrente: ignorado localmente sem TEST_DATABASE_URL e aprovado na CI com PostgreSQL 17. SQL inicial escrito conforme o schema e complementado com constraints. A primeira CI detectou DDL ausente na saída do comando migrate diff; a migration foi corrigida para criar todas as tabelas antes das constraints.
- npm install / audit: zero vulnerabilidades após atualização de dependências.
- Chrome headless: seis rotas renderizadas, sem erros JavaScript; viewport móvel 390px sem overflow horizontal. Sem PostgreSQL/API ativa, isso verifica a apresentação e não o fluxo persistido.

## Versões resolvidas

- react: 19.3.1
- vite: 7.3.7
- tailwindcss: 4.3.3
- react-router-dom: 7.18.5
- @tanstack/react-query: 5.105.0
- react-hook-form: 7.91.0
- zod: 4.6.7
- @nestjs/core: 12.3.2
- prisma: 7.10.1
- @prisma/adapter-pg: 7.10.1
- typescript: 5.9.3
- eslint: 10.13.0
- prettier: 3.9.10
- vitest: 5.0.5

## Limites e conclusão da integração

Não há docker ou psql no PATH local. A integração foi executada na CI com PostgreSQL 17 efêmero: migration aplicada, 15 testes aprovados (11 domínio, 2 formulários, 1 concorrência e 1 fluxo HTTP). O teste HTTP iniciou o NestJS conectado ao banco e validou criação, conflito, alteração e cancelamento com histórico. A concorrência confirmou uma única reserva aceita. Evidência: https://github.com/brunoramos-dev098/sistema-agendamento-/actions/runs/40906372453 (commit 97385f4). Nenhum banco de produção foi alterado. A migration requer btree_gist. Para reproduzir localmente, configure banco de teste, execute npm run db:migrate e npm run build; depois npm test com TEST_DATABASE_URL. O teste HTTP cria dados no banco de teste; use um banco descartável.

Autenticação/autorização implementadas posteriormente, conforme acessos.md. Estado de implementação e limitações de interface estão no README e fluxo-interface.md.

## Calendário e blocos — 13/11/2026

Nova jornada com cadastro na própria página, cartões de serviço/profissional, seleção de dias futuros, blocos de 30 minutos e resumo de confirmação. Migrations aplicadas tanto em bancos temporários quanto no banco local, com cópia local dos períodos anteriores e preservação do histórico de agendamentos.

Verificação executada: 22 testes aprovados (13 API/domínio, incluindo concorrência HTTP e PostgreSQL, e 9 web), TypeScript strict, ESLint e builds API/web. Teste adicional em dois contextos Chrome com banco temporário confirmou cadastro, agendamento em quinta-feira futura, reserva às 09:00 e 09:30 por clientes distintos, remoção dos blocos nos dois navegadores e próximo horário às 10:00. Viewport móvel de 390px sem overflow horizontal. Os dados dos testes foram isolados e descartados; nenhum cadastro de demonstração foi deixado no banco local.

## Login e painéis por perfil — 13/11/2026

Autenticação por email/senha e cookie HttpOnly implementada e aplicada ao banco local com migration aditiva, sem alterar os cadastros e agendamentos existentes. O primeiro administrador foi criado pelo comando offline auth:admin, com credenciais em arquivo ignorado pelo Git.

Os testes de integração verificam: acesso sem sessão (401), email/senha incorretos, cadastro público sem poder escolher perfil administrativo, impossibilidade de reivindicar cadastro antigo, consultas filtradas por proprietário, bloqueio de agendamento/alteração/cancelamento de outro cliente, bloqueio de edição de serviços/cadastros/acessos por cliente, ausência de contatos privados no catálogo, bloqueio de mudança de perfil via JSON, rejeição de origem externa, profissional sem poder alterar atendimento de outro profissional, confirmação/conclusão apenas do seu atendimento, troca de senha revogando sessões e logout efetivo.

Teste em três contextos Chrome com banco temporário confirmou cadastro/login de cliente, agendamento para seu próprio cadastro, menu e painel profissional com sua agenda, painel administrativo e gestão de acessos, bloqueio de rota indevida e logout. Acesso administrativo local foi validado sem exibir senha. Login móvel verificado em viewport 390px sem overflow. TypeScript strict, ESLint, schema Prisma e builds aprovados. Consulte acessos.md para a matriz e os limites do MVP.
