import React from 'react';
import { SearchCard } from './SearchCard';

export const Hero = ({ searchFilters, setSearchFilters, onSearch, allTrips = [] }) => {
  return (
    <>
      <div id="top"></div>
      <section className="hero">
        <div className="container hero-inner">
          <p className="hero-label">CURATED ESCAPES • UNFORGETTABLE MEMORIES</p>
          <h1>
            Go Somewhere
            <br />
            You'll Never Forget.
          </h1>
          <p className="hero-sub">
            Curated trips, unforgettable experiences, and new places waiting to become your favorite
            memories.
          </p>
          <div className="hero-ctas">
            <a href="#trips" className="btn btn-primary">
              Explore Trips →
            </a>
            <a href="#coming" className="btn btn-ghost">
              Coming Soon
            </a>
          </div>
          <div className="hero-trust">
            <span className="stars">★★★★★</span>
            <span>Loved by 2,500+ travelers</span>
          </div>

          <SearchCard
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
            onSearch={onSearch}
            allTrips={allTrips}
          />
        </div>
      </section>
      <div className="hero-spacer"></div>
    </>
  );
};
