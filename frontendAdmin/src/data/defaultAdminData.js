// Default Bus Layout Templates
export const DEFAULT_BUS_TEMPLATES = [
  {
    id: 'tpl-2-2-seater',
    name: '2+2 Luxury Seater (41 Seats)',
    description: 'Exact modern executive layout with ₹525 seats and 5-seater back row',
    type: 'seater',
    hasUpperDeck: false,
    rows: 11,
    cols: 5, // col 0, 1 (left) | col 2 (aisle) | col 3, 4 (right)
    decks: {
      lower: generateGrid(11, 5, 'seater', '2-2', 'L'),
      upper: []
    }
  },
  {
    id: 'tpl-2-1-sleeper',
    name: '2+1 AC Sleeper (30 Berths)',
    description: 'Double decker sleeper cabin: 2 on right, 1 on left with plush berths',
    type: 'sleeper',
    hasUpperDeck: true,
    rows: 6,
    cols: 4, // col 0 (single berth) | col 1 (aisle) | col 2, 3 (double berth)
    decks: {
      lower: generateGrid(6, 4, 'sleeper', '2-1', 'L', 1200),
      upper: generateGrid(6, 4, 'sleeper', '2-1', 'U', 1350)
    }
  },
  {
    id: 'tpl-1-2-vip',
    name: '1+2 Volvo Executive (21 Seats)',
    description: 'Premium spacious business class seating with recliners',
    type: 'seater',
    hasUpperDeck: false,
    rows: 7,
    cols: 4, // col 0 (single) | col 1 (aisle) | col 2, 3 (pair)
    decks: {
      lower: generateGrid(7, 4, 'seater', '1-2', 'V', 850),
      upper: []
    }
  }
];

// Helper to generate seat grid matrix matching the exact reference layout
function generateGrid(rows, cols, defaultType, layoutPattern, deckPrefix, defaultPrice = 525) {
  const grid = [];
  let seatCounter = 1;

  for (let r = 0; r < rows; r++) {
    const rowCells = [];
    const isBackRow = r === rows - 1;

    for (let c = 0; c < cols; c++) {
      let isAisle = false;
      if (!isBackRow) {
        if (layoutPattern === '2-2' && c === 2) isAisle = true;
        if (layoutPattern === '2-1' && c === 1) isAisle = true;
        if (layoutPattern === '1-2' && c === 1) isAisle = true;
        // In row 0 for 2-2, col 1 is also empty/entrance
        if (layoutPattern === '2-2' && r === 0 && c === 1) isAisle = true;
      }

      if (isAisle) {
        rowCells.push({
          id: `cell-${r}-${c}`,
          type: 'empty',
          seatNumber: '',
          price: defaultPrice,
          priceModifier: 0,
          status: 'available',
          isAisle: true
        });
      } else {
        const seatNo = `${deckPrefix}${seatCounter}`;
        seatCounter++;

        // Match sample sold seats from screenshot (Row 0 right pair sold, Row 5 right window sold)
        let initialStatus = 'available';
        if (layoutPattern === '2-2') {
          if (r === 0 && (c === 3 || c === 4)) {
            initialStatus = 'booked';
          } else if (r === 5 && c === 4) {
            initialStatus = 'booked';
          }
        }

        rowCells.push({
          id: `cell-${r}-${c}`,
          type: defaultType,
          seatNumber: seatNo,
          price: defaultPrice,
          priceModifier: 0,
          status: initialStatus,
          isAisle: false
        });
      }
    }
    grid.push(rowCells);
  }
  return grid;
}

