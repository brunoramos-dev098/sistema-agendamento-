# Diagrama Entidade-Relacionamento

Modelo conceitual dos dados que serão armazenados em MySQL. Os tipos abaixo são descritivos; o esquema físico e os scripts SQL serão elaborados na implementação.

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
        hora hora_inicio
        hora hora_fim
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

`||` indica exatamente um e `o{` indica zero ou muitos. Cada agendamento referencia exatamente um cliente, profissional e serviço. Cada disponibilidade pertence a exatamente um profissional.

A relação N:N entre profissionais e serviços é resolvida por PROFISSIONAIS_SERVICOS. Cada linha da associação tem duas chaves estrangeiras, que juntas formam a chave primária composta sugerida. O par profissional/serviço do agendamento deve existir nessa associação (RN03); as linhas do diagrama, isoladamente, não expressam essa validação.

ADMINISTRADORES aparece sem associação própria porque não foi definida uma relação persistente específica para esse perfil. Gerenciar informações é uma responsabilidade, não uma chave estrangeira adicional.

Usuario é uma classe abstrata do modelo de objetos. A estratégia de persistência da herança permanece a definir; apresentar os dados comuns nas tabelas conceituais não fixa uma estratégia nem exige uma tabela `usuarios`.

`duracao` representa minutos, e `status` corresponde a `AGENDADO`, `CONFIRMADO`, `CANCELADO` ou `CONCLUIDO`. Consulte [modelo de dados](../database/modelo-dados.md), [relações](../docs/relacoes.md) e [requisitos](../docs/requisitos.md).
