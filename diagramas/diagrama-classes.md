# Diagrama de Classes

Modelo conceitual da primeira entrega de **30/09/2026**. As classes e o enum ainda não foram implementados.

```mermaid
classDiagram
    class Usuario {
        <<abstract>>
        Long id
        String nome
        String telefone
        String email
    }
    class Cliente
    class Profissional {
        String especialidade
    }
    class Administrador
    class Servico {
        Long id
        String nome
        String descricao
        BigDecimal preco
        Integer duracao
    }
    class Disponibilidade {
        Long id
        DayOfWeek diaSemana
        LocalTime horaInicio
        LocalTime horaFim
        Profissional profissional
    }
    class Agendamento {
        Long id
        LocalDate data
        LocalTime horario
        StatusAgendamento status
        Cliente cliente
        Profissional profissional
        Servico servico
    }
    class StatusAgendamento {
        <<enumeration>>
        AGENDADO
        CONFIRMADO
        CANCELADO
        CONCLUIDO
    }

    Usuario <|-- Cliente
    Usuario <|-- Profissional
    Usuario <|-- Administrador
    Cliente "1" -- "0..*" Agendamento : possui
    Profissional "1" -- "0..*" Agendamento : atende
    Servico "1" -- "0..*" Agendamento : compoe
    Profissional "1" -- "0..*" Disponibilidade : possui
    Profissional "0..*" -- "0..*" Servico : oferece
    Agendamento ..> StatusAgendamento : utiliza
```

Usuario é uma **classe abstrata**; Cliente, Profissional e Administrador herdam seus atributos sem repeti-los. `0..*` equivale a `0..N` na documentação textual. As referências exibidas nos atributos de Agendamento e Disponibilidade são as mesmas associações representadas pelas linhas, não relações adicionais.

`duracao` representa minutos. StatusAgendamento será um enum Java. A linha pontilhada indica uso desse tipo, sem uma associação entre entidades. A visibilidade dos atributos e os métodos serão detalhados na implementação, respeitando o encapsulamento.

Consulte [entidades](../docs/entidades.md), [dados](../docs/dados.md), [relações](../docs/relacoes.md) e [requisitos](../docs/requisitos.md).
