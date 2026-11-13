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
import { ProfissionalDto } from "../common/dto.js";
@Injectable()
class Repository {
  constructor(private readonly db: PrismaService) {}
  list(u: AuthRequest["user"]) {
    return this.db.profissional.findMany({
      select:
        u.perfil === "ADMINISTRADOR"
          ? {
              id: true,
              nome: true,
              telefone: true,
              email: true,
              especialidade: true,
              servicos: true,
              disponibilidades: true,
            }
          : {
              id: true,
              nome: true,
              especialidade: true,
              servicos: true,
              disponibilidades: true,
            },
    });
  }
  save(data: ProfissionalDto, id?: string) {
    return id
      ? this.db.profissional.update({ where: { id }, data })
      : this.db.profissional.create({
          data: {
            ...data,
            disponibilidades: {
              create: Array.from({ length: 6 }, (_, i) => ({
                diaSemana: i + 1,
                inicioMinuto: 540,
                fimMinuto: 1170,
              })),
            },
          },
        });
  }
}
@Injectable()
class Service {
  constructor(private readonly repo: Repository) {}
  list(u: AuthRequest["user"]) {
    return this.repo.list(u);
  }
  save(dto: ProfissionalDto, id?: string) {
    return this.repo.save(dto, id);
  }
}
@Roles("ADMINISTRADOR")
@Controller("profissionais")
class ApiController {
  constructor(private readonly service: Service) {}
  @Roles("CLIENTE", "PROFISSIONAL", "ADMINISTRADOR")
  @Get()
  list(@Req() r: AuthRequest) {
    return this.service.list(r.user);
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
