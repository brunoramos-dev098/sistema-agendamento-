CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_preco_valido" CHECK (preco >= 0), ADD CONSTRAINT "Servico_duracao_valida" CHECK (duracao BETWEEN 1 AND 1440);
ALTER TABLE "Disponibilidade" ADD CONSTRAINT "Disponibilidade_periodo_valido" CHECK ("diaSemana" BETWEEN 1 AND 7 AND "inicioMinuto" >= 0 AND "fimMinuto" <= 1440 AND "inicioMinuto" < "fimMinuto");
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_intervalo_valido" CHECK (inicio < fim);
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_sem_sobreposicao" EXCLUDE USING gist ("profissionalId" WITH =, tstzrange(inicio, fim, '[)') WITH &&) WHERE (status <> 'CANCELADO');
