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
│           └── .gitkeep
└── database/
    └── modelo-dados.md
```

- `docs/`: documentação geral, modelagem, requisitos e registro futuro da imersão, conforme o índice acima.
- `diagramas/`: diagramas iniciais em Mermaid, descritos no [guia da pasta](diagramas/README.md).
- `src/`: espaço reservado para o código-fonte Java; a estrutura de pacotes será definida após a validação da arquitetura.
- `database/`: [modelo de dados previsto](database/modelo-dados.md), sem banco real ou SQL nesta etapa.

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

Interface: JavaFX + FXML + Scene Builder + CSS

Banco de dados: MySQL

## Equipe

| Integrante | GitHub | Papel |
|---|---|---|
| Bruno Ramos | [@brunoramos-dev098](https://github.com/brunoramos-dev098) | Team Lead |
| Luciano Henrique | [lucianohoalmeida@gmail.com](https://github.com/lucianohenriquue) | Back-end |
| Thyago Baima | [Thyago098](https://github.com/Thyago098)   | DevOps |
| Carlos Eduardo Sá Costa | A definir | Front-end |
## Status

Em desenvolvimento.
