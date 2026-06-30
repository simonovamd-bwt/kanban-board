import { render, screen, act } from '@testing-library/react';
import type { DragEndEvent } from '@dnd-kit/core';
import Board from '@/components/Board';
import { Board as BoardType } from '@/types';
import * as api from '@/lib/api';

// Capture the onDragEnd handler the real DndContext would call, so tests can
// fire synthetic drag events without a DOM pointer dance.
let capturedOnDragEnd: ((event: DragEndEvent) => void) | undefined;

jest.mock('@dnd-kit/core', () => {
  const actual = jest.requireActual('@dnd-kit/core');
  return {
    ...actual,
    DndContext: ({
      children,
      onDragEnd,
    }: {
      children: React.ReactNode;
      onDragEnd: (event: DragEndEvent) => void;
    }) => {
      capturedOnDragEnd = onDragEnd;
      return <div>{children}</div>;
    },
  };
});

jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

const baseBoard = (): BoardType => ({
  columns: [
    {
      id: 'col-1',
      title: 'To Do',
      cards: [
        { id: 'card-1', title: 'First', details: '' },
        { id: 'card-2', title: 'Second', details: '' },
      ],
    },
    { id: 'col-2', title: 'Done', cards: [] },
  ],
});

function renderBoard() {
  let current = baseBoard();
  const onUpdateBoard = jest.fn((action) => {
    current = typeof action === 'function' ? action(current) : action;
  });
  const view = render(<Board board={current} onUpdateBoard={onUpdateBoard} />);
  return { onUpdateBoard, getBoard: () => current, view };
}

function dragEvent(activeId: string, columnId: string, overId: string): DragEndEvent {
  return {
    active: { id: activeId, data: { current: { columnId } } },
    over: { id: overId, data: { current: {} } },
  } as unknown as DragEndEvent;
}

beforeEach(() => {
  jest.clearAllMocks();
  capturedOnDragEnd = undefined;
  mockedApi.moveCard.mockResolvedValue({ id: 'card-1', title: 'First', details: '' });
});

describe('Board drag handling', () => {
  it('moves a card to the end when dropped on its own column area', () => {
    const { onUpdateBoard, getBoard } = renderBoard();

    // Drop card-1 onto the column itself (overId === column id), not over a card.
    act(() => {
      capturedOnDragEnd!(dragEvent('card-1', 'col-1', 'col-1'));
    });

    expect(onUpdateBoard).toHaveBeenCalled();
    expect(getBoard().columns[0].cards.map((c) => c.id)).toEqual(['card-2', 'card-1']);
    // Sent to the server at the last index.
    expect(mockedApi.moveCard).toHaveBeenCalledWith('card-1', 'col-1', 1);
  });

  it('reorders within a column when dropped over another card', () => {
    const { getBoard } = renderBoard();

    act(() => {
      capturedOnDragEnd!(dragEvent('card-2', 'col-1', 'card-1'));
    });

    expect(getBoard().columns[0].cards.map((c) => c.id)).toEqual(['card-2', 'card-1']);
    expect(mockedApi.moveCard).toHaveBeenCalledWith('card-2', 'col-1', 0);
  });

  it('ignores drags of an unpersisted (temp-) card', () => {
    renderBoard();

    act(() => {
      capturedOnDragEnd!(dragEvent('temp-1', 'col-1', 'col-2'));
    });

    expect(mockedApi.moveCard).not.toHaveBeenCalled();
  });
});
