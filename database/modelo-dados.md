# PostgreSQL e Prisma ORM 7

Fonte do esquema: apps/api/prisma/schema.prisma. Migrations em apps/api/prisma/migrations. PrismaPg usa DATABASE_URL, CLI usa DIRECT_DATABASE_URL com fallback. Não executar migração em banco remoto sem revisão e backup.

Tabela por classe concreta para herança: Cliente, Profissional e Administrador têm atributos comuns persistidos, enquanto TypeScript os herda de Usuario sem duplicação. Não existe tabela Usuario.

UUIDs identificam registros; emails são únicos dentro de cada tabela concreta. Servico guarda numeric(10,2), duração inteira positiva. Disponibilidade pertence a Profissional, contém dia 1–7 e minutos locais 0–1440. ProfissionalServico tem PK composta (profissionalId, servicoId), resolve N:N e evita duplicação. Agendamento tem FKs obrigatórias para Cliente, Profissional e Servico, status enum, inicio e fim timestamptz, índice por profissional/início e cliente/início. FKs Restrict preservam histórico.

Migration complementa Prisma com CHECKs e extensão btree_gist. Restrição EXCLUDE combina profissionalId e tstzrange(inicio,fim,'[)') para todos os status exceto CANCELADO. Requisições simultâneas que disputam o mesmo intervalo não podem ambas confirmar. Prisma não expressa essa restrição; não substituir migrations por db push. Preço e duração do catálogo não modificam intervalos históricos.

PostgreSQL local e Supabase são alternativas. Em Supabase usar URL de conexão PostgreSQL no backend e conexão direta para migrations, mantendo TLS validado. Extensão btree_gist precisa estar disponível e autorizada. Não usar chaves Supabase nem DATABASE_URL no Vite. Nenhum banco remoto foi alterado durante esta migração.
