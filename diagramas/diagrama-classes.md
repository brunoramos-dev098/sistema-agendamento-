# Diagrama de Classes

Modelo TypeScript da migração. Implementação em apps/api/src/domain/model.ts.

```mermaid
classDiagram
    class Usuario {
        <<abstract>>
        string id
        string nome
        string telefone
        string email
    }
    class Cliente
    class Profissional {
        string especialidade
    }
    class Administrador
    class Servico {
        string id
        string nome
        string descricao
        string preco
        number duracao
    }
    class Disponibilidade {
        string id
        number diaSemana
        number inicioMinuto
        number fimMinuto
        Profissional profissional
    }
    class Agendamento {
        string id
        string inicio
        string fim
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

`duracao` representa minutos. StatusAgendamento é um enum TypeScript. A linha pontilhada indica uso desse tipo, sem uma associação entre entidades. Coleções privadas retornam cópias e atributos são somente para leitura.

Consulte [entidades](../docs/entidades.md), [dados](../docs/dados.md), [relações](../docs/relacoes.md) e [requisitos](../docs/requisitos.md).
