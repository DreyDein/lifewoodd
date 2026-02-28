import React, { useState } from 'react';

interface ServicesProps {
  t: any;
}

const fanConfig = [
  { rotate: -20, translateX: -90,  translateY: -20 },
  { rotate:  -7, translateX: -30,  translateY: -35 },
  { rotate:   7, translateX:  30,  translateY: -35 },
  { rotate:  20, translateX:  90,  translateY: -20 },
];

const Services: React.FC<ServicesProps> = ({ t }) => {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const serviceItems = t.items;

  const handleCardClick = (idx: number) => {
    setSelected((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="services" className="py-12 px-6 md:px-12 bg-lifewood-seaSalt dark:bg-lifewood-dark scroll-mt-24 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 space-y-4">
          <div className="uppercase tracking-widest text-lifewood-green dark:text-lifewood-saffron font-bold text-sm">{t.subtitle}</div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-lifewood-dark dark:text-lifewood-white">{t.title}</h2>
          <p className="max-w-3xl mx-auto text-lifewood-dark/60 dark:text-lifewood-seaSalt/60 text-lg">{t.desc}</p>
        </div>

        {/* Single Folder Container */}
            <div
              className="relative flex justify-center items-end mx-auto"
              style={{ height: '320px', width: '100%', maxWidth: '900px' }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
          <div
            className="absolute bottom-0 rounded-t-3xl rounded-b-xl bg-lifewood-green dark:bg-lifewood-saffron shadow-2xl"
            style={{
              width: '260px',
              height: '100px',
              zIndex: 1,
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scaleX(1.08) scaleY(1.05)' : 'scaleX(1)',
            }}
          />

          <div
            className="absolute bg-lifewood-green dark:bg-lifewood-saffron rounded-t-lg"
            style={{
              width: '80px',
              height: '20px',
              bottom: '96px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1,
            }}
          />

          {serviceItems.map((service: any, idx: number) => {
            const fan = fanConfig[idx];
            const isSelected = selected === idx;

            return (
              <div
                key={idx}
                onClick={() => handleCardClick(idx)}
                className="absolute bg-lifewood-white dark:bg-lifewood-dark/90 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center"
                style={{
                    width: '140px',     
                    height: '170px',      
                    bottom: '60px',
                    left: '50%',
                    marginLeft: '-70px', 
                  zIndex: isSelected ? 20 : 10 + idx,
                  cursor: hovered ? 'pointer' : 'default',
                  transition: `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 40}ms, box-shadow 0.3s ease`,
                  transform: hovered
                    ? isSelected
                      ? `rotate(${fan.rotate}deg) translateX(${fan.translateX}px) translateY(${fan.translateY - 20}px) scale(1.08)`
                      : `rotate(${fan.rotate}deg) translateX(${fan.translateX}px) translateY(${fan.translateY}px)`
                    : `rotate(${idx * 2 - 3}deg) translateX(${idx * 2 - 3}px) translateY(0px)`,
                  boxShadow: isSelected ? '0 24px 48px rgba(45,106,79,0.25)' : hovered ? '0 20px 40px rgba(0,0,0,0.18)' : '0 4px 12px rgba(0,0,0,0.10)',
                  outline: isSelected ? '3px solid #2D6A4F' : 'none',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 transition-all duration-300"
                  style={{
                    background: isSelected ? '#2D6A4F' : hovered ? '#e8f5e9' : '#f0ede6',
                    transform: isSelected ? 'scale(1.2)' : hovered ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {service.icon}
                </div>

                <h3 className="text-base font-bold mb-1 transition-colors duration-300" style={{ color: isSelected ? '#2D6A4F' : '' }}>
                  {service.title}
                </h3>

                <p
                  className="text-xs font-semibold uppercase tracking-wide text-lifewood-green/60 dark:text-lifewood-saffron/60 mt-1"
                  style={{
                    opacity: hovered && !isSelected ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  {t.clickHint}
                </p>

                {isSelected && (
                  <span className="mt-2 text-xs font-bold text-lifewood-green dark:text-lifewood-saffron uppercase tracking-wider">
                    {`✓ ${t.selectedLabel}`}
                  </span>
                )}
              </div>
            );
          })}

          <p
            className="absolute text-xs font-semibold uppercase tracking-widest text-lifewood-white dark:text-lifewood-dark"
            style={{
              bottom: '38px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 5,
              opacity: hovered ? 0 : 1,
              transition: 'opacity 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {`${t.hoverHint} ↑`}
          </p>
        </div>

        <div
          style={{
            opacity: selected !== null ? 1 : 0,
            transform: selected !== null ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            pointerEvents: selected !== null ? 'auto' : 'none',
            marginTop: '40px',
          }}
        >
          {selected !== null && (
            <div className="relative bg-lifewood-white dark:bg-lifewood-dark/60 rounded-3xl shadow-xl p-10 border-t-4 border-lifewood-green dark:border-lifewood-saffron max-w-2xl mx-auto">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-lifewood-seaSalt dark:bg-lifewood-dark/60 flex items-center justify-center text-lifewood-dark/50 dark:text-lifewood-seaSalt/50 hover:bg-lifewood-green hover:text-lifewood-white transition-all duration-200 text-sm font-bold"
              >
                ✕
              </button>

              <div className="w-16 h-16 rounded-2xl bg-lifewood-green flex items-center justify-center text-3xl mb-6 shadow-md">{serviceItems[selected].icon}</div>

              <h3 className="text-3xl font-extrabold text-lifewood-green dark:text-lifewood-saffron mb-4">{serviceItems[selected].title}</h3>

              <p className="text-lg text-lifewood-dark/70 dark:text-lifewood-seaSalt/80 leading-relaxed">{serviceItems[selected].description}</p>

              <div className="flex flex-wrap gap-2 mt-8">
                {serviceItems.map((s: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                    style={{
                      background: selected === i ? '#2D6A4F' : '#f0ede6',
                      color: selected === i ? '#fff' : '#2D6A4F',
                    }}
                  >
                    <span>{s.icon}</span>
                    <span>{s.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
