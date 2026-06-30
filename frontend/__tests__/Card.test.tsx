import { render, screen, fireEvent } from '@testing-library/react';
import Card from '@/components/Card';
import { Card as CardType } from '@/types';

const mockCard: CardType = {
  id: 'card-1',
  title: 'Test Card',
  details: 'This is a test card',
};

describe('Card', () => {
  it('should render card title and details', () => {
    const onDelete = jest.fn();
    render(<Card card={mockCard} columnId="col-1" onDelete={onDelete} />);

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is a test card')).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', () => {
    const onDelete = jest.fn();
    render(<Card card={mockCard} columnId="col-1" onDelete={onDelete} />);

    const deleteButton = screen.getByLabelText('Delete Test Card');
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith('card-1');
  });
});
