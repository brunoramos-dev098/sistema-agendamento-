# Fluxo Inicial da Interface

## 1. Introdução

Este documento apresenta a proposta inicial da interface do Sistema de Gerenciamento e Agendamento de Serviços.

A interface corresponde à Camada de Apresentação definida na arquitetura do projeto e será responsável pela interação entre o usuário e as funcionalidades do sistema.

Este documento descreve o planejamento, sem telas implementadas. O [README](../README.md) registra JavaFX, FXML, Scene Builder e CSS na seção de tecnologias, enquanto a [arquitetura](arquitetura.md) ainda mantém a interface a definir. Essa divergência documental permanece pendente de alinhamento pela equipe; o fluxo abaixo independe da tecnologia e não estabelece uma nova escolha.

## 2. Objetivo da Interface

A interface deverá permitir que os usuários utilizem as funcionalidades do sistema de maneira simples, clara e organizada.

Seu objetivo será facilitar o acesso às principais operações previstas no projeto, como cadastro de clientes, profissionais e serviços, consulta de horários disponíveis, realização de agendamentos e acompanhamento dos atendimentos.

A interface deverá apresentar as informações de forma compreensível e encaminhar as ações do usuário para as demais camadas da aplicação.

As regras de negócio não serão executadas diretamente pela interface. As solicitações serão encaminhadas para o Controller e posteriormente tratadas pela camada de Service.

## 3. Telas Previstas

As telas abaixo representam uma proposta inicial baseada nos requisitos já definidos para o sistema.

### Tela Inicial

Será o ponto inicial de navegação da aplicação.

A partir dela, o usuário poderá acessar as principais áreas do sistema:

- clientes;
- profissionais;
- serviços;
- agenda.

### Área de Clientes

Permitirá realizar o cadastro de clientes, conforme o requisito RF01.

Os dados do cliente serão posteriormente utilizados durante a criação dos agendamentos.

### Área de Profissionais

Permitirá realizar o cadastro de profissionais, conforme o requisito RF02.

Também permitirá associar serviços aos profissionais (RF04) e registrar seus períodos de disponibilidade (RF05). Essas informações serão utilizadas durante o processo de agendamento, com processamento pelo Back-end.

### Área de Serviços

Permitirá realizar o cadastro dos serviços oferecidos pelo estabelecimento, conforme o requisito RF03.

As informações de cada serviço, como descrição, preço e duração, poderão ser utilizadas pelo sistema durante o processo de agendamento.

### Tela de Agenda

Permitirá:

- consultar agendamentos;
- consultar horários disponíveis;
- acompanhar o status dos agendamentos;
- acessar as operações de alteração ou cancelamento quando permitido;
- consultar o histórico dos atendimentos, preservando os registros anteriores.

Essas funcionalidades correspondem aos requisitos RF06, RF08, RF09, RF10 e RF11. Os estados apresentados serão exatamente `AGENDADO`, `CONFIRMADO`, `CANCELADO` e `CONCLUIDO`, conforme o modelo existente. Cancelar não apaga o registro do histórico.

### Tela de Novo Agendamento

Será utilizada para realizar um novo agendamento, conforme o requisito RF07.

O usuário deverá selecionar as informações necessárias para o atendimento:

- cliente;
- serviço;
- profissional;
- data;
- horário disponível.

Antes da conclusão, os dados serão enviados para o Back-end, que realizará as validações das regras de negócio.

## 4. Fluxo de Criação de Agendamento

O fluxo inicial previsto para a criação de um agendamento é:

```text
Selecionar cliente
        ↓
Selecionar serviço
        ↓
Selecionar profissional
        ↓
Selecionar data
        ↓
Consultar horários disponíveis
        ↓
Selecionar horário
        ↓
Enviar solicitação de agendamento
        ↓
Back-end realiza as validações
        ↓
Resultado é apresentado ao usuário
```

Tanto a consulta de horários quanto o envio do agendamento passam pelo Controller. A interface apresenta os profissionais e horários retornados pelo Back-end para o serviço e a data selecionados. Ao enviar a solicitação, o Service valida novamente os dados antes do registro; a exibição prévia de um horário não substitui essa validação.

Durante esse processo, deverão ser respeitadas as regras já definidas no projeto.

- O profissional selecionado deve estar associado ao serviço escolhido (RN03).
- Todo o intervalo do atendimento deve estar dentro da disponibilidade do profissional (RN04).
- Não poderá existir conflito com outro agendamento do profissional; a duração do serviço deve ser considerada e os cancelados não ocupam horário (RN01, RN05 e RN07).
- A data não poderá ser passada (RN02), e o agendamento deverá possuir exatamente um cliente, um profissional e um serviço (RN06).

Se a operação for aceita, a interface apresenta o resultado e a agenda atualizada. Se houver uma recusa, apresenta o motivo retornado, permitindo ao usuário revisar as informações. As validações são detalhadas no [fluxo do Back-end](fluxo-backend.md) e nos [requisitos](requisitos.md).

## 5. Fluxo de Navegação

A proposta inicial de navegação é:

```text
Tela Inicial
│
├── Clientes
│   └── Cadastrar Cliente
│
├── Profissionais
│   ├── Cadastrar Profissional
│   ├── Associar Serviços
│   └── Registrar Disponibilidade
│
├── Serviços
│   └── Cadastrar Serviço
│
└── Agenda
    ├── Consultar Agendamentos
    ├── Consultar Horários Disponíveis
    ├── Acompanhar Status e Histórico
    ├── Alterar ou Cancelar Agendamento
    └── Novo Agendamento
```

Essa estrutura representa uma proposta inicial e poderá evoluir durante o desenvolvimento e a validação dos requisitos.

## 6. Princípios da Interface

### Simplicidade

A navegação deverá ser simples e compreensível, conforme definido no requisito não funcional RNF04.

### Clareza

Campos, botões e informações deverão utilizar nomes claros para facilitar a utilização do sistema.

### Organização

As funcionalidades deverão estar agrupadas de maneira lógica, facilitando o acesso às principais operações.

### Prevenção de Erros

Sempre que possível, a interface deverá evitar que o usuário selecione opções incompatíveis com as regras do sistema.
Por exemplo, horários que o Back-end informar como indisponíveis não deverão ser apresentados como opções válidas para um novo agendamento. A interface orienta o preenchimento; o Service continua responsável por aplicar as regras e validar as informações obrigatórias (RNF03).

### Feedback ao Usuário

Após uma operação, a interface deverá informar o resultado retornado pelo sistema.

Exemplos:

- Agendamento realizado.
- Agendamento cancelado.
- Horário indisponível.
- Dados obrigatórios não informados.
- Operação não permitida pelas regras do sistema.

## 7. Evolução Futura

As telas e a navegação poderão ser refinadas após a [imersão na comunidade](imersao.md) e a validação dos requisitos RF01–RF11. As permissões e condições de alteração de status permanecem sujeitas ao detalhamento já previsto nos requisitos. Este planejamento preserva o escopo e a separação de responsabilidades da [arquitetura](arquitetura.md); nenhuma tela é implementada nesta etapa.
