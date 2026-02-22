import React, { useEffect, useRef, useState } from 'react';

interface ProjectsProps {
  t: any;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

const DecryptText: React.FC<{ text: string; trigger: boolean }> = ({ text, trigger }) => {
  const [displayed, setDisplayed] = useState(text);

  useEffect(() => {
    if (!trigger) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayed(
        text
          .split('')
          .map((char, idx) => {
            if (char === ' ') return ' ';
            if (idx < Math.floor(iteration / 2)) return text[idx];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      iteration++;
      if (iteration > text.length * 2) {
        setDisplayed(text);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [trigger, text]);

  return <span className="font-mono tracking-wide">{displayed}</span>;
};

const AnimatedCard: React.FC<{ title: string; description: string; image: string; index: number }> = ({ title, description, image, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const imageOnLeft = index % 2 === 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${index * 80}ms`,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.6s ease, opacity 0.6s ease',
      }}
      className="bg-white dark:bg-lifewood-dark/80 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className={`flex flex-col md:flex-row ${imageOnLeft ? '' : 'md:flex-row-reverse'}`}>
        <div className="md:w-2/5 w-full h-56 md:h-auto flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.classList.add('bg-lifewood-green/10', 'dark:bg-lifewood-green/20', 'flex', 'items-center', 'justify-center');
                parent.innerHTML = '<span class="text-lifewood-green/40 dark:text-lifewood-saffron/40 text-6xl font-black select-none">LW</span>';
              }
            }}
          />
        </div>

        <div className="md:w-3/5 w-full p-8 flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-3 text-lifewood-green dark:text-lifewood-saffron">
            <DecryptText text={title} trigger={visible} />
          </h3>
          <p className="text-lg whitespace-pre-line text-lifewood-dark/80 dark:text-lifewood-seaSalt/90 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC<ProjectsProps> = ({ t }) => (
  <section id="projects" className="max-w-6xl mx-auto py-20 px-4">
    <div className="text-center mb-14">
      <p className="text-sm font-bold uppercase tracking-widest text-lifewood-green dark:text-lifewood-saffron mb-3">{t.eyebrow}</p>
      <h2 className="text-5xl md:text-6xl font-extrabold text-lifewood-dark dark:text-lifewood-white mb-5">{t.title}</h2>
      <p className="text-lg text-lifewood-dark/60 dark:text-lifewood-seaSalt/70 max-w-2xl mx-auto leading-relaxed">{t.description}</p>
    </div>

    <div className="space-y-10">
      {t.items.map((proj: any, idx: number) => (
        <AnimatedCard key={proj.title} title={proj.title} description={proj.description} image={proj.image} index={idx} />
      ))}
    </div>
  </section>
);

export default Projects;
