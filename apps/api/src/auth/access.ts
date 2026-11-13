import { SetMetadata, ForbiddenException } from "@nestjs/common";
export type Perfil = "CLIENTE" | "PROFISSIONAL" | "ADMINISTRADOR";
export type Actor = {
  id: string;
  email: string;
  perfil: Perfil;
  clienteId: string | null;
  profissionalId: string | null;
  administradorId: string | null;
};
export type AuthRequest = {
  user: Actor;
  headers: Record<string, string | undefined>;
  method: string;
  ip?: string;
};
export const Roles = (...roles: Perfil[]) => SetMetadata("roles", roles);
export const Public = () => SetMetadata("public", true);
export function exigirDono(
  a: { clienteId: string; profissionalId: string },
  user: Actor,
) {
  if (user.perfil === "ADMINISTRADOR") return;
  if (user.perfil === "CLIENTE" && a.clienteId === user.clienteId) return;
  if (
    user.perfil === "PROFISSIONAL" &&
    a.profissionalId === user.profissionalId
  )
    return;
  throw new ForbiddenException("Você não tem acesso a este atendimento");
}
