// Default Curated Trips Data for Admin Portal
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
    seats: 25,
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
    seats: 18,
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
    seats: 20,
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
    seats: 24,
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
    seats: 15,
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
    passengerName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98112 34567',
    seatsBooked: ['Seat 1', 'Seat 2'],
    totalAmount: 37998,
    status: 'CONFIRMED',
    bookingDate: '2026-09-07T14:22:00.000Z'
  },
  {
    id: 'WND-2026-449120',
    tripId: 'kashmir',
    tripName: 'Kashmir Diaries',
    passengerName: 'Priya Iyer',
    email: 'priya.iyer@example.com',
    phone: '+91 98450 12345',
    seatsBooked: ['Seat 1'],
    totalAmount: 27999,
    status: 'CONFIRMED',
    bookingDate: '2026-09-08T09:15:00.000Z'
  }
];
