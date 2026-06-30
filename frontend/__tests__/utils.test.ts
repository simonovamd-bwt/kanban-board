import { generateDummyData } from '@/lib/utils';

describe('generateDummyData', () => {
  it('should generate a board with 5 columns', () => {
    const board = generateDummyData();
    expect(board.columns).toHaveLength(5);
  });

  it('should have columns with unique IDs', () => {
    const board = generateDummyData();
    const columnIds = board.columns.map((col) => col.id);
    const uniqueIds = new Set(columnIds);
    expect(uniqueIds.size).toBe(5);
  });

  it('should have cards in each column', () => {
    const board = generateDummyData();
    board.columns.forEach((column) => {
      expect(column.cards.length).toBeGreaterThan(0);
    });
  });

  it('should have cards with title and details', () => {
    const board = generateDummyData();
    board.columns.forEach((column) => {
      column.cards.forEach((card) => {
        expect(card.title).toBeTruthy();
        expect(card.details).toBeTruthy();
        expect(typeof card.title).toBe('string');
        expect(typeof card.details).toBe('string');
      });
    });
  });

  it('should have cards with unique IDs', () => {
    const board = generateDummyData();
    const allCardIds = board.columns.flatMap((col) => col.cards.map((card) => card.id));
    const uniqueIds = new Set(allCardIds);
    expect(uniqueIds.size).toBe(allCardIds.length);
  });
});
