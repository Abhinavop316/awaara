import React from 'react';

export const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Awaara</h3>
            <p>Curated journeys for curious, conscious people.</p>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <a href="#trips">Trips</a>
            <a href="#coming">Coming Soon</a>
            <a href="#destinations">Destinations</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#top">About</a>
            <a href="#how">How It Works</a>
            <a href="#reviews">Reviews</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="https://wa.me/" target="_blank" rel="noreferrer">
              WhatsApp Support
            </a>
            <a href="mailto:support@awaara.demo">Email Us</a>
            <a href="#faq">Help Center</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Awaara. All rights reserved.</span>
          <div className="legal">
            <a href="#top">Privacy Policy</a>
            <a href="#top">Terms of Service</a>
            <a href="#top">Cancellation Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
