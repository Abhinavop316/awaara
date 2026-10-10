const Place = require("../models/place.model");
const https = require("https");

// Curated high quality Indian holiday destinations & itineraries
const DEFAULT_SEEDED_PLACES = [
  {
    name: "Manali & Rohtang Pass Alpine Escape",
    state: "Himachal Pradesh",
    city: "Manali",
    category: "Hill Station",
    days: "5 Days / 4 Nights",
    durationDays: 5,
    price: 13999,
    bestTimeToVisit: "October to June",
    rating: 4.9,
    reviewsCount: 312,
    img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586500036706-41963de24d8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Experience the ultimate Himalayan holiday surrounded by snow-capped peaks, pine forests, pristine rivers, and vibrant cafe culture in Old Manali.",
    highlights: [
      "Rohtang Pass & Solang Valley Snow Sports",
      "Paragliding & Ziplining over lush valleys",
      "Historic Hadimba Devi Temple & Vashisht Hot Springs",
      "Old Manali Bohemian Cafes & Live Acoustic Music",
      "Jogini Waterfall Trek with panoramic mountain views"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Manali & Old Manali Exploration",
        description: "Arrive at Manali, check-in to mountain-view resort. Afternoon visit to Hadimba Temple, Tibetan Monastery, and relaxing stroll through Old Manali cafes.",
        activities: ["Hadimba Temple", "Club House", "Old Manali Cafes", "Mall Road Evening Walk"],
        meals: "Dinner Included",
        stay: "Mountain View Alpine Resort"
      },
      {
        day: 2,
        title: "Solang Valley Adventure & Anjani Mahadev",
        description: "Full day excursion to Solang Valley for thrilling snow activities, paragliding, zorbing, and short trek to Anjani Mahadev temple.",
        activities: ["Paragliding", "Zorbing / Quad Biking", "Solang Ropeway Cable Car"],
        meals: "Breakfast & Dinner Included",
        stay: "Mountain View Alpine Resort"
      },
      {
        day: 3,
        title: "Rohtang Pass / Atal Tunnel & Sissu Valley",
        description: "Drive through the engineering marvel Atal Tunnel into the pristine Lahaul Valley. Visit Sissu Waterfall and Rohtang Snow point.",
        activities: ["Atal Tunnel Crossing", "Sissu Waterfall & Lake", "Snow Activities at Rohtang"],
        meals: "Breakfast & Dinner Included",
        stay: "Mountain View Alpine Resort"
      },
      {
        day: 4,
        title: "Jogini Waterfall Trek & Vashisht Hot Springs",
        description: "Scenic 3km pine forest trek to the majestic Jogini Waterfalls. Afternoon dip in the natural therapeutic sulphur springs of Vashisht.",
        activities: ["Jogini Waterfall Trek", "Vashisht Hot Water Spring", "Souvenir Shopping"],
        meals: "Breakfast & Dinner Included",
        stay: "Mountain View Alpine Resort"
      },
      {
        day: 5,
        title: "Naggar Castle Heritage & Departure",
        description: "Visit historic Naggar Castle and Nicholas Roerich Art Gallery overlooking the Beas valley before bidding goodbye to the mountains.",
        activities: ["Naggar Castle Tour", "Trout Fish Tasting", "Departure Transfers"],
        meals: "Breakfast Included",
        stay: "Check-out"
      }
    ],
    attractions: ["Solang Valley", "Rohtang Pass", "Hadimba Temple", "Atal Tunnel", "Jogini Waterfall", "Naggar Castle"],
    inclusions: [
      "4 Nights accommodation in 4-Star Resort",
      "Daily Buffet Breakfast & Dinner",
      "Private AC Cab for all sightseeing & transfers",
      "Rohtang / Atal Tunnel permits",
      "Trek guide for Jogini Waterfall"
    ],
    exclusions: [
      "Adventure activities tickets",
      "Heater charges at hotel if extra",
      "Any entry tickets at monuments"
    ],
    coordinates: { lat: 32.2396, lng: 77.1887 },
    isFeatured: true
  },
  {
    name: "Kashmir Paradise: Srinagar, Gulmarg & Pahalgam",
    state: "Jammu & Kashmir",
    city: "Srinagar",
    category: "Romantic Getaway",
    days: "6 Days / 5 Nights",
    durationDays: 6,
    price: 24999,
    bestTimeToVisit: "March to December",
    rating: 4.95,
    reviewsCount: 420,
    img: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Witness heaven on earth with romantic Shikara rides on Dal Lake, meadow of flowers in Gulmarg, world's highest Gondola, and picturesque valleys in Pahalgam.",
    highlights: [
      "Luxury Houseboat stay on Dal Lake with Shikara Ride",
      "Gulmarg Gondola ride to Apharwat Peak (Phase 1 & 2)",
      "Betaab Valley, Aru Valley & Chandanwari in Pahalgam",
      "Mughal Gardens (Shalimar & Nishat Bagh)",
      "Authentic Kashmiri Wazwan Feast & Saffron Farm Tour"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Srinagar & Dal Lake Shikara Ride",
        description: "Welcome to Srinagar! Check-in to a traditional handcrafted wooden luxury houseboat. Evening sunset Shikara ride across the floating gardens and lotus lakes.",
        activities: ["Dal Lake Shikara Ride", "Floating Flower Market", "Kahwa Tea Welcome"],
        meals: "Dinner Included",
        stay: "Luxury Heritage Houseboat"
      },
      {
        day: 2,
        title: "Srinagar to Gulmarg Meadow of Flowers",
        description: "Drive to Gulmarg. Take the world-famous Gondola cable car ride up to Phase 2 for skiing and panoramic snowy views.",
        activities: ["Gulmarg Gondola Ride", "Golf Course View", "Snow Sledging"],
        meals: "Breakfast & Dinner",
        stay: "Gulmarg Alpine Resort"
      },
      {
        day: 3,
        title: "Gulmarg to Pahalgam - Valley of Shepherds",
        description: "Scenic drive along saffron fields of Pampore and apple orchards to Pahalgam. Evening walk along the gushing Lidder River.",
        activities: ["Saffron Fields Tour", "Lidder River Walk", "Pahalgam Market"],
        meals: "Breakfast & Dinner",
        stay: "Riverview Cottage Pahalgam"
      },
      {
        day: 4,
        title: "Pahalgam Valleys Excursion (Betaab & Aru)",
        description: "Visit the iconic Betaab Valley (Bollywood fame), lush meadows of Aru Valley, and Chandanwari glacier point.",
        activities: ["Betaab Valley", "Aru Valley", "Chandanwari", "Pony Ride to Baisaran"],
        meals: "Breakfast & Dinner",
        stay: "Riverview Cottage Pahalgam"
      },
      {
        day: 5,
        title: "Mughal Gardens & Srinagar Heritage",
        description: "Return to Srinagar. Explore Nishat Bagh, Shalimar Bagh, Chashme Shahi, and historic Shankaracharya Temple.",
        activities: ["Mughal Gardens", "Shankaracharya Temple", "Pashmina & Carpet Weaving Tour"],
        meals: "Breakfast & Dinner",
        stay: "Srinagar Boutique Hotel"
      },
      {
        day: 6,
        title: "Departure from Srinagar",
        description: "Enjoy breakfast overlooking the mountains and transfer to Srinagar International Airport.",
        activities: ["Airport Transfer"],
        meals: "Breakfast Included",
        stay: "Check-out"
      }
    ],
    attractions: ["Dal Lake", "Gulmarg Gondola", "Betaab Valley", "Aru Valley", "Nishat Bagh", "Shankaracharya Temple"],
    inclusions: [
      "1 Night in Luxury Houseboat + 4 Nights in 4-Star Hotels",
      "Daily Kashmiri Breakfast & Royal Dinner",
      "1 Hour Sunset Shikara Ride on Dal Lake",
      "Private Sedan/Innova for entire tour",
      "All toll taxes and parking"
    ],
    exclusions: ["Gondola tickets", "Pony rides in Pahalgam", "Airfare"],
    coordinates: { lat: 34.0837, lng: 74.7973 },
    isFeatured: true
  },
  {
    name: "Jaipur & Udaipur: Royal Heritage of Rajasthan",
    state: "Rajasthan",
    city: "Jaipur",
    category: "Heritage & Forts",
    days: "6 Days / 5 Nights",
    durationDays: 6,
    price: 19999,
    bestTimeToVisit: "October to March",
    rating: 4.88,
    reviewsCount: 280,
    img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Immerse yourself in grand maharaja palaces, golden desert sunsets, lakeside serenity, and vibrant bazaars in the Pink and White cities of Rajasthan.",
    highlights: [
      "Amer Fort, Nahargarh & Hawa Mahal in Jaipur",
      "Lake Pichola Sunset Boat Cruise in Udaipur",
      "City Palace & Saheliyon ki Bari in Udaipur",
      "Traditional Rajasthani Folk Dance & Chokhi Dhani Dinner",
      "Ranakpur Marble Jain Temples architectural marvel"
    ],
    itinerary: [
      {
        day: 1,
        title: "Welcome to Jaipur (Pink City)",
        description: "Arrive in Jaipur, check-in to heritage hotel. Evening visit to Birla Temple and colorful Bapu Bazaar.",
        activities: ["Bapu Bazaar", "Birla Temple", "Chokhi Dhani Cultural Dinner"],
        meals: "Dinner Included",
        stay: "Heritage Haveli Hotel Jaipur"
      },
      {
        day: 2,
        title: "Jaipur Forts & Palaces Full Day Tour",
        description: "Explore Amer Fort with panoramic views, Hawa Mahal, City Palace museum, and Jantar Mantar observatory.",
        activities: ["Amer Fort", "Hawa Mahal Photo Stop", "City Palace", "Jantar Mantar", "Jal Mahal"],
        meals: "Breakfast & Dinner",
        stay: "Heritage Haveli Hotel Jaipur"
      },
      {
        day: 3,
        title: "Jaipur to Pushkar & Jodhpur Enroute",
        description: "Drive towards Udaipur via sacred Pushkar Brahma Temple & holy lake. Witness desert culture.",
        activities: ["Pushkar Lake & Brahma Temple", "Rose Garden Walk"],
        meals: "Breakfast & Dinner",
        stay: "Pushkar Royal Camp / Hotel"
      },
      {
        day: 4,
        title: "Arrival in Udaipur & Lake Pichola Cruise",
        description: "Arrive in romantic Udaipur (City of Lakes). Sunset boat ride around Lake Pichola and Jag Mandir Island.",
        activities: ["Lake Pichola Boat Cruise", "Jag Mandir Island", "Bagore Ki Haveli Folk Show"],
        meals: "Breakfast & Dinner",
        stay: "Lakeside Heritage Resort Udaipur"
      },
      {
        day: 5,
        title: "Udaipur City Palace & Jagdish Temple",
        description: "Tour the opulent City Palace, vintage car collection, Saheliyon-Ki-Bari gardens, and Fateh Sagar Lake.",
        activities: ["City Palace Udaipur", "Saheliyon Ki Bari", "Fateh Sagar Sunset"],
        meals: "Breakfast & Dinner",
        stay: "Lakeside Heritage Resort Udaipur"
      },
      {
        day: 6,
        title: "Departure from Udaipur",
        description: "Morning shopping for miniature paintings and silver jewelry, followed by airport / station transfer.",
        activities: ["Handicraft Shopping", "Departure Transfer"],
        meals: "Breakfast Included",
        stay: "Check-out"
      }
    ],
    attractions: ["Amer Fort", "Hawa Mahal", "Lake Pichola", "City Palace Udaipur", "Pushkar Lake", "Nahargarh Fort"],
    inclusions: [
      "5 Nights in 4-Star Heritage properties",
      "Daily royal breakfast and dinner",
      "Private AC Chauffeur vehicle for all days",
      "Lake Pichola boat cruise tickets",
      "All state taxes and driver allowances"
    ],
    exclusions: ["Monument entry tickets", "Camel rides", "Camera fees"],
    coordinates: { lat: 26.9124, lng: 75.7873 },
    isFeatured: true
  },
  {
    name: "Kerala Backwaters, Munnar Hills & Alleppey",
    state: "Kerala",
    city: "Munnar",
    category: "Lakes & Nature",
    days: "5 Days / 4 Nights",
    durationDays: 5,
    price: 17499,
    bestTimeToVisit: "September to May",
    rating: 4.92,
    reviewsCount: 350,
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Soak in God's Own Country with aromatic rolling tea gardens in Munnar, spice plantations in Thekkady, and a private luxury houseboat cruise in Alleppey.",
    highlights: [
      "Overnight stay on Luxury Alleppey Houseboat with all meals",
      "Munnar Tea Gardens, Mattupetty Dam & Eravikulam National Park",
      "Thekkady Periyar Wildlife Sanctuary & Spice Plantation Tour",
      "Kathakali & Kalaripayattu martial arts cultural live performance",
      "Cheeyappara and Valara Waterfalls enroute"
    ],
    itinerary: [
      {
        day: 1,
        title: "Cochin to Munnar Tea Country",
        description: "Pickup from Cochin and scenic drive through Western Ghats, stopping by Cheeyappara and Valara waterfalls.",
        activities: ["Cheeyappara Waterfalls", "Spice Plantation Visit", "Tea Garden Sunset Walk"],
        meals: "Dinner Included",
        stay: "Munnar Hilltop Resort"
      },
      {
        day: 2,
        title: "Munnar Sightseeing & Nilgiri Tahr",
        description: "Full day sightseeing: Eravikulam National Park (home to Nilgiri Tahr), Tea Museum, Mattupetty Dam, and Echo Point.",
        activities: ["Eravikulam National Park", "Mattupetty Dam", "Echo Point", "Tea Museum"],
        meals: "Breakfast & Dinner",
        stay: "Munnar Hilltop Resort"
      },
      {
        day: 3,
        title: "Munnar to Thekkady (Periyar Wildlife)",
        description: "Drive to Thekkady. Bamboo rafting / boat safari on Periyar Lake to spot wild elephants. Watch evening Kalaripayattu martial arts show.",
        activities: ["Periyar Boat Safari", "Spice Shopping", "Kalaripayattu Show"],
        meals: "Breakfast & Dinner",
        stay: "Thekkady Jungle Lodge"
      },
      {
        day: 4,
        title: "Thekkady to Alleppey Houseboat Cruise",
        description: "Check-in at noon to a private deluxe houseboat. Cruise through serene palm-fringed backwaters, paddy fields, and lagoons.",
        activities: ["Backwater Cruising", "Village Life Sightseeing", "Fresh Kerala Fish Curry Dinner"],
        meals: "Lunch, Evening Tea & Dinner Included",
        stay: "Private Deluxe Houseboat"
      },
      {
        day: 5,
        title: "Alleppey to Cochin Departure",
        description: "Disembark after morning cruise and breakfast. Visit Fort Kochi Chinese Fishing Nets before flight/train departure.",
        activities: ["Fort Kochi Heritage Walk", "Chinese Fishing Nets", "Airport Transfer"],
        meals: "Breakfast Included",
        stay: "Check-out"
      }
    ],
    attractions: ["Munnar Tea Gardens", "Alleppey Houseboat", "Eravikulam National Park", "Periyar Lake", "Fort Kochi"],
    inclusions: [
      "1 Night Deluxe Private Houseboat with all 3 meals",
      "3 Nights in 4-Star Mountain/Jungle Resorts",
      "All transfers by private AC vehicle",
      "Spice plantation guided tour",
      "All driver allowances and toll charges"
    ],
    exclusions: ["National Park safari tickets", "Personal laundry/drinks"],
    coordinates: { lat: 10.0889, lng: 77.0595 },
    isFeatured: true
  },
  {
    name: "Goa Coastal Vibe & Sun-Kissed Beaches",
    state: "Goa",
    city: "Panaji",
    category: "Beach & Coastal",
    days: "4 Days / 3 Nights",
    durationDays: 4,
    price: 11499,
    bestTimeToVisit: "October to May",
    rating: 4.85,
    reviewsCount: 390,
    img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Unwind along golden sands, historic Portuguese villas in Fontainhas, vibrant beach shacks, scuba diving, and unforgettable ocean sunsets.",
    highlights: [
      "North Goa Beaches: Baga, Anjuna, Vagator & Chapora Fort",
      "South Goa Serenity: Palolem Beach & Colva Beach",
      "Fontainhas Latin Quarter colorful heritage walk",
      "Mandovi River Sunset Cruise with Goan music & dance",
      "Water sports package: Jet Ski, Parasailing & Banana Ride"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Goa & Beach Sunset Relaxation",
        description: "Arrive at Goa Airport / Madgaon Station. Check-in to beachside resort. Spend evening chilling at Calangute beach shacks with seafood and live music.",
        activities: ["Beach Shack Dinner", "Calangute Night Stroll"],
        meals: "Welcome Drink & Dinner",
        stay: "Beachside 4-Star Resort"
      },
      {
        day: 2,
        title: "North Goa Highlights & Water Sports",
        description: "Visit historic Aguada Fort overlooking the sea, Chapora Fort (Dil Chahta Hai point), and enjoy thrilling watersports at Baga Beach.",
        activities: ["Aguada Fort", "Chapora Fort", "Parasailing & Jet Ski", "Anjuna Flea Market"],
        meals: "Breakfast & Dinner",
        stay: "Beachside 4-Star Resort"
      },
      {
        day: 3,
        title: "Old Goa Heritage & Latin Quarter Fontainhas",
        description: "Visit Basilica of Bom Jesus (UNESCO site), Se Cathedral, and walk through the pastel Portuguese alleys of Fontainhas. Evening Mandovi luxury cruise.",
        activities: ["Basilica of Bom Jesus", "Fontainhas Latin Quarter", "Mandovi River Cruise"],
        meals: "Breakfast & Dinner",
        stay: "Beachside 4-Star Resort"
      },
      {
        day: 4,
        title: "South Goa Beaches & Departure",
        description: "Relax at scenic Palolem crescent beach or do souvenir shopping for feni and cashew nuts before departure.",
        activities: ["Palolem Beach View", "Shopping", "Airport Drop"],
        meals: "Breakfast Included",
        stay: "Check-out"
      }
    ],
    attractions: ["Baga Beach", "Aguada Fort", "Chapora Fort", "Basilica of Bom Jesus", "Fontainhas", "Palolem Beach"],
    inclusions: [
      "3 Nights in 4-Star Beachside Resort with Swimming Pool",
      "Daily Buffet Breakfast & Dinner",
      "Mandovi River Sunset Cruise ticket",
      "Sightseeing by private AC car",
      "Airport / Railway pickup and drop"
    ],
    exclusions: ["Watersports fees", "Club entry fees"],
    coordinates: { lat: 15.4909, lng: 73.8278 },
    isFeatured: true
  },
  {
    name: "Ladakh: High Passes, Pangong Tso & Nubra Valley",
    state: "Ladakh",
    city: "Leh",
    category: "Adventure & Treks",
    days: "7 Days / 6 Nights",
    durationDays: 7,
    price: 29999,
    bestTimeToVisit: "May to October",
    rating: 4.96,
    reviewsCount: 295,
    img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Embark on an epic Himalayan expedition through the world's highest motorable passes, turquoise Pangong Lake, sand dunes of Nubra, and ancient Buddhist monasteries.",
    highlights: [
      "World's Highest Motorable Roads: Khardung La & Chang La",
      "Night camping under starlit skies at Pangong Tso Lake",
      "Double-humped Bactrian Camel Safari in Hunder Sand Dunes",
      "Magnetic Hill & Confluence of Indus and Zanskar Rivers",
      "Thiksey & Diskit Monasteries with giant Buddha Statue"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Leh & Complete Acclimatization",
        description: "Fly into Leh Kushok Bakula Rimpochee Airport. Rest full day for altitude acclimatization. Evening easy walk to Leh Market & Shanti Stupa.",
        activities: ["Leh Main Bazaar", "Shanti Stupa Sunset"],
        meals: "Dinner Included",
        stay: "Heritage Hotel Leh"
      },
      {
        day: 2,
        title: "Sham Valley: Magnetic Hill & Sangam Confluence",
        description: "Visit Hall of Fame military museum, Magnetic Hill gravity defiance, Gurudwara Pathar Sahib, and Sangam (confluence of Indus & Zanskar rivers).",
        activities: ["Magnetic Hill", "Sangam Confluence", "Hall of Fame", "Spituk Monastery"],
        meals: "Breakfast & Dinner",
        stay: "Heritage Hotel Leh"
      },
      {
        day: 3,
        title: "Leh to Nubra Valley via Khardung La (18,380 ft)",
        description: "Drive over legendary Khardung La Pass into Nubra Valley. Visit Diskit Monastery's 106ft Maitreya Buddha and ride double-humped camels in Hunder dunes.",
        activities: ["Khardung La Pass", "Diskit Monastery", "Hunder Camel Safari"],
        meals: "Breakfast & Dinner",
        stay: "Deluxe Swiss Tent Camp Nubra"
      },
      {
        day: 4,
        title: "Nubra Valley to Pangong Lake via Shyok River",
        description: "Scenic off-road drive along the wild Shyok River to the surreal Pangong Tso Lake (14,270 ft) which changes colors through the day.",
        activities: ["Shyok River Route", "Pangong Lake Sunset", "Stargazing & Milky Way Photography"],
        meals: "Breakfast & Dinner",
        stay: "Luxury Glamping Cottages Pangong"
      },
      {
        day: 5,
        title: "Pangong Lake Sunrise to Leh via Chang La",
        description: "Witness breathtaking sunrise over Pangong Lake. Return to Leh crossing Chang La Pass (17,590 ft) and Thiksey Monastery.",
        activities: ["Pangong Sunrise", "Chang La Pass", "Thiksey Monastery", "Shey Palace"],
        meals: "Breakfast & Dinner",
        stay: "Heritage Hotel Leh"
      },
      {
        day: 6,
        title: "Leh Local Discovery & Souvenir Shopping",
        description: "Visit Hemis Monastery, Stok Palace Museum, and shop for authentic Ladakhi handicrafts, pashmina, and dried apricots.",
        activities: ["Hemis Monastery", "Stok Palace", "Tibetan Market"],
        meals: "Breakfast & Dinner",
        stay: "Heritage Hotel Leh"
      },
      {
        day: 7,
        title: "Departure from Leh",
        description: "Transfer to Leh Airport with unforgettable memories of the rooftop of the world.",
        activities: ["Airport Drop"],
        meals: "Breakfast Included",
        stay: "Check-out"
      }
    ],
    attractions: ["Pangong Lake", "Khardung La", "Nubra Valley", "Diskit Monastery", "Magnetic Hill", "Shanti Stupa"],
    inclusions: [
      "6 Nights Deluxe Hotel & Glamping Swiss Camps",
      "Daily Breakfast and Dinner",
      "Protected Area Permits & Inner Line Permits",
      "Dedicated 4x4 / Tempo Traveller for high altitude",
      "Oxygen cylinder in vehicle for emergencies"
    ],
    exclusions: ["Camel safari charges", "Monastery entry fees", "Flights"],
    coordinates: { lat: 34.1526, lng: 77.5771 },
    isFeatured: true
  },
  {
    name: "Rishikesh & Haridwar: Yoga, Ganga Aarti & Rafting",
    state: "Uttarakhand",
    city: "Rishikesh",
    category: "Spiritual & Pilgrimage",
    days: "4 Days / 3 Nights",
    durationDays: 4,
    price: 9999,
    bestTimeToVisit: "September to June",
    rating: 4.87,
    reviewsCount: 230,
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Blend spirituality with adrenaline in the Yoga Capital of the World: majestic Ganga Aarti, white water river rafting, bungee jumping, and serene Himalayan ashrams.",
    highlights: [
      "Triveni Ghat & Parmarth Niketan Evening Ganga Aarti",
      "16km White Water River Rafting through Grade III/IV rapids",
      "Beatles Ashram (Chaurasi Kutia) & Laxman Jhula",
      "Har Ki Pauri divine evening rituals in Haridwar",
      "Neer Garh Waterfall nature trek & cliff jumping"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Rishikesh & Riverside Camping",
        description: "Arrive in Rishikesh. Check-in to riverside luxury camp or resort. Evening witness the divine Ganga Aarti at Parmarth Niketan.",
        activities: ["Parmarth Niketan Ganga Aarti", "Ram Jhula Walk", "Riverside Bonfire"],
        meals: "Dinner Included",
        stay: "Riverside Luxury Camp"
      },
      {
        day: 2,
        title: "White Water Rafting & Cliff Jumping",
        description: "Experience exhilarating 16km Ganga rafting from Shivpuri with rapids like Roller Coaster and Golf Course. Cliff jumping and body surfing included.",
        activities: ["16km River Rafting", "Cliff Jumping", "Maggi Point & Tea"],
        meals: "Breakfast & Dinner",
        stay: "Riverside Luxury Camp"
      },
      {
        day: 3,
        title: "Beatles Ashram & Haridwar Har Ki Pauri",
        description: "Explore the historic Beatles Ashram with vibrant graffiti murals. Afternoon drive to Haridwar to attend the world-famous Har Ki Pauri Maha Aarti.",
        activities: ["Beatles Ashram", "Neer Garh Waterfall Trek", "Har Ki Pauri Aarti"],
        meals: "Breakfast & Dinner",
        stay: "Rishikesh Resort"
      },
      {
        day: 4,
        title: "Morning Yoga Session & Departure",
        description: "Sunrise yoga and meditation session by the river Ganges, followed by breakfast and departure.",
        activities: ["Sunrise Yoga", "Souvenir & Rudraksha Shopping", "Departure"],
        meals: "Breakfast Included",
        stay: "Check-out"
      }
    ],
    attractions: ["Ram Jhula", "Laxman Jhula", "Triveni Ghat", "Beatles Ashram", "Shivpuri Rafting", "Har Ki Pauri"],
    inclusions: [
      "3 Nights luxury camp / resort stay",
      "16km White Water Rafting with safety gear & certified instructor",
      "Daily Breakfast & Dinner + Evening Bonfire & Snacks",
      "All transfers between Haridwar & Rishikesh"
    ],
    exclusions: ["Bungee jumping / Giant swing fees", "Personal expenses"],
    coordinates: { lat: 30.0869, lng: 78.2676 },
    isFeatured: true
  },
  {
    name: "Sikkim & Darjeeling: Kanchenjunga & Toy Train",
    state: "Sikkim",
    city: "Gangtok",
    category: "Hill Station",
    days: "6 Days / 5 Nights",
    durationDays: 6,
    price: 21999,
    bestTimeToVisit: "March to May & October to December",
    rating: 4.91,
    reviewsCount: 198,
    img: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Marvel at the world's 3rd highest peak Mt. Kanchenjunga, sacred glacial Tsomgo Lake, Nathula Pass, organic monasteries, and historic Darjeeling Himalayan Railway.",
    highlights: [
      "Glacial Tsomgo (Changu) Lake & Baba Mandir at 12,400 ft",
      "Darjeeling Tiger Hill sunrise over Mt. Kanchenjunga",
      "UNESCO World Heritage Darjeeling Himalayan Toy Train Ride",
      "Rumtek & Enchey Monasteries and Gangtok MG Marg",
      "Happy Valley Tea Estate tea tasting tour"
    ],
    itinerary: [
      {
        day: 1,
        title: "Bagdogra / NJP to Gangtok",
        description: "Arrive at Bagdogra Airport / NJP Station. Scenic uphill drive following the emerald Teesta River into Gangtok. Evening stroll on pedestrian MG Marg.",
        activities: ["Teesta River View", "MG Marg Shopping & Momos"],
        meals: "Dinner Included",
        stay: "Gangtok Boutique Hotel"
      },
      {
        day: 2,
        title: "Tsomgo Glacial Lake & Baba Mandir",
        description: "High altitude excursion to the sacred frozen Tsomgo Lake (12,400 ft) and historical Baba Harbhajan Singh Mandir.",
        activities: ["Tsomgo Lake Yak Ride", "Baba Mandir", "Nathula Pass View"],
        meals: "Breakfast & Dinner",
        stay: "Gangtok Boutique Hotel"
      },
      {
        day: 3,
        title: "Gangtok Local Monasteries & Ropeway",
        description: "Explore Rumtek Monastery, Do Drul Chorten, Namgyal Institute of Tibetology, and Gangtok Cable Car Ropeway.",
        activities: ["Rumtek Monastery", "Gangtok Ropeway", "Banjhakri Falls"],
        meals: "Breakfast & Dinner",
        stay: "Gangtok Boutique Hotel"
      },
      {
        day: 4,
        title: "Gangtok to Darjeeling (Queen of Hills)",
        description: "Drive through tea garden slopes to Darjeeling. Visit Batasia Loop, Ghoom Monastery, and Peace Pagoda.",
        activities: ["Batasia Loop", "Ghoom Monastery", "Darjeeling Mall Chowrasta"],
        meals: "Breakfast & Dinner",
        stay: "Darjeeling Colonial Heritage Hotel"
      },
      {
        day: 5,
        title: "Tiger Hill Sunrise & Himalayan Toy Train",
        description: "Early 4:00 AM trip to Tiger Hill for the world-famous golden sunrise illuminating Mt. Kanchenjunga. Afternoon ride on the heritage Toy Train.",
        activities: ["Tiger Hill Sunrise", "Darjeeling Toy Train Joyride", "Tea Estate Walk"],
        meals: "Breakfast & Dinner",
        stay: "Darjeeling Colonial Heritage Hotel"
      },
      {
        day: 6,
        title: "Darjeeling to Bagdogra Departure",
        description: "Morning fresh Darjeeling tea tasting and scenic drive back to Bagdogra / NJP for onward flight.",
        activities: ["Tea Tasting", "Airport Drop"],
        meals: "Breakfast Included",
        stay: "Check-out"
      }
    ],
    attractions: ["Tsomgo Lake", "Tiger Hill", "Rumtek Monastery", "Darjeeling Toy Train", "Batasia Loop", "MG Marg"],
    inclusions: [
      "5 Nights 4-Star Mountain Hotel Stay",
      "Daily Breakfast & Dinner",
      "Tsomgo Lake & Baba Mandir Special Permits",
      "Private AC / SUV vehicle throughout the tour",
      "Toy train joyride booking assistance"
    ],
    exclusions: ["Nathula Pass optional permit fees", "Camera tickets"],
    coordinates: { lat: 27.3389, lng: 88.6065 },
    isFeatured: true
  },
  {
    name: "Andaman Islands: Havelock, Neil & Radhanagar Beach",
    state: "Andaman & Nicobar",
    city: "Port Blair",
    category: "Beach & Coastal",
    days: "6 Days / 5 Nights",
    durationDays: 6,
    price: 26999,
    bestTimeToVisit: "October to May",
    rating: 4.97,
    reviewsCount: 310,
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Discover Asia's best beach at Radhanagar, crystal clear turquoise waters, scuba diving with coral reefs, and the poignant history of Cellular Jail.",
    highlights: [
      "Asia's #1 Ranked Radhanagar Beach (Beach No. 7) Sunset",
      "High-speed Catamaran Cruise (Makruzz / Nautika) to Havelock Island",
      "Scuba Diving & Sea Walk at Elephant Beach with vibrant coral reefs",
      "Cellular Jail Light & Sound Historical Show in Port Blair",
      "Natural Coral Bridge and Laxmanpur Sunset at Neil Island"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Port Blair & Cellular Jail",
        description: "Arrive at Veer Savarkar International Airport. Visit historical Cellular Jail and witness the patriotic Light & Sound show in the evening.",
        activities: ["Cellular Jail Tour", "Light & Sound Show", "Corbyn's Cove Beach"],
        meals: "Dinner Included",
        stay: "Port Blair Sea View Hotel"
      },
      {
        day: 2,
        title: "High-Speed Ferry to Havelock & Radhanagar Beach",
        description: "Board luxury cruise to Swaraj Dweep (Havelock Island). Check-in to beachside resort. Spend evening swimming at pristine Radhanagar Beach.",
        activities: ["Cruise Ride", "Radhanagar Beach Sunset Swimming"],
        meals: "Breakfast & Dinner",
        stay: "Havelock Island Beach Resort"
      },
      {
        day: 3,
        title: "Elephant Beach Coral Reefs & Watersports",
        description: "Speedboat to Elephant Beach for thrilling snorkeling, jet ski, banana rides, and discovering vibrant marine corals.",
        activities: ["Snorkeling", "Glass Bottom Boat Ride", "Scuba Diving (Optional)"],
        meals: "Breakfast & Dinner",
        stay: "Havelock Island Beach Resort"
      },
      {
        day: 4,
        title: "Havelock to Neil Island (Shaheed Dweep)",
        description: "Ferry to peaceful Neil Island. Explore Bharatpur Beach coral reef, natural limestone rock bridge, and Laxmanpur sunset point.",
        activities: ["Natural Bridge", "Bharatpur Beach", "Laxmanpur Sunset"],
        meals: "Breakfast & Dinner",
        stay: "Neil Island Resort"
      },
      {
        day: 5,
        title: "Neil Island to Port Blair",
        description: "Morning ferry back to Port Blair. Visit Sagarika Emporium for pearl jewelry, seashells, and wooden crafts.",
        activities: ["Shopping in Port Blair", "Chidiya Tapu Sunset Point"],
        meals: "Breakfast & Dinner",
        stay: "Port Blair Sea View Hotel"
      },
      {
        day: 6,
        title: "Departure from Port Blair",
        description: "Transfer to airport with tropical island memories.",
        activities: ["Airport Drop"],
        meals: "Breakfast Included",
        stay: "Check-out"
      }
    ],
    attractions: ["Radhanagar Beach", "Cellular Jail", "Elephant Beach", "Neil Island Natural Bridge", "Chidiya Tapu"],
    inclusions: [
      "5 Nights in 4-Star Beach Resorts",
      "High-speed Catamaran Cruise tickets (Port Blair - Havelock - Neil - Port Blair)",
      "Daily Breakfast & Dinner",
      "Complimentary Snorkeling session at Elephant Beach",
      "All private airport & jetty transfers"
    ],
    exclusions: ["Scuba diving charges", "Personal expenses"],
    coordinates: { lat: 11.6234, lng: 92.7265 },
    isFeatured: true
  },
  {
    name: "Varanasi Ghats: Ganga Aarti & Spiritual Legacy",
    state: "Uttar Pradesh",
    city: "Varanasi",
    category: "Spiritual & Pilgrimage",
    days: "3 Days / 2 Nights",
    durationDays: 3,
    price: 7999,
    bestTimeToVisit: "October to March",
    rating: 4.89,
    reviewsCount: 260,
    img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Experience the timeless spiritual capital of India on the banks of holy river Ganga: ancient temples, morning sunrise boat rides, and mesmerizing Dashashwamedh Ghat Aarti.",
    highlights: [
      "Sunrise Boat Ride across 84 Ghats along the Ganges",
      "Grand Evening Maha Ganga Aarti at Dashashwamedh Ghat",
      "Kashi Vishwanath Corridor & Temple Darshan",
      "Sarnath Buddhist Pilgrimage & Dhamek Stupa",
      "Famous Banarasi Silk Sari weaving & street food tour (Kachori, Paan, Malaiyo)"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kashi & Evening Maha Aarti",
        description: "Arrive in Varanasi. Check-in to heritage hotel near the Ghats. In the evening, watch the grand Dashashwamedh Ghat Ganga Aarti from a reserved boat.",
        activities: ["Dashashwamedh Ghat Aarti", "Evening Boat View", "Street Food Walk"],
        meals: "Dinner Included",
        stay: "Ghatside Heritage Haveli"
      },
      {
        day: 2,
        title: "Subah-e-Banaras & Kashi Vishwanath Corridor",
        description: "Early morning boat ride from Assi Ghat to Manikarnika Ghat witnessing morning rituals. Visit Kashi Vishwanath Jyotirlinga Temple, Annapurna Temple, and Kaal Bhairav.",
        activities: ["Sunrise Boat Ride", "Kashi Vishwanath Temple", "Kaal Bhairav", "Banarasi Silk Sari Weaver Tour"],
        meals: "Breakfast & Dinner",
        stay: "Ghatside Heritage Haveli"
      },
      {
        day: 3,
        title: "Sarnath Excursion & Departure",
        description: "Excursion to Sarnath where Lord Buddha preached his first sermon. Visit Dhamek Stupa, Archaeological Museum (Ashoka Lion Capital), and depart.",
        activities: ["Sarnath Stupa Tour", "Ashoka Pillar Museum", "Departure Drop"],
        meals: "Breakfast Included",
        stay: "Check-out"
      }
    ],
    attractions: ["Dashashwamedh Ghat", "Kashi Vishwanath Temple", "Assi Ghat", "Sarnath Stupa", "Manikarnika Ghat"],
    inclusions: [
      "2 Nights in Heritage Hotel near Ghats",
      "Private Sunrise & Sunset Boat rides on Ganges",
      "Daily Breakfast & Dinner",
      "Guided Walking tour of old Varanasi alleys",
      "Airport / Railway Station AC transfers"
    ],
    exclusions: ["Special VIP Darshan tickets", "Personal expenses"],
    coordinates: { lat: 25.3176, lng: 82.9739 },
    isFeatured: true
  },
  {
    name: "Meghalaya: Living Root Bridges, Cherrapunji & Dawki",
    state: "Meghalaya",
    city: "Shillong",
    category: "Lakes & Nature",
    days: "5 Days / 4 Nights",
    durationDays: 5,
    price: 18999,
    bestTimeToVisit: "September to May",
    rating: 4.94,
    reviewsCount: 220,
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Explore the Abode of Clouds: bio-engineered Double Decker Living Root Bridges, crystal clear Umngot River in Dawki, and thunderous waterfalls in Cherrapunji.",
    highlights: [
      "Nongriat Double Decker Living Root Bridge Trek",
      "Crystal Clear Dawki River Boating (looks like flying boats)",
      "Nohkalikai Falls & Seven Sisters Waterfalls in Cherrapunji",
      "Mawlynnong - Asia's Cleanest Village",
      "Mawsmai Limestone Caves exploration"
    ],
    itinerary: [
      {
        day: 1,
        title: "Guwahati to Shillong (Scotland of the East)",
        description: "Pickup from Guwahati Airport. Drive past picturesque Umiam Lake (Barapani). Check-in at Shillong and explore Police Bazar.",
        activities: ["Umiam Lake Boating", "Police Bazar Walk"],
        meals: "Dinner Included",
        stay: "Shillong Pine Resort"
      },
      {
        day: 2,
        title: "Cherrapunji Waterfalls & Mawsmai Caves",
        description: "Drive to Sohra (Cherrapunji). Visit Nohkalikai Falls (tallest plunge waterfall in India), Wei Sawdong three-tier falls, and Mawsmai Caves.",
        activities: ["Nohkalikai Falls", "Wei Sawdong Waterfall", "Mawsmai Caves", "Seven Sisters View"],
        meals: "Breakfast & Dinner",
        stay: "Cherrapunji Valley Resort"
      },
      {
        day: 3,
        title: "Double Decker Living Root Bridge Trek",
        description: "Trek down 3,000 steps into the lush rainforest of Tyrna to the ancient 200-year-old Double Decker Living Root Bridge and natural blue swimming pools.",
        activities: ["Living Root Bridge Trek", "Rainbow Falls", "Natural Lagoon Swimming"],
        meals: "Breakfast & Dinner",
        stay: "Cherrapunji Valley Resort"
      },
      {
        day: 4,
        title: "Mawlynnong Cleanest Village & Dawki Clear Waters",
        description: "Visit Asia's cleanest village Mawlynnong. Continue to Indo-Bangladesh border at Dawki and boat on the transparent Umngot River.",
        activities: ["Mawlynnong Village Tour", "Dawki River Boating", "Single Root Bridge"],
        meals: "Breakfast & Dinner",
        stay: "Shillong Pine Resort"
      },
      {
        day: 5,
        title: "Laitlum Canyons & Departure",
        description: "Visit the breathtaking gorges of Laitlum Canyons before driving back to Guwahati Airport.",
        activities: ["Laitlum Canyons", "Airport Transfer"],
        meals: "Breakfast Included",
        stay: "Check-out"
      }
    ],
    attractions: ["Double Decker Living Root Bridge", "Dawki River", "Nohkalikai Falls", "Mawlynnong", "Umiam Lake"],
    inclusions: [
      "4 Nights in 4-Star Resort / Premium Homestays",
      "Daily Breakfast & Dinner",
      "Private SUV vehicle throughout Meghalaya",
      "Local Khasi guide for Root Bridge trek",
      "Dawki river boating charges"
    ],
    exclusions: ["Personal trekking gear", "Airfare to Guwahati"],
    coordinates: { lat: 25.5788, lng: 91.8933 },
    isFeatured: true
  },
  {
    name: "Coorg & Ooty: Coffee Plantations & Nilgiri Hills",
    state: "Karnataka",
    city: "Coorg",
    category: "Hill Station",
    days: "5 Days / 4 Nights",
    durationDays: 5,
    price: 15499,
    bestTimeToVisit: "September to April",
    rating: 4.86,
    reviewsCount: 185,
    img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Immerse in lush coffee estates of Coorg (Scotland of India) and the mist-laden Nilgiri tea estates and botanical gardens of Ooty.",
    highlights: [
      "Private Coffee Estate walk with fresh brew tasting in Madikeri",
      "Abbey Falls & Raja's Seat sunset point in Coorg",
      "Dubare Elephant Camp interaction & river rafting",
      "Nilgiri Mountain Railway Toy Train ride to Ooty",
      "Ooty Lake boating & Doddabetta Peak (highest in Nilgiris)"
    ],
    itinerary: [
      {
        day: 1,
        title: "Bangalore / Mysore to Coorg Coffee Country",
        description: "Drive to Coorg via Bylakuppe Golden Temple (Tibetan monastery). Check-in to coffee plantation estate resort.",
        activities: ["Namdroling Golden Temple", "Coffee Plantation Walk", "Evening Campfire"],
        meals: "Dinner Included",
        stay: "Coorg Plantation Resort"
      },
      {
        day: 2,
        title: "Coorg Sightseeing & Waterfalls",
        description: "Visit Dubare Elephant Camp, Abbey Falls surrounded by spice trees, and Raja's Seat for sweeping sunset views.",
        activities: ["Dubare Elephant Camp", "Abbey Falls", "Raja's Seat", "Madikeri Fort"],
        meals: "Breakfast & Dinner",
        stay: "Coorg Plantation Resort"
      },
      {
        day: 3,
        title: "Coorg to Ooty via Bandipur Tiger Reserve",
        description: "Scenic jungle drive through Bandipur and Mudumalai National Parks. Ascend 36 hairpin bends to charming Ooty.",
        activities: ["Jungle Safari Route", "Nilgiri Mountain Views"],
        meals: "Breakfast & Dinner",
        stay: "Ooty Heritage Resort"
      },
      {
        day: 4,
        title: "Ooty & Coonoor Nilgiri Mountain Train",
        description: "Ride the heritage Nilgiri Toy Train to Coonoor. Visit Sim's Park, Dolphin's Nose view point, Ooty Botanical Gardens, and Ooty Lake.",
        activities: ["Toy Train Joyride", "Sim's Park", "Doddabetta Peak", "Ooty Lake Boating"],
        meals: "Breakfast & Dinner",
        stay: "Ooty Heritage Resort"
      },
      {
        day: 5,
        title: "Ooty to Coimbatore / Bangalore Departure",
        description: "Shop for homemade Nilgiri chocolates and eucalyptus oil before transfer to airport / railway station.",
        activities: ["Chocolate Shopping", "Departure Drop"],
        meals: "Breakfast Included",
        stay: "Check-out"
      }
    ],
    attractions: ["Abbey Falls", "Golden Temple Bylakuppe", "Ooty Lake", "Doddabetta Peak", "Nilgiri Toy Train"],
    inclusions: [
      "4 Nights in 4-Star Plantation & Heritage Resorts",
      "Daily Breakfast & Dinner",
      "Dedicated Private AC Sedan/SUV",
      "Coffee plantation guided tour with tasting",
      "All toll taxes and parking"
    ],
    exclusions: ["Toy train tickets", "Elephant bath activity fees"],
    coordinates: { lat: 12.4244, lng: 75.7382 },
    isFeatured: true
  },
  {
    name: "Jaisalmer: Golden Fort & Thar Desert Safari",
    state: "Rajasthan",
    city: "Jaisalmer",
    category: "Heritage & Forts",
    days: "4 Days / 3 Nights",
    durationDays: 4,
    price: 12999,
    bestTimeToVisit: "October to March",
    rating: 4.93,
    reviewsCount: 245,
    img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Step into Arabian Nights amidst golden yellow sandstone fortresses, intricately carved havelis, camel rides over Sam Sand Dunes, and desert camp cultural nights.",
    highlights: [
      "Overnight Swiss Tent stay at Sam Sand Dunes with campfire & Kalbelia dance",
      "Camel Safari & 4x4 Dune Bashing on rolling desert dunes",
      "Living Jaisalmer Golden Fort (Sonar Qila) & Patwon Ki Haveli",
      "Gadisar Lake sunset boating surrounded by historic chhatris",
      "Haunted village of Kuldhara heritage exploration"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Jaisalmer & Gadisar Lake",
        description: "Arrive in Jaisalmer. Check-in to golden stone haveli hotel. Evening sunset boating at picturesque Gadisar Lake.",
        activities: ["Gadisar Lake", "Local Market Stroll", "Rajasthani Thali Dinner"],
        meals: "Dinner Included",
        stay: "Golden Haveli Hotel"
      },
      {
        day: 2,
        title: "Jaisalmer Fort & Patwon Ki Haveli",
        description: "Tour the famous living fort Sonar Qila, Jain Temples, Patwon Ki Haveli, and Salim Singh Ki Haveli.",
        activities: ["Jaisalmer Fort", "Patwon Ki Haveli", "Jain Temples", "Nathmal Haveli"],
        meals: "Breakfast & Dinner",
        stay: "Golden Haveli Hotel"
      },
      {
        day: 3,
        title: "Kuldhara Haunted Village & Sam Desert Dunes Camping",
        description: "Visit abandoned ghost village of Kuldhara. Arrive at Sam Sand Dunes for camel safari, thrilling jeep dune bashing, followed by Rajasthani folk dance & music under the stars.",
        activities: ["Kuldhara Ghost Village", "Camel Safari", "4x4 Dune Bashing", "Kalbelia Folk Dance & Campfire"],
        meals: "Breakfast & Royal Desert Dinner",
        stay: "Royal Luxury Swiss Tent at Sam Dunes"
      },
      {
        day: 4,
        title: "Desert Sunrise & Departure",
        description: "Watch sunrise over golden dunes, enjoy traditional breakfast, and transfer to Jaisalmer station / airport.",
        activities: ["Dune Sunrise", "Departure Drop"],
        meals: "Breakfast Included",
        stay: "Check-out"
      }
    ],
    attractions: ["Jaisalmer Fort", "Sam Sand Dunes", "Gadisar Lake", "Patwon Ki Haveli", "Kuldhara Village"],
    inclusions: [
      "1 Night Luxury Swiss Tent at Sam Dunes + 2 Nights Heritage Haveli",
      "Daily Breakfast & Dinner",
      "Camel Safari & Cultural Folk Show with Bonfire",
      "Private AC Car for all transfers"
    ],
    exclusions: ["Jeep Dune bashing optional add-on", "Monument entries"],
    coordinates: { lat: 26.9157, lng: 70.9083 },
    isFeatured: true
  }
];

