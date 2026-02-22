import React, { useEffect, useState } from 'react';

interface HeroProps {
  onApplyClick: () => void;
  t: any;
}

const TypewriterText: React.FC<{ phrases: string[] }> = ({ phrases }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    const typingSpeed = isDeleting ? 40 : 80;
    const pauseBeforeDelete = 2000;
    const pauseBeforeType = 400;

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed === current) {
      timeout = setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
    } else if (isDeleting && displayed === '') {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, pauseBeforeType);
    } else {
      timeout = setTimeout(() => {
        setDisplayed((prev) =>
          isDeleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, phraseIndex, phrases]);

  return (
    <span className="text-lifewood-saffron inline-block">
      {displayed}
      <span
        className="inline-block w-[3px] h-[0.85em] bg-lifewood-saffron ml-1 align-middle"
        style={{ animation: 'blink 1s step-end infinite' }}
      />
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </span>
  );
};

const Hero: React.FC<HeroProps> = ({ onApplyClick, t }) => {
  const typewriterPhrases = t.typewriterPhrases;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">

      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
        >
          <source src="/Lifewood-Voice-Collection-(EnglishVersion).mp4" type="video/mp4" />
          {t.videoFallback}
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-lifewood-green/80 via-lifewood-dark/70 to-lifewood-dark/90" />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lifewood-saffron/10 rounded-full blur-3xl animate-pulse z-1" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lifewood-white/5 rounded-full blur-3xl animate-pulse delay-1000 z-1" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-lifewood-white leading-tight mb-8 tracking-tight drop-shadow-sm">
          {t.title}{' '}
          <TypewriterText phrases={typewriterPhrases} />
          {' '}{t.subtitle}
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={onApplyClick}
            className="w-full sm:w-auto px-10 py-4 bg-lifewood-saffron text-lifewood-dark text-lg font-bold rounded-full shadow-2xl hover:bg-lifewood-earth transition-all hover:-translate-y-1 active:scale-95"
          >
            {t.contact}
          </button>
          <button
            onClick={() => scrollTo('our-company')}
            className="w-full sm:w-auto px-10 py-4 border-2 border-lifewood-white text-lifewood-white text-lg font-bold rounded-full hover:bg-lifewood-white hover:text-lifewood-green transition-all hover:-translate-y-1 active:scale-95"
          >
            {t.learn}
          </button>
        </div>
      </div>

      {/* Scroll arrow */}
      <div className="absolute bottom-10 left-0 w-full flex justify-center animate-bounce pointer-events-none z-10">
        <button
          onClick={() => scrollTo('our-company')}
          className="text-lifewood-white opacity-50 hover:opacity-100 transition-opacity pointer-events-auto bg-transparent border-none cursor-pointer"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>

    </section>
  );
};

export default Hero;
