# Relações iniciais entre entidades

## Cliente e Agendamento

```text
Cliente 1 -------- 0..N Agendamento
```

Um cliente pode possuir nenhum ou vários agendamentos. Cada agendamento possui exatamente um cliente.

## Profissional e Agendamento

```text
Profissional 1 -------- 0..N Agendamento
```

Um profissional pode possuir nenhum ou vários agendamentos. Cada agendamento possui exatamente um profissional.

## Serviço e Agendamento

```text
Servico 1 -------- 0..N Agendamento
```

Um serviço pode aparecer em nenhum ou vários agendamentos. Cada agendamento possui exatamente um serviço.

## Profissional e Disponibilidade

```text
Profissional 1 -------- 0..N Disponibilidade
```

Um profissional pode possuir nenhum ou vários períodos de disponibilidade. Cada disponibilidade pertence a exatamente um profissional. Sem um período compatível, o profissional não poderá receber um agendamento (RN04).

## Profissional e Serviço

```text
Profissional 0..N -------- 0..N Servico
```

Esta é uma relação **N:N**: um profissional pode realizar vários serviços e o mesmo serviço pode ser realizado por vários profissionais. O cadastro pode existir antes da associação, por isso o mínimo é zero em ambos os lados.

A relação registra quais serviços cada profissional está apto a realizar antes de existir um agendamento. Um agendamento só pode utilizar um par profissional/serviço já associado (RN03). No MySQL, a relação será representada pela tabela associativa `profissionais_servicos`.

## Herança definida para a primeira entrega

```text
Usuario
├── Cliente
├── Profissional
└── Administrador
```

Usuario é uma **classe abstrata**, e Cliente, Profissional e Administrador herdam seus atributos comuns. A herança está adotada na proposta inicial; não é uma associação com cardinalidade. O modelo poderá evoluir durante o semestre.

A organização das classes por herança não define automaticamente a organização das tabelas do banco. O mapeamento de persistência será decidido posteriormente.

Consulte o [diagrama de classes](../diagramas/diagrama-classes.md), o [modelo de dados](../database/modelo-dados.md) e os [requisitos e regras](requisitos.md).
