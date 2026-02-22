import React from 'react';
interface PartnersProps {
  t: any;
}

const partners = [
  { name: 'Google', src: '/google-logo.png', className: 'h-8 md:h-10' },
  { name: 'Meta', src: '/meta-logo.png', className: 'h-10 md:h-12' },
  { name: 'Amazon', src: '/amazon-logo.png', className: 'h-8 md:h-10 dark:invert dark:brightness-200' },
  { name: 'Apple', src: '/apple-logo.png', className: 'h-10 md:h-12 dark:invert dark:brightness-200' },
  { name: 'NVIDIA', src: '/nvidia-logo.png', className: 'h-10 md:h-12' }
];

// Duplicate the list so the loop feels seamless
const loopedPartners = [...partners, ...partners, ...partners];

const Partners: React.FC<PartnersProps> = ({ t }) => {
  return (
    <section id="partners" className="py-24 px-6 md:px-12 bg-lifewood-seaSalt dark:bg-lifewood-dark scroll-mt-24 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <div className="uppercase tracking-[0.3em] font-bold text-xs mb-6 opacity-80 text-lifewood-dark dark:text-lifewood-paper">{t.eyebrow}</div>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-10 tracking-tight text-lifewood-dark dark:text-lifewood-paper">
          {t.title}
        </h2>
        <p className="max-w-4xl mx-auto text-lg mb-20 leading-relaxed font-medium text-lifewood-dark dark:text-lifewood-paper">
          {t.description}
        </p>

        {/* Marquee container */}
        <div className="relative w-full overflow-hidden">

          {/* Fade edges */}
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-lifewood-seaSalt dark:from-lifewood-dark to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-lifewood-seaSalt dark:from-lifewood-dark to-transparent z-10 pointer-events-none" />

          {/* Scrolling track */}
          <div
            className="flex gap-10 w-max"
            style={{
              animation: 'marquee 25s linear infinite',
            }}
          >
            {loopedPartners.map((partner, idx) => (
              <div
                key={`${partner.name}-${idx}`}
                className="bg-lifewood-white dark:bg-lifewood-dark/40 border border-lifewood-paper dark:border-lifewood-green/20 rounded-2xl px-10 py-6 flex flex-col items-center justify-center min-w-[160px] shadow-sm hover:shadow-xl hover:-translate-y-2 hover:bg-lifewood-seaSalt/30 dark:hover:bg-lifewood-green/10 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center justify-center h-14 mb-3">
                  <img
                    src={partner.src}
                    alt={`${partner.name} logo`}
                    className={`w-auto object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,179,71,0.25)] ${partner.className}`}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.classList.add('hidden');
                      if (target.nextElementSibling) {
                        target.nextElementSibling.classList.remove('hidden');
                      }
                    }}
                  />
                  <span className="hidden font-black text-sm tracking-tighter text-lifewood-dark/20 dark:text-lifewood-seaSalt/20 uppercase text-center">
                    {partner.name}
                  </span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-lifewood-dark/60 dark:text-lifewood-paper/60 group-hover:text-lifewood-green dark:group-hover:text-lifewood-saffron transition-colors duration-300">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        div[style*="marquee"]:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Partners;
