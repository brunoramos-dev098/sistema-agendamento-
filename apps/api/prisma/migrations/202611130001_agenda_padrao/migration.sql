-- Padrão solicitado: segunda a sábado, 09:00–19:30, serviços de 30 minutos.
-- Intervalos de agendamentos existentes permanecem intactos.
UPDATE "Servico" SET duracao = 30;
UPDATE "Disponibilidade" SET "diaSemana" = CASE WHEN "diaSemana" = 7 THEN 6 ELSE "diaSemana" END, "inicioMinuto" = 540, "fimMinuto" = 1170;
INSERT INTO "Disponibilidade" (id,"profissionalId","diaSemana","inicioMinuto","fimMinuto")
SELECT gen_random_uuid(), p.id, dia, 540, 1170
FROM "Profissional" p CROSS JOIN generate_series(1,6) AS dia
WHERE NOT EXISTS (SELECT 1 FROM "Disponibilidade" d WHERE d."profissionalId"=p.id AND d."diaSemana"=dia);
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_duracao_padrao" CHECK (duracao = 30);
