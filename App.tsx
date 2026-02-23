
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import About from './components/About.tsx';
import StatsBar from './components/StatsBar.tsx';
import Services from './components/Services.tsx';
import VideoShowcase from './components/VideoShowcase.tsx';
import GlobalScale from './components/GlobalScale.tsx';
import Partners from './components/Partners.tsx';
import Projects from './components/Projects.tsx';
import Careers from './components/Careers.tsx';
import CTASection from './components/CTASection.tsx';
import Footer from './components/Footer.tsx';
import AIConsultant from './components/AIConsultant.tsx';
import ApplicationModal from './components/ApplicationModal.tsx';
import { Language, Theme } from './types.ts';
import ClickSpark from './components/ClickSpark';

const translations = {
  en: {
    nav: {
      services: 'Services',
      projects: 'Projects',
      partners: 'Partners',
      scale: 'Global Scale',
      company: 'Our Company',
      careers: 'Careers',
      apply: 'Apply Now',
      settings: 'Settings',
      language: 'Language',
      toggleTheme: 'Toggle Theme',
      changeLanguage: 'Change Language',
      closeMenu: 'Close menu'
    },
    hero: {
      title: "The world's leading provider of",
      accent: 'AI-powered',
      subtitle: 'data solutions.',
      contact: 'Contact Us',
      learn: 'Learn More',
      typewriterPhrases: ['AI-powered', 'AI-Powered Data', 'Global Innovation', 'Human Potential', 'The Future of Work'],
      videoFallback: 'Your browser does not support the video tag.'
    },
    about: {
      mission: 'Our Mission',
      vision: 'Our Vision',
      missionText: "To uncover new methods and insights that reveal unexpected directions and possibilities, connecting across time, generations and technologies for everyone while delivering the highest levels of scalability, integration and security.",
      visionText: "A world where AI and human intelligence seamlessly collaborate to create dynamic opportunities and prosperous communities, transcending geographical and cultural boundaries to solve humanity's greatest challenges.",
      values: 'Our Core Values',
      principles: 'The principles that guide everything we do',
      journeyCta: 'Join our journey',
      stats: [
        { value: '40+', label: 'Delivery Centers' },
        { value: '30+', label: 'Countries' }
      ],
      coreValues: [
        {
          id: 'innovation',
          title: 'Innovation First',
          description: 'We ignite cultures of innovation, always seeking new methods and insights to reveal unexpected directions and possibilities.'
        },
        {
          id: 'connectivity',
          title: 'Global Connectivity',
          description: 'Building bridges and forming new friendships across time, generations, and technologies, connecting everyone worldwide.'
        },
        {
          id: 'excellence',
          title: 'Excellence in Delivery',
          description: 'Delivering the highest levels of scalability, integration, and security while maintaining unwavering quality standards.'
        },
        {
          id: 'empowerment',
          title: 'Team Empowerment',
          description: 'Motivating and growing teams that can initiate and learn on the run, fostering continuous adaptation and growth.'
        }
      ]
    },
    statsBar: {
      items: [
        { value: 40, suffix: '+', label: 'Global Delivery Centers' },
        { value: 30, suffix: '+', label: 'Countries Worldwide' },
        { value: 50, suffix: '+', label: 'Languages Supported' },
        { value: 56000, suffix: '+', label: 'Online Resources' }
      ]
    },
    services: {
      title: 'What We Offer',
      subtitle: 'AI Data Services',
      desc: 'Lifewood offers AI and IT services that enhance decision-making, reduce costs, and improve productivity to optimize organizational performance.',
      clickHint: 'Click to view',
      selectedLabel: 'Selected',
      hoverHint: 'Hover to explore',
      items: [
        { icon: 'ðŸŽµ', title: 'Audio', description: 'Collection, labelling, voice categorization, music categorization, intelligent customer service solutions.' },
        { icon: 'ðŸ–¼ï¸', title: 'Image', description: 'Collection, labelling, classification, audit, object detection and tagging for computer vision applications.' },
        { icon: 'ðŸŽ¬', title: 'Video', description: 'Collection, labelling, audit, live broadcast analysis, subtitle generation and video content processing.' },
        { icon: 'ðŸ“', title: 'Text', description: 'Text collection, labelling, transcription, utterance collection, sentiment analysis and NLP solutions.' }
      ]
    },
    video: {
      label: 'Operations Showcase',
      title: 'Transforming the Future of Data',
      description: "Watch how Lifewood's global infrastructure and specialized teams process millions of data points daily with unmatched precision and speed.",
      featureInfrastructure: 'Global Infrastructure',
      featureSpeed: 'Next-Gen Speed',
      videoFallback: 'Your browser does not support the video tag.'
    },
    scale: {
      title: 'Global Capabilities',
      subtitle: 'Delivering the highest levels of scalability, integration, and security',
      capabilities: [
        {
          title: '100+ Language Capabilities',
          description: 'Seamless communication across diverse cultures and markets',
          bullets: ['Real-time translation', 'Cultural adaptation', 'Localized solutions', 'Native support teams']
        },
        {
          title: '24/7 Global Operations',
          description: 'Follow-the-sun model ensuring continuous service delivery',
          bullets: ['Round-the-clock support', 'Time zone optimization', 'Seamless handoffs', 'Always-on monitoring']
        },
        {
          title: 'Unified Technology Platform',
          description: 'Single platform connecting all global operations and teams',
          bullets: ['Cloud-native infrastructure', 'Real-time synchronization', 'Global data lakes', 'Unified analytics']
        }
      ]
    },
    partners: {
      eyebrow: 'Our Clients And Partners',
      title: 'Trusted By Industry Leaders',
      description: "We are proud to partner and work with leading organizations worldwide in transforming data into meaningful solutions. Lifewood's commitment to innovation and excellence has earned the trust of global brands across industries."
    },
    projects: {
      eyebrow: 'Our Work',
      title: 'What We Do',
      description: "From building AI datasets in diverse languages and environments, to developing platforms that enhance productivity and open new opportunities in under-resourced economies, you'll see how Lifewood is shaping the future with innovation, integrity and a focus on people.",
      items: [
        {
          title: 'AI Data Extraction',
          description: 'Using AI, we optimize the acquisition of image and text from multiple sources. Techniques include onsite scanning, drone photography, negotiation with archives and the formation of alliances with corporations, religious organizations and governments.',
          image: '/AI-data-extraction.png'
        },
        {
          title: 'Machine Learning Enablement',
          description: 'From simple data to deep learning, our data solutions are highly flexible and can enable a wide variety of ML systems, no matter how complex the model.',
          image: '/Machine-Learning-Enablement.png'
        },
        {
          title: 'Autonomous Driving Technology',
          description: 'Our expertise in precision data labelling lays the groundwork for AI, so that it can process and adapt to the complexities of real-world conditions. We have implemented a diverse mapping methodology, that employs a wide range of data types, including 2D and 3D models, and combinations of both, to create a fully visualized cognitive driving system.\n\nMillions of images, videos and mapping data were annotated, effectively transitioning this technology from theoretical models to real-world applications - a significant leap forward for autonomous transport.\n\nLifewood remains at the forefront of this technology, pioneering the evolution of safe, efficient autonomous driving solutions.',
          image: '/Autonomous-Driving-Technology.png'
        },
        {
          title: 'Natural Language Processing and Speech Acquisition',
          description: "We have partnered with some of the world's most advanced companies in NLP development. With a managed workforce that spans the globe, we offer solutions in over 50 language capabilities and can assess various dialects and accents for both text and audio data. We specialize in collecting and transcribing recordings from native speakers. This has involved tens of thousands of conversations, a scale made possible by our expertise in adapting industrial processes and our integration with AI.",
          image: '/Natural-Language-Processing-and-Speech-Acquisition.png'
        },
        {
          title: 'Computer Vision (CV)',
          description: 'Training AI to see and understand the world requires a high volume of quality training data. Lifewood provides total data solutions for your CV development from collection to annotation to classification and more, for video and image datasets enabling machines to interpret visual information. We have experience in a wide variety of applications including autonomous vehicles, farm monitoring, face recognition and more.',
          image: '/Computer-Vision.png'
        },
        {
          title: 'Genealogy',
          description: 'Powered by AI, Lifewood processes genealogical material at speed and scale, to conserve and illuminate family histories, national archives, corporate lists and records of all types. Lifewood has more than 18 years of experience capturing, scanning and processing genealogical data. In fact, Lifewood started with genealogy data as its core business, so that over the years we have accumulated vast knowledge in diverse types of genealogy indexing.\n\nWe have worked with all the major genealogy companies and have extensive experience in transcribing and indexing genealogical content in a wide variety of formats, including tabular, pre-printed forms and paragraph-style records.\n\nWorking across borders, with offices on every continent, our ability with multi-language projects has built an extensive capability spanning more than 50 languages and associated dialects. Now, powered by AI and the latest inter-office communication systems, we are transforming ever more efficient ways to service our clients, while keeping humanity at the centre of our activity.\n\nGenealogical material that we have experience with includes:\n- Census\n- Vital - BMD\n- Church and Parish Registers\n- Passenger Lists\n- Naturalisation\n- Military Records\n- Legal Records\n- Yearbooks',
          image: '/Genealogy.png'
        }
      ]
    },
    careers: {
      title: 'LIFEWOOD CAREERS',
      tag: 'ALWAYS ON NEVER OFF',
      join: 'JOIN OUR TEAM',
      positions: 'Open Positions',
      stats: [
        { value: '34,000+', label: 'Devoted Specialists' },
        { value: '50+', label: 'Delivery Sites' },
        { value: '30+', label: 'Countries on 4 Continents' },
        { value: '100+', label: 'Language Capabilities' }
      ],
      openPositions: [
        { title: 'AI Research Scientist', department: 'Innovation Lab', level: 'Senior', description: 'Lead breakthrough AI research initiatives across our global innovation labs, developing next-generation machine learning algorithms.', buttonText: 'Apply Now' },
        { title: 'Global Data Engineer', department: 'Data Platform', level: 'Mid-Senior', description: 'Design and build scalable data infrastructure supporting our 34,000+ specialists across 50+ delivery sites worldwide.', buttonText: 'Apply Now' },
        { title: 'Cultural AI Specialist', department: 'Global Solutions', level: 'Mid-level', description: 'Develop AI solutions that adapt to cultural contexts, ensuring our technology works seamlessly across diverse global markets.', buttonText: 'Apply Now' },
        { title: 'Technology Innovation Intern', department: 'Multiple Teams', level: 'Entry-level', description: 'Join our transformation projects in AI, machine learning, computer vision, and emerging technologies with global impact.', buttonText: 'Apply for Internship', isPrimary: true }
      ],
      formTitle: 'Application Form',
      formDesc: 'Fill out the form below to apply for your preferred project internship.',
      firstName: 'First Name *',
      lastName: 'Last Name *',
      age: 'Age',
      email: 'Email Address *',
      degree: 'Degree/Field of Study',
      degreePlaceholder: 'e.g., Computer Science, Data Science, Engineering',
      project: 'Project Applied For *',
      selectProject: 'Select a project',
      experience: 'Relevant Experience',
      experiencePlaceholder: 'Describe your relevant experience, projects, skills, or coursework...',
      submitButton: 'Submit Application',
      closeButton: 'Close',
      successMessage: 'Application submitted successfully!',
      projectOptions: [
        { value: 'audio', label: 'Audio Labeling Project' },
        { value: 'image', label: 'Computer Vision Internship' },
        { value: 'video', label: 'Video Content Analysis' },
        { value: 'nlp', label: 'Natural Language Processing' }
      ],
      joinTitle: 'Join Our Team',
      joinDescription: 'Apply for an internship and be part of groundbreaking technology projects that are shaping the future.'
    },
    cta: {
      title: 'Ready to Transform Your Data?',
      description: 'We provide global Data Engineering Services to enable AI Solutions. Reach out to our team of experts today.',
      button: 'Contact Us Today'
    },
    footer: {
      brandDescription: 'Empowering innovation through AI-powered data solutions. Bringing big data to life for the good of humankind.',
      company: 'Company',
      legal: 'Legal',
      getInTouch: 'Get In Touch',
      aboutUs: 'About Us',
      services: 'Services',
      careers: 'Careers',
      projects: 'Projects',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      location: 'Global Offices across 30+ Countries',
      rightsReserved: 'All Rights Reserved'
    },
    ai: {
      greeting: 'Hello! I am your Lifewood AI Consultant. How can our data solutions help your business today?',
      headerTitle: 'Lifewood AI',
      headerSubtitle: 'Online Consultant',
      placeholder: 'Type your message...',
      fallbackResponse: "I'm sorry, I couldn't generate a response. Please try rephrasing your question or contact us directly.",
      connectionError: 'There was an error connecting to our consultant. Please try again later.',
      credentialsError: 'The AI Consultant is currently configuring its credentials. Please try again in a few moments.'
    }
  },
  fil: {
    nav: { projects: 'Mga Proyekto', partners: 'Mga Kasosyo' },
    partners: {
      eyebrow: 'Aming Mga Kliyente at Kasosyo',
      title: 'Pinagkakatiwalaan ng mga Nangungunang Lider sa Industriya',
      description: 'Ipinagmamalaki naming makipag-partner sa mga organisasyon sa buong mundo upang gawing makabuluhang solusyon ang data.'
    },
    projects: { eyebrow: 'Aming Mga Gawa', title: 'Ano ang Ginagawa Namin' }
  },
  ja: {
    nav: { projects: 'プロジェクト', partners: 'パートナー' },
    partners: {
      eyebrow: 'クライアントとパートナー',
      title: '業界をリードする企業からの信頼',
      description: 'Lifewoodは世界中の主要組織と連携し、データを価値あるソリューションへと変革しています。'
    },
    projects: { eyebrow: '私たちの仕事', title: '私たちの取り組み' }
  },
  ko: {
    nav: { projects: '프로젝트', partners: '파트너' },
    partners: {
      eyebrow: '고객 및 파트너',
      title: '업계 리더들이 신뢰하는 Lifewood',
      description: 'Lifewood는 전 세계 선도 조직과 협력하여 데이터를 의미 있는 솔루션으로 전환합니다.'
    },
    projects: { eyebrow: '우리의 작업', title: '우리가 하는 일' }
  },
  zh: {
    nav: { projects: '项目', partners: '合作伙伴' },
    partners: {
      eyebrow: '我们的客户与合作伙伴',
      title: '深受行业领导者信赖',
      description: '我们很荣幸与全球领先组织合作，将数据转化为有价值的解决方案。'
    },
    projects: { eyebrow: '我们的工作', title: '我们的工作内容' }
  },
  es: {
    nav: { projects: 'Proyectos', partners: 'Socios' },
    partners: {
      eyebrow: 'Nuestros Clientes y Socios',
      title: 'Con la Confianza de Lideres de la Industria',
      description: 'Nos enorgullece colaborar con organizaciones lideres para transformar datos en soluciones con impacto.'
    },
    projects: { eyebrow: 'Nuestro Trabajo', title: 'Que Hacemos' }
  }
};
const deepMerge = (base: any, override: any): any => {
  if (Array.isArray(base) || Array.isArray(override)) {
    return override ?? base;
  }
  if (typeof base !== 'object' || base === null) {
    return override ?? base;
  }
  const result: Record<string, any> = { ...base };
  if (!override || typeof override !== 'object') {
    return result;
  }
  Object.keys(override).forEach((key) => {
    result[key] = deepMerge(base[key], override[key]);
  });
  return result;
};

