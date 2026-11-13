export async function api<T>(
  path: string,
  method = "GET",
  data?: unknown,
): Promise<T> {
  let r: Response;
  try {
    r = await fetch("/api/" + path, {
      method,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : undefined,
    });
  } catch {
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique a conexão e tente novamente.",
    );
  }
  const text = await r.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : undefined;
  } catch {
    throw new Error(
      "O servidor retornou uma resposta inválida. Tente novamente mais tarde.",
    );
  }
  if (!r.ok && r.status >= 500) {
    throw new Error(
      "O serviço está indisponível. Verifique se a API e o banco de dados estão em execução.",
    );
  }
  if (
    r.status === 401 &&
    !["auth/me", "auth/login", "auth/registro"].includes(path) &&
    typeof window !== "undefined"
  )
    window.dispatchEvent(new Event("checkapp:unauthorized"));
  if (!r.ok) {
    const m = (body as { message?: string | string[] } | undefined)?.message;
    throw new Error(
      Array.isArray(m)
        ? m.join(", ")
        : (m ?? "Não foi possível concluir a operação"),
    );
  }
  if (body === undefined && r.status !== 204) {
    throw new Error(
      "O servidor retornou uma resposta vazia. Tente novamente mais tarde.",
    );
  }
  return body as T;
}
