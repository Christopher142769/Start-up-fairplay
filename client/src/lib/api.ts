const prefix = import.meta.env.VITE_API_URL ?? '';

export const GROUP_TOKEN_KEY = 'fairplay_group_token';
export const ADMIN_TOKEN_KEY = 'fairplay_admin_token';

export function getGroupToken(): string | null {
  return localStorage.getItem(GROUP_TOKEN_KEY);
}

export function setGroupToken(t: string | null) {
  if (t) localStorage.setItem(GROUP_TOKEN_KEY, t);
  else localStorage.removeItem(GROUP_TOKEN_KEY);
}

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(t: string | null) {
  if (t) localStorage.setItem(ADMIN_TOKEN_KEY, t);
  else localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function parseJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || 'Réponse invalide' };
  }
}

export async function api<T>(
  path: string,
  opts: RequestInit & { auth?: 'group' | 'admin' | null } = {}
): Promise<T> {
  const { auth = null, headers, ...rest } = opts;
  const h = new Headers(headers);
  if (auth === 'group') {
    const t = getGroupToken();
    if (t) h.set('Authorization', `Bearer ${t}`);
  }
  if (auth === 'admin') {
    const t = getAdminToken();
    if (t) h.set('Authorization', `Bearer ${t}`);
  }
  const res = await fetch(`${prefix}${path}`, { ...rest, headers: h });
  const data = await parseJson(res);
  if (!res.ok) {
    const err = (data as { error?: string }).error || res.statusText;
    throw new Error(err);
  }
  return data as T;
}
