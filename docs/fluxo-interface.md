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

A confirmação envia dados ao NestJS e invalida consultas TanStack Query. Erros do backend são apresentados no formulário. RHF e Zod validam cadastros; o servidor sempre revalida tudo. Reagendamento pede seleção completa dos dados. A consulta de horários usa passos de 15 minutos; reservas pela API aceitam qualquer minuto válido. Edição do próprio intervalo é suportada no PUT da API, embora a consulta de horários da tela ainda inclua a reserva existente.

Ainda falta aperfeiçoar edição e remoção de vínculos/disponibilidades na interface. O histórico inclui CANCELADO e CONCLUIDO. Permissões por perfil e condições refinadas de transição aguardam validação com usuários.
