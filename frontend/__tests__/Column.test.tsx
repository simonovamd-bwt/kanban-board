import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Column from '@/components/Column';
import { Column as ColumnType } from '@/types';

const mockColumn: ColumnType = {
  id: 'col-1',
  title: 'To Do',
  cards: [
    {
      id: 'card-1',
      title: 'Test Card',
      details: 'Test details',
    },
  ],
};

describe('Column', () => {
  it('should render column title', () => {
    const onRename = jest.fn();
    const onDeleteCard = jest.fn();
    const onAddCard = jest.fn();

    render(
      <Column
        column={mockColumn}
        onRename={onRename}
        onDeleteCard={onDeleteCard}
        onUpdateCard={jest.fn()}
        onAddCard={onAddCard}
      />
    );

    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('should render cards in the column', () => {
    const onRename = jest.fn();
    const onDeleteCard = jest.fn();
    const onAddCard = jest.fn();

    render(
      <Column
        column={mockColumn}
        onRename={onRename}
        onDeleteCard={onDeleteCard}
        onUpdateCard={jest.fn()}
        onAddCard={onAddCard}
      />
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('should allow renaming column', async () => {
    const user = userEvent.setup();
    const onRename = jest.fn();
    const onDeleteCard = jest.fn();
    const onAddCard = jest.fn();

    render(
      <Column
        column={mockColumn}
        onRename={onRename}
        onDeleteCard={onDeleteCard}
        onUpdateCard={jest.fn()}
        onAddCard={onAddCard}
      />
    );

    const titleElement = screen.getByText('To Do');
    await user.click(titleElement);

    const input = screen.getByDisplayValue('To Do');
    await user.clear(input);
    await user.type(input, 'New Title');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(onRename).toHaveBeenCalledWith('col-1', 'New Title');
    });
  });

  it('should call onAddCard when form is submitted', async () => {
    const user = userEvent.setup();
    const onRename = jest.fn();
    const onDeleteCard = jest.fn();
    const onAddCard = jest.fn();

    render(
      <Column
        column={mockColumn}
        onRename={onRename}
        onDeleteCard={onDeleteCard}
        onUpdateCard={jest.fn()}
        onAddCard={onAddCard}
      />
    );

    const addButton = screen.getByRole('button', { name: /add card/i });
    await user.click(addButton);

    const titleInput = screen.getByPlaceholderText('Card title');
    const detailsInput = screen.getByPlaceholderText('Card details');

    await user.type(titleInput, 'New Card');
    await user.type(detailsInput, 'New details');

    const submitButton = screen.getByRole('button', { name: 'Add Card' });
    await user.click(submitButton);

    expect(onAddCard).toHaveBeenCalledWith('col-1', 'New Card', 'New details');
  });
});
