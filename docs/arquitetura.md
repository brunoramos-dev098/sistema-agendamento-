# Arquitetura do Checkapp

Monorepo npm: apps/web contém React + TypeScript strict + Vite; apps/api contém NestJS + TypeScript strict. Comunicação por API REST JSON. React Router controla navegação; TanStack Query consulta e invalida dados; React Hook Form e Zod validam cadastros. Tailwind CSS 4 e CSS responsivo definem a apresentação.

Controller recebe HTTP e DTO validado pelo ValidationPipe global (whitelist e rejeição de campos extras). Service aplica RN01–RN07. Repository coordena acesso Prisma. Domain contém classes de POO e a função pura de validação de intervalos. PrismaService é injetado por módulo global. Módulos separam clientes, profissionais, serviços, disponibilidades e agenda.

Usuario abstrato é base de Cliente, Profissional e Administrador. Objetos de domínio e registros Prisma têm responsabilidades distintas; a validação pura do domínio é usada pelo serviço de agenda. Não existe autenticação ou permissão por perfil implementada.

Transações Serializable com até três tentativas em conflito de serialização validam referências, associação, disponibilidade e ocupação. A migration adiciona EXCLUDE USING gist sobre profissional e tstzrange(inicio,fim,'[)'), excetuando CANCELADO. Assim, requisições concorrentes não conseguem reservar intervalos sobrepostos, inclusive por outros clientes SQL. O fim fica congelado no agendamento: editar a duração de um serviço não altera atendimentos existentes.

Veja [modelo de dados](../database/modelo-dados.md), [requisitos](requisitos.md) e [histórico de migração](migracao.md).
