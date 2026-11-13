# Execução local neste computador

PostgreSQL 17.11, banco checkapp e credenciais aleatórias foram configurados localmente. O arquivo .env, os binários e os dados em .tools/ estão ignorados pelo Git. A API usa o usuário checkapp sem privilégios de superusuário. Banco, API e interface aceitam conexões locais.

Abra Iniciar-Checkapp.cmd com dois cliques para iniciar o banco, aplicar migrations pendentes, compilar a API e iniciar os servidores. Alternativamente, na raiz:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\Iniciar-Checkapp.ps1
```

Acesse http://127.0.0.1:5173/clientes. O script pode ser executado novamente; servidores em portas já ativas não são duplicados. Os processos ficam em segundo plano até encerrar a sessão ou reiniciar o computador. Depois de reiniciar, execute o atalho novamente. Esta preparação usa os binários e o npm já instalados em .tools/ deste computador; em um clone novo, siga a instalação do README.

Logs: .tools/api.log, .tools/api-error.log, .tools/web-server.log, .tools/web-server-error.log e .tools/postgres-error.log. Não remova .tools/pgdata: ela contém seus cadastros. Faça backup do banco antes de limpar arquivos locais. Não publique o .env ou o conteúdo de .tools/.

Validação executada em 13/11/2026: migration aplicada no PostgreSQL local; GET /api/clientes com HTTP 200; cadastro e leitura no banco aprovados, com remoção apenas do registro temporário de verificação; restrição de conflitos presente. Tela de clientes verificada no Chrome.
