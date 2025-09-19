export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, "");
  const url = `${baseUrl}${path.startsWith("/") ? path : "/" + path}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Erro na requisição");
  }

  return res.json() as Promise<T>;
}