// Helper to make HTTPS requests to external travel APIs
const fetchJsonHttps = (url, headers = {}) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: "GET",
      headers: {
        "User-Agent": "AwaaraTravel/1.0 (India Places & Stays Explorer)",
        "Accept": "application/json",
        ...headers
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve({ error: "Failed to parse JSON response", raw: data });
        }
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({ error: "Request timed out" });
    });

    req.on("error", (err) => {
      console.warn("HTTPS Request error:", err.message);
      resolve({ error: err.message });
    });

    req.end();
  });
};


// GET /api/places - Get all places with pagination, search, state/city filters
exports.getAllPlaces = async (req, res) => {
  try {
    const {
      search,
      state,
      city,
      category,
      days,
      minPrice,
      maxPrice,
      page = 1,
      limit = 9,
      sort = "featured"
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 9));
    const skip = (pageNum - 1) * limitNum;

    const query = { status: { $ne: "draft" } };

    if (search && search.trim() !== "" && search !== "undefined") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: regex },
        { city: regex },
        { state: regex },
        { category: regex },
        { overview: regex },
        { highlights: regex },
        { attractions: regex }
      ];
    }

    if (state && state !== "All" && state !== "all" && state !== "undefined" && state.trim() !== "") {
      query.state = new RegExp(`^${state.trim()}$`, "i");
    }

    if (city && city !== "All" && city !== "all" && city !== "undefined" && city.trim() !== "") {
      query.city = new RegExp(`^${city.trim()}$`, "i");
    }

    if (category && category !== "All" && category !== "all" && category !== "undefined" && category.trim() !== "") {
      query.category = category;
    }

    if (days && days !== "All" && days !== "undefined") {
      const daysNum = parseInt(days, 10);
      if (!isNaN(daysNum)) {
        query.durationDays = daysNum;
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { isFeatured: -1, rating: -1, createdAt: -1 };
    if (sort === "price-low") sortOption = { price: 1 };
    else if (sort === "price-high") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };
    else if (sort === "days") sortOption = { durationDays: 1 };

    let totalPlaces = 0;
    let places = [];

    // Attempt to query DB
    try {
      totalPlaces = await Place.countDocuments(query);
      places = await Place.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean();
    } catch (dbErr) {
      console.warn("MongoDB connection warning, using in-memory fallbacks:", dbErr.message);
    }

    // Auto-seed if empty and no filters
    if (totalPlaces === 0 && (!search && (!state || state === "All") && (!city || city === "All") && (!category || category === "All"))) {
      try {
        const count = await Place.countDocuments();
        if (count === 0) {
          await Place.insertMany(DEFAULT_SEEDED_PLACES);
          totalPlaces = await Place.countDocuments(query);
          places = await Place.find(query).sort(sortOption).skip(skip).limit(limitNum).lean();
        }
      } catch (seedErr) {
        console.warn("Auto-seed error or DB offline, using memory seed:", seedErr.message);
      }
    }

    // Fallback to in-memory list if DB empty
    if (places.length === 0 && totalPlaces === 0) {
      let filtered = [...DEFAULT_SEEDED_PLACES];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.city.toLowerCase().includes(s) ||
            p.state.toLowerCase().includes(s) ||
            p.category.toLowerCase().includes(s)
        );
      }
      if (state && state !== "All") {
        filtered = filtered.filter((p) => p.state.toLowerCase() === state.toLowerCase());
      }
      if (city && city !== "All") {
        filtered = filtered.filter((p) => p.city.toLowerCase() === city.toLowerCase());
      }
      if (category && category !== "All") {
        filtered = filtered.filter((p) => p.category === category);
      }
      totalPlaces = filtered.length;
      places = filtered.slice(skip, skip + limitNum);
    }

    // Extract unique states and categories for filter dropdowns
    const states = [
      "Himachal Pradesh",
      "Jammu & Kashmir",
      "Rajasthan",
      "Kerala",
      "Goa",
      "Ladakh",
      "Uttarakhand",
      "Sikkim",
      "Meghalaya",
      "Karnataka",
      "Andaman & Nicobar",
      "Uttar Pradesh",
      "Tamil Nadu",
      "Maharashtra",
      "West Bengal",
      "Gujarat",
      "Madhya Pradesh",
      "Assam",
      "Punjab"
    ];

    const categories = [
      "Hill Station",
      "Heritage & Forts",
      "Beach & Coastal",
      "Spiritual & Pilgrimage",
      "Adventure & Treks",
      "Wildlife & Safari",
      "Lakes & Nature",
      "Romantic Getaway",
      "Cultural & City"
    ];

    const hasMore = skip + places.length < totalPlaces;

    res.status(200).json({
      success: true,
      count: places.length,
      total: totalPlaces,
      page: pageNum,
      limit: limitNum,
      hasMore,
      states,
      categories,
      places
    });
  } catch (error) {
    console.error("Error in getAllPlaces:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch holiday places",
      error: error.message
    });
  }
};

