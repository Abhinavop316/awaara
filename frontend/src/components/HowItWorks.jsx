import React from 'react';

export const HowItWorks = () => {
  return (
    <section id="how">
      <div className="container">
        <div className="section-head reveal">
          <h2>Two Ways to Wander.</h2>
          <p>Whether your next trip is already planned or still a daydream, there's a path for you.</p>
        </div>
        <div className="how-wrap">
          <div className="how-path reveal">
            <h3>READY TO GO?</h3>
            <div className="how-steps">
              <div className="how-step">
                <h4>Explore</h4>
                <p>Find your perfect curated trip from our upcoming calendar.</p>
              </div>
              <div className="how-step">
                <h4>Book</h4>
                <p>Reserve your seats online in a few clicks.</p>
              </div>
              <div className="how-step">
                <h4>Pay</h4>
                <p>Secure checkout with UPI, Card, or Net Banking.</p>
              </div>
              <div className="how-step">
                <h4>Travel</h4>
                <p>Show up with your digital ticket. We handle all logistics.</p>
              </div>
            </div>
          </div>

          <div className="how-path reveal">
            <h3>DREAMING OF SOMEWHERE ELSE?</h3>
            <div className="how-steps">
              <div className="how-step">
                <h4>Tell Us</h4>
                <p>Share your dream destination and preferred season.</p>
              </div>
              <div className="how-step">
                <h4>We Plan</h4>
                <p>We scout boutique stays and build the perfect itinerary.</p>
              </div>
              <div className="how-step">
                <h4>We Notify</h4>
                <p>You get first-priority alerts when the trip goes live.</p>
              </div>
              <div className="how-step">
                <h4>You Book</h4>
                <p>Lock in your spot before seats open to the public.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
