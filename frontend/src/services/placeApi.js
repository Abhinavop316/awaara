import { INDIA_PLACES_DATA } from '../data/placesData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const placeApi = {
  // Fetch holiday places with search, filters and pagination for infinite scroll
  async getPlaces({
    search = '',
    state = 'All',
    city = 'All',
    category = 'All',
    duration = 'All',
    page = 1,
    limit = 6,
    sort = 'featured'
  } = {}) {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (state && state !== 'All') params.append('state', state);
      if (city && city !== 'All') params.append('city', city);
      if (category && category !== 'All') params.append('category', category);
      if (page) params.append('page', String(page));
      if (limit) params.append('limit', String(limit));
      if (sort) params.append('sort', sort);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${API_BASE_URL}/places?${params.toString()}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.success && Array.isArray(data.places)) {
          return data;
        }
      }
    } catch (e) {
      console.warn('Place API unreachable, using robust local data:', e.message);
    }

    // Local in-browser fallback filtering & pagination
    let filtered = [...INDIA_PLACES_DATA];

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.overview && p.overview.toLowerCase().includes(q)) ||
          (p.highlights && p.highlights.some((h) => h.toLowerCase().includes(q))) ||
          (p.attractions && p.attractions.some((a) => a.toLowerCase().includes(q)))
      );
    }

    if (state && state !== 'All') {
      filtered = filtered.filter((p) => p.state.toLowerCase() === state.toLowerCase());
    }

    if (city && city !== 'All') {
      filtered = filtered.filter((p) => p.city.toLowerCase() === city.toLowerCase());
    }

    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (duration && duration !== 'All') {
      if (duration === 'short') {
        filtered = filtered.filter((p) => p.durationDays <= 4);
      } else if (duration === 'medium') {
        filtered = filtered.filter((p) => p.durationDays >= 5 && p.durationDays <= 6);
      } else if (duration === 'long') {
        filtered = filtered.filter((p) => p.durationDays >= 7);
      }
    }

    const total = filtered.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 6);
    const skip = (pageNum - 1) * limitNum;
    const paginatedPlaces = filtered.slice(skip, skip + limitNum);
    const hasMore = skip + paginatedPlaces.length < total;

    return {
      success: true,
      places: paginatedPlaces,
      total,
      page: pageNum,
      limit: limitNum,
      hasMore,
      count: paginatedPlaces.length
    };
  },

  // Get place by ID
  async getPlaceById(id) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const response = await fetch(`${API_BASE_URL}/places/${id}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        if (data && data.success && data.place) {
          return data;
        }
      }
    } catch (e) {
      console.warn('Place API getById fallback:', e.message);
    }

    const localPlace = INDIA_PLACES_DATA.find((p) => p.id === id || p._id === id);
    return {
      success: Boolean(localPlace),
      place: localPlace || null
    };
  },

  // Fetch OpenTripMap places & suggestions
  async getOpenTripMapPlaces(city, state, lat, lon, type = 'attractions') {
    try {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (state) params.append('state', state);
      if (lat) params.append('lat', String(lat));
      if (lon) params.append('lon', String(lon));
      if (type) params.append('type', type);

      const response = await fetch(`${API_BASE_URL}/places/opentripmap/places?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (e) {
      console.warn('OpenTripMap API error:', e);
    }
    return { success: false, results: [] };
  }
};


