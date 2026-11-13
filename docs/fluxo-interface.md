# Fluxo da interface web

Navegação lateral no desktop e horizontal em telas pequenas, com estados de carregamento, vazio, sucesso e erro. Não há dados fictícios. Uma API indisponível aparece como erro.

| Rota           | Fluxo                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| /              | Dashboard com próximos atendimentos e total de profissionais                                           |
| /clientes      | Listar, cadastrar e editar dados de clientes                                                           |
| /profissionais | Listar, cadastrar, editar, associar serviços e cadastrar disponibilidade recorrente                    |
| /servicos      | Listar, cadastrar e editar descrição, preço e duração                                                  |
| /agenda        | Listar agenda e histórico, filtrar data/profissional, alterar status, cancelar e acessar reagendamento |
| /novo          | Selecionar cliente, serviço, profissional associado, data e horário retornado pela API                 |

A confirmação envia dados ao NestJS e invalida consultas TanStack Query. Erros do backend são apresentados no formulário. RHF e Zod validam cadastros; o servidor sempre revalida tudo. Reagendamento pede seleção completa dos dados. A consulta e a criação usam blocos de 30 minutos. O reagendamento consulta horários ignorando o próprio ID e revalida na gravação.

A disponibilidade permite cadastro e edição de períodos semanais. A tela de novo atendimento apresenta os períodos do profissional e explica ausência de configuração, dia incompatível, duração insuficiente ou horários ocupados/passados. A interface identifica o horário como São Luís (MA). Ainda falta aperfeiçoar a remoção de vínculos/disponibilidades. O histórico inclui CANCELADO e CONCLUIDO. Permissões por perfil e condições refinadas de transição aguardam validação com usuários.

## Jornada simplificada

A tela /novo reúne cadastro do cliente, cartões de serviços e profissionais, calendário por dias e botões para cada horário livre. Permite datas futuras, reserva com resumo e atualização automática da ocupação a cada cinco segundos. Padrão: segunda a sábado, 09:00–19:30, duração de 30 minutos. Veja [regras e fluxo](agenda-cliente.md).
