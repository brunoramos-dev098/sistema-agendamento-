import { Module } from "@nestjs/common";
import { AgendaController } from "./agenda.controller.js";
import { AgendaService } from "./agenda.service.js";
import { AgendaRepository } from "./agenda.repository.js";
@Module({
  controllers: [AgendaController],
  providers: [AgendaService, AgendaRepository],
})
export class AgendaModule {}
