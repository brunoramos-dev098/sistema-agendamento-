import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  Matches,
  IsUUID,
  IsEnum,
  IsISO8601,
} from "class-validator";
import { StatusAgendamento } from "../domain/model.js";
export class PessoaDto {
  @IsString() @IsNotEmpty() nome!: string;
  @IsString() @IsNotEmpty() telefone!: string;
  @IsEmail() email!: string;
}
export class ProfissionalDto extends PessoaDto {
  @IsString() @IsNotEmpty() especialidade!: string;
}
export class ServicoDto {
  @IsString() @IsNotEmpty() nome!: string;
  @IsString() descricao!: string;
  @Matches(/^\d{1,8}(\.\d{1,2})?$/) preco!: string;
  @IsInt() @Min(1) @Max(1440) duracao!: number;
}
export class DisponibilidadeDto {
  @IsUUID() profissionalId!: string;
  @IsInt() @Min(1) @Max(7) diaSemana!: number;
  @IsInt() @Min(0) @Max(1439) inicioMinuto!: number;
  @IsInt() @Min(1) @Max(1440) fimMinuto!: number;
}
export class AgendamentoDto {
  @IsUUID() clienteId!: string;
  @IsUUID() profissionalId!: string;
  @IsUUID() servicoId!: string;
  @IsISO8601({ strict: true }) @Matches(/(Z|[+-]\d{2}:\d{2})$/) inicio!: string;
}
export class StatusDto {
  @IsEnum(StatusAgendamento) status!: StatusAgendamento;
}