// GET /api/places/:id - Get single place details
exports.getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    let place = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      place = await Place.findById(id).lean();
    }

    if (!place) {
      place = DEFAULT_SEEDED_PLACES.find(
        (p) => String(p._id) === id || p.name.toLowerCase() === id.toLowerCase() || p.city.toLowerCase() === id.toLowerCase()
      );
    }

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Holiday place / destination not found"
      });
    }

    res.status(200).json({
      success: true,
      place
    });
  } catch (error) {
    console.error("Error in getPlaceById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch place details",
      error: error.message
    });
  }
};

// POST /api/places - Admin creates new place / holiday package with itinerary
exports.createPlace = async (req, res) => {
  try {
    const {
      name,
      state,
      city,
      category,
      days,
      durationDays,
      price,
      bestTimeToVisit,
      rating,
      img,
      gallery,
      overview,
      highlights,
      itinerary,
      attractions,
      inclusions,
      exclusions,
      coordinates,
      isFeatured
    } = req.body;

    if (!name || !state || !city || !price) {
      return res.status(400).json({
        success: false,
        message: "Name, State, City, and Estimated Price are required fields."
      });
    }

    const calculatedDays = durationDays || (itinerary && itinerary.length > 0 ? itinerary.length : 4);
    const formattedDays = days || `${calculatedDays} Days / ${calculatedDays - 1} Nights`;

    const newPlace = new Place({
      name,
      state,
      city,
      category: category || "Hill Station",
      days: formattedDays,
      durationDays: calculatedDays,
      price: Number(price),
      bestTimeToVisit: bestTimeToVisit || "October to April",
      rating: rating ? Number(rating) : 4.8,
      img: img || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
      gallery: Array.isArray(gallery) ? gallery : [],
      overview: overview || `Explore beautiful sights and rich heritage in ${city}, ${state}.`,
      highlights: Array.isArray(highlights) ? highlights : [],
      itinerary: Array.isArray(itinerary) ? itinerary : [],
      attractions: Array.isArray(attractions) ? attractions : [],
      inclusions: Array.isArray(inclusions) && inclusions.length > 0 ? inclusions : [
        "Deluxe hotel / resort accommodation",
        "Daily breakfast and dinner",
        "Dedicated AC vehicle for all sightseeing",
        "Sightseeing permits & tolls"
      ],
      exclusions: Array.isArray(exclusions) && exclusions.length > 0 ? exclusions : [
        "Personal expenses and tips",
        "Flight or train fare to destination"
      ],
      coordinates: coordinates || { lat: 0, lng: 0 },
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
      status: "active"
    });

    const saved = await newPlace.save();

    res.status(201).json({
      success: true,
      message: "Holiday destination created successfully! 🎉",
      place: saved
    });
  } catch (error) {
    console.error("Error in createPlace:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create holiday destination",
      error: error.message
    });
  }
};

