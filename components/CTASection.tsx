
import React from 'react';

interface CTASectionProps {
  onApplyClick: () => void;
  t: any;
}

const CTASection: React.FC<CTASectionProps> = ({ onApplyClick, t }) => {
  return (
    <section id="apply" className="py-24 px-6 relative overflow-hidden bg-lifewood-green scroll-mt-24">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-lifewood-saffron/5 skew-x-12 translate-x-1/2"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10 text-lifewood-white space-y-8">
        <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">{t.title}</h2>
        <p className="text-xl text-lifewood-seaSalt/80">
          {t.description}
        </p>
        <div>
          <button 
            onClick={onApplyClick}
            className="inline-block bg-lifewood-saffron text-lifewood-dark px-12 py-4 rounded-full text-xl font-bold shadow-2xl hover:bg-lifewood-earth transition-all hover:-translate-y-1 active:scale-95"
          >
            {t.button}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
