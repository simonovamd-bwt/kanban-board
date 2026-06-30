'use client';

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Board as BoardType } from '@/types';
import Column from './Column';
import { useState, memo, useCallback } from 'react';

interface BoardProps {
  board: BoardType;
  onUpdateBoard: (board: BoardType) => void;
}

function Board({ board, onUpdateBoard }: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleRenameColumn = useCallback((columnId: string, newTitle: string) => {
    const updatedBoard = {
      ...board,
      columns: board.columns.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col
      ),
    };
    onUpdateBoard(updatedBoard);
  }, [board, onUpdateBoard]);

  const handleDeleteCard = useCallback((cardId: string) => {
    const updatedBoard = {
      ...board,
      columns: board.columns.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.id !== cardId),
      })),
    };
    onUpdateBoard(updatedBoard);
  }, [board, onUpdateBoard]);

  const handleAddCard = useCallback((columnId: string, title: string, details: string) => {
    const newCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      details,
    };

    const updatedBoard = {
      ...board,
      columns: board.columns.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
      ),
    };
    onUpdateBoard(updatedBoard);
  }, [board, onUpdateBoard]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const cardId = active.id as string;
    const sourceColumnId = active.data.current?.columnId as string;
    const overId = over.id as string;

    const targetColumn = board.columns.find((col) => col.id === overId);
    const targetCard = board.columns
      .flatMap((col) => col.cards.map((c) => ({ card: c, columnId: col.id })))
      .find((item) => item.card.id === overId);

    const sourceColumn = board.columns.find((col) => col.id === sourceColumnId);
    if (!sourceColumn) return;

    const card = sourceColumn.cards.find((c) => c.id === cardId);
    if (!card) return;

    const targetColumnId = targetCard?.columnId || (targetColumn?.id as string);

    if (!targetColumnId) return;

    if (sourceColumnId === targetColumnId && targetCard) {
      const targetCardIndex = sourceColumn.cards.findIndex((c) => c.id === overId);
      const sourceCardIndex = sourceColumn.cards.findIndex((c) => c.id === cardId);

      if (targetCardIndex === -1 || sourceCardIndex === -1 || targetCardIndex === sourceCardIndex) return;

      const newCards = [...sourceColumn.cards];
      newCards.splice(sourceCardIndex, 1);
      newCards.splice(targetCardIndex, 0, card);

      const updatedBoard = {
        ...board,
        columns: board.columns.map((col) =>
          col.id === sourceColumnId ? { ...col, cards: newCards } : col
        ),
      };
      onUpdateBoard(updatedBoard);
      return;
    }

    if (sourceColumnId !== targetColumnId) {
      const finalTargetColumn = board.columns.find((col) => col.id === targetColumnId);
      if (!finalTargetColumn) return;

      const updatedBoard = {
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === sourceColumnId) {
            return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
          }
          if (col.id === targetColumnId) {
            return { ...col, cards: [...col.cards, card] };
          }
          return col;
        }),
      };
      onUpdateBoard(updatedBoard);
    }
  }, [board, onUpdateBoard]);

  const activeCard = activeId
    ? board.columns
        .flatMap((col) => col.cards)
        .find((card) => card.id === activeId)
    : null;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#032147' }}>Kanban Board</h1>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onRename={handleRenameColumn}
              onDeleteCard={handleDeleteCard}
              onAddCard={handleAddCard}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeCard ? (
          <div className="bg-white border-2 rounded-lg p-4 shadow-lg opacity-90 rotate-1" style={{ borderColor: '#ecad0a' }}>
            <h3 className="font-semibold text-lg" style={{ color: '#032147' }}>{activeCard.title}</h3>
            <p className="text-sm" style={{ color: '#888888' }}>{activeCard.details}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default memo(Board);
