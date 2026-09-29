# Estrutura inicial dos dados

Os tipos abaixo são sugestões iniciais para Java e poderão ser alterados após a validação dos requisitos. Não representam a definição de um banco de dados ou de tipos SQL.

## Usuario

Classe abstrata que concentra os atributos herdados por Cliente, Profissional e Administrador.

| Campo | Tipo Java sugerido | Descrição |
|---|---|---|
| id | Long | Identificador do usuário |
| nome | String | Nome completo |
| telefone | String | Telefone, preservando formatação e zeros iniciais |
| email | String | E-mail |

## Cliente

Herda `id`, `nome`, `telefone` e `email` de Usuario. Não possui atributos específicos definidos nesta etapa. Sua associação com Agendamento está representada no [diagrama de classes](../diagramas/diagrama-classes.md).

## Profissional

Herda `id`, `nome`, `telefone` e `email` de Usuario. Somente o atributo específico é listado abaixo.

| Campo | Tipo sugerido | Descrição |
|---|---|---|
| especialidade | String | Especialidade do profissional |

## Administrador

Herda `id`, `nome`, `telefone` e `email` de Usuario. Não possui atributos específicos definidos nesta etapa.

## Serviço (Servico)

| Campo | Tipo sugerido | Descrição |
|---|---|---|
| id | Long | Identificador do serviço |
| nome | String | Nome do serviço |
| descricao | String | Descrição do serviço oferecido |
| preco | BigDecimal | Valor monetário do serviço |
| duracao | Integer | Duração prevista em minutos |

## Disponibilidade

| Campo | Tipo Java sugerido | Descrição |
|---|---|---|
| id | Long | Identificador do período de disponibilidade |
| diaSemana | DayOfWeek | Dia da semana do período recorrente |
| horaInicio | LocalTime | Início do período disponível |
| horaFim | LocalTime | Fim do período disponível |
| profissional | Profissional | Referência ao único profissional ao qual o período pertence |

## Agendamento

| Campo | Tipo sugerido | Descrição |
|---|---|---|
| id | Long | Identificador do agendamento |
| data | LocalDate | Data do atendimento |
| horario | LocalTime | Horário de início do atendimento |
| status | StatusAgendamento | Situação do agendamento, conforme os valores abaixo |
| cliente | Cliente | Referência ao único cliente associado |
| profissional | Profissional | Referência ao único profissional associado |
| servico | Servico | Referência ao único serviço associado |

As referências representam associações entre objetos. No modelo de persistência previsto, poderão corresponder a chaves estrangeiras, conforme [modelo de dados](../database/modelo-dados.md).

## StatusAgendamento

Enum Java previsto, ainda sem arquivo de implementação:

| Valor | Descrição |
|---|---|
| AGENDADO | Atendimento registrado na agenda |
| CONFIRMADO | Atendimento confirmado |
| CANCELADO | Atendimento cancelado; não ocupa horário |
| CONCLUIDO | Atendimento realizado |

As transições serão detalhadas posteriormente. A relação N:N entre Profissional e Servico é uma associação do modelo, não um novo atributo escalar; sua representação em coleções Java será definida na implementação. Os tipos e associações estão alinhados ao [diagrama de classes](../diagramas/diagrama-classes.md).
