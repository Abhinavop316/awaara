// Count total bookable seats in a bus layout
export const countBookableSeats = (layout) => {
  if (!layout || !layout.decks) return 0;
  let count = 0;

  const countDeck = (deck) => {
    if (!Array.isArray(deck)) return;
    deck.forEach((row) => {
      if (Array.isArray(row)) {
        row.forEach((cell) => {
          if (cell && (cell.type === 'seater' || cell.type === 'sleeper')) {
            count++;
          }
        });
      }
    });
  };

  countDeck(layout.decks.lower);
  if (layout.hasUpperDeck) {
    countDeck(layout.decks.upper);
  }

  return count;
};

// Auto-renumber seats in a deck
export const renumberDeck = (deck, prefix = 'S') => {
  if (!Array.isArray(deck)) return deck;
  let counter = 1;

  return deck.map((row, rIdx) =>
    row.map((cell, cIdx) => {
      if (cell.type === 'seater' || cell.type === 'sleeper') {
        const newSeatNum = `${prefix}${counter++}`;
        return { ...cell, seatNumber: newSeatNum };
      }
      return { ...cell, seatNumber: '' };
    })
  );
};

// Create a blank deck grid with aisle and custom default price
export const createEmptyDeck = (rows, cols, defaultPrice = 525) => {
  const grid = [];
  let seatCounter = 1;

  for (let r = 0; r < rows; r++) {
    const row = [];
    const isBackRow = r === rows - 1;

    for (let c = 0; c < cols; c++) {
      let isAisle = false;
      if (!isBackRow) {
        if (cols === 5 && c === 2) isAisle = true;
        if (cols === 4 && c === 1) isAisle = true;
        if (cols === 5 && r === 0 && c === 1) isAisle = true;
      }

      if (isAisle) {
        row.push({
          id: `cell-${Date.now()}-${r}-${c}`,
          type: 'empty',
          seatNumber: '',
          price: defaultPrice,
          priceModifier: 0,
          status: 'available',
          isAisle: true
        });
      } else {
        row.push({
          id: `cell-${Date.now()}-${r}-${c}`,
          type: 'seater',
          seatNumber: `L${seatCounter++}`,
          price: defaultPrice,
          priceModifier: 0,
          status: 'available',
          isAisle: false
        });
      }
    }
    grid.push(row);
  }
  return grid;
};
