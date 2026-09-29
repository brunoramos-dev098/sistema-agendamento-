1. Responsabilidade do Back-end
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
2. Componentes Previstos
A arquitetura do Back-end será organizada principalmente em Controller, Service e Repository.
Controller
Será responsável por receber as ações provenientes da interface e encaminhá-las para a camada de Service.
Também será responsável por devolver o resultado das operações para a Camada de Apresentação.
Como exemplos conceituais de componentes que poderão existir futuramente:
ClienteController
ProfissionalController
ServicoController
AgendamentoController

Esses nomes representam apenas exemplos para a futura implementação e ainda não correspondem a classes implementadas.
Service
Será responsável pelas regras de negócio e validações da aplicação.
Como exemplos conceituais de componentes futuros:
ClienteService
ProfissionalService
ServicoService
AgendamentoService

A camada de Service deverá concentrar principalmente as validações relacionadas aos agendamentos.
Repository
Será responsável futuramente pela persistência dos dados.
Suas responsabilidades previstas incluem:
- consultar dados;
- persistir novos registros;
- atualizar registros existentes;
- realizar a comunicação com o banco de dados.
Como exemplos conceituais de componentes futuros:
ClienteRepository
ProfissionalRepository
ServicoRepository
AgendamentoRepository
DisponibilidadeRepository

Nenhum Repository ou banco de dados real foi implementado nesta etapa.
3. Fluxo para Criação de um Agendamento
O fluxo previsto para a criação de um agendamento será:
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
Repository realizará futuramente a persistência
                ↓
Resultado retorna ao Controller
                ↓
Resultado é enviado para a Camada de Apresentação

A persistência ainda não está implementada, pois o banco de dados e o mecanismo de acesso aos dados permanecem a definir.
4. Principais Validações
As validações abaixo correspondem às regras de negócio já definidas no projeto.
Data do Agendamento
O sistema não deverá permitir a criação de agendamentos em datas passadas.
Essa validação corresponde à regra RN02.
Profissional e Serviço
O profissional selecionado deve estar associado ao serviço solicitado.
Um profissional não poderá ser utilizado em um agendamento para um serviço que não esteja entre os serviços associados a ele.
Essa validação corresponde à regra RN03.
Disponibilidade
O agendamento deverá ocorrer dentro de um período de disponibilidade cadastrado para o profissional.
Todo o intervalo do atendimento deverá estar contido nesse período.
Essa validação corresponde à regra RN04.
Conflito de Horário
O sistema deverá impedir que um profissional possua dois agendamentos ocupando o mesmo intervalo de tempo.
Essa validação corresponde à regra RN01.
Duração do Serviço
A duração do serviço deverá ser considerada durante a verificação de conflitos.
Exemplo:
Serviço: 60 minutos
Horário inicial: 10:00
Horário final previsto: 11:00

Nesse caso, outro atendimento do mesmo profissional não poderá ocupar qualquer parte desse intervalo.
Essa validação corresponde à regra RN05.
Dados Obrigatórios do Agendamento
Cada agendamento deverá estar associado a exatamente:
- um cliente;
- um profissional;
- um serviço.
Essa validação corresponde à regra RN06.
Agendamentos Cancelados
Um agendamento cancelado deverá continuar registrado para fins de histórico, mas não deverá ocupar um horário da agenda.
Essa regra corresponde à RN07.
Status do Agendamento
O tipo StatusAgendamento está previsto como um enum Java com os seguintes valores:
AGENDADO
CONFIRMADO
CANCELADO
CONCLUIDO

Os significados iniciais são:
- AGENDADO: atendimento registrado na agenda;
- CONFIRMADO: atendimento confirmado;
- CANCELADO: atendimento cancelado e que não ocupa horário;
- CONCLUIDO: atendimento realizado.
As condições exatas para mudança entre os estados poderão ser refinadas posteriormente.
5. Responsabilidade das Camadas
Controller
Responsável por:
- receber ações da interface;
- encaminhar dados para os Services;
- receber o resultado das operações;
- devolver o resultado para a Camada de Apresentação.
As regras de negócio não deverão ficar concentradas no Controller.
Service
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
Repository
Responsável futuramente por:
- consultar os dados persistidos;
- persistir novos registros;
- atualizar informações existentes;
- realizar a comunicação com o banco de dados.
O banco de dados e a tecnologia de persistência ainda serão definidos.
Modelo de Domínio
O Back-end utilizará as classes e tipos já definidos no modelo inicial:
Usuario
Cliente
Profissional
Administrador
Servico
Disponibilidade
Agendamento
StatusAgendamento

Usuario será uma classe abstrata.
Cliente, Profissional e Administrador serão suas subclasses.
StatusAgendamento será um enum e não uma entidade com identidade própria.
