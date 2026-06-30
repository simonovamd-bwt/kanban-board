import { Board, Card } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export function getBoard(): Promise<Board> {
  return request<Board>('/board');
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

export function deleteCard(cardId: string): Promise<unknown> {
  return request(`/cards/${cardId}`, { method: 'DELETE' });
}

export function moveCard(cardId: string, columnId: string, position: number): Promise<Card> {
  return request<Card>(`/cards/${cardId}/move`, {
    method: 'PATCH',
    body: JSON.stringify({ column_id: columnId, position }),
  });
}
