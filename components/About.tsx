import React, { useEffect, useRef, useState } from 'react';

interface AboutProps {
  onApplyClick: () => void;
  t: any;
}

// --- Split Text Animation ---
const SplitText: React.FC<{ text: string; className?: string; delay?: number }> = ({ text, className, delay = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={`inline ${className ?? ''}`} aria-label={text}>
      {/* Split by WORDS instead of characters to prevent mid-word line breaks */}
      {text.split(' ').map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split('').map((char, cIdx) => (
            <span
              key={cIdx}
              className="inline-block transition-all duration-500"
              style={{
                transitionDelay: `${delay + (wIdx * word.length + cIdx) * 30}ms`,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                opacity: visible ? 1 : 0,
              }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
};

// --- Count Up Animation ---
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
    <div ref={ref}>
      <span className="block text-3xl font-extrabold text-lifewood-green">
        {prefix}{hasComma ? displayed.toLocaleString() : displayed}{suffix}
      </span>
      <span className="text-lifewood-dark/60 dark:text-lifewood-seaSalt/60 text-sm font-semibold uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};

const coreValues = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    id: 'innovation',
    title: 'Innovation First',
    description: 'We ignite cultures of innovation, always seeking new methods and insights to reveal unexpected directions and possibilities.'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    id: 'connectivity',
    title: 'Global Connectivity',
    description: 'Building bridges and forming new friendships across time, generations, and technologies, connecting everyone worldwide.'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    id: 'excellence',
    title: 'Excellence in Delivery',
    description: 'Delivering the highest levels of scalability, integration, and security while maintaining unwavering quality standards.'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    id: 'empowerment',
    title: 'Team Empowerment',
    description: 'Motivating and growing teams that can initiate and learn on the run, fostering continuous adaptation and growth.'
  }
];

const About: React.FC<AboutProps> = ({ onApplyClick, t }) => {
  const coreValuesText = (t.coreValues || []).reduce((acc: Record<string, any>, item: any) => {
    acc[item.id] = item;
    return acc;
  }, {});
  return (
    <section id="our-company" className="py-24 px-6 md:px-12 bg-lifewood-paper/20 dark:bg-lifewood-dark/50 overflow-hidden scroll-mt-24 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">

          {/* Our Mission - Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-lifewood-green dark:text-lifewood-saffron mb-8">
                <SplitText text={t.mission} />
              </h2>
              <div className="space-y-6 text-lg md:text-xl text-lifewood-dark/80 dark:text-lifewood-seaSalt/80 leading-relaxed font-medium">
                <p>{t.missionText}</p>
                <p className="text-lifewood-green dark:text-lifewood-earth font-bold mt-8">
                  {t.journeyCta}
                </p>
              </div>
            </div>

            {/* ✅ Count-up stats */}
            <div className="pt-12 grid grid-cols-2 gap-8 border-t border-lifewood-paper dark:border-lifewood-dark/30">
              {t.stats.map((stat: any) => (
                <CountUpStat key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>

          {/* Our Vision - Right Column Card */}
          <div className="lg:col-span-5">
            <div className="bg-lifewood-paper dark:bg-lifewood-dark/80 border border-lifewood-paper dark:border-lifewood-green/20 p-8 md:p-12 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-3 hover:bg-lifewood-seaSalt/50 dark:hover:bg-lifewood-green/10 transition-all duration-300 group cursor-pointer">
              <h3 className="text-3xl font-extrabold text-lifewood-green dark:text-lifewood-earth mb-6 group-hover:text-lifewood-dark dark:group-hover:text-lifewood-saffron transition-colors duration-300">
                <SplitText text={t.vision} delay={100} />
              </h3>
              <p className="text-lg md:text-xl text-lifewood-dark/80 dark:text-lifewood-seaSalt/90 leading-relaxed font-medium group-hover:text-lifewood-dark dark:group-hover:text-lifewood-seaSalt transition-colors duration-300">
                {t.visionText}
              </p>

              <div className="mt-12 pt-8 border-t border-lifewood-dark/10 dark:border-lifewood-seaSalt/10">
                <button
                  onClick={onApplyClick}
                  className="inline-flex items-center text-lifewood-green dark:text-lifewood-saffron font-bold text-lg group hover:text-lifewood-dark dark:hover:text-lifewood-earth transition-colors duration-300"
                >
                  {t.journeyCta}
                  <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="pt-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-lifewood-green dark:text-lifewood-white mb-4">
              <SplitText text={t.values} />
            </h2>
            <p className="text-lifewood-dark/60 dark:text-lifewood-seaSalt/60 text-lg">{t.principles}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, idx) => (
              <div
                key={idx}
                className="bg-lifewood-white dark:bg-lifewood-dark/40 p-10 rounded-2xl border border-lifewood-seaSalt dark:border-lifewood-green/10 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:bg-lifewood-seaSalt/30 dark:hover:bg-lifewood-green/10 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-16 h-16 bg-lifewood-paper dark:bg-lifewood-green/20 rounded-xl flex items-center justify-center text-lifewood-green dark:text-lifewood-earth mb-8 group-hover:scale-125 group-hover:bg-lifewood-green group-hover:text-lifewood-white dark:group-hover:bg-lifewood-saffron dark:group-hover:text-lifewood-dark transition-all duration-300">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-lifewood-green dark:text-lifewood-white mb-4 group-hover:text-lifewood-dark dark:group-hover:text-lifewood-saffron transition-colors duration-300">
                  <SplitText text={coreValuesText[value.id]?.title || value.title} delay={idx * 100} />
                </h3>
                <p className="text-lifewood-dark/60 dark:text-lifewood-seaSalt/60 text-base leading-relaxed group-hover:text-lifewood-dark/80 dark:group-hover:text-lifewood-seaSalt/80 transition-colors duration-300">
                  {coreValuesText[value.id]?.description || value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
