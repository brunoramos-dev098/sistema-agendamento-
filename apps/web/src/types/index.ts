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
