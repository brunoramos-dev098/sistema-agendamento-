# Fluxo Inicial do Back-end

## 1. Introdução

Este documento complementa o [fluxo da interface](fluxo-interface.md) e descreve o processamento previsto das solicitações do Sistema de Gerenciamento e Agendamento de Serviços. Segue a [arquitetura em camadas](arquitetura.md), os [requisitos](requisitos.md) e o modelo de domínio já documentado.

Os componentes e fluxos são conceituais: nenhuma classe Java, integração de persistência ou funcionalidade é implementada nesta etapa.

## 2. Responsabilidades do Back-end

O Back-end será responsável por processar as solicitações recebidas da Camada de Apresentação, aplicar as regras de negócio, utilizar as entidades do domínio e futuramente realizar a comunicação com a camada de persistência.
Entre suas principais responsabilidades estarão:

- receber as ações encaminhadas pela interface;
- validar informações obrigatórias;
- aplicar as regras de negócio;
- verificar disponibilidade dos profissionais;
- verificar se o profissional está associado ao serviço solicitado;
- impedir conflitos entre agendamentos;
- considerar a duração dos serviços;
- controlar operações de criação, alteração e cancelamento de agendamentos;
- utilizar as entidades do domínio durante o processamento;
- encaminhar operações para a camada de persistência;
- retornar o resultado para a Camada de Apresentação.

## 3. Componentes Previstos

A arquitetura do Back-end será organizada principalmente em Controller, Service e Repository.

| Camada | Exemplos conceituais para implementação futura |
|---|---|
| Controller | `ClienteController`, `ProfissionalController`, `ServicoController`, `AgendamentoController` |
| Service | `ClienteService`, `ProfissionalService`, `ServicoService`, `AgendamentoService` |
| Repository | `ClienteRepository`, `ProfissionalRepository`, `ServicoRepository`, `AgendamentoRepository`, `DisponibilidadeRepository` |

Esses nomes representam apenas exemplos, não um conjunto definitivo de classes ou componentes já implementados. As responsabilidades de cada camada estão detalhadas na seção 6.

Nenhum Repository ou banco de dados real foi implementado nesta etapa.

## 4. Fluxo de Criação de Agendamento

O fluxo previsto para a criação de um agendamento será:

```text
Usuário solicita novo agendamento
                ↓
Camada de Apresentação envia a solicitação
                ↓
Controller recebe os dados
                ↓
Service inicia as validações
                ↓
Validação das informações obrigatórias
                ↓
Verificação da data
                ↓
Verificação da associação entre profissional e serviço
                ↓
Verificação da disponibilidade
                ↓
Verificação de conflitos de horário
                ↓
Criação do Agendamento
                ↓
Repository encaminha a persistência ao Banco de Dados
                ↓
Resultado retorna ao Service
                ↓
Resultado retorna ao Controller
                ↓
Resultado é enviado para a Camada de Apresentação
```

Durante as verificações, o Service solicitará ao Repository os dados necessários sobre o profissional, seus serviços, sua disponibilidade e os agendamentos existentes. Essas consultas também seguem a separação de camadas; a interface não acessa diretamente a persistência.

Se uma validação falhar, o Service retorna o motivo ao Controller, que o encaminha à apresentação, sem criar ou persistir o agendamento. No fluxo aceito, o resultado de sucesso retorna após a conclusão da operação de persistência prevista. Nenhuma dessas operações está implementada nesta etapa.

A consulta de horários (RF06) considera as mesmas regras de associação, disponibilidade e ocupação aplicáveis à criação (RF07). Na alteração (RF09), as regras são reavaliadas, sem considerar o próprio agendamento como conflito consigo mesmo. O cancelamento preserva o registro e libera seu horário, permitindo consultas, acompanhamento de status e histórico (RF08, RF10 e RF11).

## 5. Principais Validações

As validações abaixo correspondem às regras de negócio já definidas no projeto.

### Data do Agendamento — RN02

O sistema não deverá permitir a criação de agendamentos em datas passadas.

### Profissional e Serviço — RN03

O profissional selecionado deve estar associado ao serviço solicitado.
Um profissional não poderá ser utilizado em um agendamento para um serviço que não esteja entre os serviços associados a ele.

### Disponibilidade — RN04

O agendamento deverá ocorrer dentro de um período de disponibilidade cadastrado para o profissional.
Todo o intervalo do atendimento deverá estar contido nesse período.

### Conflito de Horário — RN01

O sistema deverá impedir que um profissional possua dois agendamentos ocupando o mesmo intervalo de tempo.

