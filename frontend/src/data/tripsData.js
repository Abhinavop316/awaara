export const TRIPS = [
  {
    id: 'manali',
    name: 'Manali Escape',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
    price: 18999,
    dates: '15–20 Oct 2026',
    duration: '5 Days',
    durationDays: 5,
    status: 'open',
    highlight: 'Great for first-timers',
    seats: 12,
    month: 'Oct',
    experience: 'Adventure'
  },
  {
    id: 'bali',
    name: 'Bali Bliss',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
    price: 42999,
    dates: '10–16 Nov 2026',
    duration: '7 Days',
    durationDays: 7,
    status: 'limited',
    highlight: 'ONLY 5 SEATS LEFT',
    seats: 5,
    month: 'Nov',
    experience: 'Relaxation'
  },
  {
    id: 'kashmir',
    name: 'Kashmir Diaries',
    img: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=900&q=80',
    price: 27999,
    dates: '5–10 Dec 2026',
    duration: '6 Days',
    durationDays: 6,
    status: 'open',
    highlight: 'Most loved trip',
    seats: 14,
    month: 'Dec',
    experience: 'Culture'
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan Royal Trail',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80',
    price: 22999,
    dates: '20–24 Nov 2026',
    duration: '5 Days',
    durationDays: 5,
    status: 'open',
    highlight: 'Palace stays included',
    seats: 16,
    month: 'Nov',
    experience: 'Culture'
  },
  {
    id: 'spiti',
    name: 'Spiti Expedition',
    img: 'https://images.unsplash.com/photo-1626016570407-4bc2b6d7c7f4?auto=format&fit=crop&w=900&q=80',
    price: 31999,
    dates: '12–18 Dec 2026',
    duration: '7 Days',
    durationDays: 7,
    status: 'limited',
    highlight: 'ONLY 4 SEATS LEFT',
    seats: 4,
    month: 'Dec',
    experience: 'Adventure'
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya Explorer',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    price: 24999,
    dates: '8–13 Jan 2027',
    duration: '6 Days',
    durationDays: 6,
    status: 'soldout',
    highlight: 'Waitlist open',
    seats: 0,
    month: 'Jan',
    experience: 'Adventure'
  }
];

export const COMING_SOON = [
  {
    id: 'ladakh',
    name: 'Ladakh Winter',
    img: 'https://images.unsplash.com/photo-1589793907316-f94025b46850?auto=format&fit=crop&w=700&q=80',
    season: 'Expected Jan–Feb',
    desc: 'Frozen lakes, starlit skies, and the quiet of the high Himalayas.'
  },
  {
    id: 'japan',
    name: 'Japan Cherry Blossom',
    img: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=700&q=80',
    season: 'Expected March',
    desc: 'Sakura season across Tokyo, Kyoto and the countryside in between.'
  },
  {
    id: 'vietnam',
    name: 'Vietnam Explorer',
    img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=700&q=80',
    season: 'Expected April',
    desc: "From Hanoi's old quarter to the limestone cliffs of Ha Long Bay."
  },
  {
    id: 'georgia',
    name: 'Georgia Escape',
    img: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=700&q=80',
    season: 'Expected May',
    desc: "Mountain villages, ancient wine cellars, and Tbilisi's old town."
  }
];

export const ITINERARY_DAYS = [
  'Arrival & orientation walk',
  'Guided exploration of local highlights',
  'Free day for optional activities',
  'Signature experience day',
  'Departure & farewell brunch'
];

export const FAQS = [
  {
    question: 'How do I book a planned trip?',
    answer: 'Choose any trip marked Booking Open or Limited Seats, tap View Trip, then Book This Trip to start the guided booking flow.'
  },
  {
    question: 'What happens after I pay?',
    answer: 'You will see an instant confirmation screen with your booking ID, and a digital ticket you can download right away.'
  },
  {
    question: 'Will I receive a ticket?',
    answer: 'Yes — a downloadable digital ticket is generated the moment your booking is confirmed, with all your trip details on it.'
  },
  {
    question: 'Can I cancel my booking?',
    answer: 'Cancellations are accepted up to 7 days before departure, subject to the cancellation policy shown at checkout.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'UPI, credit or debit cards, and net banking are all supported at checkout.'
  },
  {
    question: 'What happens if a trip is Coming Soon?',
    answer: "It means the trip isn't finalized yet. Tell us you're interested and we'll notify you the moment it's ready to book."
  },
  {
    question: 'How will I know when a Coming Soon trip is planned?',
    answer: "We'll reach out over the channels you choose — email or WhatsApp — as soon as the trip is confirmed."
  },
  {
    question: 'Can I travel solo?',
    answer: 'Absolutely. Most of our trips are designed around small groups, so solo travellers are always welcome.'
  },
  {
    question: 'Are meals included?',
    answer: "Selected meals are included on every trip — the exact inclusions are listed on each trip's detail page."
  }
];

export const STATS = [
  { target: 2500, label: 'Happy travelers' },
  { target: 48, label: 'Trips curated' },
  { target: 14, label: 'Destinations' }
];

export const REVIEWS = [
  {
    quote: 'Everything was so beautifully planned. We just had to show up and enjoy.',
    author: 'Riya Mehta',
    trip: 'Kashmir Diaries'
  },
  {
    quote: 'Our Bali trip felt hand-picked just for us — every detail, sorted.',
    author: 'Arjun Nair',
    trip: 'Bali Bliss'
  },
  {
    quote: 'I travelled solo and never once felt like an afterthought.',
    author: 'Simran Kaur',
    trip: 'Spiti Expedition'
  }
];

export const DESTINATIONS_DATA = [
  {
    name: 'Kashmir',
    img: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1000&q=80',
    className: 'dest-large'
  },
  {
    name: 'Bali',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
    className: 'dest-medium'
  },
  {
    name: 'Manali',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=80',
    className: 'dest-medium2'
  },
  {
    name: 'Rajasthan',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=700&q=80',
    className: 'dest-small'
  }
];
