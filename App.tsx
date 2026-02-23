
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
        { icon: '🎵', title: 'Audio', description: 'Collection, labelling, voice categorization, music categorization, intelligent customer service solutions.' },
        { icon: '🖼️', title: 'Image', description: 'Collection, labelling, classification, audit, object detection and tagging for computer vision applications.' },
        { icon: '🎬', title: 'Video', description: 'Collection, labelling, audit, live broadcast analysis, subtitle generation and video content processing.' },
        { icon: '📝', title: 'Text', description: 'Text collection, labelling, transcription, utterance collection, sentiment analysis and NLP solutions.' }
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
    nav: { services: 'Serbisyo', partners: 'Mga Kasosyo', scale: 'Global na Scale', company: 'Aming Kumpanya', careers: 'Trabaho', apply: 'Mag-apply Na' },
    hero: { title: "Ang nangungunang provider sa mundo ng", accent: "AI-powered", subtitle: "na solusyon sa data.", contact: "Makipag-ugnayan", learn: "Matuto Pa" },
    about: { mission: "Aming Misyon", vision: "Aming Bisyon", missionText: "Upang tumuklas ng mga bagong pamamaraan at insight na nagpapakita ng mga hindi inaasahang direksyon at posibilidad, kumokonekta sa panahon, henerasyon at teknolohiya para sa lahat.", visionText: "Isang mundo kung saan ang AI at katalinuhan ng tao ay walang putol na nagtutulungan upang lumikha ng mga dinamikong pagkakataon.", values: "Aming Core Values", principles: "Ang mga prinsipyo na gumagabay sa lahat ng aming ginagawa" },
    services: { title: "Ano ang Inaalok Namin", subtitle: "AI Data Services", desc: "Nag-aalok ang Lifewood ng mga serbisyo ng AI at IT na nagpapahusay sa paggawa ng desisyon at nagpapabuti sa pagiging produktibo." },
    video: { label: "Showcase ng Operasyon", title: "Pagbabago sa Kinabukasan ng Data", description: "Panoorin kung paano ang global na imprastraktura ng Lifewood at mga espesyalistang team ay nagpoproseso ng milyun-milyong data point araw-araw." },
    scale: { title: "Global na Kakayahan", subtitle: "Paghahatid ng pinakamataas na antas ng scalability, integration, at seguridad" },
    careers: { title: "KARERA SA LIFEWOOD", tag: "LAGING BUKAS HINDI TUMITIGIL", join: "SUMALI SA AMING TEAM", positions: "Mga Bakanteng Trabaho", formTitle: "Application Form", formDesc: "Fill out the form below to apply for your preferred project internship.", firstName: "First Name *", lastName: "Last Name *", age: "Age", email: "Email Address *", degree: "Degree/Field of Study", degreePlaceholder: "e.g., Computer Science, Data Science, Engineering", project: "Project Applied For *", selectProject: "Select a project", experience: "Relevant Experience", experiencePlaceholder: "Describe your relevant experience, projects, skills, or coursework...", submitButton: "Submit Application", closeButton: "Close" },
    cta: { title: "Handa nang baguhin ang iyong Data?", button: "Makipag-ugnayan Ngayon" }
  },
  ja: {
    nav: { services: 'サービス', partners: 'パートナー', scale: 'グローバル規模', company: '会社概要', careers: '採用情報', apply: '今すぐ応募' },
    hero: { title: "世界をリードする", accent: "AI駆動型", subtitle: "データソリューションプロバイダー。", contact: "お問い合わせ", learn: "詳細を見る" },
    about: { mission: "私たちの使命", vision: "私たちのビジョン", missionText: "新しい手法と洞察を発見し、予期せぬ方向性と可能性を明らかにし、あらゆる人々のために時代、世代、技術を超えてつながること。", visionText: "AIと人間の知性がシームレスに協力し、地理的および文化的な境界を越えて動的な機会を生み出す世界。", values: "コアバリュー", principles: "私たちのすべての行動を導く原則" },
    services: { title: "提供サービス", subtitle: "AIデータサービス", desc: "Lifewoodは、意思決定を強化し、コストを削減し、生産性を向上させて組織のパフォーマンスを最適화するAIおよびITサービスを提供します。" },
    video: { label: "オペレーション紹介", title: "データの未来を変革する", description: "Lifewoodのグローバルなインフラストラクチャと専門チームが、毎日数百万のデータポイントを比類のない精度とスピードで処理する様子をご覧ください。" },
    scale: { title: "グローバルな能力", subtitle: "最高レベルのスケーラビリティ、統合、およびセキュリティの提供" },
    careers: { title: "採用情報", tag: "常に進化し続ける", join: "チームに参加する", positions: "募集職種", formTitle: "Application Form", formDesc: "Fill out the form below to apply for your preferred project internship.", firstName: "First Name *", lastName: "Last Name *", age: "Age", email: "Email Address *", degree: "Degree/Field of Study", degreePlaceholder: "e.g., Computer Science, Data Science, Engineering", project: "Project Applied For *", selectProject: "Select a project", experience: "Relevant Experience", experiencePlaceholder: "Describe your relevant experience, projects, skills, or coursework...", submitButton: "Submit Application", closeButton: "Close" },
    cta: { title: "データの変革を始めませんか？", button: "今すぐお問い合わせ" }
  },
  ko: {
    nav: { services: '서비스', partners: '파트너', scale: '글로벌 스케일', company: '회사 소개', careers: '채용', apply: '지금 지원하기' },
    hero: { title: "세계 최고의", accent: "AI 기반", subtitle: "데이터 솔루션 제공업체.", contact: "문의하기", learn: "더 알아보기" },
    about: { mission: "우리의 사명", vision: "우리의 비전", missionText: "새로운 방법과 통찰력을 발견하여 예상치 못한 방향과 가능성을 드러내고, 시간과 세대, 기술을 초월하여 모든 사람을 연결합니다.", visionText: "AI와 인간의 지능이 원활하게 협력하여 지리적, 문화적 경계를 초월하고 역동적인 기회를 창출하는 세상.", values: "핵심 가치", principles: "우리의 모든 활동을 이끄는 원칙" },
    services: { title: "제공 서비스", subtitle: "AI 데이터 서비스", desc: "Lifewood는 의사 결정을 강화하고 비용을 절감하며 생산성을 향상시켜 조직 성과를 최적화하는 AI 및 IT 서비스를 제공합니다." },
    video: { label: "운영 쇼케이스", title: "데이터의 미래를 혁신하다", description: "Lifewood의 글로벌 인프라와 전문 팀이 타의 추종을 불허하는 정확도와 속도로 매일 수백만 개의 데이터 포인트를 처리하는 방법을 확인하세요." },
    scale: { title: "글로벌 역량", subtitle: "최고 수준의 확장성, 통합 및 보안 제공" },
    careers: { title: "채용 정보", tag: "멈추지 않는 혁신", join: "팀에 합류하세요", positions: "현재 모집 중인 직무", formTitle: "Application Form", formDesc: "Fill out the form below to apply for your preferred project internship.", firstName: "First Name *", lastName: "Last Name *", age: "Age", email: "Email Address *", degree: "Degree/Field of Study", degreePlaceholder: "e.g., Computer Science, Data Science, Engineering", project: "Project Applied For *", selectProject: "Select a project", experience: "Relevant Experience", experiencePlaceholder: "Describe your relevant experience, projects, skills, or coursework...", submitButton: "Submit Application", closeButton: "Close" },
    cta: { title: "데이터 혁신을 준비하셨나요?", button: "지금 문의하기" }
  },
  zh: {
    nav: { services: '服务', partners: '合作伙伴', scale: '全球规模', company: '关于我们', careers: '职业生涯', apply: '立即申请' },
    hero: { title: "全球领先的", accent: "人工智能驱动", subtitle: "数据解决方案提供商。", contact: "联系我们", learn: "了解更多" },
    about: { mission: "我们的使命", vision: "我们的愿景", missionText: "发掘新的方法 and 见解，揭示意想不到的方向和可能性，跨越时代、世代和技术为每个人建立联系。", visionText: "人工智能与人类智慧无缝协作，创造充满活力的机遇和繁荣的社区，超越地理和文化界限。", values: "核心价值观", principles: "指导我们一切行动的原则" },
    services: { title: "我们提供的服务", subtitle: "AI数据服务", desc: "Lifewood 提供人工智能和 IT 服务，旨在增强决策能力、降低成本并提高生产力。" },
    video: { label: "运营展示", title: "转型数据的未来", description: "观看 Lifewood 的全球基础设施和专业团队如何以无与伦比的精度和速度处理每天数百万个数据点。" },
    scale: { title: "全球能力", subtitle: "提供最高水平的可扩展性、集成和安全性" },
    careers: { title: "职业发展", tag: "创新永不止步", join: "加入我们的团队", positions: "开放职位", formTitle: "Application Form", formDesc: "Fill out the form below to apply for your preferred project internship.", firstName: "First Name *", lastName: "Last Name *", age: "Age", email: "Email Address *", degree: "Degree/Field of Study", degreePlaceholder: "e.g., Computer Science, Data Science, Engineering", project: "Project Applied For *", selectProject: "Select a project", experience: "Relevant Experience", experiencePlaceholder: "Describe your relevant experience, projects, skills, or coursework...", submitButton: "Submit Application", closeButton: "Close" },
    cta: { title: "准备好转型您的数据了吗？", button: "立即联系我们" }
  },
  es: {
    nav: { services: 'Servicios', partners: 'Socios', scale: 'Escala Global', company: 'Nuestra Empresa', careers: 'Carreras', apply: 'Postularse' },
    hero: { title: "El proveedor líder mundial de", accent: "soluciones de datos", subtitle: "impulsadas por IA.", contact: "Contáctenos", learn: "Saber Más" },
    about: { mission: "Nuestra Misión", vision: "Nuestra Bisón", missionText: "Descubrir nuevos métodos y conocimientos que revelen direcciones y posibilidades inesperadas, conectando a través del tiempo, las generaciones y las tecnologías.", visionText: "Un mundo donde la IA y la inteligencia humana colaboran a la perfección para crear oportunidades dinámicas y comunidades prósperas.", values: "Valores Fundamentales", principles: "Los principios que guían todo lo que hacemos" },
    services: { title: "Lo Que Ofrecemos", subtitle: "Servicios de Datos de IA", desc: "Lifewood ofrece servicios de IA e IT que mejoran la toma de decisiones, reducen costos y mejoran la productividad." },
    video: { label: "Escaparate de Operaciones", title: "Transformando el Futuro de los Datos", description: "Vea cómo la infraestructura global de Lifewood y sus equipos especializados procesan millones de puntos de datos diariamente." },
    scale: { title: "Capacidades Globales", subtitle: "Entregando los más altos niveles de escalabilidad, integration, y seguridad" },
    careers: { title: "CARRERAS EN LIFEWOOD", tag: "SIEMPRE ACTIVOS, NUNCA APAGADOS", join: "ÚNETE A NUESTRO EQUIPO", positions: "Posiciones Abiertas", formTitle: "Application Form", formDesc: "Fill out the form below to apply for your preferred project internship.", firstName: "First Name *", lastName: "Last Name *", age: "Age", email: "Email Address *", degree: "Degree/Field of Study", degreePlaceholder: "e.g., Computer Science, Data Science, Engineering", project: "Project Applied For *", selectProject: "Select a project", experience: "Relevant Experience", experiencePlaceholder: "Describe your relevant experience, projects, skills, or coursework...", submitButton: "Submit Application", closeButton: "Close" },
    cta: { title: "¿Listo para transformar sus datos?", button: "Contáctenos Hoy" }
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
