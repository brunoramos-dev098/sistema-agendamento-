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
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { ProfissionalDto } from "../common/dto.js";
@Injectable()
class Repository {
  constructor(private readonly db: PrismaService) {}
  list() {
    return this.db.profissional.findMany({
      include: { servicos: true, disponibilidades: true },
    });
  }
  save(data: ProfissionalDto, id?: string) {
    return id
      ? this.db.profissional.update({ where: { id }, data })
      : this.db.profissional.create({ data });
  }
}
@Injectable()
class Service {
  constructor(private readonly repo: Repository) {}
  list() {
    return this.repo.list();
  }
  save(dto: ProfissionalDto, id?: string) {
    return this.repo.save(dto, id);
  }
}
@Controller("profissionais")
class ApiController {
  constructor(private readonly service: Service) {}
  @Get() list() {
    return this.service.list();
  }
  @Post() create(@Body() dto: ProfissionalDto) {
    return this.service.save(dto);
  }
  @Put(":id") update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: ProfissionalDto,
  ) {
    return this.service.save(dto, id);
  }
}
@Module({ controllers: [ApiController], providers: [Service, Repository] })
export class profissionaisModule {}
