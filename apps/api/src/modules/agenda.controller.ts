import { AuthRequest, Roles } from "../auth/access.js";
import {
  Req,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  BadRequestException,
} from "@nestjs/common";
import { isUUID } from "class-validator";
import { AgendaService } from "./agenda.service.js";
import { AgendamentoDto, StatusDto } from "../common/dto.js";
@Controller("agendamentos")
export class AgendaController {
  constructor(private readonly service: AgendaService) {}
  @Get() list(@Req() r: AuthRequest) {
    return this.service.list(r.user);
  }
  @Get("horarios") horarios(
    @Query("profissionalId") p: string,
    @Query("servicoId") s: string,
    @Query("data") d: string,
    @Req() r: AuthRequest,
    @Query("ignorar") ignorar?: string,
  ) {
    if (!isUUID(p) || !isUUID(s) || (ignorar !== undefined && !isUUID(ignorar)))
      throw new BadRequestException("Identificadores inválidos");
    return this.service.horarios(p, s, d, r.user, ignorar);
  }
  @Roles("CLIENTE", "ADMINISTRADOR")
  @Post()
  criar(@Req() r: AuthRequest, @Body() dto: AgendamentoDto) {
    return this.service.salvar(dto, r.user);
  }
  @Roles("CLIENTE", "ADMINISTRADOR")
  @Put(":id")
  alterar(
    @Req() r: AuthRequest,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: AgendamentoDto,
  ) {
    return this.service.salvar(dto, r.user, id);
  }
  @Patch(":id/status") status(
    @Req() r: AuthRequest,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: StatusDto,
  ) {
    return this.service.status(id, dto.status, r.user);
  }
}
