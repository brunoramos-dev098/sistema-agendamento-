# Inventário da migração

A = criado, M = alterado, D = removido. O único arquivo removido é o placeholder Java; histórico Git preservado.

```text
A	.env.example
A	.github/workflows/ci.yml
A	.gitignore
M	README.md
A	apps/api/package.json
A	apps/api/prisma.config.ts
A	apps/api/prisma/migrations/202610290001_initial/migration.sql
A	apps/api/prisma/migrations/migration_lock.toml
A	apps/api/prisma/schema.prisma
A	apps/api/src/common/dto.ts
A	apps/api/src/common/prisma.filter.ts
A	apps/api/src/domain/agenda.test.ts
A	apps/api/src/domain/agenda.ts
A	apps/api/src/domain/concorrencia.integration.test.ts
A	apps/api/src/domain/http.integration.test.ts
A	apps/api/src/domain/model.ts
A	apps/api/src/main.ts
A	apps/api/src/modules/agenda.controller.ts
A	apps/api/src/modules/agenda.module.ts
A	apps/api/src/modules/agenda.repository.ts
A	apps/api/src/modules/agenda.service.ts
A	apps/api/src/modules/clientes.ts
A	apps/api/src/modules/disponibilidades.ts
A	apps/api/src/modules/profissionais.ts
A	apps/api/src/modules/servicos.ts
A	apps/api/src/prisma/prisma.service.ts
A	apps/api/tsconfig.json
A	apps/web/index.html
A	apps/web/package.json
A	apps/web/src/App.tsx
A	apps/web/src/components/Formulario.test.ts
A	apps/web/src/components/Formulario.tsx
A	apps/web/src/hooks/useLista.ts
A	apps/web/src/main.tsx
A	apps/web/src/pages/Agenda.tsx
A	apps/web/src/pages/Cadastros.tsx
A	apps/web/src/services/api.ts
A	apps/web/src/style.css
A	apps/web/src/types/index.ts
A	apps/web/tsconfig.json
A	apps/web/vite.config.ts
M	database/modelo-dados.md
M	diagramas/README.md
M	diagramas/diagrama-arquitetura.md
M	diagramas/diagrama-classes.md
M	diagramas/diagrama-entidade-relacionamento.md
M	docs/arquitetura.md
A	docs/arquivos-migracao.md
M	docs/dados.md
M	docs/documentacao.md
M	docs/entidades.md
M	docs/fluxo-backend.md
M	docs/fluxo-interface.md
A	docs/migracao.md
M	docs/relacoes.md
M	docs/requisitos.md
A	docs/verificacao.md
A	eslint.config.mjs
A	package-lock.json
A	package.json
D	src/main/java/.gitkeep
```
