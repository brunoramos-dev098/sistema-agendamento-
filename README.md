# Sistema de Gerenciamento e Agendamento de Serviços

Projeto acadêmico desenvolvido na disciplina de Programação Orientada a Objetos (POO), em Java, para aplicar conceitos de POO na solução de um problema real: a organização de serviços e agendamentos em pequenos estabelecimentos.

## Sobre o Projeto

Pequenos prestadores de serviço frequentemente utilizam WhatsApp, agendas físicas ou outros métodos manuais para controlar seus atendimentos. O projeto propõe centralizar essas informações e facilitar a organização da agenda.

## Problema

- Agendamentos dispersos em conversas de WhatsApp e agendas físicas.
- Conflitos de horário entre atendimentos.
- Esquecimentos de agendamentos.
- Dificuldade de organização da agenda dos profissionais.
- Ausência de histórico de atendimentos.
- Dificuldade para visualizar horários disponíveis e acompanhar cancelamentos e alterações.

## Objetivo Geral

Desenvolver uma aplicação orientada a objetos para centralizar e organizar o gerenciamento de clientes, profissionais, serviços, disponibilidade e agendamentos.

## Objetivos Específicos

- Cadastrar clientes.
- Cadastrar profissionais.
- Cadastrar serviços.
- Associar serviços aos profissionais.
- Registrar disponibilidade dos profissionais.
- Consultar horários disponíveis.
- Criar e consultar agendamentos.
- Impedir conflitos de horário.
- Permitir alteração e cancelamento de agendamentos.
- Acompanhar o status dos agendamentos.
- Armazenar histórico de atendimentos.

## Público-Alvo

- Barbearias.
- Salões de beleza.
- Manicures.
- Clínicas de estética.
- Profissionais autônomos.

## Documentação

| Documento | Conteúdo |
|---|---|
| [Documentação geral](docs/documentacao.md) | Contexto, justificativa, objetivos, usuários e aplicação de POO |
| [Arquitetura](docs/arquitetura.md) | Responsabilidades das camadas e modelo de domínio |
| [Fluxo da interface](docs/fluxo-interface.md) | Telas previstas, navegação e encaminhamento das solicitações ao Controller |
| [Fluxo do Back-end](docs/fluxo-backend.md) | Componentes conceituais, processamento de agendamentos e validações RN01–RN07 |
| [Entidades](docs/entidades.md) | Usuario abstrato, subclasses e entidades do agendamento |
| [Relações](docs/relacoes.md) | Herança, associações e cardinalidades |
| [Dados](docs/dados.md) | Atributos, tipos Java sugeridos e status |
| [Requisitos](docs/requisitos.md) | Requisitos funcionais, não funcionais e regras de negócio |
| [Imersão na comunidade](docs/imersao.md) | Modelo para registro da coleta futura |
| [Modelo de dados](database/modelo-dados.md) | Tabelas conceituais e chaves previstas |
| [Diagramas](diagramas/README.md) | Diagramas de classes, arquitetura e entidade-relacionamento |

O modelo inicial adota **Usuario como classe abstrata**, herdada por Cliente, Profissional e Administrador. Disponibilidade representa os períodos semanais dos profissionais, e a associação N:N entre Profissional e Servico indica quais serviços cada profissional oferece. Agendamento reúne cliente, profissional, serviço, data, horário e status. Essa proposta será validada durante a imersão e poderá evoluir no semestre.

## Estrutura do Projeto

