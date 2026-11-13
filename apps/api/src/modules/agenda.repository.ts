import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { Prisma } from "../generated/prisma/client.js";
@Injectable()
export class AgendaRepository {
  constructor(private readonly db: PrismaService) {}
  transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.db.$transaction(fn, { isolationLevel: "Serializable" });
  }
  list() {
    return this.db.agendamento.findMany({
      include: { cliente: true, profissional: true, servico: true },
      orderBy: { inicio: "asc" },
    });
  }
}
