import React from 'react';

interface FooterProps {
  t: any;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    if (elem) {
      e.preventDefault();
      window.scrollTo({
        top: elem.offsetTop - 80,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', href);
    }
  };

  return (
    <footer className="bg-lifewood-dark text-lifewood-seaSalt pt-20 pb-10 px-6 md:px-12 border-t border-lifewood-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center">
              <span className="rounded-md p-1 bg-lifewood-paper/90 shadow-sm inline-flex items-center">
                <img
                  src="/lifewood-logo.png"
                  alt="Lifewood"
                  className="h-8 md:h-10 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.classList.add('hidden');
                    const fallback = document.createElement('span');
                    fallback.textContent = 'LIFEWOOD';
                    fallback.className = 'text-2xl font-black tracking-tighter text-lifewood-saffron';
                    target.parentElement?.appendChild(fallback);
                  }}
                />
              </span>
            </div>
            <p className="text-lifewood-seaSalt/60 leading-relaxed text-sm">{t.brandDescription}</p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 bg-lifewood-white/10 rounded-full flex items-center justify-center hover:bg-lifewood-saffron transition-all group" aria-label="LinkedIn">
                <svg className="w-4 h-4 text-lifewood-seaSalt group-hover:text-lifewood-dark transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 bg-lifewood-white/10 rounded-full flex items-center justify-center hover:bg-lifewood-saffron transition-all group" aria-label="Facebook">
                <svg className="w-4 h-4 text-lifewood-seaSalt group-hover:text-lifewood-dark transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 bg-lifewood-white/10 rounded-full flex items-center justify-center hover:bg-lifewood-saffron transition-all group" aria-label="YouTube">
                <svg className="w-4 h-4 text-lifewood-seaSalt group-hover:text-lifewood-dark transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.499 6.203a2.995 2.995 0 00-2.104-2.116C19.559 3.5 12 3.5 12 3.5s-7.559 0-9.395.587A2.995 2.995 0 000 6.203C0 8.037 0 12 0 12s0 3.963.605 5.797a2.995 2.995 0 002.104 2.116C4.441 20.5 12 20.5 12 20.5s7.559 0 9.395-.587a2.995 2.995 0 002.104-2.116C24 15.963 24 12 24 12s0-3.963-.501-5.797zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 bg-lifewood-white/10 rounded-full flex items-center justify-center hover:bg-lifewood-saffron transition-all group" aria-label="Instagram">
                <svg className="w-4 h-4 text-lifewood-seaSalt group-hover:text-lifewood-dark transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.63c-.786.297-1.449.645-2.088 1.284-.44.44-.856 1.076-1.084 1.886-.297.788-.398 1.657-.456 2.907-.059 1.271-.074 1.644-.074 4.848s.015 3.577.072 4.857c.06 1.271.261 2.148.558 2.913.306.788.645 1.451 1.284 2.088.44.44 1.079.857 1.887 1.085.766.296 1.636.499 2.913.558 1.271.06 1.645.074 4.848.074s3.577-.015 4.856-.072c1.271-.06 2.148-.262 2.913-.559.786-.306 1.45-.645 2.088-1.284.44-.44.856-1.079 1.084-1.886.297-.765.499-1.636.558-2.913.06-1.271.074-1.645.074-4.848s-.015-3.577-.072-4.857c-.06-1.271-.262-2.148-.559-2.913-.306-.786-.645-1.45-1.284-2.088-.44-.44-1.079-.856-1.886-1.084-.765-.297-1.636-.499-2.913-.558C15.577.035 15.203.001 12 0zm0 2.16c3.203 0 3.585.009 4.849.07 1.171.06 1.805.262 2.227.437.562.217.96.477 1.382.896.419.42.679.819.896 1.381.175.422.378 1.056.437 2.228.06 1.263.07 1.646.07 4.848s-.01 3.585-.07 4.849c-.06 1.171-.262 1.805-.436 2.226-.217.561-.477.96-.896 1.382-.42.419-.824.679-1.38.896-.423.175-1.057.378-2.228.437-1.263.06-1.649.07-4.848.07-3.199 0-3.586-.01-4.849-.07-1.172-.06-1.806-.262-2.228-.436-.56-.217-.96-.477-1.382-.897-.419-.419-.679-.823-.896-1.379-.175-.423-.378-1.057-.437-2.228-.06-1.264-.07-1.647-.07-4.849s.01-3.585.07-4.849c.06-1.172.262-1.806.436-2.227.217-.561.477-.96.897-1.382.419-.419.823-.679 1.379-.896.423-.175 1.057-.378 2.228-.437 1.264-.06 1.647-.07 4.849-.07z" />
                  <circle cx="12" cy="12" r="3.305" />
                  <path d="M17.098 5.678a1.04 1.04 0 100 2.08 1.04 1.04 0 000-2.08z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 text-lifewood-white uppercase tracking-widest">{t.company}</h4>
            <ul className="space-y-3 text-lifewood-seaSalt/60 text-sm">
              <li>
                <a href="#our-company" onClick={(e) => scrollToSection(e, '#our-company')} className="hover:text-lifewood-saffron transition-colors">
                  {t.aboutUs}
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => scrollToSection(e, '#services')} className="hover:text-lifewood-saffron transition-colors">
                  {t.services}
                </a>
              </li>
              <li>
                <a href="#careers" onClick={(e) => scrollToSection(e, '#careers')} className="hover:text-lifewood-saffron transition-colors">
                  {t.careers}
                </a>
              </li>
              <li>
                <a href="#projects" onClick={(e) => scrollToSection(e, '#projects')} className="hover:text-lifewood-saffron transition-colors">
                  {t.projects}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 text-lifewood-white uppercase tracking-widest">{t.legal}</h4>
            <ul className="space-y-3 text-lifewood-seaSalt/60 text-sm">
              <li>
                <a href="/privacy-policy.html" className="hover:text-lifewood-saffron transition-colors">
                  {t.privacy}
                </a>
              </li>
              <li>
                <a href="/terms.html" className="hover:text-lifewood-saffron transition-colors">
                  {t.terms}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 text-lifewood-white uppercase tracking-widest">{t.getInTouch}</h4>
            <ul className="space-y-4 text-lifewood-seaSalt/60 text-sm">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-lifewood-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@lifewood.com" className="hover:text-lifewood-saffron transition-colors break-all">
                  info@lifewood.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-lifewood-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{t.location}</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-lifewood-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <a href="https://www.lifewood.com" target="_blank" rel="noopener noreferrer" className="hover:text-lifewood-saffron transition-colors">
                  www.lifewood.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-lifewood-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-lifewood-seaSalt/40 text-sm">
          <p>&copy; {new Date().getFullYear()} Lifewood - {t.rightsReserved}</p>
          <div className="flex gap-6" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
