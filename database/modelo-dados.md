# Modelo de dados previsto

Esta é uma visão inicial da estrutura de persistência, sujeita à validação dos requisitos. Nenhum banco de dados foi escolhido ou criado, e esta etapa não inclui SQL.

## Possíveis tabelas futuras

```text
clientes
profissionais
administradores
servicos
disponibilidades
agendamentos
profissionais_servicos
```

| Tabela prevista | Chave primária sugerida | Informações principais |
|---|---|---|
| clientes | id | nome, telefone, email |
| profissionais | id | nome, telefone, email, especialidade |
| administradores | id | nome, telefone, email |
| servicos | id | nome, descricao, preco, duracao |
| disponibilidades | id | dia_semana, hora_inicio, hora_fim, profissional_id |
| agendamentos | id | data, horario, status e referências às demais tabelas |
| profissionais_servicos | (profissional_id, servico_id) | Associação entre profissional e serviço |

Usuario é uma **classe abstrata no modelo orientado a objetos**, herdada por Cliente, Profissional e Administrador. A estratégia de persistência da herança ainda será definida. A lista acima é uma visão conceitual dos dados previstos, não uma escolha definitiva de mapeamento; não pressupõe uma tabela `usuarios`. Os atributos comuns são apresentados nas tabelas conceituais para indicar quais informações precisam ser armazenadas, sem duplicá-los nas subclasses do modelo de classes.

## Chaves estrangeiras previstas

### agendamentos

```text
agendamentos
- id
- data
- horario
- status
- cliente_id
- profissional_id
- servico_id
```

| Campo em agendamentos | Referência prevista | Significado |
|---|---|---|
| cliente_id | clientes.id | Cliente do agendamento |
| profissional_id | profissionais.id | Profissional responsável |
| servico_id | servicos.id | Serviço agendado |

Cada agendamento deverá estar associado a exatamente um registro de cada uma dessas tabelas. Um cliente, profissional ou serviço poderá estar associado a zero ou mais agendamentos.

`id` é a chave primária sugerida. `status` representa `AGENDADO`, `CONFIRMADO`, `CANCELADO` ou `CONCLUIDO`, conforme StatusAgendamento. O formato de armazenamento será definido posteriormente. Cancelamentos preservam o registro, mas liberam o intervalo para outros agendamentos (RN07).

### disponibilidades

```text
disponibilidades
- id
- dia_semana
- hora_inicio
- hora_fim
- profissional_id
```

`id` é a chave primária sugerida e `profissional_id` é uma chave estrangeira para `profissionais.id`. Cada período pertence a exatamente um profissional; um profissional pode possuir zero ou mais períodos. `dia_semana` corresponde a `diaSemana` no modelo Java, e os horários correspondem a `horaInicio` e `horaFim`.

### profissionais_servicos

```text
profissionais_servicos
- profissional_id
- servico_id
```

`profissional_id` referencia `profissionais.id`, e `servico_id` referencia `servicos.id`. O par é a chave primária composta sugerida, evitando repetir a mesma associação. Cada registro vincula exatamente um profissional a exatamente um serviço; cada profissional e serviço pode aparecer em zero ou mais registros dessa tabela.

Essa tabela resolve conceitualmente a relação **N:N** e permite registrar os serviços que um profissional pode realizar antes de existir um agendamento. O par selecionado no agendamento deve existir nessa associação (RN03). A forma de garantir essa regra na implementação e na persistência será definida posteriormente.

## Relação com as demais visões

Os atributos e tipos Java sugeridos estão em [dados](../docs/dados.md), e as cardinalidades em [relações](../docs/relacoes.md). O [diagrama entidade-relacionamento](../diagramas/diagrama-entidade-relacionamento.md) representa as tabelas conceituais e chaves descritas aqui.

Esta proposta não determina o banco, framework ou mecanismo de acesso aos dados. Os tipos usados no diagrama são descritivos, sem constituir SQL ou um esquema físico definitivo.
