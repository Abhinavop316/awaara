import React from 'react';

export const SearchCard = ({ searchFilters, setSearchFilters, onSearch, allTrips = [] }) => {
  const handleChange = (field, value) => {
    setSearchFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    onSearch();
    const tripsSection = document.getElementById('trips');
    if (tripsSection) {
      tripsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Derive unique destination list from active trips
  const uniqueDestinations = Array.from(
    new Set(
      allTrips
        .map((t) => t.name || t.destination)
        .filter(Boolean)
    )
  );

  const defaultDests = ['Manali', 'Bali', 'Kashmir', 'Rajasthan', 'Spiti', 'Meghalaya', 'Goa'];
  const displayDestinations = Array.from(new Set([...uniqueDestinations, ...defaultDests]));

  return (
    <div className="search-card" id="searchCard">
      <div className="field">
        <label htmlFor="whereSelect">Where?</label>
        <select
          id="whereSelect"
          value={searchFilters.where}
          onChange={(e) => handleChange('where', e.target.value)}
        >
          <option value="">Choose a destination</option>
          {displayDestinations.map((dest) => (
            <option key={dest} value={dest}>
              {dest}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary" id="findTripBtn" onClick={handleSearchClick}>
        Find My Trip →
      </button>
    </div>
  );
};


