# Entidades iniciais

Esta é a proposta de modelagem da primeira entrega de **30/09/2026**. O modelo adota herança de Usuario e poderá evoluir durante o semestre, conforme a imersão e a validação dos requisitos. As classes ainda não foram implementadas.

## Usuario

Tipo: **classe abstrata**. Não representa um usuário a ser instanciado diretamente.

Atributos:

- `id`
- `nome`
- `telefone`
- `email`

Responsabilidade: concentrar informações comuns aos diferentes tipos de usuários do sistema.

Subclasses: **Cliente**, **Profissional** e **Administrador**. Essa organização aplica abstração e herança, evitando a duplicação dos atributos comuns.

## Cliente

Herda de: **Usuario**. Não possui atributos específicos definidos nesta etapa.

Responsabilidades:

- Realizar agendamentos.
- Consultar seus agendamentos.
- Cancelar agendamentos quando permitido.
- Possuir histórico de atendimentos.

## Profissional

Herda de: **Usuario**.

Atributos específicos iniciais:

- `especialidade`

Responsabilidades:

- Oferecer serviços.
- Possuir períodos de disponibilidade.
- Possuir agendamentos.
- Realizar atendimentos.

## Administrador

Herda de: **Usuario**. Não possui atributos específicos definidos nesta etapa.

Responsabilidades:

- Gerenciar serviços.
- Gerenciar profissionais.
- Acompanhar os agendamentos.
- Administrar informações do estabelecimento.

## Servico

Atributos:

- `id`
- `nome`
- `descricao`
- `preco`
- `duracao`

Responsabilidade: representar um serviço disponibilizado pelo estabelecimento. A duração será inicialmente expressa em minutos.

Tipos Java sugeridos: `id: Long`, `nome: String`, `descricao: String`, `preco: BigDecimal` e `duracao: Integer`.

## Disponibilidade

Atributos e tipos Java sugeridos:

- `id: Long`
- `diaSemana: DayOfWeek`
- `horaInicio: LocalTime`
- `horaFim: LocalTime`
- `profissional: Profissional`

Responsabilidade: representar os períodos em que determinado profissional está disponível para realizar atendimentos. Essa entidade é necessária para saber quando um profissional realmente pode receber agendamentos. Cada registro descreve um período semanal pertencente a um único profissional; períodos disponíveis ainda precisam ser confrontados com os agendamentos que ocupam a agenda.

## Agendamento

Atributos:

- `id`
- `data`
- `horario`
- `status`
- `cliente`
- `profissional`
- `servico`

Responsabilidade: representar o agendamento de um serviço, associando exatamente um cliente, um profissional e um serviço a uma data e horário.

Tipos Java sugeridos: `id: Long`, `data: LocalDate`, `horario: LocalTime`, `status: StatusAgendamento`, `cliente: Cliente`, `profissional: Profissional` e `servico: Servico`.

## StatusAgendamento

Será representado futuramente como um **enum Java**, com os valores:

| Valor | Significado inicial |
|---|---|
| AGENDADO | Atendimento registrado na agenda |
| CONFIRMADO | Atendimento confirmado |
| CANCELADO | Atendimento cancelado; não ocupa horário |
| CONCLUIDO | Atendimento realizado |

Não é uma entidade com identidade própria. As condições e permissões para transições entre estados serão refinadas após a validação com os usuários.

## Evolução do modelo

Os atributos comuns de Cliente, Profissional e Administrador são herdados de Usuario. As associações estão em [relações](relacoes.md), os tipos em [dados](dados.md), as regras em [requisitos](requisitos.md) e a visão UML no [diagrama de classes](../diagramas/diagrama-classes.md).

Na futura implementação, o encapsulamento deverá proteger os dados dos objetos, e a camada de serviço coordenará as operações e validações entre entidades. Não são definidos métodos adicionais nesta etapa.
