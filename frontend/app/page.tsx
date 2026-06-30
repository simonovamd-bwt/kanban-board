'use client';

import { useState, useEffect, useCallback, type SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import { getBoard } from '@/lib/api';
import { Board as BoardType } from '@/types';

const Board = dynamic(() => import('@/components/Board'), {
  ssr: false,
});

type Status = 'loading' | 'error' | 'ready';

export default function Home() {
  const [board, setBoard] = useState<BoardType | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  const fetchBoard = useCallback((signal?: AbortSignal) => {
    getBoard(signal)
      .then((data) => {
        setBoard(data);
        setStatus('ready');
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchBoard(controller.signal);
    return () => controller.abort();
  }, [fetchBoard]);

  const handleRetry = () => {
    setStatus('loading');
    fetchBoard();
  };

  // Board only renders once `board` is non-null; adapt the updater so Board can
  // use functional updates without dealing with the `null` initial state.
  const updateBoard = useCallback((action: SetStateAction<BoardType>) => {
    setBoard((prev) =>
      prev === null
        ? prev
        : typeof action === 'function'
          ? (action as (p: BoardType) => BoardType)(prev)
          : action
    );
  }, []);

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-text">Loading...</div>
        </div>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
          <h2 className="text-xl font-semibold text-foreground">Cannot reach the server</h2>
          <p className="text-sm max-w-sm text-gray-text">
            Make sure the backend is running on http://localhost:8000, then try again.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="rounded bg-accent px-4 py-2 font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Board board={board!} onUpdateBoard={updateBoard} />
    </main>
  );
}
