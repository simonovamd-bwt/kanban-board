import { render, screen } from '@testing-library/react';
import Board from '@/components/Board';
import { Board as BoardType } from '@/types';

const mockBoard: BoardType = {
  columns: [
    {
      id: 'col-1',
      title: 'To Do',
      cards: [
        {
          id: 'card-1',
          title: 'Test Card',
          details: 'Test details',
        },
      ],
    },
    {
      id: 'col-2',
      title: 'In Progress',
      cards: [],
    },
  ],
};

describe('Board', () => {
  it('should render board title', () => {
    const onUpdateBoard = jest.fn();
    render(<Board board={mockBoard} onUpdateBoard={onUpdateBoard} />);

    expect(screen.getByText('Kanban Board')).toBeInTheDocument();
  });

  it('should render all columns', () => {
    const onUpdateBoard = jest.fn();
    render(<Board board={mockBoard} onUpdateBoard={onUpdateBoard} />);

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('should render cards in columns', () => {
    const onUpdateBoard = jest.fn();
    render(<Board board={mockBoard} onUpdateBoard={onUpdateBoard} />);

    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });
});
