# Requisitos iniciais

Proposta da primeira entrega de **30/09/2026**, baseada no escopo acadêmico do projeto. Estes requisitos ainda serão validados com usuários reais por meio da [imersão na comunidade](imersao.md); não representam resultados de entrevistas já realizadas.

## Requisitos Funcionais

| Código | Requisito |
|---|---|
| RF01 | O sistema deve permitir cadastrar clientes. |
| RF02 | O sistema deve permitir cadastrar profissionais. |
| RF03 | O sistema deve permitir cadastrar serviços. |
| RF04 | O sistema deve permitir associar serviços aos profissionais. |
| RF05 | O sistema deve permitir registrar os horários de disponibilidade de cada profissional. |
| RF06 | O sistema deve permitir consultar horários disponíveis. |
| RF07 | O sistema deve permitir criar agendamentos. |
| RF08 | O sistema deve permitir consultar agendamentos. |
| RF09 | O sistema deve permitir alterar ou cancelar um agendamento. |
| RF10 | O sistema deve permitir acompanhar o status do agendamento. |
| RF11 | O sistema deve manter histórico dos atendimentos. |

## Regras de Negócio

| Código | Regra |
|---|---|
| RN01 | Um profissional não pode possuir dois agendamentos que ocupem o mesmo intervalo de tempo. |
| RN02 | Não é permitido criar agendamentos em datas passadas. |
| RN03 | O profissional escolhido deve estar associado ao serviço solicitado. |
| RN04 | O agendamento deve ocorrer dentro do período de disponibilidade do profissional. |
| RN05 | A duração do serviço deve ser considerada ao verificar conflitos de horário. |
| RN06 | Cada agendamento deve possuir exatamente um cliente, um profissional e um serviço. |
| RN07 | Agendamentos cancelados não devem ser considerados como horários ocupados. |

A consulta de horários e a criação ou alteração de um agendamento devem considerar conjuntamente a associação profissional/serviço, a disponibilidade e os intervalos já ocupados. Para a modelagem inicial, o intervalo do atendimento vai do horário de início até o início acrescido da duração do serviço, em minutos; todo o intervalo precisa caber na disponibilidade. Na alteração, o próprio agendamento não deve ser tratado como conflito consigo mesmo.

Exemplo de RN01 e RN05: um serviço de 60 minutos iniciado às 10h ocupa o intervalo até as 11h; outro atendimento do mesmo profissional às 10h30 conflita com ele. Um atendimento pode começar às 11h, desde que as demais regras sejam atendidas. Esse critério considera intervalos com início incluído e fim excluído.

Os estados previstos são `AGENDADO`, `CONFIRMADO`, `CANCELADO` e `CONCLUIDO`. Cancelar altera o estado e libera o horário, preservando o registro para consulta e histórico. A conclusão identifica o atendimento realizado. As condições de confirmação, alteração, cancelamento e conclusão, bem como as permissões de cada perfil, serão refinadas após a imersão e validação com usuários reais.

## Requisitos Não Funcionais

| Código | Requisito |
|---|---|
| RNF01 | O código deverá utilizar princípios de Programação Orientada a Objetos. |
| RNF02 | O sistema deverá apresentar separação clara de responsabilidades entre as camadas. |
| RNF03 | A aplicação deverá validar informações obrigatórias antes de registrar dados. |
| RNF04 | A interface futura deverá possuir navegação simples e compreensível. |
| RNF05 | Os dados deverão futuramente ser persistidos em banco de dados. |

Interface, banco de dados e frameworks permanecem a definir. Os requisitos acima orientam o desenvolvimento futuro, sem prometer recursos já implementados.

## Relação com a modelagem

| Requisitos | Elementos do modelo |
|---|---|
| RF01–RF03 | Cliente, Profissional e Servico |
| RF04 | Associação N:N entre Profissional e Servico |
| RF05–RF06 | Disponibilidade, Profissional, Servico e Agendamento |
| RF07–RF09 | Agendamento e suas referências obrigatórias |
| RF10–RF11 | Agendamento e StatusAgendamento, preservando os registros |

Consulte [entidades](entidades.md), [relações](relacoes.md) e [arquitetura](arquitetura.md). A primeira entrega contempla a documentação e modelagem destes requisitos; sua implementação é uma etapa posterior.
