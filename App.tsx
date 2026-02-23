
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
    nav: { services: 'Serbisyo', projects: 'Mga Proyekto', partners: 'Mga Kasosyo', scale: 'Global na Scale', company: 'Aming Kumpanya', careers: 'Trabaho', apply: 'Mag-apply Na', settings: 'Mga Setting', language: 'Wika', toggleTheme: 'Palitan ang Tema', changeLanguage: 'Palitan ang Wika', closeMenu: 'Isara ang Menu' },
    hero: { title: "Ang nangungunang provider sa mundo ng", accent: "AI-powered", subtitle: "na solusyon sa data.", contact: "Makipag-ugnayan", learn: "Matuto Pa", typewriterPhrases: ['AI-powered', 'AI Data', 'Global Innovation', 'Human Potential', 'Future of Work'], videoFallback: 'Hindi suportado ng browser ang video.' },
    about: { mission: "Aming Misyon", vision: "Aming Bisyon", missionText: "Upang tumuklas ng mga bagong pamamaraan at insight na nagpapakita ng mga posibilidad.", visionText: "Isang mundo kung saan ang AI at katalinuhan ng tao ay nagtutulungan.", values: "Aming Core Values", principles: "Ang mga prinsipyong gumagabay sa lahat ng aming ginagawa", journeyCta: "Sumama sa aming paglalakbay", stats: [{ value: '40+', label: 'Delivery Centers' }, { value: '30+', label: 'Mga Bansa' }], coreValues: [{ id: 'innovation', title: 'Inobasyon Una', description: 'Patuloy kaming naghahanap ng mga bagong ideya at pamamaraan.' }, { id: 'connectivity', title: 'Global na Koneksyon', description: 'Nag-uugnay kami ng mga tao, kultura at teknolohiya sa buong mundo.' }, { id: 'excellence', title: 'Kahusayan sa Paghahatid', description: 'Mataas na antas ng scalability, integration at seguridad.' }, { id: 'empowerment', title: 'Pagpapalakas ng Team', description: 'Pinauunlad namin ang team para tuloy-tuloy na matuto at umangkop.' }] },
    statsBar: { items: [{ value: 40, suffix: '+', label: 'Global Delivery Centers' }, { value: 30, suffix: '+', label: 'Mga Bansa' }, { value: 50, suffix: '+', label: 'Mga Wikang Suportado' }, { value: 56000, suffix: '+', label: 'Online Resources' }] },
    services: { title: "Ano ang Inaalok Namin", subtitle: "AI Data Services", desc: "Nag-aalok ang Lifewood ng mga serbisyo ng AI at IT na nagpapahusay sa paggawa ng desisyon at pagiging produktibo.", clickHint: 'I-click para makita', selectedLabel: 'Napili', hoverHint: 'I-hover para i-explore', items: [{ icon: '🎵', title: 'Audio', description: 'Pagkolekta at pag-label ng audio data.' }, { icon: '🖼️', title: 'Larawan', description: 'Image collection at object detection para sa computer vision.' }, { icon: '🎬', title: 'Bidyo', description: 'Video collection at content processing.' }, { icon: '📝', title: 'Teksto', description: 'Text collection, transcription at NLP.' }] },
    video: { label: "Showcase ng Operasyon", title: "Pagbabago sa Kinabukasan ng Data", description: "Panoorin kung paano pinoproseso ng Lifewood ang milyun-milyong data points araw-araw.", featureInfrastructure: 'Global Infrastructure', featureSpeed: 'Mabilis na Proseso', videoFallback: 'Hindi suportado ng browser ang video.' },
    scale: { title: "Global na Kakayahan", subtitle: "Paghahatid ng mataas na antas ng scalability, integration at seguridad" },
    partners: { eyebrow: 'Aming Mga Kliyente at Kasosyo', title: 'Pinagkakatiwalaan ng mga Nangungunang Lider sa Industriya', description: 'Ipinagmamalaki naming makipag-partner sa mga organisasyon sa buong mundo upang gawing makabuluhang solusyon ang data.' },
    projects: { eyebrow: 'Aming Mga Gawa', title: 'Ano ang Ginagawa Namin', description: "Mula sa pagbuo ng AI datasets sa iba't ibang wika at kapaligiran hanggang sa pagbuo ng mga platform na nagpapataas ng produktibidad.", items: [{ title: 'AI Data Extraction', description: 'Pagkuha ng image at text data gamit ang AI.', image: '/AI-data-extraction.png' }, { title: 'Machine Learning Enablement', description: 'Flexible na data solutions para sa ML models.', image: '/Machine-Learning-Enablement.png' }, { title: 'Autonomous Driving Technology', description: 'High-precision labeling para sa autonomous driving.', image: '/Autonomous-Driving-Technology.png' }, { title: 'NLP at Speech', description: 'Multilingual text/audio collection para sa NLP.', image: '/Natural-Language-Processing-and-Speech-Acquisition.png' }, { title: 'Computer Vision', description: 'End-to-end CV data services.', image: '/Computer-Vision.png' }, { title: 'Genealogy', description: 'Pagproseso ng genealogical records sa malaking sukat.', image: '/Genealogy.png' }] },
    careers: { title: "KARERA SA LIFEWOOD", tag: "LAGING BUKAS HINDI TUMITIGIL", join: "SUMALI SA AMING TEAM", positions: "Mga Bakanteng Trabaho", stats: [{ value: '34,000+', label: 'Devoted Specialists' }, { value: '50+', label: 'Delivery Sites' }, { value: '30+', label: 'Mga Bansa' }, { value: '100+', label: 'Language Capabilities' }], openPositions: [{ title: 'AI Research Scientist', department: 'Innovation Lab', level: 'Senior', description: 'Manguna sa AI research initiatives.', buttonText: 'Mag-apply' }, { title: 'Global Data Engineer', department: 'Data Platform', level: 'Mid-Senior', description: 'Magdisenyo ng scalable data infrastructure.', buttonText: 'Mag-apply' }, { title: 'Cultural AI Specialist', department: 'Global Solutions', level: 'Mid-level', description: 'Gumawa ng culturally-adaptive AI solutions.', buttonText: 'Mag-apply' }, { title: 'Technology Innovation Intern', department: 'Multiple Teams', level: 'Entry-level', description: 'Sumali sa AI at innovation projects.', buttonText: 'Mag-apply sa Internship', isPrimary: true }], formTitle: "Application Form", formDesc: "Fill out the form below to apply for your preferred project internship.", firstName: "First Name *", lastName: "Last Name *", age: "Age", email: "Email Address *", degree: "Degree/Field of Study", degreePlaceholder: "e.g., Computer Science, Data Science, Engineering", project: "Project Applied For *", selectProject: "Select a project", experience: "Relevant Experience", experiencePlaceholder: "Describe your relevant experience, projects, skills, or coursework...", submitButton: "Submit Application", closeButton: "Close", successMessage: 'Tagumpay na naisumite ang application!', projectOptions: [{ value: 'audio', label: 'Audio Labeling Project' }, { value: 'image', label: 'Computer Vision Internship' }, { value: 'video', label: 'Video Content Analysis' }, { value: 'nlp', label: 'Natural Language Processing' }], joinTitle: 'Sumali sa Aming Team', joinDescription: 'Mag-apply at maging bahagi ng mga proyektong humuhubog sa hinaharap.' },
    cta: { title: "Handa nang baguhin ang iyong Data?", description: 'Nagbibigay kami ng global data engineering services para sa AI solutions.', button: "Makipag-ugnayan Ngayon" },
    footer: { brandDescription: 'Pinapalakas ang inobasyon sa pamamagitan ng AI-powered data solutions.', company: 'Kumpanya', legal: 'Legal', getInTouch: 'Makipag-ugnayan', aboutUs: 'Tungkol sa Amin', services: 'Serbisyo', careers: 'Trabaho', projects: 'Mga Proyekto', privacy: 'Patakaran sa Privacy', terms: 'Mga Tuntunin at Kundisyon', location: 'Mga Global Office sa 30+ Bansa', rightsReserved: 'Lahat ng Karapatan ay Nakalaan' },
    ai: { greeting: 'Hello! Ako ang iyong Lifewood AI Consultant. Paano kami makakatulong?', headerTitle: 'Lifewood AI', headerSubtitle: 'Online Consultant', placeholder: 'I-type ang iyong mensahe...', fallbackResponse: 'Paumanhin, hindi ako nakagawa ng sagot. Pakisubukang muli.', connectionError: 'May problema sa koneksyon. Subukang muli mamaya.', credentialsError: 'Inaayos pa ang AI credentials. Subukan muli sa ilang sandali.' }
  },
  ja: {
    nav: { services: 'サービス', projects: 'プロジェクト', partners: 'パートナー', scale: 'グローバル規模', company: '会社概要', careers: '採用情報', apply: '今すぐ応募', settings: '設定', language: '言語', toggleTheme: 'テーマ切替', changeLanguage: '言語を変更', closeMenu: 'メニューを閉じる' },
    hero: { title: '世界をリードする', accent: 'AI駆動型', subtitle: 'データソリューションプロバイダー。', contact: 'お問い合わせ', learn: '詳細を見る', typewriterPhrases: ['AI駆動型', 'AIデータ', 'グローバルイノベーション', '人材の可能性', '働き方の未来'], videoFallback: 'お使いのブラウザは動画タグに対応していません。' },
    about: { mission: '私たちの使命', vision: '私たちのビジョン', missionText: '新しい手法と洞察を見いだし、予想外の可能性を開きます。', visionText: 'AIと人の知性が協働し、新たな機会を生み出す世界を目指します。', values: 'コアバリュー', principles: '私たちの行動を導く原則', journeyCta: '私たちの挑戦に参加', stats: [{ value: '40+', label: 'デリバリー拠点' }, { value: '30+', label: '対応国' }], coreValues: [{ id: 'innovation', title: 'イノベーション第一', description: '常に新しい方法を探求し、価値を創出します。' }, { id: 'connectivity', title: 'グローバル接続', description: '人・文化・技術をつなぎ、世界を近づけます。' }, { id: 'excellence', title: '提供品質の追求', description: '高い拡張性、統合性、セキュリティを実現します。' }, { id: 'empowerment', title: 'チームの成長', description: '学び続けるチームを育て、持続的な成長を促進します。' }] },
    statsBar: { items: [{ value: 40, suffix: '+', label: 'グローバル拠点' }, { value: 30, suffix: '+', label: '対応国' }, { value: 50, suffix: '+', label: '対応言語' }, { value: 56000, suffix: '+', label: 'オンライン資源' }] },
    services: { title: '提供サービス', subtitle: 'AIデータサービス', desc: 'LifewoodはAIとITサービスで意思決定と生産性を向上させます。', clickHint: 'クリックして表示', selectedLabel: '選択中', hoverHint: 'ホバーして確認', items: [{ icon: '🎵', title: '音声', description: '音声データの収集・ラベリング・分類。' }, { icon: '🖼️', title: '画像', description: '画像収集、分類、物体検出など。' }, { icon: '🎬', title: '動画', description: '動画データ収集、監査、処理。' }, { icon: '📝', title: 'テキスト', description: 'テキスト収集、書き起こし、NLP。' }] },
    video: { label: 'オペレーション紹介', title: 'データの未来を変革', description: 'Lifewoodのグローバル体制が日々大量データを高精度で処理します。', featureInfrastructure: 'グローバル基盤', featureSpeed: '次世代スピード', videoFallback: 'お使いのブラウザは動画タグに対応していません。' },
    scale: {
      title: 'グローバル能力',
      subtitle: '高い拡張性・統合性・セキュリティを提供',
      capabilities: [
        {
          title: '100以上の言語対応',
          description: '多様な文化と市場で円滑なコミュニケーション',
          bullets: ['リアルタイム翻訳', '文化適応', 'ローカライズ対応', 'ネイティブサポート']
        },
        {
          title: '24時間365日の運用',
          description: 'フォローザサンモデルで継続的に提供',
          bullets: ['24時間サポート', 'タイムゾーン最適化', 'シームレス引き継ぎ', '常時監視']
        },
        {
          title: '統合テクノロジープラットフォーム',
          description: '世界中の運用とチームを1つに接続',
          bullets: ['クラウドネイティブ基盤', 'リアルタイム同期', 'グローバルデータレイク', '統合分析']
        }
      ]
    },
    partners: { eyebrow: 'クライアントとパートナー', title: '業界をリードする企業からの信頼', description: 'Lifewoodは世界中の主要組織と連携し、データを価値あるソリューションへと変革しています。' },
    projects: { eyebrow: '私たちの仕事', title: '私たちの取り組み', description: '多言語データセット構築から生産性向上プラットフォーム開発まで、Lifewoodの取り組みを紹介します。', items: [{ title: 'AIデータ抽出', description: 'AIで画像・テキスト取得を最適化します。', image: '/AI-data-extraction.png' }, { title: '機械学習支援', description: '多様なMLモデル向けの柔軟なデータソリューション。', image: '/Machine-Learning-Enablement.png' }, { title: '自動運転技術', description: '高精度アノテーションで自動運転開発を支援。', image: '/Autonomous-Driving-Technology.png' }, { title: 'NLPと音声取得', description: '多言語テキスト・音声データを収集・評価。', image: '/Natural-Language-Processing-and-Speech-Acquisition.png' }, { title: 'コンピュータビジョン', description: 'CV開発向けのエンドツーエンドデータサービス。', image: '/Computer-Vision.png' }, { title: '系譜データ', description: '系譜記録の高速・大規模処理。', image: '/Genealogy.png' }] },
    careers: { title: 'LIFEWOOD 採用', tag: '常時稼働', join: 'チームに参加', positions: '募集職種', stats: [{ value: '34,000+', label: '専門スタッフ' }, { value: '50+', label: '拠点' }, { value: '30+', label: '対応国' }, { value: '100+', label: '言語対応' }], openPositions: [{ title: 'AI研究者', department: 'Innovation Lab', level: 'シニア', description: '次世代MLアルゴリズム研究を主導。', buttonText: '応募する' }, { title: 'グローバルデータエンジニア', department: 'Data Platform', level: 'ミドル〜シニア', description: '大規模データ基盤の設計と構築。', buttonText: '応募する' }, { title: 'カルチャーAIスペシャリスト', department: 'Global Solutions', level: 'ミドル', description: '文化適応型AIソリューションを開発。', buttonText: '応募する' }, { title: '技術革新インターン', department: 'Multiple Teams', level: 'エントリー', description: 'AI・CV等の先端プロジェクトに参加。', buttonText: 'インターン応募', isPrimary: true }], formTitle: '応募フォーム', formDesc: '希望プロジェクトのインターンに応募してください。', firstName: '名 *', lastName: '姓 *', age: '年齢', email: 'メールアドレス *', degree: '専攻分野', degreePlaceholder: '例: コンピュータサイエンス', project: '応募プロジェクト *', selectProject: 'プロジェクトを選択', experience: '関連経験', experiencePlaceholder: '関連経験・スキル・実績を記入してください。', submitButton: '応募を送信', closeButton: '閉じる', successMessage: '応募を受け付けました。', projectOptions: [{ value: 'audio', label: '音声ラベリング' }, { value: 'image', label: 'コンピュータビジョン' }, { value: 'video', label: '動画解析' }, { value: 'nlp', label: '自然言語処理' }], joinTitle: 'チームに参加', joinDescription: '未来を形づくる技術プロジェクトに参加しましょう。' },
    cta: { title: 'データ変革を始めませんか？', description: 'AI実現のためのグローバルデータエンジニアリングを提供します。', button: '今すぐ相談する' },
    footer: { brandDescription: 'AI駆動型データソリューションでイノベーションを加速。', company: '会社情報', legal: '法務', getInTouch: 'お問い合わせ', aboutUs: '会社概要', services: 'サービス', careers: '採用情報', projects: 'プロジェクト', privacy: 'プライバシーポリシー', terms: '利用規約', location: '30カ国以上に拠点', rightsReserved: '無断転載禁止' },
    ai: { greeting: 'こんにちは。Lifewood AIコンサルタントです。どのようにお手伝いできますか？', headerTitle: 'Lifewood AI', headerSubtitle: 'オンラインコンサルタント', placeholder: 'メッセージを入力...', fallbackResponse: '回答を生成できませんでした。別の表現でお試しください。', connectionError: '接続エラーが発生しました。後でもう一度お試しください。', credentialsError: 'AI認証情報を設定中です。少し待ってから再試行してください。' }
  },
  ko: {
    nav: { services: '서비스', projects: '프로젝트', partners: '파트너', scale: '글로벌 역량', company: '회사 소개', careers: '채용', apply: '지금 지원', settings: '설정', language: '언어', toggleTheme: '테마 전환', changeLanguage: '언어 변경', closeMenu: '메뉴 닫기' },
    hero: { title: '세계적인', accent: 'AI 기반', subtitle: '데이터 솔루션 제공 기업', contact: '문의하기', learn: '더 알아보기', typewriterPhrases: ['AI 기반', 'AI 데이터', '글로벌 혁신', '인재 잠재력', '미래의 일'], videoFallback: '브라우저가 비디오 태그를 지원하지 않습니다.' },
    about: { mission: '우리의 미션', vision: '우리의 비전', missionText: '새로운 방법과 통찰을 찾아 더 큰 가능성을 엽니다.', visionText: 'AI와 인간 지능이 함께 성장 기회를 만드는 세상을 지향합니다.', values: '핵심 가치', principles: '우리가 지키는 원칙', journeyCta: '우리의 여정에 함께하세요', stats: [{ value: '40+', label: '전달 센터' }, { value: '30+', label: '진출 국가' }], coreValues: [{ id: 'innovation', title: '혁신 우선', description: '항상 새로운 방법을 찾고 실행합니다.' }, { id: 'connectivity', title: '글로벌 연결', description: '사람, 문화, 기술을 세계적으로 연결합니다.' }, { id: 'excellence', title: '전달의 탁월함', description: '확장성, 통합성, 보안을 높은 수준으로 제공합니다.' }, { id: 'empowerment', title: '팀 성장', description: '빠르게 배우고 성장하는 팀 문화를 만듭니다.' }] },
    statsBar: { items: [{ value: 40, suffix: '+', label: '글로벌 센터' }, { value: 30, suffix: '+', label: '진출 국가' }, { value: 50, suffix: '+', label: '지원 언어' }, { value: 56000, suffix: '+', label: '온라인 리소스' }] },
    services: { title: '제공 서비스', subtitle: 'AI 데이터 서비스', desc: 'Lifewood는 AI/IT 서비스로 의사결정과 생산성을 향상합니다.', clickHint: '클릭하여 보기', selectedLabel: '선택됨', hoverHint: '마우스를 올려 확인', items: [{ icon: '🎵', title: '오디오', description: '오디오 데이터 수집 및 라벨링.' }, { icon: '🖼️', title: '이미지', description: '이미지 수집, 분류, 객체 인식.' }, { icon: '🎬', title: '비디오', description: '비디오 데이터 수집 및 처리.' }, { icon: '📝', title: '텍스트', description: '텍스트 수집, 전사, NLP.' }] },
    video: { label: '운영 소개', title: '데이터의 미래를 변화시키다', description: 'Lifewood의 글로벌 인프라가 매일 대규모 데이터를 정밀하게 처리합니다.', featureInfrastructure: '글로벌 인프라', featureSpeed: '차세대 속도', videoFallback: '브라우저가 비디오 태그를 지원하지 않습니다.' },
    scale: {
      title: '글로벌 역량',
      subtitle: '높은 확장성, 통합성, 보안 제공',
      capabilities: [
        {
          title: '100+ 언어 역량',
          description: '다양한 문화와 시장에서 원활한 커뮤니케이션',
          bullets: ['실시간 번역', '문화 적응', '현지화 솔루션', '네이티브 지원팀']
        },
        {
          title: '24/7 글로벌 운영',
          description: '연속 서비스를 위한 팔로우-더-선 모델',
          bullets: ['24시간 지원', '시간대 최적화', '원활한 인수인계', '상시 모니터링']
        },
        {
          title: '통합 기술 플랫폼',
          description: '전 세계 운영과 팀을 하나로 연결',
          bullets: ['클라우드 네이티브 인프라', '실시간 동기화', '글로벌 데이터 레이크', '통합 분석']
        }
      ]
    },
    partners: { eyebrow: '고객 및 파트너', title: '업계 리더들이 신뢰하는 Lifewood', description: 'Lifewood는 전 세계 선도 조직과 협력해 데이터를 의미 있는 솔루션으로 전환합니다.' },
    projects: { eyebrow: '우리의 작업', title: '우리가 하는 일', description: '다양한 언어 데이터셋 구축부터 생산성 향상 플랫폼 개발까지 Lifewood의 성과를 소개합니다.', items: [{ title: 'AI 데이터 추출', description: 'AI로 이미지와 텍스트 데이터 수집을 최적화합니다.', image: '/AI-data-extraction.png' }, { title: '머신러닝 활성화', description: '다양한 ML 모델을 위한 유연한 데이터 솔루션.', image: '/Machine-Learning-Enablement.png' }, { title: '자율주행 기술', description: '정밀 라벨링으로 자율주행 개발을 지원합니다.', image: '/Autonomous-Driving-Technology.png' }, { title: 'NLP 및 음성', description: '다국어 텍스트/음성 데이터 수집 및 평가.', image: '/Natural-Language-Processing-and-Speech-Acquisition.png' }, { title: '컴퓨터 비전', description: 'CV 개발을 위한 엔드투엔드 데이터 서비스.', image: '/Computer-Vision.png' }, { title: '족보 데이터', description: '족보 기록의 대규모 고속 처리.', image: '/Genealogy.png' }] },
    careers: { title: 'LIFEWOOD 채용', tag: '항상 ON', join: '팀에 합류하세요', positions: '채용 공고', stats: [{ value: '34,000+', label: '전문 인력' }, { value: '50+', label: '운영 거점' }, { value: '30+', label: '진출 국가' }, { value: '100+', label: '언어 역량' }], openPositions: [{ title: 'AI 연구 과학자', department: 'Innovation Lab', level: '시니어', description: '차세대 ML 알고리즘 연구를 주도합니다.', buttonText: '지원하기' }, { title: '글로벌 데이터 엔지니어', department: 'Data Platform', level: '미드-시니어', description: '확장 가능한 데이터 인프라를 설계/구축합니다.', buttonText: '지원하기' }, { title: '문화 AI 전문가', department: 'Global Solutions', level: '미드', description: '문화 맥락에 맞는 AI 솔루션을 개발합니다.', buttonText: '지원하기' }, { title: '기술 혁신 인턴', department: 'Multiple Teams', level: '엔트리', description: 'AI/비전 혁신 프로젝트에 참여합니다.', buttonText: '인턴 지원', isPrimary: true }], formTitle: '지원서', formDesc: '원하는 프로젝트 인턴십에 지원해 주세요.', firstName: '이름 *', lastName: '성 *', age: '나이', email: '이메일 *', degree: '전공/학위', degreePlaceholder: '예: 컴퓨터공학, 데이터사이언스', project: '지원 프로젝트 *', selectProject: '프로젝트 선택', experience: '관련 경험', experiencePlaceholder: '관련 경험, 프로젝트, 기술을 작성해 주세요.', submitButton: '지원서 제출', closeButton: '닫기', successMessage: '지원이 완료되었습니다!', projectOptions: [{ value: 'audio', label: '오디오 라벨링' }, { value: 'image', label: '컴퓨터 비전 인턴십' }, { value: 'video', label: '비디오 분석' }, { value: 'nlp', label: '자연어 처리' }], joinTitle: '팀에 합류하세요', joinDescription: '미래를 바꾸는 기술 프로젝트에 함께하세요.' },
    cta: { title: '데이터 혁신을 시작할 준비가 되셨나요?', description: 'AI 솔루션을 위한 글로벌 데이터 엔지니어링 서비스를 제공합니다.', button: '지금 문의하기' },
    footer: { brandDescription: 'AI 기반 데이터 솔루션으로 혁신을 가속합니다.', company: '회사', legal: '법적 고지', getInTouch: '문의하기', aboutUs: '회사 소개', services: '서비스', careers: '채용', projects: '프로젝트', privacy: '개인정보 처리방침', terms: '이용약관', location: '30개국 이상 글로벌 오피스', rightsReserved: '모든 권리 보유' },
    ai: { greeting: '안녕하세요! Lifewood AI 컨설턴트입니다. 무엇을 도와드릴까요?', headerTitle: 'Lifewood AI', headerSubtitle: '온라인 컨설턴트', placeholder: '메시지를 입력하세요...', fallbackResponse: '응답을 생성하지 못했습니다. 다시 시도해 주세요.', connectionError: '연결 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', credentialsError: 'AI 인증 정보를 설정 중입니다. 잠시 후 다시 시도해 주세요.' }
  },
  zh: {
    nav: { services: '服务', projects: '项目', partners: '合作伙伴', scale: '全球规模', company: '关于我们', careers: '招聘', apply: '立即申请', settings: '设置', language: '语言', toggleTheme: '切换主题', changeLanguage: '切换语言', closeMenu: '关闭菜单' },
    hero: { title: '全球领先的', accent: 'AI驱动', subtitle: '数据解决方案提供商。', contact: '联系我们', learn: '了解更多', typewriterPhrases: ['AI驱动', 'AI数据', '全球创新', '人才潜能', '未来工作'], videoFallback: '您的浏览器不支持视频标签。' },
    about: { mission: '我们的使命', vision: '我们的愿景', missionText: '探索新方法与洞察，持续发掘新的可能性。', visionText: '让AI与人类智慧协作，创造更多发展机会。', values: '核心价值观', principles: '指导我们行动的原则', journeyCta: '加入我们的旅程', stats: [{ value: '40+', label: '交付中心' }, { value: '30+', label: '覆盖国家' }], coreValues: [{ id: 'innovation', title: '创新优先', description: '持续探索新方法，推动价值创造。' }, { id: 'connectivity', title: '全球连接', description: '连接人、文化与技术，打造协同网络。' }, { id: 'excellence', title: '卓越交付', description: '提供高扩展性、集成性与安全性。' }, { id: 'empowerment', title: '团队赋能', description: '打造持续学习和成长的团队。' }] },
    statsBar: { items: [{ value: 40, suffix: '+', label: '全球交付中心' }, { value: 30, suffix: '+', label: '覆盖国家' }, { value: 50, suffix: '+', label: '支持语言' }, { value: 56000, suffix: '+', label: '在线资源' }] },
    services: { title: '我们的服务', subtitle: 'AI数据服务', desc: 'Lifewood通过AI与IT服务提升决策效率、降低成本并提高生产力。', clickHint: '点击查看', selectedLabel: '已选中', hoverHint: '悬停探索', items: [{ icon: '🎵', title: '音频', description: '音频数据采集、标注与分类。' }, { icon: '🖼️', title: '图像', description: '图像采集、分类与目标检测。' }, { icon: '🎬', title: '视频', description: '视频采集、审核与内容处理。' }, { icon: '📝', title: '文本', description: '文本采集、转写与NLP处理。' }] },
    video: { label: '运营展示', title: '重塑数据未来', description: 'Lifewood全球基础设施每天高精度处理海量数据。', featureInfrastructure: '全球基础设施', featureSpeed: '下一代速度', videoFallback: '您的浏览器不支持视频标签。' },
    scale: {
      title: '全球能力',
      subtitle: '提供高扩展性、集成性与安全性',
      capabilities: [
        {
          title: '100+ 语言能力',
          description: '跨文化跨市场的无缝沟通',
          bullets: ['实时翻译', '文化适配', '本地化方案', '本地支持团队']
        },
        {
          title: '7x24 全球运营',
          description: '通过接力式运营实现持续服务',
          bullets: ['全天候支持', '时区优化', '无缝交接', '持续监控']
        },
        {
          title: '统一技术平台',
          description: '连接全球团队与运营的一体化平台',
          bullets: ['云原生基础设施', '实时同步', '全球数据湖', '统一分析']
        }
      ]
    },
    partners: { eyebrow: '我们的客户与合作伙伴', title: '深受行业领导者信赖', description: '我们与全球领先组织合作，将数据转化为有价值的解决方案。' },
    projects: { eyebrow: '我们的工作', title: '我们在做什么', description: '从多语言数据集建设到生产力平台开发，Lifewood持续推动创新与价值落地。', items: [{ title: 'AI数据提取', description: '利用AI优化图像与文本数据采集。', image: '/AI-data-extraction.png' }, { title: '机器学习赋能', description: '为各类ML模型提供灵活数据方案。', image: '/Machine-Learning-Enablement.png' }, { title: '自动驾驶技术', description: '通过高精度标注支持自动驾驶系统。', image: '/Autonomous-Driving-Technology.png' }, { title: 'NLP与语音', description: '多语言文本与音频数据采集评估。', image: '/Natural-Language-Processing-and-Speech-Acquisition.png' }, { title: '计算机视觉', description: '覆盖CV全流程的数据服务。', image: '/Computer-Vision.png' }, { title: '家谱数据', description: '家谱档案的大规模高速处理。', image: '/Genealogy.png' }] },
    careers: { title: 'LIFEWOOD 招聘', tag: '始终在线', join: '加入我们', positions: '开放职位', stats: [{ value: '34,000+', label: '专业人才' }, { value: '50+', label: '交付站点' }, { value: '30+', label: '覆盖国家' }, { value: '100+', label: '语言能力' }], openPositions: [{ title: 'AI研究科学家', department: 'Innovation Lab', level: '高级', description: '主导下一代机器学习算法研究。', buttonText: '立即申请' }, { title: '全球数据工程师', department: 'Data Platform', level: '中高级', description: '设计并构建可扩展数据基础设施。', buttonText: '立即申请' }, { title: '文化AI专家', department: 'Global Solutions', level: '中级', description: '开发适配不同文化场景的AI方案。', buttonText: '立即申请' }, { title: '技术创新实习生', department: 'Multiple Teams', level: '初级', description: '参与AI与视觉等前沿项目。', buttonText: '申请实习', isPrimary: true }], formTitle: '申请表', formDesc: '填写下表申请你感兴趣的项目实习。', firstName: '名 *', lastName: '姓 *', age: '年龄', email: '电子邮箱 *', degree: '专业/学习方向', degreePlaceholder: '例如：计算机科学、数据科学', project: '申请项目 *', selectProject: '选择项目', experience: '相关经验', experiencePlaceholder: '请描述你的相关经验、项目与技能。', submitButton: '提交申请', closeButton: '关闭', successMessage: '申请提交成功！', projectOptions: [{ value: 'audio', label: '音频标注项目' }, { value: 'image', label: '计算机视觉实习' }, { value: 'video', label: '视频内容分析' }, { value: 'nlp', label: '自然语言处理' }], joinTitle: '加入我们的团队', joinDescription: '参与塑造未来的技术项目。' },
    cta: { title: '准备好升级你的数据了吗？', description: '我们提供全球数据工程服务，助力AI解决方案落地。', button: '立即联系我们' },
    footer: { brandDescription: '通过AI驱动的数据解决方案赋能创新。', company: '公司', legal: '法律', getInTouch: '联系我们', aboutUs: '关于我们', services: '服务', careers: '招聘', projects: '项目', privacy: '隐私政策', terms: '条款与条件', location: '覆盖30+国家的全球办公室', rightsReserved: '保留所有权利' },
    ai: { greeting: '您好！我是 Lifewood AI 顾问。今天我们如何帮助您的业务？', headerTitle: 'Lifewood AI', headerSubtitle: '在线顾问', placeholder: '输入你的消息...', fallbackResponse: '抱歉，我暂时无法生成回复，请换一种说法重试。', connectionError: '连接顾问时出现错误，请稍后重试。', credentialsError: 'AI顾问正在配置凭据，请稍后再试。' }
  },
  es: {
    nav: { services: 'Servicios', projects: 'Proyectos', partners: 'Socios', scale: 'Escala Global', company: 'Nuestra Empresa', careers: 'Carreras', apply: 'Postular Ahora', settings: 'Configuracion', language: 'Idioma', toggleTheme: 'Cambiar Tema', changeLanguage: 'Cambiar Idioma', closeMenu: 'Cerrar menu' },
    hero: { title: 'El proveedor lider mundial de', accent: 'IA impulsada', subtitle: 'en soluciones de datos.', contact: 'Contactanos', learn: 'Saber mas', typewriterPhrases: ['IA impulsada', 'Datos con IA', 'Innovacion Global', 'Potencial Humano', 'Futuro del Trabajo'], videoFallback: 'Tu navegador no soporta la etiqueta de video.' },
    about: { mission: 'Nuestra Mision', vision: 'Nuestra Vision', missionText: 'Descubrimos nuevos metodos e ideas para abrir oportunidades inesperadas.', visionText: 'Un mundo donde la IA y la inteligencia humana colaboran sin friccion.', values: 'Nuestros Valores', principles: 'Principios que guian todo lo que hacemos', journeyCta: 'Unete a nuestro viaje', stats: [{ value: '40+', label: 'Centros de Entrega' }, { value: '30+', label: 'Paises' }], coreValues: [{ id: 'innovation', title: 'Innovacion Primero', description: 'Buscamos continuamente nuevas formas de crear valor.' }, { id: 'connectivity', title: 'Conectividad Global', description: 'Conectamos personas, culturas y tecnologia en todo el mundo.' }, { id: 'excellence', title: 'Excelencia en Entrega', description: 'Ofrecemos alta escalabilidad, integracion y seguridad.' }, { id: 'empowerment', title: 'Empoderamiento del Equipo', description: 'Impulsamos equipos que aprenden y se adaptan rapido.' }] },
    statsBar: { items: [{ value: 40, suffix: '+', label: 'Centros Globales' }, { value: 30, suffix: '+', label: 'Paises' }, { value: 50, suffix: '+', label: 'Idiomas Soportados' }, { value: 56000, suffix: '+', label: 'Recursos en Linea' }] },
    services: { title: 'Lo Que Ofrecemos', subtitle: 'Servicios de Datos con IA', desc: 'Lifewood ofrece servicios de IA y TI que mejoran decisiones, reducen costos y aumentan productividad.', clickHint: 'Haz clic para ver', selectedLabel: 'Seleccionado', hoverHint: 'Pasa el cursor para explorar', items: [{ icon: '🎵', title: 'Audio', description: 'Recoleccion y etiquetado de datos de audio.' }, { icon: '🖼️', title: 'Imagen', description: 'Recoleccion, clasificacion y deteccion de objetos.' }, { icon: '🎬', title: 'Video', description: 'Captura, auditoria y procesamiento de video.' }, { icon: '📝', title: 'Texto', description: 'Recoleccion de texto, transcripcion y NLP.' }] },
    video: { label: 'Muestra de Operaciones', title: 'Transformando el Futuro de los Datos', description: 'Nuestra infraestructura global procesa millones de datos con precision y velocidad.', featureInfrastructure: 'Infraestructura Global', featureSpeed: 'Velocidad de Nueva Generacion', videoFallback: 'Tu navegador no soporta la etiqueta de video.' },
    scale: {
      title: 'Capacidades Globales',
      subtitle: 'Entregamos altos niveles de escalabilidad, integracion y seguridad',
      capabilities: [
        {
          title: '100+ Capacidades de Idioma',
          description: 'Comunicacion fluida entre culturas y mercados diversos',
          bullets: ['Traduccion en tiempo real', 'Adaptacion cultural', 'Soluciones localizadas', 'Equipos nativos de soporte']
        },
        {
          title: 'Operaciones Globales 24/7',
          description: 'Modelo follow-the-sun para servicio continuo',
          bullets: ['Soporte permanente', 'Optimizacion por zonas horarias', 'Transferencias fluidas', 'Monitoreo continuo']
        },
        {
          title: 'Plataforma Tecnologica Unificada',
          description: 'Una sola plataforma para todas las operaciones globales',
          bullets: ['Infraestructura cloud-native', 'Sincronizacion en tiempo real', 'Data lakes globales', 'Analitica unificada']
        }
      ]
    },
    partners: { eyebrow: 'Nuestros Clientes y Socios', title: 'Con la Confianza de Lideres de la Industria', description: 'Nos enorgullece colaborar con organizaciones lideres para transformar datos en soluciones con impacto.' },
    projects: { eyebrow: 'Nuestro Trabajo', title: 'Que Hacemos', description: 'Desde construir datasets de IA en multiples idiomas hasta crear plataformas de productividad, mostramos el impacto de Lifewood.', items: [{ title: 'Extraccion de Datos con IA', description: 'Optimizamos la obtencion de imagenes y texto desde multiples fuentes.', image: '/AI-data-extraction.png' }, { title: 'Habilitacion de Machine Learning', description: 'Soluciones de datos flexibles para distintos modelos de ML.', image: '/Machine-Learning-Enablement.png' }, { title: 'Tecnologia de Conduccion Autonoma', description: 'Etiquetado de alta precision para sistemas de conduccion autonoma.', image: '/Autonomous-Driving-Technology.png' }, { title: 'NLP y Voz', description: 'Recoleccion multilingue de texto y audio para NLP.', image: '/Natural-Language-Processing-and-Speech-Acquisition.png' }, { title: 'Vision por Computadora', description: 'Servicios end-to-end para proyectos de vision por computadora.', image: '/Computer-Vision.png' }, { title: 'Genealogia', description: 'Procesamiento de registros genealogicos a gran escala.', image: '/Genealogy.png' }] },
    careers: { title: 'CARRERAS EN LIFEWOOD', tag: 'SIEMPRE ACTIVO', join: 'UNETE A NUESTRO EQUIPO', positions: 'Vacantes Abiertas', stats: [{ value: '34,000+', label: 'Especialistas Dedicados' }, { value: '50+', label: 'Sitios de Entrega' }, { value: '30+', label: 'Paises en 4 Continentes' }, { value: '100+', label: 'Capacidades de Idioma' }], openPositions: [{ title: 'Cientifico de Investigacion en IA', department: 'Innovation Lab', level: 'Senior', description: 'Lidera iniciativas de investigacion de IA de nueva generacion.', buttonText: 'Postular' }, { title: 'Ingeniero de Datos Global', department: 'Data Platform', level: 'Mid-Senior', description: 'Disena infraestructura de datos escalable para operaciones globales.', buttonText: 'Postular' }, { title: 'Especialista de IA Cultural', department: 'Global Solutions', level: 'Mid-level', description: 'Desarrolla soluciones de IA adaptadas a contextos culturales.', buttonText: 'Postular' }, { title: 'Practicante de Innovacion Tecnologica', department: 'Multiple Teams', level: 'Entry-level', description: 'Participa en proyectos de IA, vision y tecnologias emergentes.', buttonText: 'Postular a Practicas', isPrimary: true }], formTitle: 'Formulario de Solicitud', formDesc: 'Completa el formulario para postular al proyecto de practicas de tu preferencia.', firstName: 'Nombre *', lastName: 'Apellido *', age: 'Edad', email: 'Correo Electronico *', degree: 'Carrera/Campo de Estudio', degreePlaceholder: 'Ej.: Ciencias de la Computacion, Data Science, Ingenieria', project: 'Proyecto al que Postulas *', selectProject: 'Selecciona un proyecto', experience: 'Experiencia Relevante', experiencePlaceholder: 'Describe tu experiencia, proyectos, habilidades o cursos...', submitButton: 'Enviar Solicitud', closeButton: 'Cerrar', successMessage: 'Solicitud enviada con exito!', projectOptions: [{ value: 'audio', label: 'Proyecto de Etiquetado de Audio' }, { value: 'image', label: 'Pasantia de Vision por Computadora' }, { value: 'video', label: 'Analisis de Contenido en Video' }, { value: 'nlp', label: 'Procesamiento de Lenguaje Natural' }], joinTitle: 'Unete a Nuestro Equipo', joinDescription: 'Se parte de proyectos tecnologicos que estan moldeando el futuro.' },
    cta: { title: 'Listo para Transformar tus Datos?', description: 'Brindamos servicios globales de ingenieria de datos para habilitar soluciones de IA.', button: 'Contactanos Hoy' },
    footer: { brandDescription: 'Impulsamos la innovacion con soluciones de datos potenciadas por IA.', company: 'Empresa', legal: 'Legal', getInTouch: 'Contactanos', aboutUs: 'Sobre Nosotros', services: 'Servicios', careers: 'Carreras', projects: 'Proyectos', privacy: 'Politica de Privacidad', terms: 'Terminos y Condiciones', location: 'Oficinas globales en mas de 30 paises', rightsReserved: 'Todos los Derechos Reservados' },
    ai: { greeting: 'Hola, soy tu Consultor de IA de Lifewood. Como podemos ayudar a tu negocio hoy?', headerTitle: 'Lifewood AI', headerSubtitle: 'Consultor en linea', placeholder: 'Escribe tu mensaje...', fallbackResponse: 'Lo siento, no pude generar una respuesta. Intenta reformular tu pregunta.', connectionError: 'Hubo un error de conexion con nuestro consultor. Intentalo de nuevo mas tarde.', credentialsError: 'El consultor de IA esta configurando sus credenciales. Intenta en unos momentos.' }
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


