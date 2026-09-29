# Fluxo Inicial da Interface

Este documento apresenta a proposta inicial da interface do Sistema de Gerenciamento e Agendamento de Serviços.

A interface corresponde à Camada de Apresentação definida na arquitetura do projeto e será responsável pela interação entre o usuário e as funcionalidades do sistema.

A tecnologia utilizada para desenvolver a interface ainda será definida durante as próximas etapas do projeto.

## 1. Objetivo da Interface

A interface deverá permitir que os usuários utilizem as funcionalidades do sistema de maneira simples, clara e organizada.

Seu objetivo será facilitar o acesso às principais operações previstas no projeto, como cadastro de clientes, profissionais e serviços, consulta de horários disponíveis, realização de agendamentos e acompanhamento dos atendimentos.

A interface deverá apresentar as informações de forma compreensível e encaminhar as ações do usuário para as demais camadas da aplicação.

As regras de negócio não serão executadas diretamente pela interface. As solicitações serão encaminhadas para o Controller e posteriormente tratadas pela camada de Service.

## 2. Telas Previstas

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

Também deverá permitir a utilização das informações relacionadas aos serviços associados ao profissional e aos seus períodos de disponibilidade durante o processo de agendamento.

### Área de Serviços

Permitirá realizar o cadastro dos serviços oferecidos pelo estabelecimento, conforme o requisito RF03.

As informações de cada serviço, como descrição, preço e duração, poderão ser utilizadas pelo sistema durante o processo de agendamento.

### Tela de Agenda

Permitirá:

- consultar agendamentos;
- consultar horários disponíveis;
- acompanhar o status dos agendamentos;
- acessar as operações de alteração ou cancelamento quando permitido.

Essas funcionalidades correspondem aos requisitos RF06, RF08, RF09 e RF10.

### Tela de Novo Agendamento

Será utilizada para realizar um novo agendamento, conforme o requisito RF07.

O usuário deverá selecionar as informações necessárias para o atendimento:

- cliente;
- serviço;
- profissional;
- data;
- horário disponível.

Antes da conclusão, os dados serão enviados para o Back-end, que realizará as validações das regras de negócio.

## 3. Fluxo para Criar um Agendamento

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
Durante esse processo, deverão ser respeitadas as regras já definidas no projeto.
O profissional selecionado deve estar associado ao serviço escolhido.
O horário deve estar dentro da disponibilidade do profissional.
Também não poderá existir conflito com outro agendamento que ocupe o mesmo intervalo.
A duração do serviço deverá ser considerada durante essa validação.
4. Fluxo de Navegação
A proposta inicial de navegação é:
Tela Inicial
│
├── Clientes
│   └── Cadastrar Cliente
│
├── Profissionais
│   └── Cadastrar Profissional
│
├── Serviços
│   └── Cadastrar Serviço
│
└── Agenda
    ├── Consultar Agendamentos
    ├── Consultar Horários Disponíveis
    ├── Alterar ou Cancelar Agendamento
    └── Novo Agendamento
Essa estrutura representa uma proposta inicial e poderá evoluir durante o desenvolvimento e a validação dos requisitos.
5. Princípios da Interface
Simplicidade
A navegação deverá ser simples e compreensível, conforme definido no requisito não funcional RNF04.
Clareza
Campos, botões e informações deverão utilizar nomes claros para facilitar a utilização do sistema.
Organização
As funcionalidades deverão estar agrupadas de maneira lógica, facilitando o acesso às principais operações.
Prevenção de Erros
Sempre que possível, a interface deverá evitar que o usuário selecione opções incompatíveis com as regras do sistema.
Por exemplo, horários que não estejam disponíveis não deverão ser apresentados como opções válidas para um novo agendamento.
Feedback ao Usuário
Após uma operação, a interface deverá informar o resultado retornado pelo sistema.
Exemplos:
agendamento realizado;
agendamento cancelado;
horário indisponível;
dados obrigatórios não informados;
operação não permitida pelas regras do sistema.
