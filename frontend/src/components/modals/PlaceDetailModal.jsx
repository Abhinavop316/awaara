import React, { useState, useEffect } from 'react';

export const PlaceDetailModal = ({ place, isOpen, onClose, onInquirePlace }) => {
  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary' | 'attractions' | 'inclusions' | 'overview'
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setActiveTab('itinerary');
      setActiveImageIndex(0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, place]);

  if (!isOpen || !place) return null;

  const images = [place.img, ...(place.gallery || [])].filter(Boolean);

  const handleOpenEnquiry = () => {
    if (onInquirePlace) {
      onInquirePlace(place);
    }
  };

  return (
    <div className="modal-backdrop place-modal-backdrop" onClick={onClose}>
      <div
        className="modal-card place-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button
          className="modal-close place-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Modal Header & Gallery */}
        <div className="place-modal-hero">
          <img
            src={images[activeImageIndex] || place.img}
            alt={place.name}
            className="place-modal-hero-img"
          />
          <div className="place-modal-hero-overlay">
            <div className="place-modal-badges">
              <span className="badge-pill category-badge">{place.category}</span>
              <span className="badge-pill duration-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {place.days || `${place.durationDays || 5} Days`}
              </span>
              <span className="badge-pill state-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {place.city}, {place.state}
              </span>
            </div>
            <h2 className="place-modal-title">{place.name}</h2>
            <div className="place-modal-meta-row">
              <div className="place-modal-rating">
                ★ <strong>{place.rating || '4.9'}</strong>
                <span>({place.reviewsCount || '250+'} Reviews)</span>
              </div>
              <div className="place-modal-best-time">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
                </svg>
                Best Season: <strong>{place.bestTimeToVisit || 'October to May'}</strong>
              </div>
            </div>
          </div>

          {/* Thumbnail strip if multiple images */}
          {images.length > 1 && (
            <div className="place-modal-thumbnails">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  className={`place-thumbnail-btn ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Navigation Tabs */}
        <div className="place-modal-tabs">
          <button
            className={`place-tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => setActiveTab('itinerary')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Day-by-Day Itinerary ({place.itinerary?.length || place.durationDays || 0} Days)
          </button>
          <button
            className={`place-tab-btn ${activeTab === 'attractions' ? 'active' : ''}`}
            onClick={() => setActiveTab('attractions')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Places to Visit & Sights
          </button>
          <button
            className={`place-tab-btn ${activeTab === 'inclusions' ? 'active' : ''}`}
            onClick={() => setActiveTab('inclusions')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Inclusions & Stays
          </button>
          <button
            className={`place-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            About Destination
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="place-modal-body">
          {/* TAB 1: DAY BY DAY ITINERARY */}
          {activeTab === 'itinerary' && (
            <div className="place-itinerary-view">
              <div className="itinerary-intro">
                <p>
                  Explore our carefully planned day-by-day travel plan designed for an effortless,
                  scenic, and comfortable holiday in <strong>{place.city}</strong>.
                </p>
              </div>

              <div className="itinerary-timeline">
                {place.itinerary && place.itinerary.length > 0 ? (
                  place.itinerary.map((dayItem, idx) => (
                    <div key={idx} className="timeline-day-card">
                      <div className="timeline-day-marker">
                        <span className="day-number">Day {dayItem.day || idx + 1}</span>
                      </div>
                      <div className="timeline-day-content">
                        <h4 className="timeline-day-title">{dayItem.title}</h4>
                        <p className="timeline-day-desc">{dayItem.description}</p>

                        {dayItem.activities && dayItem.activities.length > 0 && (
                          <div className="timeline-activities-chips">
                            {dayItem.activities.map((act, actIdx) => (
                              <span key={actIdx} className="activity-chip">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                                {act}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="timeline-day-meta">
                          {dayItem.meals && (
                            <span className="meta-tag meals-tag">
                              🍽️ Meals: <strong>{dayItem.meals}</strong>
                            </span>
                          )}
                          {dayItem.stay && (
                            <span className="meta-tag stay-tag">
                              🏨 Stay: <strong>{dayItem.stay}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-itinerary-box">
                    <p>Custom flexible {place.days || '4-Day'} sightseeing itinerary available.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PLACES TO VISIT & SIGHTS */}
          {activeTab === 'attractions' && (
            <div className="place-attractions-view">
              <div className="attractions-header">
                <h3>Top Places to Visit in {place.city}, {place.state}</h3>
                <span className="sights-badge">
                  Curated Sights & Heritage
                </span>
              </div>

              {/* Highlights Chips */}
              {place.highlights && place.highlights.length > 0 && (
                <div className="highlights-section">
                  <h5 className="section-subtitle">Trip Highlights</h5>
                  <div className="highlights-grid">
                    {place.highlights.map((h, i) => (
                      <div key={i} className="highlight-item-card">
                        <span className="highlight-check">✓</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Curated Tourist Attractions */}
              {place.attractions && place.attractions.length > 0 && (
                <div className="curated-attractions-section">
                  <h5 className="section-subtitle">Featured Key Attractions</h5>
                  <div className="attractions-tags-cloud">
                    {place.attractions.map((attr, idx) => (
                      <span key={idx} className="attraction-pill">
                        📍 {attr}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INCLUSIONS & STAYS */}
          {activeTab === 'inclusions' && (
            <div className="place-inclusions-view">
              <div className="inclusions-grid-row">
                <div className="inclusion-box inclusive">
                  <h4 className="box-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    What's Included in this Holiday
                  </h4>
                  <ul className="inclusion-list">
                    {(place.inclusions && place.inclusions.length > 0
                      ? place.inclusions
                      : [
                          'Handpicked luxury / boutique hotel stays',
                          'Daily sumptuous breakfast & dinner',
                          'Private AC sanitized cab for all sightseeing',
                          'All entry permits, toll taxes and parking fees',
                          '24x7 Dedicated Awaara travel concierge'
                        ]
                    ).map((inc, i) => (
                      <li key={i}>{inc}</li>
                    ))}
                  </ul>
                </div>

                <div className="inclusion-box exclusive">
                  <h4 className="box-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d9534f" strokeWidth="3">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Exclusions
                  </h4>
                  <ul className="exclusion-list">
                    {(place.exclusions && place.exclusions.length > 0
                      ? place.exclusions
                      : [
                          'Personal laundry, beverages and tips',
                          'Optional water sports / adventure activities',
                          'Airfare / train fare to start city'
                        ]
                    ).map((exc, i) => (
                      <li key={i}>{exc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ABOUT DESTINATION */}
          {activeTab === 'overview' && (
            <div className="place-overview-view">
              <h3>About {place.name}</h3>
              <p className="overview-text">{place.overview}</p>
              <div className="destination-fact-cards">
                <div className="fact-card">
                  <span className="fact-label">State</span>
                  <strong>{place.state}</strong>
                </div>
                <div className="fact-card">
                  <span className="fact-label">City / Region</span>
                  <strong>{place.city}</strong>
                </div>
                <div className="fact-card">
                  <span className="fact-label">Recommended Duration</span>
                  <strong>{place.days || `${place.durationDays || 5} Days`}</strong>
                </div>
                <div className="fact-card">
                  <span className="fact-label">Experience Type</span>
                  <strong>{place.category}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Price & Actions */}
        <div className="place-modal-footer">
          <div className="place-modal-price-box">
            <span className="price-label">Starting from</span>
            <div className="price-amount-wrap">
              <span className="currency-symbol">₹</span>
              <span className="price-amount">{place.price?.toLocaleString('en-IN') || '11,999'}</span>
              <span className="price-unit">/ person</span>
            </div>
          </div>

          <div className="place-modal-actions">
            <button
              className="btn btn-outline"
              onClick={handleOpenEnquiry}
            >
              Custom Inquiry
            </button>
            <button
              className="btn btn-primary place-book-btn"
              onClick={handleOpenEnquiry}
            >
              Enquire for this Holiday →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
