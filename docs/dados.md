# Dados e tipos

| Informação                | TypeScript / API                          | PostgreSQL                           |
| ------------------------- | ----------------------------------------- | ------------------------------------ |
| IDs                       | string UUID                               | uuid                                 |
| Nome, telefone, email     | string                                    | text, email único por tipo de pessoa |
| Especialidade e descrição | string                                    | text                                 |
| Preço                     | string decimal (ex.: 35.50)               | numeric(10,2)                        |
| Duração                   | number inteiro, minutos                   | integer positivo                     |
| Dia da semana             | number 1 segunda a 7 domingo              | integer 1–7                          |
| Disponibilidade           | inicioMinuto e fimMinuto desde meia-noite | integer 0–1440                       |
| Início e fim              | ISO 8601 com offset obrigatório           | timestamptz(3)                       |
| Status                    | StatusAgendamento                         | enum                                 |

Horários recorrentes usam America/Fortaleza. Instantes de atendimentos são armazenados em UTC e apresentados no fuso do estabelecimento. Intervalos [início,fim). API não aceita instante sem offset. Dias inválidos são rejeitados. Períodos não atravessam meia-noite; para isso cadastrar períodos separados.

Dinheiro nunca é calculado com ponto flutuante: classe Servico usa string decimal validada e Prisma usa Decimal. Duração está em minutos. Telefone permanece texto.

Status tem exatamente AGENDADO, CONFIRMADO, CANCELADO e CONCLUIDO. Cancelamento mantém o registro e libera ocupação. Fim histórico permanece fixo após alterações no catálogo.

## Horário de São Luís (MA)

A interface usa o nome São Luís (MA). O identificador técnico America/Fortaleza também cobre o Maranhão, conforme a tabela IANA: https://raw.githubusercontent.com/eggert/tz/main/zone1970.tab. Mantê-lo preserva a interpretação dos horários e dos registros existentes. A lista de horários depende da disponibilidade do profissional no dia da semana selecionado, da duração integral do serviço e das reservas existentes.

## Autenticação

Conta possui UUID, email único normalizado, senhaHash scrypt e perfil enum. Exatamente um vínculo obrigatório conforme perfil: clienteId, profissionalId ou administradorId, cada um único. Sessao guarda tokenHash SHA-256 como PK, contaId com FK Cascade e expiraEm timestamptz, com índices por conta e expiração. Nenhum registro antigo recebe senha automática.
