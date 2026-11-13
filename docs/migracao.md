# Registro da migração

Base main: 149a7e87da783cab2cb6a93a1794f8486d9ebd7a. Domínio Java inspecionado na feature/modelo-dominio: 6ca63964afbf08b03734707198e5b35d6f5b9410, PR #1 aberto. Não foi mesclado nem apagado. A nova implementação TypeScript substitui a proposta Java, JavaFX, FXML, Scene Builder e MySQL. Nenhum código Java do PR antigo foi copiado para a implementação ativa. O placeholder src/main/java/.gitkeep foi retirado; histórico Git preservado.

Preservados: sete classes e enum, herança, referências obrigatórias, associação bidirecional com coleções protegidas, RF01–RF11 e RN01–RN07. Prisma adota tabelas concretas, UUIDs e fins históricos; disponibilidade usa minutos locais e dia ISO.

Pendências antes de exposição pública: autenticação e autorização a definir com a equipe, transições de status a validar em imersão, paginação e filtros server-side, UX de edição de disponibilidade/vínculos, auditoria e testes de navegação completos. Cadastros não possuem exclusão física. Consulte verificacao.md para resultados efetivamente executados.
