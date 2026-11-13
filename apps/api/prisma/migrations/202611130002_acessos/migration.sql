CREATE TYPE "Perfil" AS ENUM ('CLIENTE','PROFISSIONAL','ADMINISTRADOR');
CREATE TABLE "Conta" (id uuid PRIMARY KEY,email text NOT NULL UNIQUE,"senhaHash" text NOT NULL,perfil "Perfil" NOT NULL,"clienteId" uuid UNIQUE REFERENCES "Cliente"(id) ON DELETE RESTRICT ON UPDATE CASCADE,"profissionalId" uuid UNIQUE REFERENCES "Profissional"(id) ON DELETE RESTRICT ON UPDATE CASCADE,"administradorId" uuid UNIQUE REFERENCES "Administrador"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
CONSTRAINT "Conta_perfil_vinculo" CHECK ((perfil='CLIENTE' AND "clienteId" IS NOT NULL AND "profissionalId" IS NULL AND "administradorId" IS NULL) OR (perfil='PROFISSIONAL' AND "profissionalId" IS NOT NULL AND "clienteId" IS NULL AND "administradorId" IS NULL) OR (perfil='ADMINISTRADOR' AND "administradorId" IS NOT NULL AND "clienteId" IS NULL AND "profissionalId" IS NULL)));
CREATE TABLE "Sessao" ("tokenHash" char(64) PRIMARY KEY,"contaId" uuid NOT NULL REFERENCES "Conta"(id) ON DELETE CASCADE ON UPDATE CASCADE,"expiraEm" timestamptz(3) NOT NULL);
CREATE INDEX "Sessao_contaId_idx" ON "Sessao"("contaId");
CREATE INDEX "Sessao_expiraEm_idx" ON "Sessao"("expiraEm");
