# Modelo PostgreSQL

```mermaid
erDiagram
    CLIENTES {
        identificador id PK
        texto nome
        texto telefone
        texto email
    }
    PROFISSIONAIS {
        identificador id PK
        texto nome
        texto telefone
        texto email
        texto especialidade
    }
    ADMINISTRADORES {
        identificador id PK
        texto nome
        texto telefone
        texto email
    }
    SERVICOS {
        identificador id PK
        texto nome
        texto descricao
        decimal preco
        inteiro duracao
    }
    DISPONIBILIDADES {
        identificador id PK
        dia_da_semana dia_semana
        integer inicio_minuto
        integer fim_minuto
        identificador profissional_id FK
    }
    AGENDAMENTOS {
        identificador id PK
        data data
        hora horario
        estado status
        identificador cliente_id FK
        identificador profissional_id FK
        identificador servico_id FK
    }
    PROFISSIONAIS_SERVICOS {
        identificador profissional_id PK, FK
        identificador servico_id PK, FK
    }

    CLIENTES ||--o{ AGENDAMENTOS : possui
    PROFISSIONAIS ||--o{ AGENDAMENTOS : atende
    SERVICOS ||--o{ AGENDAMENTOS : compoe
    PROFISSIONAIS ||--o{ DISPONIBILIDADES : possui
    PROFISSIONAIS ||--o{ PROFISSIONAIS_SERVICOS : oferece
    SERVICOS ||--o{ PROFISSIONAIS_SERVICOS : vincula
```

Tipos SQL e nomes físicos exatos estão no schema Prisma. Tabela por classe concreta, FKs Restrict, relação N:N explícita e status enum. Veja [modelo](../database/modelo-dados.md).