// Default Bus Fleet
export const DEFAULT_BUSES = [
  {
    id: 'bus-01',
    busNumber: 'DL 01 AB 7741',
    name: 'Himalayan Express Volvo 9600',
    operator: 'Awaara Fleet Operations',
    source: 'Delhi (Kashmere Gate)',
    destination: 'Manali (Mall Road)',
    departureTime: '19:30',
    arrivalTime: '08:30 (Next Day)',
    boardingPoints: ['Kashmere Gate ISBT', 'Majnu Ka Tilla', 'Karnal Bypass'],
    droppingPoints: ['Patlikuhal', 'Green Tax Barrier', 'Manali Mall Road'],
    templateId: 'tpl-2-1-sleeper',
    totalSeats: 30,
    status: 'Active'
  },
  {
    id: 'bus-02',
    busNumber: 'HR 26 CK 9902',
    name: 'Royal Rajputana Multi-Axle',
    operator: 'Awaara Royal Cruisers',
    source: 'Delhi (Aerocity)',
    destination: 'Jaipur & Udaipur',
    departureTime: '22:00',
    arrivalTime: '06:00 (Next Day)',
    boardingPoints: ['Aerocity Metro', 'Dhaula Kuan', 'IFFCO Chowk Gurgaon'],
    droppingPoints: ['Sindhi Camp Jaipur', 'Udaipur City Center'],
    templateId: 'tpl-2-2-seater',
    totalSeats: 40,
    status: 'Active'
  },
  {
    id: 'bus-03',
    busNumber: 'JK 02 BB 5510',
    name: 'Kashmir Valley Panorama Coach',
    operator: 'Awaara Alpine Shuttles',
    source: 'Jammu Tawi',
    destination: 'Srinagar (Dal Gate)',
    departureTime: '06:00',
    arrivalTime: '14:30',
    boardingPoints: ['Jammu Tawi Railway Stn', 'Katra Bypass'],
    droppingPoints: ['Anantnag', 'Pampore', 'Dal Gate Srinagar'],
    templateId: 'tpl-1-2-vip',
    totalSeats: 21,
    status: 'Active'
  }
];

// Default Trips
export const DEFAULT_TRIPS = [
  {
    id: 'manali',
    name: 'Manali Escape',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
    source: 'Delhi',
    destination: 'Manali',
    price: 18999,
    dates: '15–20 Oct 2026',
    duration: '5 Days',
    status: 'open',
    highlight: 'Great for first-timers',
    seats: 12,
    busId: 'bus-01',
    month: 'Oct',
    experience: 'Adventure'
  },
  {
    id: 'bali',
    name: 'Bali Bliss',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
    source: 'Mumbai / Delhi Airport',
    destination: 'Bali, Indonesia',
    price: 42999,
    dates: '10–16 Nov 2026',
    duration: '7 Days',
    status: 'limited',
    highlight: 'ONLY 5 SEATS LEFT',
    seats: 5,
    busId: 'bus-02',
    month: 'Nov',
    experience: 'Relaxation'
  },
  {
    id: 'kashmir',
    name: 'Kashmir Diaries',
    img: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=900&q=80',
    source: 'Jammu / Srinagar',
    destination: 'Kashmir Valley',
    price: 27999,
    dates: '5–10 Dec 2026',
    duration: '6 Days',
    status: 'open',
    highlight: 'Most loved trip',
    seats: 14,
    busId: 'bus-03',
    month: 'Dec',
    experience: 'Culture'
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan Royal Trail',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80',
    source: 'Delhi NCR',
    destination: 'Jaipur & Udaipur',
    price: 22999,
    dates: '20–24 Nov 2026',
    duration: '5 Days',
    status: 'open',
    highlight: 'Palace stays included',
    seats: 16,
    busId: 'bus-02',
    month: 'Nov',
    experience: 'Culture'
  },
  {
    id: 'spiti',
    name: 'Spiti Expedition',
    img: 'https://images.unsplash.com/photo-1626016570407-4bc2b6d7c7f4?auto=format&fit=crop&w=900&q=80',
    source: 'Shimla',
    destination: 'Kaza / Spiti',
    price: 31999,
    dates: '12–18 Dec 2026',
    duration: '7 Days',
    status: 'limited',
    highlight: 'ONLY 4 SEATS LEFT',
    seats: 4,
    busId: 'bus-01',
    month: 'Dec',
    experience: 'Adventure'
  }
];

// Sample Bookings Manifest
export const DEFAULT_BOOKINGS = [
  {
    id: 'WND-2026-881290',
    tripId: 'manali',
    tripName: 'Manali Escape',
    busId: 'bus-01',
    passengerName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98112 34567',
    seatsBooked: ['L1', 'L2'],
    totalAmount: 37998,
    status: 'CONFIRMED',
    bookingDate: '2026-09-07T14:22:00.000Z'
  },
  {
    id: 'WND-2026-449120',
    tripId: 'kashmir',
    tripName: 'Kashmir Diaries',
    busId: 'bus-03',
    passengerName: 'Priya Iyer',
    email: 'priya.iyer@example.com',
    phone: '+91 98450 12345',
    seatsBooked: ['V1'],
    totalAmount: 27999,
    status: 'CONFIRMED',
    bookingDate: '2026-09-08T09:15:00.000Z'
  }
];
