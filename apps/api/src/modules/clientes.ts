import { Roles, AuthRequest } from "../auth/access.js";
import {
  Req,
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
  list(u: AuthRequest["user"]) {
    return this.db.cliente.findMany({
      where:
        u.perfil === "ADMINISTRADOR"
          ? {}
          : u.perfil === "CLIENTE"
            ? { id: u.clienteId! }
            : { agendamentos: { some: { profissionalId: u.profissionalId! } } },
      select:
        u.perfil === "PROFISSIONAL"
          ? { id: true, nome: true, telefone: true }
          : { id: true, nome: true, telefone: true, email: true },
    });
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
  list(u: AuthRequest["user"]) {
    return this.repo.list(u);
  }
  save(dto: PessoaDto, id?: string) {
    return this.repo.save(dto, id);
  }
}
@Roles("ADMINISTRADOR")
@Controller("clientes")
class ApiController {
  constructor(private readonly service: Service) {}
  @Roles("CLIENTE", "PROFISSIONAL", "ADMINISTRADOR")
  @Get()
  list(@Req() r: AuthRequest) {
    return this.service.list(r.user);
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
