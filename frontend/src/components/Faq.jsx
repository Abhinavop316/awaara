import React, { useState } from 'react';
import { FAQS } from '../data/tripsData';

export const Faq = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="faq">
      <div className="container">
        <div className="section-head center reveal" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <h2>Questions, Answered.</h2>
        </div>
        <div className="faq-list" id="faqList">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div className={`faq-item ${isOpen ? 'open' : ''}`} key={idx}>
                <button
                  className="faq-q"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="faq-plus">+</span>
                </button>
                <div className={`faq-a ${isOpen ? 'open' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
