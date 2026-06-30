'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType } from '@/types';
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
      className="border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow mb-3 bg-background"
    >
      <div className="flex justify-between items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="flex-1 cursor-grab active:cursor-grabbing"
        >
          <h3 className="font-semibold text-lg text-foreground">{card.title}</h3>
          {card.details && <p className="text-sm text-gray-text mt-1">{card.details}</p>}
        </div>
        <button
          type="button"
          onClick={() => onDelete(card.id)}
          aria-label={`Delete ${card.title}`}
          className="shrink-0 rounded p-1 text-gray-text transition-colors hover:text-danger hover:bg-danger/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-danger"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 5v6m4-6v6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default memo(Card);
