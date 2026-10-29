export async function api<T>(
  path: string,
  method = "GET",
  data?: unknown,
): Promise<T> {
  const r = await fetch("/api/" + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });
  const body: unknown = await r.json();
  if (!r.ok) {
    const m = (body as { message?: string | string[] }).message;
    throw new Error(
      Array.isArray(m)
        ? m.join(", ")
        : (m ?? "Não foi possível concluir a operação"),
    );
  }
  return body as T;
}
