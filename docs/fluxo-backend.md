# Fluxo REST do Back-end

DTO → ValidationPipe → Controller → Service → Repository/Prisma → PostgreSQL. Dados e erros HTTP retornam em JSON. IDs de rota devem ser UUID. Cadastro incompleto ou inválido recebe 400; registro ausente na agenda recebe 404; conflito transacional após tentativas recebe 409.

| Endpoint                                                                      | Operação                                                               |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| GET/POST /clientes, /profissionais, /servicos                                 | Consultar e cadastrar                                                  |
| PUT /clientes/:id, /profissionais/:id, /servicos/:id                          | Editar cadastro completo                                               |
| PUT /profissionais/:p/servicos/:s                                             | Associar de forma idempotente                                          |
| GET/POST /disponibilidades                                                    | Consultar e cadastrar períodos                                         |
| PUT /disponibilidades/:id                                                     | Editar período                                                         |
| GET /agendamentos                                                             | Consultar agenda e histórico                                           |
| GET /agendamentos/horarios?profissionalId=UUID&servicoId=UUID&data=YYYY-MM-DD | Horários disponíveis em ISO UTC                                        |
| POST /agendamentos                                                            | Criar com clienteId, profissionalId, servicoId e inicio ISO com offset |
| PUT /agendamentos/:id                                                         | Alterar dados completos e revalidar, ignorando próprio ID              |
| PATCH /agendamentos/:id/status                                                | Alterar status, inclusive CANCELADO                                    |

Criação e alteração verificam referências obrigatórias (RN06), passado (RN02), associação (RN03), disponibilidade integral (RN04), sobreposição com duração (RN01/RN05) e exclusão dos cancelados da ocupação (RN07). Usam transação Serializable; a restrição PostgreSQL de exclusão é a defesa final contra concorrência. Cancelar faz UPDATE, nunca DELETE. Reativar cancelado revalida o intervalo histórico. Não há endpoints de exclusão de cadastros para evitar perda de histórico.

Exemplo: 10h–11h impede 10h30 e permite 11h. Todos os horários do estabelecimento usam America/Fortaleza; API retorna instantes UTC. Não há autenticação: executar apenas em ambiente local até definir identidade e autorização reais.
