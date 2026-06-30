'use client';

import { useState, memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TextField } from '@mui/material';
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

  return (
    <div ref={setNodeRef} className="bg-gray-50 rounded-lg p-4 min-w-[280px] flex flex-col h-fit">
      <div className="mb-4">
        {isRenaming ? (
          <TextField
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            autoFocus
            variant="standard"
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#209dd7',
                padding: '4px 0',
              },
              '& .MuiInput-underline:before': {
                borderBottomColor: '#209dd7',
              },
              '& .MuiInput-underline:hover:before': {
                borderBottomColor: '#1a7ba8',
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: '#209dd7',
              },
            }}
          />
        ) : (
          <div className="flex items-center justify-between">
            <h2
              className="text-lg font-semibold cursor-pointer flex-1 transition-colors"
              style={{ color: '#209dd7' }}
              onClick={() => setIsRenaming(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1a7ba8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#209dd7';
              }}
              title="Click to rename"
            >
              {column.title}
            </h2>
          </div>
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
