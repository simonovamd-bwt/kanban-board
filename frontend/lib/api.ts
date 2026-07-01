import { Board, Card } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const DEFAULT_TIMEOUT_MS = 10000;

interface RequestOptions extends RequestInit {
  /** Abort the request after this many ms (default 10s). */
  timeoutMs?: number;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal, ...init } = options;

  // Combine the caller's signal (if any) with our timeout so either can abort.
  const timeoutController = new AbortController();
  const timer = setTimeout(() => timeoutController.abort(), timeoutMs);
  const signals = [timeoutController.signal, signal].filter(Boolean) as AbortSignal[];
  const combined =
    signals.length > 1 && typeof AbortSignal.any === 'function'
      ? AbortSignal.any(signals)
      : signals[0];

  try {
    const res = await fetch(`${BASE_URL}/api${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: combined,
      ...init,
    });
    if (!res.ok) {
      throw new Error(`API ${res.status}: ${path}`);
    }
    if (res.status === 204) {
      return undefined as T;
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export function getBoard(signal?: AbortSignal): Promise<Board> {
  return request<Board>('/board', { signal });
}

export function renameColumn(columnId: string, title: string): Promise<unknown> {
  return request(`/columns/${columnId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
  });
}

export function addCard(columnId: string, title: string, details: string): Promise<Card> {
  return request<Card>(`/columns/${columnId}/cards`, {
    method: 'POST',
    body: JSON.stringify({ title, details }),
  });
}

export function updateCard(cardId: string, title: string, details: string): Promise<Card> {
  return request<Card>(`/cards/${cardId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title, details }),
  });
}

export function deleteCard(cardId: string): Promise<unknown> {
  return request(`/cards/${cardId}`, { method: 'DELETE' });
}

export function moveCard(cardId: string, columnId: string, position: number): Promise<Card> {
  return request<Card>(`/cards/${cardId}/move`, {
    method: 'PATCH',
    body: JSON.stringify({ column_id: columnId, position }),
  });
}
