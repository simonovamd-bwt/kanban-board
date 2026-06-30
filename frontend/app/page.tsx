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

export default function Home() {
  const [board, setBoard] = useState<BoardType | null>(null);

  useEffect(() => {
    getBoard().then(setBoard);
  }, []);

  if (!board) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: '#060813' }}>
        <div className="flex items-center justify-center min-h-screen">
          <div style={{ color: '#667085' }}>Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <main className="min-h-screen" style={{ backgroundColor: '#060813' }}>
        <Board board={board} onUpdateBoard={setBoard} />
      </main>
    </ThemeProvider>
  );
}
