import React, { useState, useEffect, useRef, useCallback } from 'react';
import { placeApi } from '../services/placeApi';

export const HolidayPlaces = ({ onSelectPlace, onBookPlace, onInquirePlace }) => {
  const [places, setPlaces] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Sentinel ref for infinite scroll observer
  const sentinelRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load first page of places when search changes
  const loadInitialPlaces = useCallback(async () => {
    setIsLoading(true);
    setPage(1);
    try {
      const res = await placeApi.getPlaces({
        search: debouncedSearch,
        page: 1,
        limit: 6
      });

      if (res && res.success && Array.isArray(res.places)) {
        setPlaces(res.places);
        setHasMore(res.hasMore);
        setTotalCount(res.total || res.places.length);
      } else {
        setPlaces([]);
        setHasMore(false);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error loading initial places:', err);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  // Trigger initial load on search changes
  useEffect(() => {
    loadInitialPlaces();
  }, [loadInitialPlaces]);

  // Load more places on scroll (Infinite Scrolling)
  const loadMorePlaces = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoading) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const res = await placeApi.getPlaces({
        search: debouncedSearch,
        page: nextPage,
        limit: 6
      });

      if (res && res.success && Array.isArray(res.places) && res.places.length > 0) {
        setPlaces((prev) => {
          // Prevent duplicates by ID
          const existingIds = new Set(prev.map((p) => p.id || p._id));
          const newUnique = res.places.filter((p) => !existingIds.has(p.id || p._id));
          return [...prev, ...newUnique];
        });
        setPage(nextPage);
        setHasMore(res.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more places:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, isLoading, isLoadingMore, debouncedSearch]);

  // Set up IntersectionObserver on sentinelRef
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          loadMorePlaces();
        }
      },
      {
        root: null,
        rootMargin: '250px',
        threshold: 0.1
      }
    );

    observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMore, isLoading, isLoadingMore, loadMorePlaces]);

  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedSearch('');
  };

  return (
    <section className="section holiday-places-section" id="holidays">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="holiday-breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <a href="#top">Home</a>
            </li>
            <li className="breadcrumb-separator">/</li>
            <li className="breadcrumb-current" aria-current="page">
              Holidays & Places to Visit in India
            </li>
          </ol>
        </nav>

        {/* Section Header */}
        <div className="holiday-header-wrap">
          <div className="holiday-header-badge">
            <span className="geo-icon">🧭</span>
            <span>All India Holidays • Curated Itineraries & Verified Stays</span>
          </div>
          <h2 className="holiday-section-title">
            Explore India: Dream Holidays & Iconic Places to Visit
          </h2>
          <p className="holiday-section-subtitle">
            From the snow peaks of Kashmir and Himachal to royal palaces of Rajasthan,
            sun-kissed Goa beaches, and tranquil Kerala backwaters. Discover day-by-day
            itineraries curated for unforgettable journeys.
          </p>
        </div>

        {/* Search Bar */}
        <div className="holiday-filter-panel">
          <div className="search-input-group">
            <svg
              className="search-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="holiday-search-input"
              placeholder="Search destinations, sights, forts, hill stations (e.g. Manali, Rohtang, Dal Lake)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="search-clear-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Results Info Counter */}
        <div className="holiday-results-meta">
          <span>
            Showing <strong>{places.length}</strong> of <strong>{totalCount}</strong> holiday places in India
          </span>
          {debouncedSearch && (
            <span className="filter-applied-badge">Search Results</span>
          )}
        </div>

        {/* Holiday Places Grid */}
        {isLoading ? (
          <div className="holiday-loading-grid">
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div key={sk} className="place-skeleton-card">
                <div className="skeleton-img"></div>
                <div className="skeleton-body">
                  <div className="skeleton-line line-title"></div>
                  <div className="skeleton-line line-meta"></div>
                  <div className="skeleton-line line-desc"></div>
                  <div className="skeleton-line line-btn"></div>
                </div>
              </div>
            ))}
          </div>
        ) : places.length > 0 ? (
          <div className="holiday-places-grid">
            {places.map((place) => {
              const placeId = place.id || place._id;
              return (
                <div
                  key={placeId}
                  className="holiday-card"
                  onClick={() => onSelectPlace(place)}
                >
                  {/* Card Image Banner */}
                  <div className="holiday-card-media">
                    <img
                      src={place.img}
                      alt={place.name}
                      loading="lazy"
                      className="holiday-card-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                    <div className="card-top-tags">
                      <span className="category-pill">{place.category}</span>
                      <span className="days-pill">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {place.days || `${place.durationDays} Days`}
                      </span>
                    </div>

                    <div className="card-rating-float">
                      ★ <strong>{place.rating || '4.9'}</strong>
                      <span className="rating-count">({place.reviewsCount || '100+'})</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="holiday-card-body">
                    <div className="holiday-location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{place.city}, {place.state}</span>
                    </div>

                    <h3 className="holiday-card-title">{place.name}</h3>

                    <p className="holiday-card-desc">
                      {place.overview
                        ? place.overview.slice(0, 110) + '...'
                        : 'Experience extraordinary sights, culture, and nature.'}
                    </p>

                    {/* Highlights Pills */}
                    {place.highlights && place.highlights.length > 0 && (
                      <div className="holiday-card-highlights">
                        {place.highlights.slice(0, 2).map((hl, i) => (
                          <span key={i} className="highlight-pill">
                            ✓ {hl}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Row: Price + Actions */}
                    <div className="holiday-card-footer">
                      <div className="holiday-card-price">
                        <span className="price-sub">Starting from</span>
                        <div className="price-val">
                          ₹{place.price?.toLocaleString('en-IN')}
                          <span className="per-person">/ person</span>
                        </div>
                      </div>

                      <div className="holiday-card-actions">
                        <button
                          className="btn-view-itinerary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPlace(place);
                          }}
                        >
                          View Details
                        </button>
                        <button
                          className="btn-book-quick"
                          onClick={(e) => {
                            e.stopPropagation();
                            onInquirePlace(place);
                          }}
                        >
                          Enquire Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="holiday-empty-state">
            <div className="empty-icon">🏖️</div>
            <h3>No Holiday Destinations Match Your Search</h3>
            <p>Try searching for a different destination or clearing your search term.</p>
            {searchTerm && (
              <button className="btn btn-primary" onClick={handleClearSearch}>
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Sentinel element for Infinite Scroll */}
        <div ref={sentinelRef} className="holiday-sentinel-loader">
          {isLoadingMore && (
            <div className="infinite-loading-indicator">
              <div className="spinner-sm"></div>
              <span>Loading more places to visit in India...</span>
            </div>
          )}
          {!hasMore && places.length > 0 && !isLoading && (
            <div className="infinite-end-indicator">
              <span className="end-check">✨</span>
              <span>You've explored all {totalCount} curated Indian holiday destinations!</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
