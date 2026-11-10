import React, { useRef, useState, useEffect } from 'react';

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  threshold = 0.05,
  direction = 'up', // 'up' | 'none' | 'scale'
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Fallback if IntersectionObserver is unsupported
    if (!window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    const scrollParent = element.closest('main') || null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        root: scrollParent,
        threshold,
        rootMargin: '20px 0px 20px 0px',
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold]);

  const getTransform = () => {
    if (isVisible) return 'translate-y-0 scale-100 opacity-100';
    if (direction === 'scale') return 'scale-95 opacity-0';
    if (direction === 'none') return 'opacity-0';
    return 'translate-y-4 scale-[0.98] opacity-0';
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: '550ms',
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`transition-all ${getTransform()} ${className}`}
    >
      {children}
    </div>
  );
}
