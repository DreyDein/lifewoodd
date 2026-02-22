import React, { useEffect, useRef, useState } from 'react';

interface CareersProps {
  onApplyClick: () => void;
  t: any;
}

// --- Count-up helpers ---
const parseValue = (value: string) => {
  const prefix = value.match(/^[^0-9]*/)?.[0] || '';
  const suffix = value.match(/[^0-9,]*$/)?.[0] || '';
  const numberStr = value.replace(prefix, '').replace(suffix, '').replace(/,/g, '');
  const number = parseInt(numberStr, 10);
  const hasComma = value.includes(',');
  return { number, suffix, prefix, hasComma };
};

const CountUpStat: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState(0);
  const [started, setStarted] = useState(false);
  const { number, suffix, prefix, hasComma } = parseValue(value);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * number));
      if (step >= steps) {
        setDisplayed(number);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [started, number]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <span className="text-4xl md:text-5xl font-extrabold text-lifewood-green dark:text-lifewood-saffron mb-3">
        {prefix}{hasComma ? displayed.toLocaleString() : displayed}{suffix}
      </span>
      <span className="text-lifewood-dark/60 dark:text-lifewood-seaSalt/60 font-semibold text-sm md:text-base">
        {label}
      </span>
    </div>
  );
};

// --- Tilt Card ---
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // mouse X relative to card
    const y = e.clientY - rect.top;  // mouse Y relative to card

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max tilt in degrees
    const maxTilt = 10;
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: 'transform 0.15s ease', willChange: 'transform' }}
    >
      {children}
    </div>
  );
};

// --- Main Careers component ---
const Careers: React.FC<CareersProps> = ({ onApplyClick, t }) => {
  const careerStats = t.stats;
  const openPositions = t.openPositions;

  return (
    <section id="careers" className="py-24 px-6 md:px-12 bg-lifewood-paper/30 dark:bg-lifewood-dark/50 scroll-mt-24 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
  <h2
    className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent"
    style={{
      backgroundImage: 'linear-gradient(90deg, #2D6A4F, #52B788, #F4A300, #52B788, #2D6A4F)',
      backgroundSize: '200% auto',
      animation: 'gradientShift 3s linear infinite',
    }}
  >
    {t.title}
  </h2>
  <h3
    className="text-2xl md:text-3xl font-bold mb-8 tracking-[0.2em] uppercase bg-clip-text text-transparent"
    style={{
      backgroundImage: 'linear-gradient(90deg, #F4A300, #2D6A4F, #52B788, #2D6A4F, #F4A300)',
      backgroundSize: '200% auto',
      animation: 'gradientShift 4s linear infinite',
    }}
  >
    {t.tag}
  </h3>

  <style>{`
    @keyframes gradientShift {
      0%   { background-position: 0% center; }
      100% { background-position: 200% center; }
    }
  `}</style>
</div>

        {/* Count-up stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-24">
          {careerStats.map((stat, idx) => (
            <CountUpStat key={idx} value={stat.value} label={stat.label} />
          ))}
        </div>

        <div className="pt-16 border-t border-lifewood-paper dark:border-lifewood-green/20 text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-lifewood-dark dark:text-lifewood-white mb-10 tracking-tight">
            {t.join}
          </h2>
        </div>

        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-lifewood-dark dark:text-lifewood-white mb-4">{t.positions}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {openPositions.map((job, idx) => (
              // ✅ Wrap each card with TiltCard
              <TiltCard
                key={idx}
                className="bg-lifewood-paper dark:bg-lifewood-dark/70 rounded-2xl p-8 shadow-sm hover:shadow-xl border border-lifewood-paper dark:border-lifewood-paper/10 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-lifewood-dark dark:text-lifewood-white">{job.title}</h3>
                    <p className="text-lifewood-green dark:text-lifewood-saffron font-bold text-sm">{job.department}</p>
                  </div>
                  <span className="bg-lifewood-seaSalt dark:bg-lifewood-paper/10 text-lifewood-dark/60 dark:text-lifewood-paper px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {job.level}
                  </span>
                </div>
                <p className="text-lifewood-dark/60 dark:text-lifewood-paper/90 mb-8 leading-relaxed">{job.description}</p>
                <button
                  onClick={onApplyClick}
                  className={`w-full py-4 rounded-xl font-bold transform transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:scale-95 ${
                    job.isPrimary
                      ? 'bg-lifewood-green text-lifewood-white'
                      : 'bg-lifewood-seaSalt dark:bg-lifewood-paper/10 text-lifewood-dark dark:text-lifewood-paper hover:bg-lifewood-green/90 hover:text-lifewood-white'
                  }`}
                >
                  {job.buttonText}
                </button>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Careers;
