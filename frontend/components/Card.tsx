'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType } from '@/types';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { memo } from 'react';

interface CardProps {
  card: CardType;
  columnId: string;
  onDelete: (cardId: string) => void;
}

function Card({ card, columnId, onDelete }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      columnId,
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, backgroundColor: '#060813', borderColor: '#2a2b38' }}
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow mb-3"
    >
      <div className="flex justify-between items-start mb-2">
        <div
          {...attributes}
          {...listeners}
          className="flex-1 cursor-grab active:cursor-grabbing"
        >
          <h3 className="font-semibold text-lg" style={{ color: '#f5f5f7' }}>{card.title}</h3>
        </div>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete(card.id);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          sx={{
            color: '#667085',
            '&:hover': { color: '#ff6b6b', backgroundColor: 'rgba(255, 107, 107, 0.08)' },
          }}
          aria-label={`Delete ${card.title}`}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <p className="text-sm" style={{ color: '#667085' }}>{card.details}</p>
      </div>
    </div>
  );
}

export default memo(Card);