### Duração do Serviço — RN05

A duração do serviço deverá ser considerada durante a verificação de conflitos.
Exemplo:

```text
Serviço: 60 minutos
Horário inicial: 10:00
Horário final previsto: 11:00
```

Nesse caso, outro atendimento do mesmo profissional não poderá ocupar qualquer parte desse intervalo.
Conforme os requisitos, o início está incluído e o fim excluído: um atendimento às 10h30 conflita, mas outro pode começar às 11h se as demais regras forem atendidas.

### Dados Obrigatórios do Agendamento — RN06 e RNF03

Cada agendamento deverá estar associado a exatamente:

- um cliente;
- um profissional;
- um serviço.

As demais informações obrigatórias do registro também devem ser validadas antes de persistir os dados, conforme RNF03.

### Agendamentos Cancelados — RN07

Um agendamento cancelado deverá continuar registrado para fins de histórico, mas não deverá ocupar um horário da agenda.

### Status do Agendamento

O tipo StatusAgendamento está previsto como um enum Java com os seguintes valores:

```text
AGENDADO
CONFIRMADO
CANCELADO
CONCLUIDO
```

Os significados iniciais são:

- AGENDADO: atendimento registrado na agenda;
- CONFIRMADO: atendimento confirmado;
- CANCELADO: atendimento cancelado e que não ocupa horário;
- CONCLUIDO: atendimento realizado.

As condições exatas para mudança entre os estados poderão ser refinadas posteriormente.

## 6. Responsabilidades das Camadas

```text
Camada de Apresentação
        ↓
Controller
        ↓
Service
        ↓
Repository
        ↓
Banco de Dados
```

### Camada de Apresentação

Recebe as entradas do usuário, encaminha solicitações ao Controller e apresenta os resultados retornados. Sua navegação é descrita no [fluxo da interface](fluxo-interface.md). As regras de negócio pertencem ao Service.

### Controller

Responsável por:

- receber ações da interface;
- encaminhar dados para os Services;
- receber o resultado das operações;
- devolver o resultado para a Camada de Apresentação.

As regras de negócio não deverão ficar concentradas no Controller.

### Service

Responsável por:

- aplicar as regras de negócio;
- realizar validações;
- coordenar as operações entre as entidades;
- verificar disponibilidade;
- validar profissional e serviço;
- identificar conflitos de horário;
- considerar a duração do serviço;
- controlar as operações relacionadas aos agendamentos.

A camada de Service será a principal responsável pela lógica de negócio da aplicação.

### Repository

Responsável futuramente por:

- consultar os dados persistidos;
- persistir novos registros;
- atualizar informações existentes;
- realizar a comunicação com o banco de dados.

O [README](../README.md) registra MySQL, enquanto a [arquitetura](arquitetura.md), os [requisitos](requisitos.md) e o [modelo de dados](../database/modelo-dados.md) ainda mantêm a escolha do banco em aberto. Essa divergência documental permanece pendente de alinhamento pela equipe. Este fluxo descreve apenas as responsabilidades da persistência, sem decidir um banco ou mecanismo de acesso aos dados.

## 7. Modelo de Domínio

O Back-end utilizará as classes e tipos já definidos no modelo inicial:

- `Usuario`.
- `Cliente`.
- `Profissional`.
- `Administrador`.
- `Servico`.
- `Disponibilidade`.
- `Agendamento`.
- `StatusAgendamento`.

Usuario será uma classe abstrata.
Cliente, Profissional e Administrador serão suas subclasses.
StatusAgendamento será um enum e não uma entidade com identidade própria.

Cada Agendamento referencia exatamente um Cliente, Profissional e Servico. Profissional possui períodos de Disponibilidade e se associa a Servico em uma relação N:N, independente de agendamentos. Essas definições estão em [entidades](entidades.md), [relações](relacoes.md) e [dados](dados.md).

O modelo de domínio é utilizado pelas camadas conforme suas responsabilidades; não representa uma etapa adicional depois do banco de dados.

## 8. Evolução Futura

Os componentes poderão ser detalhados durante a implementação, mantendo as responsabilidades e os requisitos RF01–RF11 já definidos. Os cadastros (RF01–RF03), as associações profissional/serviço (RF04) e os períodos de disponibilidade (RF05) fornecerão os dados necessários aos fluxos de agendamento.

A [imersão na comunidade](imersao.md) orientará o refinamento das regras e das condições de mudança de status. Esta revisão não define frameworks, estratégia de persistência da herança ou novas funcionalidades, nem altera as decisões do modelo de domínio.
