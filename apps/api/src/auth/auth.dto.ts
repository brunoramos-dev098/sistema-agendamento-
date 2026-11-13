import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsUUID,
  IsIn,
} from "class-validator";
import { PessoaDto } from "../common/dto.js";
export class LoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(1) @MaxLength(128) senha!: string;
}
export class RegistroDto extends PessoaDto {
  @IsString() @MinLength(12) @MaxLength(128) senha!: string;
}
export class CriarAcessoDto {
  @IsIn(["CLIENTE", "PROFISSIONAL"]) perfil!: "CLIENTE" | "PROFISSIONAL";
  @IsUUID() entidadeId!: string;
  @IsString() @MinLength(12) @MaxLength(128) senha!: string;
}
export class TrocarSenhaDto {
  @IsString() @MaxLength(128) senhaAtual!: string;
  @IsString() @MinLength(12) @MaxLength(128) novaSenha!: string;
}
