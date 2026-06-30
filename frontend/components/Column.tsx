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
    <div ref={setNodeRef} className="rounded-lg p-4 min-w-[280px] flex flex-col h-fit" style={{ backgroundColor: '#1e1d28' }}>
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
                color: '#fd7e14',
                padding: '4px 0',
              },
              '& .MuiInput-underline:before': {
                borderBottomColor: '#fd7e14',
              },
              '& .MuiInput-underline:hover:before': {
                borderBottomColor: '#e96f08',
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: '#fd7e14',
              },
            }}
          />
        ) : (
          <div className="flex items-center justify-between">
            <h2
              className="text-lg font-semibold cursor-pointer flex-1 transition-colors"
              style={{ color: '#fd7e14' }}
              onClick={() => setIsRenaming(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#e96f08';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#fd7e14';
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
