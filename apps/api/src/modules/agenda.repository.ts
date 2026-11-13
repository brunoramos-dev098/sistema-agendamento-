import { Actor } from "../auth/access.js";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { Prisma } from "../generated/prisma/client.js";
@Injectable()
export class AgendaRepository {
  constructor(private readonly db: PrismaService) {}
  transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.db.$transaction(fn, { isolationLevel: "Serializable" });
  }
  list(user: Actor) {
    return this.db.agendamento.findMany({
      where:
        user.perfil === "CLIENTE"
          ? { clienteId: user.clienteId! }
          : user.perfil === "PROFISSIONAL"
            ? { profissionalId: user.profissionalId! }
            : {},
      include: {
        cliente: {
          select:
            user.perfil === "ADMINISTRADOR"
              ? { id: true, nome: true, email: true, telefone: true }
              : { id: true, nome: true, telefone: true },
        },
        profissional: { select: { id: true, nome: true, especialidade: true } },
        servico: true,
      },
      orderBy: { inicio: "asc" },
    });
  }
}
