import {
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
  @Get() list() {
    return this.service.list();
  }
  @Get("horarios") horarios(
    @Query("profissionalId") p: string,
    @Query("servicoId") s: string,
    @Query("data") d: string,
  ) {
    if (!isUUID(p) || !isUUID(s))
      throw new BadRequestException("Identificadores inválidos");
    return this.service.horarios(p, s, d);
  }
  @Post() criar(@Body() dto: AgendamentoDto) {
    return this.service.salvar(dto);
  }
  @Put(":id") alterar(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: AgendamentoDto,
  ) {
    return this.service.salvar(dto, id);
  }
  @Patch(":id/status") status(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: StatusDto,
  ) {
    return this.service.status(id, dto.status);
  }
}
