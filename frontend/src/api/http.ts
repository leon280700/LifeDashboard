export class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function request<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers:
      body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message =
      typeof data?.error === "string"
        ? data.error
        : `${method} ${url} fehlgeschlagen (${res.status})`;
    throw new HttpError(message, res.status);
  }
  return res.json().catch(() => undefined as T);
}
export const errorMessage = (e: unknown, fallback: string) =>
  e instanceof HttpError && e.status === 400 ? e.message : fallback;
