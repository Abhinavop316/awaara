import { useEffect } from 'react';

export const useScrollReveal = () => {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => revealObserver.observe(el));

    return () => {
      elements.forEach((el) => revealObserver.unobserve(el));
      revealObserver.disconnect();
    };
  }, []);
};
