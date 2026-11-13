# Entidades TypeScript

Implementação: apps/api/src/domain/model.ts.

- Usuario: classe abstrata, id, nome, telefone e email somente para leitura; construtor protegido.
- Cliente: herda Usuario sem duplicar atributos; possui 0..N agendamentos.
- Profissional: herda Usuario, especialidade, serviços e disponibilidades. Coleções privadas retornam cópias; métodos sincronizam associação com Servico.
- Administrador: herda Usuario; representa gestão, sem regras de autorização inventadas.
- Servico: id, nome, descricao, preco decimal em string, duracao em minutos, profissionais. Valida dinheiro e duração.
- Disponibilidade: id, diaSemana ISO 1–7, inicioMinuto, fimMinuto, profissional. Valida limites e ordenação do período.
- Agendamento: id, inicio, fim, status encapsulado, exatamente um cliente, profissional e serviço. Método alterarStatus preserva identidade.
- StatusAgendamento: enum com AGENDADO, CONFIRMADO, CANCELADO e CONCLUIDO.

Abstração, herança e encapsulamento substituem as classes Java do PR #1. Associações mantêm os mesmos conceitos. Services coordenam regras globais, domínio valida intervalos, persistência não substitui o modelo de objetos. Veja [relações](relacoes.md) e [dados](dados.md).
