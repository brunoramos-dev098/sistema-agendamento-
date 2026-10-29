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
import { PessoaDto } from "../common/dto.js";
@Injectable()
class Repository {
  constructor(private readonly db: PrismaService) {}
  list() {
    return this.db.cliente.findMany();
  }
  save(data: PessoaDto, id?: string) {
    return id
      ? this.db.cliente.update({ where: { id }, data })
      : this.db.cliente.create({ data });
  }
}
@Injectable()
class Service {
  constructor(private readonly repo: Repository) {}
  list() {
    return this.repo.list();
  }
  save(dto: PessoaDto, id?: string) {
    return this.repo.save(dto, id);
  }
}
@Controller("clientes")
class ApiController {
  constructor(private readonly service: Service) {}
  @Get() list() {
    return this.service.list();
  }
  @Post() create(@Body() dto: PessoaDto) {
    return this.service.save(dto);
  }
  @Put(":id") update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: PessoaDto,
  ) {
    return this.service.save(dto, id);
  }
}
@Module({ controllers: [ApiController], providers: [Service, Repository] })
export class clientesModule {}
