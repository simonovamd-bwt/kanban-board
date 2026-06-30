'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider, createTheme, Button } from '@mui/material';
import { getBoard } from '@/lib/api';
import { Board as BoardType } from '@/types';

const Board = dynamic(() => import('@/components/Board'), {
  ssr: false,
});

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fd7e14',
    },
    secondary: {
      main: '#017bec',
    },
    background: {
      default: '#060813',
      paper: '#1e1d28',
    },
    text: {
      primary: '#f5f5f7',
      secondary: '#667085',
    },
  },
});

type Status = 'loading' | 'error' | 'ready';

export default function Home() {
  const [board, setBoard] = useState<BoardType | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  const fetchBoard = useCallback(() => {
    getBoard()
      .then((data) => {
        setBoard(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const handleRetry = () => {
    setStatus('loading');
    fetchBoard();
  };

  if (status === 'loading') {
    return (
      <main className="min-h-screen" style={{ backgroundColor: '#060813' }}>
        <div className="flex items-center justify-center min-h-screen">
          <div style={{ color: '#667085' }}>Loading...</div>
        </div>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <ThemeProvider theme={theme}>
        <main className="min-h-screen" style={{ backgroundColor: '#060813' }}>
          <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
            <h2 className="text-xl font-semibold" style={{ color: '#f5f5f7' }}>
              Cannot reach the server
            </h2>
            <p className="text-sm max-w-sm" style={{ color: '#667085' }}>
              Make sure the backend is running on http://localhost:8000, then try again.
            </p>
            <Button variant="contained" onClick={handleRetry} sx={{ color: '#060813', fontWeight: 600 }}>
              Retry
            </Button>
          </div>
        </main>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <main className="min-h-screen" style={{ backgroundColor: '#060813' }}>
        <Board board={board!} onUpdateBoard={setBoard} />
      </main>
    </ThemeProvider>
  );
}
