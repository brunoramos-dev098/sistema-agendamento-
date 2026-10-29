import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
export const pessoa = z.object({
  nome: z.string().trim().min(1),
  telefone: z.string().min(1),
  email: z.email(),
});
export const servico = z.object({
  nome: z.string().min(1),
  descricao: z.string(),
  preco: z.string().regex(/^\d{1,8}(\.\d{1,2})?$/),
  duracao: z.coerce.number().int().min(1).max(1440),
});
export function Formulario({
  tipo,
  valor,
  onSave,
}: {
  tipo: string;
  valor?: Record<string, unknown>;
  onSave: (d: unknown) => Promise<void>;
}) {
  const schema: z.ZodType<
    Record<string, unknown>,
    Record<string, unknown>
  > = tipo === "servicos"
    ? servico
    : tipo === "profissionais"
      ? pessoa.extend({ especialidade: z.string().min(1) })
      : pessoa;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: valor });
  const [mensagem, setMensagem] = useState("");
  const campos =
    tipo === "servicos"
      ? ["nome", "descricao", "preco", "duracao"]
      : [
          "nome",
          "telefone",
          "email",
          ...(tipo === "profissionais" ? ["especialidade"] : []),
        ];
  return (
    <form
      onSubmit={handleSubmit(async (d) => {
        try {
          await onSave(d);
          setMensagem("Salvo com sucesso.");
        } catch (e) {
          setMensagem((e as Error).message);
        }
      })}
    >
      <div className="form-grid">
        {campos.map((c) => (
          <label key={c}>
            {c}
            <input {...register(c)} type={c === "email" ? "email" : "text"} />
            {errors[c] && <small>Confira este campo.</small>}
          </label>
        ))}
      </div>
      <button disabled={isSubmitting}>
        Salvar {tipo === "servicos" ? "serviço" : "cadastro"}
      </button>
      <p role="status">{mensagem}</p>
    </form>
  );
}