```text
sistema-agendamento-/
├── README.md
├── docs/
│   ├── documentacao.md
│   ├── arquitetura.md
│   ├── fluxo-interface.md
│   ├── fluxo-backend.md
│   ├── entidades.md
│   ├── relacoes.md
│   ├── dados.md
│   ├── requisitos.md
│   └── imersao.md
├── diagramas/
│   ├── README.md
│   ├── diagrama-classes.md
│   ├── diagrama-arquitetura.md
│   └── diagrama-entidade-relacionamento.md
├── src/
│   └── main/
│       └── java/
│           ├── .gitkeep
│           └── br/com/sistemaagendamento/dominio/
│               ├── Usuario.java
│               ├── Cliente.java
│               ├── Profissional.java
│               ├── Administrador.java
│               ├── Servico.java
│               ├── Disponibilidade.java
│               ├── Agendamento.java
│               └── StatusAgendamento.java
└── database/
    └── modelo-dados.md
```

- `docs/`: documentação geral, modelagem, fluxos de interface e Back-end, requisitos e registro futuro da imersão, conforme o índice acima.
- `diagramas/`: diagramas iniciais em Mermaid, descritos no [guia da pasta](diagramas/README.md).
- `src/`: código Java do modelo de domínio, no pacote `br.com.sistemaagendamento.dominio`.
- `database/`: [modelo de dados previsto](database/modelo-dados.md), sem banco real ou SQL nesta etapa.

## Modelo de domínio em Java

As sete classes de domínio e o enum `StatusAgendamento` estão implementados em [src/main/java/br/com/sistemaagendamento/dominio](src/main/java/br/com/sistemaagendamento/dominio), conforme o [diagrama de classes](diagramas/diagrama-classes.md). O código utiliza apenas Java padrão e foi compilado e verificado com JDK 17.

`Usuario` é abstrata e concentra os dados herdados por `Cliente`, `Profissional` e `Administrador`. Os campos são privados; os identificadores são recebidos no construtor, podem ser nulos antes da persistência e não possuem setter. As referências obrigatórias de `Agendamento` e `Disponibilidade`, suas datas, horários e o status não aceitam `null` nos construtores ou setters.

A associação N:N usa `Set` nos dois lados, com consultas somente para leitura e métodos de adição e remoção que mantêm os vínculos sincronizados. A repetição da mesma instância é evitada; a identidade entre objetos carregados do banco será tratada na etapa de persistência. As demais relações são representadas pelas referências em `Agendamento` e `Disponibilidade`, sem listas inversas duplicadas.

Conflitos de agenda, disponibilidade global e permissões de mudança de status continuam reservados aos futuros Services. Controllers, Services, Repositories, interface e integração com MySQL ainda não estão implementados.

## Primeira Entrega

**Data: 30/09/2026**

Conteúdo:

- Documentação.
- Organização do repositório.
- Arquitetura inicial.
- Entidades.
- Relações entre entidades.
- Estrutura de dados.
- Diagramas iniciais.

Esta etapa prepara a base do projeto. As funcionalidades serão implementadas posteriormente, após o levantamento e a validação dos requisitos.

## Tecnologias

- Java.
- Programação Orientada a Objetos.
- Git.
- GitHub.

| Área | Tecnologia | Uso no projeto |
|---|---|---|
| Interface | JavaFX | Componentes e interação nas telas da aplicação desktop |
| Estrutura das telas | FXML | Descrição dos layouts |
| Edição visual | Scene Builder | Montagem e edição dos layouts FXML |
| Estilos | CSS | Aparência dos componentes JavaFX |
| Banco de dados | MySQL | Armazenamento dos dados do sistema |

Essas tecnologias estão definidas para o desenvolvimento. O modelo de domínio Java está implementado; as telas e a integração com MySQL ainda serão desenvolvidas.

## Equipe

| Integrante | GitHub | Papel |
|---|---|---|
| Bruno Ramos | [@brunoramos-dev098](https://github.com/brunoramos-dev098) | Team Lead |
| Luciano Henrique | [lucianohoalmeida@gmail.com](https://github.com/lucianohenriquue) | Back-end |
| Thyago Baima | [Thyago098](https://github.com/Thyago098) | DevOps |
| Carlos Eduardo Sá Costa | [carloseduardo-Eng](https://github.com/carloseduardo-Eng) | Front-end |

## Status

Em desenvolvimento.
