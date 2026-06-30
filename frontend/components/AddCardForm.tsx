'use client';

import { useState, memo } from 'react';

interface AddCardFormProps {
  onAdd: (title: string, details: string) => void;
}

function AddCardForm({ onAdd }: AddCardFormProps) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), details.trim());
      setTitle('');
      setDetails('');
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setTitle('');
    setDetails('');
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-accent text-accent py-2 font-medium transition-colors hover:border-accent-hover hover:bg-accent/10"
      >
        <span className="text-lg leading-none">+</span> Add Card
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background border border-border rounded-lg p-3 shadow"
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
          type="submit"
          className="flex-1 rounded bg-accent px-3 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
        >
          Add Card
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded border border-border px-3 py-2 text-sm text-gray-text transition-colors hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default memo(AddCardForm);
