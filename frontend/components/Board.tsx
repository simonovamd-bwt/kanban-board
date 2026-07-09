'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Board as BoardType } from '@/types';
import Column from './Column';
import { useState, useRef, useEffect, memo, useCallback, type SetStateAction } from 'react';
import * as api from '@/lib/api';

interface BoardProps {
  board: BoardType;
  onUpdateBoard: (action: SetStateAction<BoardType>) => void;
}

function Board({ board, onUpdateBoard }: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Keep a ref to the latest board so handlers can read current state without
  // closing over `board` — this keeps the callbacks stable and avoids races
  // between rapid mutations operating on a stale snapshot.
  const boardRef = useRef(board);
  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  // Monotonic counter for optimistic placeholder ids so concurrent adds (even
  // with identical titles) never collide.
  const tempIdRef = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require a small drag before activating so clicks (e.g. delete) don't
      // get swallowed by the drag listeners.
      activationConstraint: { distance: 8 },
    })
  );

  // Re-fetch authoritative state from the server and replace the optimistic
  // board. Used to roll back when a mutation fails.
  const resync = useCallback(
    (message: string) => {
      setError(message);
      api
        .getBoard()
        .then((fresh) => onUpdateBoard(fresh))
        .catch(() => setError('Lost connection to the server.'));
    },
    [onUpdateBoard]
  );

  const handleRenameColumn = useCallback(
    (columnId: string, newTitle: string) => {
      onUpdateBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === columnId ? { ...col, title: newTitle } : col
        ),
      }));
      api.renameColumn(columnId, newTitle).catch(() => resync('Could not rename column.'));
    },
    [onUpdateBoard, resync]
  );

  const handleUpdateCard = useCallback(
    (cardId: string, title: string, details: string) => {
      onUpdateBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) => ({
          ...col,
          cards: col.cards.map((card) =>
            card.id === cardId ? { ...card, title, details } : card
          ),
        })),
      }));
      api.updateCard(cardId, title, details).catch(() => resync('Could not update card.'));
    },
    [onUpdateBoard, resync]
  );

  const handleDeleteCard = useCallback(
    (cardId: string) => {
      onUpdateBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) => ({
          ...col,
          cards: col.cards.filter((card) => card.id !== cardId),
        })),
      }));
      api.deleteCard(cardId).catch(() => resync('Could not delete card.'));
    },
    [onUpdateBoard, resync]
  );

  const handleAddCard = useCallback(
    (columnId: string, title: string, details: string) => {
      // Optimistically insert a placeholder, then reconcile with the server's
      // card (which carries the real id) — or roll back on failure.
      const tempId = `temp-${(tempIdRef.current += 1)}`;
      onUpdateBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === columnId
            ? { ...col, cards: [...col.cards, { id: tempId, title, details }] }
            : col
        ),
      }));

      api
        .addCard(columnId, title, details)
        .then((newCard) => {
          onUpdateBoard((prev) => ({
            ...prev,
            columns: prev.columns.map((col) =>
              col.id === columnId
                ? {
                    ...col,
                    cards: col.cards.map((c) => (c.id === tempId ? newCard : c)),
                  }
                : col
            ),
          }));
        })
        .catch(() => resync('Could not add card.'));
    },
    [onUpdateBoard, resync]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      const current = boardRef.current;
      const cardId = active.id as string;
      const sourceColumnId = active.data.current?.columnId as string | undefined;
      const overId = over.id as UniqueIdentifier;

      // An optimistic placeholder has no server id yet — moving it would PATCH a
      // non-existent card and trigger a full resync. Ignore the drag.
      if (cardId.startsWith('temp-')) return;

      const targetColumn = current.columns.find((col) => col.id === overId);
      const targetCard = current.columns
        .flatMap((col) => col.cards.map((c) => ({ card: c, columnId: col.id })))
        .find((item) => item.card.id === overId);

      const sourceColumn = current.columns.find((col) => col.id === sourceColumnId);
      if (!sourceColumn) return;

      const card = sourceColumn.cards.find((c) => c.id === cardId);
      if (!card) return;

      const targetColumnId = targetCard?.columnId ?? targetColumn?.id;
      if (!targetColumnId) return;

      if (sourceColumnId === targetColumnId) {
        const sourceCardIndex = sourceColumn.cards.findIndex((c) => c.id === cardId);
        // Dropped over a card → its slot; dropped on empty column area → the end.
        const targetCardIndex = targetCard
          ? sourceColumn.cards.findIndex((c) => c.id === overId)
          : sourceColumn.cards.length - 1;

        if (sourceCardIndex === -1 || targetCardIndex === -1 || targetCardIndex === sourceCardIndex) {
          return;
        }

        const newCards = [...sourceColumn.cards];
        newCards.splice(sourceCardIndex, 1);
        newCards.splice(targetCardIndex, 0, card);

        onUpdateBoard((prev) => ({
          ...prev,
          columns: prev.columns.map((col) =>
            col.id === sourceColumnId ? { ...col, cards: newCards } : col
          ),
        }));
        api.moveCard(cardId, targetColumnId, targetCardIndex).catch(() => resync('Could not move card.'));
        return;
      }

      if (sourceColumnId !== targetColumnId) {
        const finalTargetColumn = current.columns.find((col) => col.id === targetColumnId);
        if (!finalTargetColumn) return;

        // Insert at the dropped-over card's position, or append when dropping on the column.
        const targetPosition = targetCard
          ? finalTargetColumn.cards.findIndex((c) => c.id === overId)
          : finalTargetColumn.cards.length;

        onUpdateBoard((prev) => ({
          ...prev,
          columns: prev.columns.map((col) => {
            if (col.id === sourceColumnId) {
              return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
            }
            if (col.id === targetColumnId) {
              const newCards = [...col.cards];
              newCards.splice(targetPosition, 0, card);
              return { ...col, cards: newCards };
            }
            return col;
          }),
        }));
        api.moveCard(cardId, targetColumnId, targetPosition).catch(() => resync('Could not move card.'));
      }
    },
    [onUpdateBoard, resync]
  );

  const activeCard = activeId
    ? board.columns.flatMap((col) => col.cards).find((card) => card.id === activeId)
    : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Kanban Board</h1>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onRename={handleRenameColumn}
              onDeleteCard={handleDeleteCard}
              onUpdateCard={handleUpdateCard}
              onAddCard={handleAddCard}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeCard ? (
          <div className="border-2 border-accent rounded-lg p-4 shadow-lg opacity-95 rotate-1 bg-surface">
            <h3 className="font-semibold text-lg text-foreground">{activeCard.title}</h3>
            <p className="text-sm text-gray-text">{activeCard.details}</p>
          </div>
        ) : null}
      </DragOverlay>

      {error && (
        <div
          role="alert"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-lg border border-danger bg-surface px-4 py-3 shadow-lg"
        >
          <span className="text-sm text-foreground">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss"
            className="text-gray-text hover:text-foreground"
          >
            ✕
          </button>
        </div>
      )}
    </DndContext>
  );
}

export default memo(Board);
