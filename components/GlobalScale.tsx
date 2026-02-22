
import React from 'react';

interface GlobalScaleProps {
  t: any;
}

const defaultCapabilities = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    title: '100+ Language Capabilities',
    description: 'Seamless communication across diverse cultures and markets',
    bullets: ['Real-time translation', 'Cultural adaptation', 'Localized solutions', 'Native support teams']
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '24/7 Global Operations',
    description: 'Follow-the-sun model ensuring continuous service delivery',
    bullets: ['Round-the-clock support', 'Time zone optimization', 'Seamless handoffs', 'Always-on monitoring']
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Unified Technology Platform',
    description: 'Single platform connecting all global operations and teams',
    bullets: ['Cloud-native infrastructure', 'Real-time synchronization', 'Global data lakes', 'Unified analytics']
  }
];

const GlobalScale: React.FC<GlobalScaleProps> = ({ t }) => {
  return (
    <section id="global-scale" className="py-24 px-6 md:px-12 bg-lifewood-white dark:bg-lifewood-dark/80 scroll-mt-24 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-lifewood-green dark:text-lifewood-white mb-4">{t.title}</h2>
          <p className="text-lifewood-dark/60 dark:text-lifewood-seaSalt/60 text-lg max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(t.capabilities || defaultCapabilities).map((item: any, idx: number) => {
            const fallback = defaultCapabilities[idx];
            const icon = item.icon ?? fallback?.icon;

            return (
            <div 
              key={idx} 
              className="bg-lifewood-white dark:bg-lifewood-dark/40 p-10 rounded-2xl border border-lifewood-paper dark:border-lifewood-green/20 shadow-sm hover:shadow-2xl hover:-translate-y-3 hover:bg-lifewood-seaSalt/30 dark:hover:bg-lifewood-green/10 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-14 h-14 bg-lifewood-paper dark:bg-lifewood-green/20 rounded-xl flex items-center justify-center text-lifewood-green dark:text-lifewood-saffron mb-8 group-hover:scale-125 group-hover:bg-lifewood-green group-hover:text-lifewood-white dark:group-hover:bg-lifewood-saffron dark:group-hover:text-lifewood-dark transition-all duration-300">
                {icon}
              </div>
              <h3 className="text-2xl font-bold text-lifewood-dark dark:text-lifewood-white mb-4 group-hover:text-lifewood-green dark:group-hover:text-lifewood-saffron transition-colors duration-300">{item.title}</h3>
              <p className="text-lifewood-dark/50 dark:text-lifewood-seaSalt/50 mb-8 leading-relaxed group-hover:text-lifewood-dark/70 dark:group-hover:text-lifewood-seaSalt/70 transition-colors duration-300">
                {item.description}
              </p>
              <ul className="space-y-3">
                {item.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-center gap-3 text-lifewood-dark/60 dark:text-lifewood-seaSalt/60 group-hover:text-lifewood-dark/80 dark:group-hover:text-lifewood-seaSalt/80 transition-colors duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-lifewood-green dark:bg-lifewood-saffron shrink-0"></span>
                    <span className="text-sm font-medium">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )})}
        </div>
      </div>
    </section>
  );
};

export default GlobalScale;
