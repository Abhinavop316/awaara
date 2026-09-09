import React, { useState, useEffect, useRef } from 'react';
import { STATS } from '../data/tripsData';

export const WhyChooseUs = () => {
  const [counts, setCounts] = useState(STATS.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          STATS.forEach((stat, idx) => {
            const target = stat.target;
            const duration = 1500;
            const steps = 40;
            const stepTime = duration / steps;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                setCounts((prev) => {
                  const copy = [...prev];
                  copy[idx] = target;
                  return copy;
                });
                clearInterval(timer);
              } else {
                setCounts((prev) => {
                  const copy = [...prev];
                  copy[idx] = Math.floor(current);
                  return copy;
                });
              }
            }, stepTime);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section style={{ background: '#f4ece0' }}>
      <div className="container">
        <div className="section-head reveal">
          <h2>Why People Come Back to Awaara.</h2>
        </div>
        <div className="why-grid">
          <div className="why-card reveal">
            <svg className="why-icon" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="19" stroke="#211d1a" strokeWidth="1.5" />
              <path d="M24 14v10l7 5" stroke="#e0663f" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <h3>Curated, Not Crowded</h3>
            <p>Thoughtfully designed trips with intimate group sizes and unique stays.</p>
          </div>

          <div className="why-card reveal">
            <svg className="why-icon" viewBox="0 0 48 48" fill="none">
              <rect x="9" y="12" width="30" height="24" rx="3" stroke="#211d1a" strokeWidth="1.5" />
              <path d="M9 20h30" stroke="#e0663f" strokeWidth="1.5" />
            </svg>
            <h3>Zero Guesswork</h3>
            <p>Transparent pricing, day-by-day itineraries, and clear inclusions upfront.</p>
          </div>

          <div className="why-card reveal">
            <svg className="why-icon" viewBox="0 0 48 48" fill="none">
              <path
                d="M24 8l4.5 9.5L39 19l-7.5 7 2 10.5L24 31l-9.5 5.5 2-10.5L9 19l10.5-1.5z"
                stroke="#211d1a"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <h3>Real Adventures</h3>
            <p>Authentic experiences and local secrets you'll genuinely want to talk about.</p>
          </div>

          <div className="why-card reveal">
            <svg className="why-icon" viewBox="0 0 48 48" fill="none">
              <path
                d="M24 40c9-6 15-13 15-21a9 9 0 00-15-6 9 9 0 00-15 6c0 8 6 15 15 21z"
                stroke="#e0663f"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <h3>We're With You</h3>
            <p>Dedicated travel leads and round-the-clock support before, during, and after.</p>
          </div>
        </div>

        <div className="counters-strip reveal" ref={statsRef}>
          {STATS.map((stat, idx) => (
            <div className="counter-item" key={stat.label}>
              <div className="num">
                {counts[idx].toLocaleString('en-IN')}+
              </div>
              <div className="lbl">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
