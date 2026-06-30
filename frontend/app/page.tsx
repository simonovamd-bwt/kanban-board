'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider, createTheme } from '@mui/material';
import { getBoard } from '@/lib/api';
import { Board as BoardType } from '@/types';

const Board = dynamic(() => import('@/components/Board'), {
  ssr: false,
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#209dd7',
    },
    secondary: {
      main: '#753991',
    },
    background: {
      default: '#ffffff',
    },
  },
});

export default function Home() {
  const [board, setBoard] = useState<BoardType | null>(null);

  useEffect(() => {
    getBoard().then(setBoard);
  }, []);

  if (!board) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <div style={{ color: '#888888' }}>Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <main className="min-h-screen bg-white">
        <Board board={board} onUpdateBoard={setBoard} />
      </main>
    </ThemeProvider>
  );
}
