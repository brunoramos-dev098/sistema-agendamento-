import { config } from "dotenv";
config({ path: "../../.env" });
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "./password.js";
import { isEmail } from "class-validator";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
try {
  if (await db.conta.count({ where: { perfil: "ADMINISTRADOR" } })) {
    console.log("Já existe administrador. Nenhuma senha foi alterada.");
  } else {
    const email = (process.env.CHECKAPP_ADMIN_EMAIL ?? "admin@checkapp.local")
      .trim()
      .toLowerCase();
    const senha =
      process.env.CHECKAPP_ADMIN_PASSWORD ??
      randomBytes(24).toString("base64url");
    if (!isEmail(email) || senha.length < 12 || senha.length > 128)
      throw new Error(
        "Configure um email válido e senha entre 12 e 128 caracteres.",
      );
    const senhaHash = await hashPassword(senha);
    await db.$transaction(async (tx) => {
      const pessoa = await tx.administrador.upsert({
        where: { email },
        update: {},
        create: {
          nome: "Administrador Checkapp",
          telefone: "Não informado",
          email,
        },
      });
      await tx.conta.create({
        data: {
          email,
          senhaHash,
          perfil: "ADMINISTRADOR",
          administradorId: pessoa.id,
        },
      });
    });
    const dir = resolve("../../.tools");
    await mkdir(dir, { recursive: true });
    await writeFile(
      resolve(dir, "acesso-admin.txt"),
      `Acesso inicial do administrador Checkapp\nEmail: ${email}\nSenha: ${senha}\n\nEntre em http://127.0.0.1:5173/ e altere sua senha em Meu cadastro.\n`,
    );
    console.log(
      "Administrador criado. Credenciais em .tools/acesso-admin.txt (ignorado pelo Git).",
    );
  }
} finally {
  await db.$disconnect();
}
