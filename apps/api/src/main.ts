import "reflect-metadata";
import { PrismaFilter } from "./common/prisma.filter.js";
import { config } from "dotenv";
config({ path: "../../.env" });
import { NestFactory } from "@nestjs/core";
import { Module, Global, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service.js";
import { AgendaModule } from "./modules/agenda.module.js";
import { clientesModule } from "./modules/clientes.js";
import { profissionaisModule } from "./modules/profissionais.js";
import { servicosModule } from "./modules/servicos.js";
import { DisponibilidadesModule } from "./modules/disponibilidades.js";
@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
class PrismaModule {}
@Module({
  imports: [
    PrismaModule,
    AgendaModule,
    clientesModule,
    profissionaisModule,
    servicosModule,
    DisponibilidadesModule,
  ],
})
class AppModule {}
const app = await NestFactory.create(AppModule);
app.enableCors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:5173" });
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
app.useGlobalFilters(new PrismaFilter());
app.enableShutdownHooks();
await app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
