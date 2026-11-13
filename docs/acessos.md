# Login, perfis e permissões

O Checkapp usa contas com exatamente um perfil: CLIENTE, PROFISSIONAL ou ADMINISTRADOR. A conta se vincula a um cadastro existente por chave estrangeira, com CHECK garantindo o vínculo correspondente ao perfil. Usuario continua abstrato no domínio; Conta e Sessao pertencem à autenticação, não à hierarquia de pessoas.

| Operação                               | Cliente                                          | Profissional                           | Administrador            |
| -------------------------------------- | ------------------------------------------------ | -------------------------------------- | ------------------------ |
| Serviços e profissionais disponíveis   | Consulta sem contatos privados dos profissionais | Consulta                               | Gerencia                 |
| Agenda e histórico                     | Apenas os próprios                               | Apenas os seus atendimentos            | Todos                    |
| Criar/reagendar                        | Para si; encerrados não são reagendados          | Não                                    | Todos                    |
| Cancelar                               | Seus registros não concluídos                    | Não                                    | Todos                    |
| Confirmar/concluir                     | Não                                              | Seus atendimentos ativos               | Todos                    |
| Clientes                               | Apenas seus dados                                | Nome e telefone de clientes que atende | Todos                    |
| Disponibilidades/associações/cadastros | Não gerencia                                     | Consulta seus períodos                 | Gerencia                 |
| Meu cadastro/senha                     | Próprio                                          | Próprio                                | Próprio                  |
| Criar acessos de cadastros existentes  | Não                                              | Não                                    | Clientes e profissionais |

As restrições existem na API, com guard global, verificação de perfil, filtro das consultas e checagem do dono nas alterações dentro das transações. Manipular IDs, corpo JSON ou acessar uma rota pela URL não amplia o acesso. Campos extras em DTOs são rejeitados. Senhas e hashes não são retornados nas consultas.

## Entrada e cadastros existentes

A tela inicial exige email e senha. O cadastro público cria apenas clientes novos; não aceita perfil nem ID de outro cadastro. Para impedir apropriação de registros antigos, um email já cadastrado não pode ser reivindicado no registro público. O administrador entra em Contas e acessos, escolhe um cadastro existente e define a senha inicial, preservando o ID e o histórico. A pessoa altera a senha em Meu cadastro.

Após migrar e compilar a API, execute `npm run auth:admin -w apps/api` para criar o primeiro administrador. O comando exige acesso local ao banco, não possui endpoint público, não substitui uma conta administrativa existente e grava as credenciais iniciais em `.tools/acesso-admin.txt`, ignorado pelo Git. CHECKAPP_ADMIN_EMAIL e CHECKAPP_ADMIN_PASSWORD são opcionais; sem senha configurada, usa segredo aleatório. Nunca publique esse arquivo.

## Sessões e senhas

Senhas entre 12 e 128 caracteres usam scrypt com salt aleatório de 16 bytes, N=32768, r=8, p=3. A comparação usa timingSafeEqual. A sessão contém token aleatório de 32 bytes, com apenas seu SHA-256 no PostgreSQL e validade de 12 horas. O navegador recebe cookie HttpOnly, SameSite=Strict e Secure em produção; o token não vai para localStorage/sessionStorage. Logout revoga a sessão. Troca de senha revoga todas as sessões da conta.

Mutações verificam Origin e rejeitam cookies de sessão enviados sem Origin. Em desenvolvimento são permitidas apenas as origens locais previstas; em produção usa WEB_ORIGIN. Login/cadastro possuem limite de 20 tentativas por IP em 15 minutos nesta instância. Senha/email inválidos recebem mensagem genérica.

## Endpoints

- Públicos: GET /auth/health, POST /auth/login, POST /auth/registro.
- Autenticados: GET /auth/me, POST /auth/logout, PUT /auth/perfil, POST /auth/senha.
- Administrador: GET/POST /auth/contas.
- Os endpoints de cadastros, agenda, serviços e disponibilidade aplicam a matriz acima.

## Limites do MVP

A execução local está configurada. Para publicar, configurar HTTPS e WEB_ORIGIN, certificados/reverse proxy, recuperação e verificação de email, gestão de bloqueio de contas e auditoria. O limitador em memória é adequado a uma instância e deve ser compartilhado se houver múltiplas instâncias. Não há recuperação de senha por email implementada. Cadastros de profissionais não criam senhas automaticamente.

Referências: [Node.js crypto](https://nodejs.org/docs/latest-v24.x/api/crypto.html) e [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).
