import React, { useState, useEffect } from 'react';
import { Language, Theme } from '../types.ts';

interface NavbarProps {
  onApplyClick: () => void;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  currentTheme: Theme;
  onThemeToggle: () => void;
  t: any;
}

const Navbar: React.FC<NavbarProps> = ({ onApplyClick, currentLang, onLangChange, currentTheme, onThemeToggle, t }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const navLinks = [
    { name: t.services, href: '#services' },
    { name: t.projects, href: '#projects' },
    { name: t.partners, href: '#partners' },
    { name: t.scale, href: '#global-scale' },
    { name: t.company, href: '#our-company' },
    { name: t.careers, href: '#careers' },
  ];

  const languageNames: Record<Language, Record<Language, string>> = {
    en: { en: 'English', fil: 'Filipino', ja: 'Japanese', ko: 'Korean', zh: 'Chinese', es: 'Spanish' },
    fil: { en: 'Ingles', fil: 'Filipino', ja: 'Hapones', ko: 'Koreano', zh: 'Tsino', es: 'Espanyol' },
    ja: { en: '英語', fil: 'フィリピノ語', ja: '日本語', ko: '韓国語', zh: '中国語', es: 'スペイン語' },
    ko: { en: '영어', fil: '필리핀어', ja: '일본어', ko: '한국어', zh: '중국어', es: '스페인어' },
    zh: { en: '英语', fil: '菲律宾语', ja: '日语', ko: '韩语', zh: '中文', es: '西班牙语' },
    es: { en: 'Ingles', fil: 'Filipino', ja: 'Japones', ko: 'Coreano', zh: 'Chino', es: 'Espanol' },
  };

  const languages = (Object.keys(languageNames[currentLang]) as Language[]).map((code) => ({
    code,
    label: languageNames[currentLang][code],
  }));

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    if (elem) {
      window.scrollTo({ top: elem.offsetTop - 80, behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  const textColorClass = scrolled
    ? 'text-lifewood-green dark:text-lifewood-seaSalt'
    : 'text-lifewood-white';

  const logoColorClass = scrolled
    ? 'text-lifewood-green dark:text-lifewood-saffron'
    : 'text-lifewood-white dark:text-lifewood-saffron';

  return (
    <>
      {/* ✅ Navbar bar — always visible, separated from sliding panel */}
      <nav className={`fixed top-0 left-0 w-full z-[200] transition-all duration-300 py-3 px-6 md:px-12 border-b ${
        scrolled
          ? 'bg-lifewood-white/95 dark:bg-lifewood-dark/95 backdrop-blur-md shadow-sm border-lifewood-paper dark:border-lifewood-green/20'
          : 'bg-lifewood-dark/20 backdrop-blur-sm border-transparent lg:bg-transparent lg:backdrop-blur-none'
      }`}>
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">

          {/* Logo */}
          <a href="#home" onClick={(e) => scrollToSection(e, '#home')} className="flex items-center space-x-2">
            <span className="rounded-md p-1 bg-lifewood-paper/90 shadow-sm inline-flex items-center">
              <img
                src="/lifewood-logo.png"
                alt="Lifewood"
                className="h-8 md:h-10 object-contain transition-all duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.classList.add('hidden');
                  const fallback = document.createElement('span');
                  fallback.textContent = 'LIFEWOOD';
                  fallback.className = `text-2xl font-black tracking-tighter transition-colors duration-300 ${logoColorClass}`;
                  target.parentElement?.appendChild(fallback);
                }}
              />
            </span>
          </a>

          {/* Desktop Controls */}
<div className="hidden lg:flex items-center space-x-4">
  <ul className="flex items-center">
    {navLinks.map((item) => (
      <li key={item.name}>
        
          <a href={item.href}
          onClick={(e) => scrollToSection(e, item.href)}
          className={`px-4 py-2 text-[15px] font-bold transition-colors duration-300 hover:opacity-70 whitespace-nowrap ${textColorClass}`}
        >
          {item.name}
        </a>
      </li>
    ))}
  </ul>

            <div className="flex items-center space-x-2 pl-4 border-l dark:border-lifewood-green/20 border-lifewood-white/20">
              {/* Theme Toggle */}
              <button
                onClick={onThemeToggle}
                className={`p-2 rounded-full transition-colors duration-300 hover:bg-black/5 dark:hover:bg-white/10 ${textColorClass}`}
                title={t.toggleTheme}
              >
                {currentTheme === 'light' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>

              {/* Language Selection */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className={`p-2 rounded-full transition-colors duration-300 hover:bg-black/5 dark:hover:bg-white/10 ${textColorClass}`}
                  title={t.changeLanguage}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </button>
                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-lifewood-white dark:bg-lifewood-dark rounded-xl shadow-xl border border-lifewood-paper dark:border-lifewood-green/20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { onLangChange(lang.code as Language); setIsLangOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-lifewood-seaSalt dark:hover:bg-lifewood-dark/50 ${currentLang === lang.code ? 'text-lifewood-green font-bold' : 'text-lifewood-dark/60 dark:text-lifewood-seaSalt/60'}`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={onApplyClick}
                className="bg-lifewood-green dark:bg-lifewood-saffron text-lifewood-white dark:text-lifewood-dark px-7 py-3 rounded-lg font-bold text-[15px] transition-all hover:bg-lifewood-dark dark:hover:bg-lifewood-earth hover:shadow-md active:scale-95 whitespace-nowrap ml-2"
              >
                {t.apply}
              </button>
            </div>
          </div>

          {/* ✅ Hamburger — always on top */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 focus:outline-none text-lifewood-white"
            style={{ zIndex: 300 }}
          >
            {isMenuOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* ✅ Backdrop — outside nav so it doesn't cover the hamburger */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-lifewood-dark/60 backdrop-blur-sm lg:hidden"
          style={{ zIndex: 250 }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* ✅ Mobile Menu Panel — outside nav, slides in from right */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xs bg-lifewood-white dark:bg-lifewood-dark lg:hidden shadow-2xl overflow-y-auto transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 270 }}
      >
        {/* Close Button inside panel */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-6 right-6 p-2 text-lifewood-dark dark:text-lifewood-seaSalt hover:opacity-70 transition-opacity"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col h-full pt-24 px-8 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-lifewood-paper dark:border-lifewood-green/20">
            <span className="font-bold text-lifewood-dark/40 dark:text-lifewood-seaSalt/40 uppercase tracking-widest text-xs">{t.settings}</span>
            <div className="flex items-center space-x-4">
              <button onClick={onThemeToggle} className="p-2 rounded-lg bg-lifewood-seaSalt dark:bg-lifewood-dark/50">
                {currentTheme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>

          {navLinks.map((item) => (
            
              <a key={item.name}
              href={item.href}
              onClick={(e) => { scrollToSection(e, item.href); setIsMenuOpen(false); }}
              className="text-2xl font-bold text-lifewood-green dark:text-lifewood-seaSalt border-b border-lifewood-paper dark:border-lifewood-green/20 pb-2"
            >
              {item.name}
            </a>
          ))}

          <div className="pt-4">
            <label className="block text-xs font-bold text-lifewood-dark/40 dark:text-lifewood-seaSalt/40 uppercase mb-3">{t.language}</label>
            <div className="grid grid-cols-2 gap-2">
              {languages.map(l => (
                <button
                  key={l.code}
                  onClick={() => onLangChange(l.code as Language)}
                  className={`p-2 text-sm rounded-lg border ${currentLang === l.code ? 'border-lifewood-green bg-lifewood-green/5 text-lifewood-green' : 'border-lifewood-paper dark:border-lifewood-green/20 text-lifewood-dark/60 dark:text-lifewood-seaSalt/60'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => { onApplyClick(); setIsMenuOpen(false); }}
            className="bg-lifewood-green text-lifewood-white text-center py-4 rounded-xl font-bold text-xl mt-4"
          >
            {t.apply}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;