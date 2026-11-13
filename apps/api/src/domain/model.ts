export enum StatusAgendamento {
  AGENDADO = "AGENDADO",
  CONFIRMADO = "CONFIRMADO",
  CANCELADO = "CANCELADO",
  CONCLUIDO = "CONCLUIDO",
}
export abstract class Usuario {
  protected constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly telefone: string,
    public readonly email: string,
  ) {}
}
export class Cliente extends Usuario {
  constructor(id: string, nome: string, telefone: string, email: string) {
    super(id, nome, telefone, email);
  }
}
export class Administrador extends Usuario {
  constructor(id: string, nome: string, telefone: string, email: string) {
    super(id, nome, telefone, email);
  }
}
export class Profissional extends Usuario {
  #servicos = new Set<Servico>();
  #disponibilidades: Disponibilidade[] = [];
  constructor(
    id: string,
    nome: string,
    telefone: string,
    email: string,
    public readonly especialidade: string,
  ) {
    super(id, nome, telefone, email);
  }
  get servicos() {
    return [...this.#servicos];
  }
  get disponibilidades() {
    return [...this.#disponibilidades];
  }
  adicionarServico(s: Servico) {
    if (!this.#servicos.has(s)) {
      this.#servicos.add(s);
      s.adicionarProfissional(this);
    }
  }
  removerServico(s: Servico) {
    if (this.#servicos.delete(s)) s.removerProfissional(this);
  }
  adicionarDisponibilidade(d: Disponibilidade) {
    if (d.profissional !== this) throw new Error("Profissional incompatível");
    this.#disponibilidades.push(d);
  }
}
export class Servico {
  #profissionais = new Set<Profissional>();
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly descricao: string,
    public readonly preco: string,
    public readonly duracao: number,
  ) {
    if (
      !/^\d+(\.\d{1,2})?$/.test(preco) ||
      !Number.isInteger(duracao) ||
      duracao <= 0
    )
      throw new Error("Serviço inválido");
  }
  get profissionais() {
    return [...this.#profissionais];
  }
  adicionarProfissional(p: Profissional) {
    if (!this.#profissionais.has(p)) {
      this.#profissionais.add(p);
      p.adicionarServico(this);
    }
  }
  removerProfissional(p: Profissional) {
    if (this.#profissionais.delete(p)) p.removerServico(this);
  }
}
export class Disponibilidade {
  constructor(
    public readonly id: string,
    public readonly diaSemana: number,
    public readonly inicioMinuto: number,
    public readonly fimMinuto: number,
    public readonly profissional: Profissional,
  ) {
    if (
      diaSemana < 1 ||
      diaSemana > 7 ||
      inicioMinuto < 0 ||
      fimMinuto > 1440 ||
      inicioMinuto >= fimMinuto
    )
      throw new Error("Disponibilidade inválida");
  }
}
export class Agendamento {
  #status: StatusAgendamento;
  constructor(
    public readonly id: string,
    public readonly inicio: string,
    public readonly fim: string,
    status: StatusAgendamento,
    public readonly cliente: Cliente,
    public readonly profissional: Profissional,
    public readonly servico: Servico,
  ) {
    this.#status = status;
    if (!cliente || !profissional || !servico)
      throw new Error("Referências obrigatórias");
  }
  get status() {
    return this.#status;
  }
  alterarStatus(s: StatusAgendamento) {
    this.#status = s;
  }
}
