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
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow mb-3"
    >
      <div className="flex justify-between items-start mb-2">
        <div
          {...attributes}
          {...listeners}
          className="flex-1 cursor-grab active:cursor-grabbing"
        >
          <h3 className="font-semibold text-lg" style={{ color: '#032147' }}>{card.title}</h3>
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
            color: '#888888',
            '&:hover': { color: '#d32f2f', backgroundColor: 'rgba(211, 47, 47, 0.04)' },
          }}
          aria-label={`Delete ${card.title}`}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <p className="text-sm" style={{ color: '#888888' }}>{card.details}</p>
      </div>
    </div>
  );
}

export default memo(Card);
