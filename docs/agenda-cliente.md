# Agendamento por calendário e blocos

Decisão funcional de 13/11/2026: serviços de 30 minutos e expediente padrão dos profissionais de segunda a sábado, das 09:00 às 19:30, no horário de São Luís (MA). O último início é às 19:00; o atendimento termina às 19:30. Domingo não possui expediente padrão. A associação profissional/serviço continua indicando quais serviços cada profissional realiza.

## Jornada do cliente

A entrada usa login ou cadastro público de cliente com nome, telefone, email e senha. O cliente agenda para seu próprio ID autenticado; somente o administrador pode selecionar outros clientes. Cadastros antigos recebem acesso pelo administrador, preservando seu histórico. Após entrar, o fluxo continua nos cartões de serviço e profissional. A lista de serviços oferece o link Agendar este serviço.

O calendário permite percorrer semanas e escolher diretamente uma data futura. Cada botão de horário representa um intervalo de 30 minutos. Selecionar um bloco apresenta um resumo; a confirmação registra na API. Horários ocupados são omitidos, cancelados voltam a aparecer e datas passadas são rejeitadas. A lista é consultada novamente a cada cinco segundos e após confirmação ou erro. A consulta não garante a reserva: duas confirmações simultâneas são protegidas por transação Serializable e pela restrição EXCLUDE do PostgreSQL.

## Persistência

A migration 202611130001_agenda_padrao ajusta a duração do catálogo e os períodos existentes, acrescenta dias ausentes e preserva início/fim e histórico dos agendamentos já registrados. Os períodos anteriores foram copiados localmente para .tools/antes-agenda-padrao.json antes da aplicação. Novos profissionais recebem automaticamente os seis períodos padrão na mesma operação de cadastro. Não é necessário cadastrar cada dia manualmente.

Serviços novos/editados devem ter duração de 30 minutos, validada no formulário, DTO e CHECK PostgreSQL. O domínio genérico continua capaz de representar duração de atendimentos históricos. Na API, novos horários devem iniciar em minutos 00 ou 30; todo o intervalo deve caber na disponibilidade. O reagendamento pode consultar horários ignorando seu próprio ID pelo parâmetro ignorar; a gravação revalida todos os vínculos e conflitos.
