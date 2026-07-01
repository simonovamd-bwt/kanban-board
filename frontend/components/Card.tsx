'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType } from '@/types';
import { memo, useState } from 'react';

interface CardProps {
  card: CardType;
  columnId: string;
  onDelete: (cardId: string) => void;
  onUpdate: (cardId: string, title: string, details: string) => void;
}

function Card({ card, columnId, onDelete, onUpdate }: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [details, setDetails] = useState(card.details);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      columnId,
      card,
    },
    disabled: isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const startEditing = () => {
    setTitle(card.title);
    setDetails(card.details);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (title.trim()) {
      onUpdate(card.id, title.trim(), details.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(card.title);
    setDetails(card.details);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="border border-accent rounded-lg p-3 shadow-sm mb-3 bg-background"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Card title"
          autoFocus
          aria-label="Card title"
          className="w-full mb-2 rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-gray-text outline-none focus:border-accent"
        />
        <textarea
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Card details"
          aria-label="Card details"
          className="w-full mb-3 rounded border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-gray-text outline-none focus:border-accent resize-none"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded bg-accent px-3 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded border border-border px-3 py-2 text-sm text-gray-text transition-colors hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

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
          onClick={startEditing}
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
