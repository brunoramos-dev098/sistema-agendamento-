import { Catch, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Prisma } from "../generated/prisma/client.js";
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaFilter implements ExceptionFilter {
  catch(e: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    let status = 400;
    let message = "Operação não permitida pelos dados relacionados";
    if (e.code === "P2025") {
      status = 404;
      message = "Registro não encontrado";
    } else if (e.code === "P2002" || e.code === "P2034" || e.code === "P2004") {
      status = 409;
      message = "Registro duplicado ou intervalo ocupado";
    }
    host
      .switchToHttp()
      .getResponse()
      .status(status)
      .json({ statusCode: status, message });
  }
}
