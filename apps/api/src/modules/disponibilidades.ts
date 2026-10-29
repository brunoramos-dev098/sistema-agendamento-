import {
  Module,
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseUUIDPipe,
  Injectable,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { DisponibilidadeDto } from "../common/dto.js";
@Injectable()
class Service {
  constructor(private readonly db: PrismaService) {}
  list() {
    return this.db.disponibilidade.findMany();
  }
  save(d: DisponibilidadeDto, id?: string) {
    if (d.inicioMinuto >= d.fimMinuto)
      throw new BadRequestException("Fim deve ser posterior ao início");
    return id
      ? this.db.disponibilidade.update({ where: { id }, data: d })
      : this.db.disponibilidade.create({ data: d });
  }
  vincular(p: string, s: string) {
    return this.db.profissionalServico.upsert({
      where: { profissionalId_servicoId: { profissionalId: p, servicoId: s } },
      create: { profissionalId: p, servicoId: s },
      update: {},
    });
  }
}
@Controller()
class ApiController {
  constructor(private readonly service: Service) {}
  @Get("disponibilidades") list() {
    return this.service.list();
  }
  @Post("disponibilidades") create(@Body() dto: DisponibilidadeDto) {
    return this.service.save(dto);
  }
  @Put("disponibilidades/:id") update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: DisponibilidadeDto,
  ) {
    return this.service.save(dto, id);
  }
  @Put("profissionais/:p/servicos/:s") vincular(
    @Param("p", ParseUUIDPipe) p: string,
    @Param("s", ParseUUIDPipe) s: string,
  ) {
    return this.service.vincular(p, s);
  }
}
@Module({ controllers: [ApiController], providers: [Service] })
export class DisponibilidadesModule {}