// PUT /api/places/:id - Admin updates a place
exports.updatePlace = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Place.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Holiday place not found for update"
      });
    }

    res.status(200).json({
      success: true,
      message: "Holiday place updated successfully! 🚀",
      place: updated
    });
  } catch (error) {
    console.error("Error in updatePlace:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update holiday place",
      error: error.message
    });
  }
};

// DELETE /api/places/:id - Admin deletes a place
exports.deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Place.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Holiday destination not found for deletion"
      });
    }

    res.status(200).json({
      success: true,
      message: "Holiday destination deleted successfully!"
    });
  } catch (error) {
    console.error("Error in deletePlace:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete holiday place",
      error: error.message
    });
  }
};

// GET /api/places/opentripmap/places - Fetch places to visit & sights from OpenTripMap API
exports.getOpenTripMapPlaces = async (req, res) => {
  try {
    const { city, state, lat, lon, type = "attractions", radius = 25000, limit = 15 } = req.query;
    const apiKey = process.env.OPENTRIPMAP_API_KEY || "5ae2e3f221c38a28845f05b61077ed4ad5be5f55f7b6122cfb247c98";

    let targetLat = lat;
    let targetLon = lon;

    // If coordinates are missing, fetch geoname coordinates from OpenTripMap
    if (!targetLat || !targetLon) {
      const searchName = city || state || "Delhi";
      const geoUrl = `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(searchName)}&country=IN&apikey=${apiKey}`;
      const geoData = await fetchJsonHttps(geoUrl);

      if (geoData && geoData.lat && geoData.lon) {
        targetLat = geoData.lat;
        targetLon = geoData.lon;
      } else {
        targetLat = 28.6139;
        targetLon = 77.2090;
      }
    }

    // Determine kinds for OpenTripMap
    let kinds = "interesting_places,historic,cultural,natural,architecture,religion,view_points";
    if (type === "stays" || type === "hotels") {
      kinds = "other_hotels,resorts,guest_houses,motels,hostels,campsites,apartments";
    }

    const otmUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${targetLon}&lat=${targetLat}&kinds=${kinds}&limit=${limit}&apikey=${apiKey}`;
    const result = await fetchJsonHttps(otmUrl);

    if (Array.isArray(result)) {
      const filtered = result
        .filter((item) => item.name && item.name.trim() !== "")
        .map((item) => ({
          xid: item.xid,
          name: item.name,
          kinds: item.kinds ? item.kinds.split(",") : [],
          distance: item.dist,
          rate: item.rate,
          lat: item.point?.lat,
          lon: item.point?.lon,
          wikidata: item.wikidata || null
        }));

      return res.status(200).json({
        success: true,
        source: "OpenTripMap API",
        type,
        center: { lat: targetLat, lon: targetLon },
        count: filtered.length,
        results: filtered
      });
    }

    res.status(200).json({
      success: true,
      source: "OpenTripMap API",
      type,
      center: { lat: targetLat, lon: targetLon },
      count: 0,
      results: []
    });
  } catch (error) {
    console.error("Error in getOpenTripMapPlaces:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch places from OpenTripMap",
      error: error.message
    });
  }
};

// POST /api/places/seed - Reset / Seed initial holiday destinations
exports.seedPlaces = async (req, res) => {
  try {
    await Place.deleteMany({});
    const created = await Place.insertMany(DEFAULT_SEEDED_PLACES);

    res.status(200).json({
      success: true,
      message: `Successfully seeded ${created.length} holiday destinations across India!`,
      places: created
    });
  } catch (error) {
    console.error("Error in seedPlaces:", error);
    res.status(500).json({
      success: false,
      message: "Failed to seed holiday destinations",
      error: error.message
    });
  }
};