const App: React.FC = () => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('lifewood-lang') as Language) || 'en');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('lifewood-theme') as Theme) || 'light');

  const t = deepMerge(translations.en, translations[language]);

  useEffect(() => {
    localStorage.setItem('lifewood-lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('lifewood-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const openApplyModal = () => setIsApplyModalOpen(true);
  const closeApplyModal = () => setIsApplyModalOpen(false);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <ClickSpark>
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-lifewood-dark text-lifewood-seaSalt' : 'bg-lifewood-seaSalt text-lifewood-dark'}`}>
      <Navbar 
        onApplyClick={openApplyModal} 
        currentLang={language} 
        onLangChange={setLanguage} 
        currentTheme={theme}
        onThemeToggle={toggleTheme}
        t={t.nav}
      />
      <main>
        <Hero onApplyClick={openApplyModal} t={t.hero} />
        <About onApplyClick={openApplyModal} t={t.about} />
        <StatsBar t={t.statsBar} />
        <Services t={t.services} />
        <VideoShowcase t={t.video} />
        <GlobalScale t={t.scale} />
        <Partners t={t.partners} />
        <Projects t={t.projects} />
        <Careers onApplyClick={openApplyModal} t={t.careers} />
        <CTASection onApplyClick={openApplyModal} t={t.cta} />
      </main>
      <Footer t={t.footer} />
      <AIConsultant t={t.ai} lang={language} />
      
      <ApplicationModal isOpen={isApplyModalOpen} onClose={closeApplyModal} t={t.careers} />
    </div>
    </ClickSpark>
  );
};

export default App;


