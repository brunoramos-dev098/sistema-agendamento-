export type Periodo = {
  id: string;
  profissionalId: string;
  diaSemana: number;
  inicioMinuto: number;
  fimMinuto: number;
};
export type Registro = {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  especialidade?: string;
  descricao?: string;
  preco?: string;
  duracao?: number;
  servicos?: { servicoId: string }[];
  disponibilidades?: Periodo[];
};
export type Atendimento = {
  id: string;
  inicio: string;
  fim: string;
  status: string;
  cliente: Registro;
  profissional: Registro;
  servico: Registro;
};
