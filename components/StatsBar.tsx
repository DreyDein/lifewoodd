
import React, { useState, useEffect, useRef } from 'react';

interface StatsBarProps {
  t: any;
}

const StatItem = ({ value, suffix, label, isVisible }: { value: number, suffix: string, label: string, isVisible: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = value;
    const duration = 2000; // 2 seconds animation
    const increment = end / (duration / 16); // ~60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  const formattedCount = count >= 1000 
    ? new Intl.NumberFormat().format(count) 
    : count;

  return (
    <div className={`text-center transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="text-3xl md:text-5xl font-extrabold text-lifewood-saffron mb-2 tabular-nums">
        {formattedCount}{suffix}
      </div>
      <div className="text-lifewood-white/90 font-bold text-xs md:text-sm uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

const StatsBar: React.FC<StatsBarProps> = ({ t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="transformation" 
      className="bg-lifewood-green py-20 px-6 scroll-mt-24 relative overflow-hidden"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {t.items.map((stat: any, idx: number) => (
            <StatItem 
              key={idx} 
              value={stat.value} 
              suffix={stat.suffix} 
              label={stat.label} 
              isVisible={isVisible} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
