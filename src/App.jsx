import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ИМПОРТЫ ИЗОБРАЖЕНИЙ ---
import logoImg from './assets/logo.png';
import planetImg from './assets/planet.png';
import aiImg from './assets/ai.png';
import aiIconImg from './assets/ai-icon.png';
import dataImg from './assets/data.jpg';
import dataIconImg from './assets/data-icon.png';
import autoImg from './assets/auto.png';
import autoIconImg from './assets/auto-icon.png';

// --- КОМПОНЕНТ ФОНА ---
const SpaceBackground = () => {
  const canvasRef = useRef(null);
  const targetScrollRotation = useRef(0);
  const currentScrollRotation = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      targetScrollRotation.current = window.scrollY * 0.003;
    };
    window.addEventListener('scroll', handleScroll);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let tunnelStars = [];
    let staticStars = [];
    let galaxyStars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initSpace();
    };

    const initSpace = () => {
      tunnelStars = [];
      for (let i = 0; i < 400; i++) {
        tunnelStars.push({
          x: (Math.random() - 0.5) * canvas.width * 2,
          y: (Math.random() - 0.5) * canvas.height * 2,
          z: Math.random() * canvas.width,
          pz: 0
        });
      }

      staticStars = [];
      for (let i = 0; i < 400; i++) {
        staticStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 0.8 + 0.2,
          opacity: Math.random(),
          blink: Math.random() * 0.008 + 0.002
        });
      }

      galaxyStars = [];
      const branches = 5;
      for (let i = 0; i < 400; i++) {
        const dist = Math.random() * 200 + 40;
        const angle = (i % branches) * ((Math.PI * 2) / branches) + (dist * 0.04);
        galaxyStars.push({
          dist: dist,
          angle: angle,
          size: Math.random() * 1.5 + 0.8,
          opacity: Math.random() * 0.4 + 0.3,
          color: i % 3 === 0 ? '#b4d2ff' : i % 2 === 0 ? '#ffffff' : '#ffd2b4'
        });
      }
    };

    const animate = () => {
      const lerpFactor = 0.02;
      currentScrollRotation.current += (targetScrollRotation.current - currentScrollRotation.current) * lerpFactor;

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const constantSpeed = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;

      tunnelStars.forEach(s => {
        s.z -= constantSpeed;
        if (s.z <= 1) {
          s.z = canvas.width;
          s.pz = s.z;
        }
        const perspective = 128 / s.z;
        const sx = s.x * perspective + canvas.width / 2;
        const sy = s.y * perspective + canvas.height / 2;
        if (s.pz > 0) {
          const prevPerspective = 128 / s.pz;
          const px = s.x * prevPerspective + canvas.width / 2;
          const py = s.y * prevPerspective + canvas.height / 2;
          ctx.beginPath();
          ctx.globalAlpha = 0.8 - (s.z / canvas.width);
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }
        s.pz = s.z;
      });

      ctx.globalAlpha = 1;
      staticStars.forEach(p => {
        p.opacity += p.blink;
        if (p.opacity > 1 || p.opacity < 0.1) p.blink *= -1;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const gCenterX = canvas.width * 0.12;
      const gCenterY = canvas.height * 0.32;

      galaxyStars.forEach(s => {
        const currentAngle = s.angle + currentScrollRotation.current;
        const x = gCenterX + Math.cos(currentAngle) * s.dist;
        const y = gCenterY + Math.sin(currentAngle) * s.dist * 0.6;

        ctx.shadowBlur = 4;
        ctx.shadowColor = s.color;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.opacity;

        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

const NeonFrame = ({ children, color = "cyan" }) => {
  const colorMap = {
    cyan: "group-hover:border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]",
    purple: "group-hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]",
    blue: "group-hover:border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
  };

  return (
    <div className={`transition-all duration-500 border border-white/10 bg-black/40 backdrop-blur-xl ${colorMap[color]}`}>
      {children}
    </div>
  );
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const baseFontSize = 16;
    const adjustedFontSize = baseFontSize / dpr;
    document.documentElement.style.fontSize = `${adjustedFontSize}px`;
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#BBBBBB] font-mono selection:bg-cyan-500/30 overflow-x-hidden relative">

      <SpaceBackground />

      <header className="fixed top-0 left-0 w-full z-[100] px-4 md:px-16 py-4 md:py-6 flex items-center justify-between border-b border-cyan-500/20 backdrop-blur-xl bg-black/60">
        <div className="flex-shrink-0 relative group">
          <div className="absolute inset-0 bg-cyan-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <img
            src={logoImg}
            alt="Orbit Digital"
            className="h-10 sm:h-16 md:h-24 w-auto object-contain cursor-pointer relative z-10 grayscale hover:grayscale-0 transition-all"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </div>
        {/* ГЛАВНАЯ НАВИГАЦИЯ  заголовок*/}
        <div className="flex items-center gap-4 md:gap-10">
          {/* ГЛАВНАЯ НАВИГАЦИЯ */}
          <nav className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.4em] font-medium">
            {['about', 'services', 'products', 'partners'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={(e) => handleNavClick(e, item)}
                className="text-gray-400 hover:text-white transition-all relative group flex items-center px-2 py-1"
              >
                {/* Левая декоративная скобка */}
                <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-cyan-500 transition-all duration-300 mr-1.5 text-[12px] font-light">
                  [
                </span>

                <span className="relative">
                  {item === 'about' ? 'О нас' :
                    item === 'services' ? 'Услуги' :
                      item === 'products' ? 'Продукты' : 'Партнеры'}

                  {/* Тонкое неоновое подчеркивание */}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300 group-hover:w-full"></span>
                </span>

                {/* Правая декоративная скобка */}
                <span className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-cyan-500 transition-all duration-300 ml-1.5 text-[12px] font-light">
                  ]
                </span>
              </a>
            ))}
          </nav>

          {/* КНОПКА СВЯЗИ С БЕЛОЙ ЗАЛИВКОЙ */}
          {/* КНОПКА СВЯЗИ: TOTAL WHITE EDITION */}
          {/* КНОПКА СВЯЗИ: WHITE GLASS EDITION */}
          <button
            onClick={openModal}
            className="relative px-8 md:px-12 py-3 md:py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] group"
          >
            {/* Матовое стекло: при наведении становится светлее и плотнее */}
            <span className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-full group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-500"></span>

            {/* Маленькие белые светящиеся точки по бокам */}
            <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_8px_white] transition-all duration-300"></span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_8px_white] transition-all duration-300"></span>

            {/* Текст: от серого к чисто белому */}
            <span className="relative z-10 text-gray-400 group-hover:text-white transition-colors duration-300">
              Связаться
            </span>
          </button>

          {/* МОБИЛЬНАЯ КНОПКА (БУРГЕР) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex flex-col gap-2 p-2 focus:outline-none group"
          >
            <span className={`h-[1px] bg-cyan-400 transition-all duration-300 ${isMobileMenuOpen ? 'w-6 rotate-45 translate-y-2.5' : 'w-8 group-hover:w-6'}`}></span>
            <span className={`h-[1px] bg-cyan-400 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'w-8 group-hover:w-4'}`}></span>
            <span className={`h-[1px] bg-cyan-400 transition-all duration-300 ${isMobileMenuOpen ? 'w-6 -rotate-45 -translate-y-2.5' : 'w-8 group-hover:w-2'}`}></span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[45] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:gap-12 font-sans"
          >
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-gray-200 hover:text-cyan-400 transition-colors">О компании</a>
            <a href="#services" onClick={(e) => handleNavClick(e, 'services')} className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-gray-200 hover:text-cyan-400 transition-colors">Услуги</a>
            <a href="#products" onClick={(e) => handleNavClick(e, 'products')} className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-gray-200 hover:text-cyan-400 transition-colors">Продукты</a>
            <button onClick={openModal} className="mt-6 md:mt-10 bg-cyan-500 text-black px-8 md:px-12 py-4 md:py-5 rounded-full font-bold uppercase text-xs md:text-sm tracking-widest hover:bg-cyan-400">Начать проект</button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 pt-20">

        {/* --- ГЛАВНЫЙ БЛОК --- */}
        <section className="py-20 sm:py-32 md:py-72 px-5 sm:px-10 text-center relative overflow-visible">
          {/* --- ДЕКОРАТИВНАЯ ПЛАНЕТА --- */}
          <motion.img
            src={planetImg}
            alt="Planet Decor"
            initial={{ opacity: 0, x: 150, y: -80 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 2.5, ease: "easeOut" }}

            // УМЕНЬШЕНО: теперь ширина 400px на мобильных и 750px на десктопе.
            // Подправлены отступы (right-[-35%]), чтобы маленькая планета не прилипала к тексту.
            className="absolute top-[-5%] right-[-55%] sm:top-[-10%] sm:right-[-45%] md:top-[-20%] md:right-[-65%] xl:top-[-25%] xl:right-[-70%] w-[300px] sm:w-[400px] md:w-[750px] xl:w-[1000px] h-auto pointer-events-none z-0 select-none filter blur-[0.5px]"

            style={{
              maxWidth: 'none',
              // Маска остается плотной, чтобы планета была "солидной" и не прозрачной.
              WebkitMaskImage: 'radial-gradient(circle at center, black 85%, transparent 100%)',
              maskImage: 'radial-gradient(circle at center, black 85%, transparent 100%)'
            }}
          />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.2 }}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black leading-[0.9] mb-8 md:mb-14 tracking-tight select-none font-sans">
              <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] uppercase">ORBIT</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse">
                Digital
              </span>
            </h1>
            <p className="text-base md:text-xl text-gray-500 max-w-xs md:max-w-xl mx-auto font-light tracking-[0.3em] md:tracking-[0.4em] uppercase leading-relaxed border-t border-b border-gray-800 py-3 md:py-4">
              // Технологии и автоматизация для бизнеса
            </p>
          </motion.div>
        </section>

        {/* КРАТКИЙ СПИСОК УСЛУГ - УЛУЧШЕННЫЙ ДИЗАЙН */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="mb-40"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y border-white/5 bg-white/[0.01] backdrop-blur-sm">
            {[
              { label: "01. AI CORE", desc: "Внедрение нейронных сетей и ИИ." },
              { label: "02. BIG DATA", desc: "Проектирование баз данных." },
              { label: "03. AUTO SYNC", desc: "Оптимизация бизнес-процессов." }
            ].map((item, i) => (
              <div
                key={i}
                className={`relative py-24 px-8 sm:px-12 group overflow-hidden transition-all duration-500 hover:bg-white/[0.02]
          ${i !== 2 ? 'md:border-r border-white/5' : ''}`} // Тонкая вертикальная линия между блоками
              >
                {/* Световой индикатор сверху при наведении */}
                <div className="absolute top-0 left-0 w-0 h-[1px] bg-cyan-500/50 transition-all duration-500 group-hover:w-full" />

                {/* Метка (Label) */}
                <span className="block text-cyan-500 text-[10px] mb-8 tracking-[0.5em] font-bold uppercase transition-transform duration-300 group-hover:translate-x-1">
                  {item.label}
                </span>

                {/* Основной текст */}
                <p className="text-white text-xl md:text-2xl font-light uppercase tracking-tight leading-tight transition-all duration-300 group-hover:text-cyan-50 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  {item.desc}
                </p>

                {/* Маленький декоративный элемент в углу */}
                <div className="absolute bottom-4 right-4 w-1 h-1 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </motion.section>
        {/* Декоративный разделитель между блоками */}
        <div className="w-full flex justify-center my-20 md:my-32">
          <div className="w-[1px] h-20 md:h-32 bg-gradient-to-b from-cyan-500/50 via-transparent to-transparent" />
        </div>

        {/* --- О НАС --- */}
        <motion.section id="about" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} className="mb-32 md:mb-64 py-10 md:py-24 relative">
          <div className="absolute inset-0 opacity-5 [background-image:linear-gradient(#444_1px,transparent_1px),linear-gradient(90deg,#444_1px,transparent_1px)] [background-size:24px_24px] md:background-size:32px_32px]"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-8 md:gap-12 items-start">
            <div className="flex flex-col gap-2 md:gap-3 border-l-2 border-purple-500 pl-4 md:pl-6">
              <span className="text-purple-500 font-bold tracking-[0.5em] uppercase text-[8px] md:text-[10px]">Company.Log</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-none font-sans uppercase text-left">Разработка <br /> решений.</h2>
            </div>
            <div className="space-y-4 md:space-y-6">
              <p className="text-base md:text-2xl text-[#AAAAAA] leading-relaxed font-light text-left">
                Мы помогаем оптимизировать бизнес-процессы, создавая надежные инструменты на базе современных технологий для стабильной работы компаний.
              </p>
              <div className="text-cyan-400 text-[10px] md:text-sm uppercase text-left">// Статус: Активен. Интеграция систем в процессе.</div>
            </div>
          </div>
        </motion.section>

        {/* --- УСЛУГИ --- */}
        <div id="services" className="space-y-16 md:space-y-32 mb-32 md:mb-64">
          <h2 className="text-center text-[8px] md:text-[10px] font-bold uppercase tracking-[0.6em] text-cyan-500/60 mb-10 md:mb-20">// Направления работы</h2>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} className="group">
            <NeonFrame color="cyan">
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,2fr] items-center gap-8 md:gap-16 p-6 md:p-12">
                <div className="relative overflow-hidden border border-cyan-500/30">
                  <img src={aiImg} alt="AI Services" className="w-full h-48 md:h-auto object-cover group-hover:scale-110 transition-transform duration-[3s] ease-out opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="space-y-4 md:space-y-8 text-left">
                  <motion.img src={aiIconImg} alt="AI" className="w-12 h-12 md:w-20 md:h-20 filter saturate-50 group-hover:saturate-100 transition-all" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} />
                  <div className="space-y-2 md:space-y-4">
                    <h3 className="text-2xl md:text-5xl font-black text-white tracking-tighter leading-none font-sans uppercase">Интеллектуальные <br /> системы</h3>
                    <p className="text-sm md:text-2xl text-gray-400 font-light leading-relaxed">Внедрение продвинутых алгоритмов машинного обучения и виртуальных помощников. Наши ИИ-решения берут на себя интеллектуальную нагрузку, гарантируя высокую производительность.</p>
                  </div>
                  <div className="text-[10px] md:text-lg text-cyan-600 group-hover:text-cyan-400 transition-colors">&gt; Load_AI_Service</div>
                </div>
              </div>
            </NeonFrame>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} className="group">
            <NeonFrame color="purple">
              <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.5fr] items-center gap-8 md:gap-16 p-6 md:p-12">
                <div className="lg:order-1 space-y-4 md:space-y-8 text-left">
                  <motion.img src={dataIconImg} alt="Data" className="w-12 h-12 md:w-20 md:h-20 filter saturate-50 group-hover:saturate-100 transition-all" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 0.5 }} />
                  <div className="space-y-2 md:space-y-4">
                    <h3 className="text-2xl md:text-5xl font-black text-white tracking-tighter leading-none font-sans uppercase">Работа <br /> с данными</h3>
                    <p className="text-sm md:text-2xl text-gray-400 font-light leading-relaxed">Разработка серверной логики и аналитических движков для работы с Big Data. Мы строим системы, где каждый байт информации работает на достижение ваших стратегических целей.</p>
                  </div>
                  <div className="text-[10px] md:text-lg text-purple-600 group-hover:text-purple-400 transition-colors">&gt; Data_Process_Run</div>
                </div>
                <div className="lg:order-2 relative overflow-hidden border border-purple-500/30">
                  <img src={dataImg} alt="Data Management" className="w-full h-48 md:h-auto object-cover group-hover:scale-110 transition-transform duration-[3s] ease-out opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
              </div>
            </NeonFrame>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} className="group">
            <NeonFrame color="blue">
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,2fr] items-center gap-8 md:gap-16 p-6 md:p-12">
                <div className="relative overflow-hidden border border-blue-500/30">
                  <img src={autoImg} alt="Automation" className="w-full h-48 md:h-auto object-cover group-hover:scale-110 transition-transform duration-[3s] ease-out opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="space-y-4 md:space-y-8 text-left">
                  <motion.img src={autoIconImg} alt="Auto" className="w-12 h-12 md:w-20 md:h-20 filter saturate-50 group-hover:saturate-100 transition-all" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }} />
                  <div className="space-y-2 md:space-y-4">
                    <h3 className="text-2xl md:text-5xl font-black text-white tracking-tighter leading-none font-sans uppercase">Инженерная <br /> оптимизация</h3>
                    <p className="text-sm md:text-2xl text-gray-400 font-light leading-relaxed">Разработка и внедрение прикладного ПО для синхронизации сложных бизнес-операций. Обеспечиваем бесперебойную работу цифровых сервисов без необходимости внешнего контроля.</p>
                  </div>
                  <div className="text-[10px] md:text-lg text-blue-600 group-hover:text-blue-400 transition-colors">&gt; Start_Automation</div>
                </div>
              </div>
            </NeonFrame>
          </motion.div>
        </div>

        {/* --- РАЗДЕЛ: ПРОДУКТЫ --- */}
        <section id="products" className="mb-32 md:mb-64">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
            <h2 className="text-center text-[8px] md:text-[10px] font-bold uppercase tracking-[0.6em] text-purple-500/60 mb-10 md:mb-20">// Проекты в разработке</h2>
            <div className="min-h-[200px] flex items-center justify-center border border-white/5 bg-white/[0.01]">
              <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-gray-700 select-none animate-pulse">
                Системы в режиме ожидания...
              </span>
            </div>
          </motion.div>
        </section>

        {/* --- ПАРТНЕРЫ --- */}
        <section id="partners" className="mb-32 md:mb-64">
          <h2 className="text-center text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] text-gray-600 mb-10 md:mb-20">// Партнеры</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((id) => (
              <motion.div key={id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: id * 0.1 }} className="h-24 md:h-32 border border-white/5 flex items-center justify-center bg-white/[0.01] hover:bg-cyan-950/20 hover:border-cyan-500/50 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000"></div>
                <span className="text-[#333] group-hover:text-cyan-400 font-bold text-[10px] md:text-xs tracking-widest uppercase relative z-10">Partner_0{id}</span>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 md:py-16 bg-[#030303] text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">

          <p className="text-gray-500 text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-light max-w-[200px] md:max-w-none">
            &copy; 2026 Orbit Digital // Технологии для эффективной работы.
          </p>

          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-600">
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-6" onClick={closeModal}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-black border border-cyan-500 p-6 md:p-16 w-full max-w-2xl relative shadow-[0_0_50px_rgba(34,211,238,0.2)]" onClick={(e) => e.stopPropagation()}>

              <button onClick={closeModal} className="absolute top-4 right-4 md:top-6 md:right-6 text-cyan-500/50 hover:text-cyan-400 text-2xl md:text-3xl focus:outline-none">&times;</button>

              <h3 className="text-2xl md:text-5xl font-black mb-4 md:mb-6 text-white tracking-tighter uppercase font-sans">Связаться с нами</h3>

              <form className="space-y-4 md:space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Сообщение отправлено.'); closeModal(); }}>
                <input type="text" placeholder="Ваше имя" className="w-full bg-white/5 border border-white/10 p-4 md:p-5 rounded-none text-white outline-none focus:border-cyan-500 text-sm md:text-base" required />

                <input type="email" placeholder="Email для связи" className="w-full bg-white/5 border border-white/10 p-4 md:p-5 rounded-none text-white outline-none focus:border-cyan-500 text-sm md:text-base" required />

                {/* ИЗМЕНЕНО: Поле телефона с маской +7 */}
                <input
                  type="tel"
                  defaultValue="+7 "
                  onInput={(e) => {
                    if (!e.target.value.startsWith('+7 ')) {
                      e.target.value = '+7 ' + e.target.value.replace(/^\+7\s*/, '');
                    }
                  }}
                  placeholder="Номер телефона"
                  className="w-full bg-white/5 border border-white/10 p-4 md:p-5 rounded-none text-white outline-none focus:border-cyan-500 text-sm md:text-base"
                  required
                />

                <textarea placeholder="Как мы можем вам помочь?" rows="3" className="w-full bg-white/5 border border-white/10 p-4 md:p-5 rounded-none text-white outline-none focus:border-cyan-500 resize-none text-sm md:text-base"></textarea>

                <button type="submit" className="w-full bg-cyan-500 text-black py-4 md:py-6 rounded-none text-[10px] md:text-sm font-bold uppercase tracking-widest hover:bg-cyan-400 transition-all">Отправить запрос</button>
              </form>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;