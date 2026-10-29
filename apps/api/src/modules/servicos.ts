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
import { ServicoDto } from "../common/dto.js";
@Injectable()
class Repository {
  constructor(private readonly db: PrismaService) {}
  list() {
    return this.db.servico.findMany();
  }
  save(data: ServicoDto, id?: string) {
    return id
      ? this.db.servico.update({ where: { id }, data })
      : this.db.servico.create({ data });
  }
}
@Injectable()
class Service {
  constructor(private readonly repo: Repository) {}
  list() {
    return this.repo.list();
  }
  save(dto: ServicoDto, id?: string) {
    return this.repo.save(dto, id);
  }
}
@Controller("servicos")
class ApiController {
  constructor(private readonly service: Service) {}
  @Get() list() {
    return this.service.list();
  }
  @Post() create(@Body() dto: ServicoDto) {
    return this.service.save(dto);
  }
  @Put(":id") update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: ServicoDto,
  ) {
    return this.service.save(dto, id);
  }
}
@Module({ controllers: [ApiController], providers: [Service, Repository] })
export class servicosModule {}
