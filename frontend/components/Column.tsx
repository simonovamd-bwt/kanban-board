'use client';

import { useState, memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType } from '@/types';
import Card from './Card';
import AddCardForm from './AddCardForm';

interface ColumnProps {
  column: ColumnType;
  onRename: (columnId: string, newTitle: string) => void;
  onDeleteCard: (cardId: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
}

function Column({ column, onRename, onDeleteCard, onAddCard }: ColumnProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      columnId: column.id,
    },
  });

  const handleRename = () => {
    if (editTitle.trim() && editTitle.trim() !== column.title) {
      onRename(column.id, editTitle.trim());
    } else {
      setEditTitle(column.title);
    }
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditTitle(column.title);
      setIsRenaming(false);
    }
  };

  const startRenaming = () => {
    setEditTitle(column.title);
    setIsRenaming(true);
  };

  return (
    <div ref={setNodeRef} className="rounded-lg p-4 min-w-[280px] flex flex-col h-fit bg-surface">
      <div className="mb-4">
        {isRenaming ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Column title"
            className="w-full bg-transparent text-lg font-semibold text-accent border-b border-accent outline-none py-1"
          />
        ) : (
          <h2 className="text-lg font-semibold">
            <button
              type="button"
              onClick={startRenaming}
              title="Click to rename"
              className="text-accent hover:text-accent-hover transition-colors text-left w-full"
            >
              {column.title}
            </button>
          </h2>
        )}
      </div>

      <SortableContext items={column.cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 mb-4">
          {column.cards.map((card) => (
            <Card key={card.id} card={card} columnId={column.id} onDelete={onDeleteCard} />
          ))}
        </div>
      </SortableContext>

      <AddCardForm onAdd={(title, details) => onAddCard(column.id, title, details)} />
    </div>
  );
}

export default memo(Column);
