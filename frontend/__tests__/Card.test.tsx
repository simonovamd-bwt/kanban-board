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
    render(
      <Card card={mockCard} columnId="col-1" onDelete={jest.fn()} onUpdate={jest.fn()} />
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is a test card')).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', () => {
    const onDelete = jest.fn();
    render(
      <Card card={mockCard} columnId="col-1" onDelete={onDelete} onUpdate={jest.fn()} />
    );

    const deleteButton = screen.getByLabelText('Delete Test Card');
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith('card-1');
  });

  it('should call onUpdate with edited title and details', () => {
    const onUpdate = jest.fn();
    render(
      <Card card={mockCard} columnId="col-1" onDelete={jest.fn()} onUpdate={onUpdate} />
    );

    fireEvent.click(screen.getByText('Test Card'));

    fireEvent.change(screen.getByLabelText('Card title'), {
      target: { value: 'Updated Card' },
    });
    fireEvent.change(screen.getByLabelText('Card details'), {
      target: { value: 'Updated details' },
    });
    fireEvent.click(screen.getByText('Save'));

    expect(onUpdate).toHaveBeenCalledWith('card-1', 'Updated Card', 'Updated details');
  });
});
