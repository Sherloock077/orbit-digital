import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendFormData } from './services/messageService';

// ==========================================
// 1. ИМПОРТЫ СТАТИЧЕСКИХ РЕСУРСОВ (ИЗОБРАЖЕНИЙ)
// ==========================================
import logoImg from './assets/logo.png';
import orbitImg from './assets/orbit.jpg';
import imgBigData from './assets/bigdata.jpg';
import imgDPI from './assets/DPI.jpg';
import imgDron from './assets/dron2.jpg';
import imgOSINT from './assets/OSINT.jpg';
import imgOutsorcing from './assets/outsorcing.jpg';

// ==========================================
// 2. КОМПОНЕНТ: КНОПКА "НАВЕРХ"
// ==========================================
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[1000] w-10 h-10 md:w-12 md:h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md hover:bg-cyan-500/40 hover:scale-110 active:scale-95 ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      aria-label="Наверх"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 fill-none stroke-cyan-400 stroke-2">
        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

// ==========================================
// 3. КОМПОНЕНТ: ИНТЕРАКТИВНЫЙ КОСМИЧЕСКИЙ ФОН (HTML5 CANVAS)
// ==========================================
const SpaceBackground = () => {
  const canvasRef = useRef(null);
  const targetScrollRotation = useRef(0);
  const currentScrollRotation = useRef(0);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

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
      const starCount = isMobile ? 400 : 600;
      for (let i = 0; i < starCount; i++) {
        staticStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 0.8 + 0.2,
          opacity: Math.random() * 0.6,
          blink: Math.random() * 0.006 + 0.002
        });
      }

      galaxyStars = [];
      const branches = 5;
      const galaxyCount = isMobile ? 150 : 400;
      for (let i = 0; i < galaxyCount; i++) {
        const dist = Math.random() * 200 + 40;
        const angle = (i % branches) * ((Math.PI * 2) / branches) + (dist * 0.04);
        galaxyStars.push({
          dist: dist,
          angle: angle,
          size: Math.random() * 1.2 + 0.6,
          opacity: Math.random() * 0.25 + 0.15,
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
        if (p.opacity > 0.6 || p.opacity < 0.1) p.blink *= -1;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.7})`;
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

        ctx.shadowBlur = 2;
        ctx.shadowColor = s.color;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.opacity * 0.6;

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
      window.removeEventListener('resize', checkMobile);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

// ==========================================
// 4. ОСНОВНОЙ КОМПОНЕНТ ПРИЛОЖЕНИЯ (APP)
// ==========================================
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.15 }
    );

    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      observer.observe(servicesSection);
    }

    return () => {
      if (servicesSection) {
        observer.unobserve(servicesSection);
      }
    };
  }, []);

  // ==================== ИСПРАВЛЕННЫЙ СКРОЛЛ К ПРОДУКТУ (С ЗАДЕРЖКОЙ) ====================
  const scrollToProduct = (index) => {
    const productElement = document.getElementById(`product-${index}`);
    if (productElement) {
      // Функция скролла
      const scrollNow = () => {
        productElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      };

      // Вызываем сразу
      scrollNow();

      // И ещё раз через 100ms для корректировки (убирает накопленный сдвиг)
      setTimeout(scrollNow, 100);
    }

    if (isMobile) {
      setExpandedProduct(index);
    }
  };

  const servicesList = [
    {
      label: "01. DPI SYSTEMS",
      desc: "Трафик-менеджмент",
      activeColor: "#ef4444",
      textColor: "text-red-500",
      productIndex: 0
    },
    {
      label: "02. DRONE TECH",
      desc: "БАС (Беспилотные авиационные системы)",
      activeColor: "#22d3ee",
      textColor: "text-cyan-400",
      productIndex: 1
    },
    {
      label: "03. OSINT INTELLIGENCE",
      desc: "Автоматизированный сбор данных",
      activeColor: "#fbbf24",
      textColor: "text-amber-400",
      productIndex: 2
    },
    {
      label: "04. BIG DATA ANALYSIS",
      desc: "Архитектуры хранения терабайтов данных",
      activeColor: "#a855f7",
      textColor: "text-purple-400",
      productIndex: 3
    },
    {
      label: "05. CORE OUTSOURCING",
      desc: "Разработка под ключ.",
      activeColor: "#10b981",
      textColor: "text-emerald-500",
      productIndex: 4
    }
  ];

  const products = [
    {
      id: "product-0",
      label: "01. DPI SYSTEMS",
      desc: `• Анализ и управление сетевым трафиком.\n• Разработка систем глубокого анализа пакетов для классификации и приоритизации трафика.\n• Решения для кибербезопасности: обнаружение вторжений (IDS) и предотвращение утечек данных на лету.\n• Оптимизация пропускной способности сетей для крупных корпоративных узлов.`,
      activeColor: "#ef4444",
      textColor: "text-red-500",
      img: imgDPI
    },
    {
      id: "product-1",
      label: "02. DRONE TECH",
      desc: `• Алгоритмы обнаружения дронов по анализу их радиосигналов.\n• Программное подавление (глушение) каналов управления, навигации и телеметрии.\n• Перехват управления дроном: взлом связи, подмена координат и автоматическая посадка.\n• Программное обеспечение для координации систем перехвата и работы с радиолокационными станциями.`,
      activeColor: "#22d3ee",
      textColor: "text-cyan-400",
      img: imgDron
    },
    {
      id: "product-2",
      label: "03. OSINT INTELLIGENCE",
      desc: `• Автоматизированный сбор и сквозной мониторинг открытых данных.\n• Глубокий анализ потенциальных рисков и угроз безопасности.\n• Выявление и визуализация скрытых взаимосвязей в цифровой среде.\n• Аудит репутации и проверка контрагентов через открытые источники данных.`,
      activeColor: "#fbbf24",
      textColor: "text-amber-400",
      img: imgOSINT
    },
    {
      id: "product-3",
      label: "04. BIG DATA ANALYSIS",
      desc: `• Строим надёжные системы для хранения и обработки очень больших объёмов информации (терабайты и больше).\n• Разрабатываем модели прогнозирования и алгоритмы машинного обучения.\n• Делаем понятные дашборды и визуализацию процессов в реальном времени.\n• Находим скрытые закономерности и полезные для бизнеса выводы в любых массивах данных.`,
      activeColor: "#a855f7",
      textColor: "text-purple-400",
      img: imgBigData
    },
    {
      id: "product-4",
      label: "05. CORE OUTSOURCING",
      desc: `• Выделенные команды разработчиков с полным техническим сопровождением.\n• Экспертиза в разработке на React, Python и современных веб-технологиях.\n• Полный цикл: архитектура, разработка, тестирование, развёртывание.\n• Прозрачный контроль процессов, код-ревью и постоянная поддержка.`,
      activeColor: "#10b981",
      textColor: "text-emerald-500",
      img: imgOutsorcing
    }
  ];

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
    // Очистка формы
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  // Обработчик изменения поля формы
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик отправки формы
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('Заполните все обязательные поля: Имя, Email и Сообщение');
      return;
    }

    setIsSending(true);
    
    try {
      const result = await sendFormData(formData);
      
      if (result.success) {
        alert('✅ Спасибо! Ваша заявка отправлена. Мы скоро вам напишем.');
        closeModal();
      } else {
        alert('❌ Ошибка при отправке. Пожалуйста, попробуйте позже.');
        console.error('Send error:', result.error);
      }
    } catch (error) {
      alert('❌ Ошибка при отправке. Пожалуйста, попробуйте позже.');
      console.error('Form submission error:', error);
    } finally {
      setIsSending(false);
    }
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
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#BBBBBB] font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif] selection:bg-cyan-500/30 overflow-x-hidden relative">

      <SpaceBackground />
      <ScrollToTop />

      {/* ==================== ШАПКА САЙТА ==================== */}
      <header className="fixed top-0 left-0 w-full z-[100] px-4 md:px-16 h-20 md:h-28 flex items-center justify-between border-b border-cyan-500/20 backdrop-blur-xl bg-black/60">
        <div className="flex-shrink-0 relative group">
          <div className="absolute inset-0 bg-cyan-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <img
            src={logoImg}
            alt="Orbit Digital"
            className="h-10 sm:h-14 md:h-20 w-auto object-contain cursor-pointer relative z-10 grayscale hover:grayscale-0 transition-all"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.4em] font-medium font-['Inter',system-ui,sans-serif]">
            {['about', 'services', 'products', 'partners'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={(e) => handleNavClick(e, item)}
                className="text-gray-400 hover:text-white transition-all relative group flex items-center px-2 py-1"
              >
                <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-cyan-500 transition-all duration-300 mr-1.5 text-[14px] font-light">[</span>
                <span className="relative">
                  {item === 'about' ? 'О нас' : item === 'services' ? 'Направления' : item === 'products' ? 'Продукты' : 'Партнеры'}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300 group-hover:w-full"></span>
                </span>
                <span className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-cyan-500 transition-all duration-300 ml-1.5 text-[14px] font-light">]</span>
              </a>
            ))}
          </nav>

          <button onClick={openModal} className="relative px-6 md:px-8 py-2 md:py-2.5 group transition-all duration-500">
            <span className="relative z-10 text-[9px] md:text-[10px] font-medium uppercase tracking-[0.25em] text-white/70 group-hover:text-white transition-colors duration-500 font-['Inter',system-ui,sans-serif]">Связаться</span>
            <span className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-500"></span>
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-[1px] h-[1px] bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 w-[1px] h-[1px] bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          </button>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden flex flex-col gap-2 p-2 focus:outline-none group">
            <span className={`h-[1px] bg-cyan-400 transition-all duration-300 ${isMobileMenuOpen ? 'w-6 rotate-45 translate-y-2.5' : 'w-8 group-hover:w-6'}`}></span>
            <span className={`h-[1px] bg-cyan-400 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'w-8 group-hover:w-4'}`}></span>
            <span className={`h-[1px] bg-cyan-400 transition-all duration-300 ${isMobileMenuOpen ? 'w-6 -rotate-45 -translate-y-2.5' : 'w-8 group-hover:w-2'}`}></span>
          </button>
        </div>
      </header>

      {/* ==================== МОБИЛЬНОЕ МЕНЮ ==================== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[45] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:gap-12 font-['Inter',system-ui,sans-serif]"
          >
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-200 hover:text-cyan-400 transition-colors">О компании</a>
            <a href="#services" onClick={(e) => handleNavClick(e, 'services')} className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-200 hover:text-cyan-400 transition-colors">Услуги</a>
            <a href="#products" onClick={(e) => handleNavClick(e, 'products')} className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-200 hover:text-cyan-400 transition-colors">Продукты</a>
            <button onClick={openModal} className="mt-6 md:mt-10 bg-cyan-500 text-black px-8 md:px-12 py-4 md:py-5 rounded-full font-bold uppercase text-base md:text-sm tracking-widest hover:bg-cyan-400 font-['Inter',system-ui,sans-serif]">Начать проект</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== ОСНОВНОЙ КОНТЕНТ ==================== */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 pt-20">

        {/* ========================================== */}
        {/* ГЛАВНЫЙ ЭКРАН (HERO) */}
        {/* ========================================== */}
        <section className="min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center py-16 text-center relative overflow-visible" style={{ minHeight: 'calc(100vh - 80px)', marginTop: '-40px' }}>
          <motion.img
            src={orbitImg}
            alt="Orbit Space Object"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-[-5%] right-[-55%] sm:top-[-10%] sm:right-[-45%] md:top-[-20%] md:right-[-65%] xl:top-[-25%] xl:right-[-70%] w-[200px] sm:w-[280px] md:w-[400px] xl:w-[600px] h-auto pointer-events-none z-0 opacity-70"
          />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="w-full"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black leading-[1.1] mb-0 sm:mb-1 md:mb-2 tracking-tighter select-none font-['Inter',system-ui,sans-serif] text-center">
              <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] uppercase block">ORBIT</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 block font-['Inter',system-ui,sans-serif]" style={{ lineHeight: 1.3, paddingBottom: '0.2em', marginTop: '-0.15em' }}>
                Digital
              </span>
            </h1>
            <p className="hero-subtitle custom-subtitle text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 w-full max-w-4xl mx-auto font-light tracking-[0.05em] sm:tracking-[0.1em] md:tracking-[0.2em] uppercase leading-[1.6] border-t border-b border-white/10 py-4 sm:py-5 md:py-6 bg-black/20 backdrop-blur-sm px-4 sm:px-6 md:px-8 font-['Inter',system-ui,sans-serif]">
  // Мы создаем технологии на стыке физической безопасности и цифрового интеллекта.
            </p>
          </motion.div>
        </section>

        {/* ========================================== */}
        {/* СЕКЦИЯ 1: НАШИ НАПРАВЛЕНИЯ */}
        {/* ========================================== */}
        <section id="services" className="py-20 px-4 max-w-5xl mx-auto scroll-mt-32">
          <div className="relative z-10 flex flex-col items-center text-center mb-16 md:mb-24">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-[1px] bg-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
              <span className="services-badge text-cyan-400 font-['Inter',system-ui,sans-serif] text-[10px] md:text-[12px] tracking-[0.6em] uppercase font-bold">
                [ Core Capabilities ]
              </span>
              <div className="w-12 h-[1px] bg-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            </div>

            <h2 className="services-heading text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight font-['Inter',system-ui,sans-serif] relative select-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">Наши</span>{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">направления</span>
            </h2>

            <div className="mt-8 w-40 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          </div>

          <div className="flex flex-col gap-4 relative z-10">
            {servicesList.map((item, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => {
                    scrollToProduct(item.productIndex);
                    setHoveredIndex(i);
                    setTimeout(() => setHoveredIndex(null), 300);
                  }}
                  className="service-card group relative flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 border border-white/10 bg-black/30 backdrop-blur-sm cursor-pointer transition-all duration-500 ease-in-out overflow-hidden rounded-2xl md:rounded-3xl"
                  style={{
                    borderColor: isHovered ? item.activeColor : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isHovered ? `0 0 25px ${item.activeColor}33, inset 0 0 15px ${item.activeColor}11` : 'none'
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 pointer-events-none rounded-2xl md:rounded-3xl" style={{ background: `linear-gradient(90deg, ${item.activeColor} 0%, transparent 80%)` }} />

                  <div className="md:w-5/12 mb-3 md:mb-0 z-10 relative">
                    {/* 👇👇👇 ДОБАВЛЕН КЛАСС services-card-title 👇👇👇 */}
                    <h3 className={`services-card-title text-base md:text-xl lg:text-2xl font-black font-['Inter',system-ui,sans-serif] tracking-[0.4em] uppercase transition-all duration-300 translate-x-0 group-hover:translate-x-2 inline-block ${isHovered ? item.textColor : 'text-slate-400'}`}>
                      {item.label}
                    </h3>
                  </div>

                  <div className="md:w-7/12 z-10 md:pl-6 relative">
                    <p className={`services-card-desc text-sm md:text-base lg:text-lg leading-relaxed font-normal md:font-light uppercase tracking-wide transition-colors duration-500 font-['Inter',system-ui,sans-serif] ${isHovered ? 'text-gray-100' : 'text-gray-400'}`}>
                      {item.desc}
                    </p>
                  </div>

                  <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100" style={{ backgroundColor: item.activeColor, boxShadow: `0 0 10px ${item.activeColor}` }} />
                  <div className="absolute top-3 right-3 text-[9px] md:text-[10px] uppercase tracking-wider text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-['Inter',system-ui,sans-serif]">
                    [ подробнее ]
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="w-full flex justify-center my-20 md:my-32">
          <div className="w-[1px] h-20 md:h-32 bg-gradient-to-b from-cyan-500/50 via-transparent to-transparent" />
        </div>
        {/* ========================================== */}
        {/* СЕКЦИЯ: О КОМПАНИИ */}
        {/* ========================================== */}
        <motion.section
          id="about"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="mb-32 md:mb-64 py-16 md:py-24 relative"
        >
          <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(#444_1px,transparent_1px),linear-gradient(90deg,#444_1px,transparent_1px)] [background-size:32px_32px]"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-10 md:gap-12 items-start">
            <div className="flex flex-col gap-4 border-l-2 border-purple-500 pl-6">
              <span className="text-purple-500 font-bold tracking-[0.5em] uppercase text-[11px] md:text-[13px] font-['Inter',system-ui,sans-serif]">Orbit.Digital / Core</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none font-['Inter',system-ui,sans-serif] uppercase text-left">Инженерный <br /> Интеллект.</h2>
            </div>

            <div className="space-y-6 md:space-y-8 w-full md:-mr-8 lg:-mr-12">
              <p className="about-text text-lg md:text-xl lg:text-2xl text-[#CCCCCC] leading-relaxed font-light text-left font-['Inter',system-ui,sans-serif]">
                Мы проектируем системы глубокого анализа трафика, автономные полетные решения и инструменты цифровой разведки. Наши продукты превращают сырые данные в контролируемую среду для защиты и масштабирования вашего бизнеса.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ========================================== */}
        {/* СЕКЦИЯ 2: ПРОЕКТЫ В РАЗРАБОТКЕ */}
        {/* ========================================== */}
        <section id="products" className="mb-32 md:mb-64">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <h2 className="text-center text-[9px] md:text-[11px] font-bold uppercase tracking-[0.6em] text-purple-500/60 mb-10 md:mb-20 font-['Inter',system-ui,sans-serif]">// Проекты в разработке</h2>

            <div className="flex flex-col gap-8 max-w-none -mx-8 md:-mx-32 lg:-mx-48 xl:-mx-64 2xl:-mx-80">
              {products.map((item, i) => (
                <motion.div
                  key={i}
                  id={item.id}
                  onClick={() => {
                    if (isMobile) {
                      setExpandedProduct(expandedProduct === i ? null : i);
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = item.activeColor;
                    e.currentTarget.style.boxShadow = `0 0 25px ${item.activeColor}33`;
                    e.currentTarget.style.setProperty('--current-accent', item.activeColor);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.setProperty('--current-accent', 'rgba(255,255,255,0.2)');
                  }}
                  className="group relative border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden transition-all duration-500 cursor-pointer flex flex-col md:flex-row items-stretch rounded-2xl md:rounded-3xl"
                >
                  <div className="relative w-full md:w-5/12 min-h-[220px] md:min-h-full overflow-hidden bg-black/40 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-white/5 rounded-t-2xl md:rounded-l-3xl md:rounded-t-none">
                    <div className="absolute inset-0 z-10 opacity-5 group-hover:opacity-0 transition-opacity duration-500" style={{ backgroundColor: item.activeColor }} />
                    <img src={item.img} alt={item.label} className="w-full h-full max-h-[260px] md:max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700 scale-102 group-hover:scale-100" />
                  </div>

                  <div className="p-6 md:p-8 md:pl-12 md:pr-0 flex-1 flex flex-col justify-between">
                    <div>
                      <span className={`${item.textColor} product-title mb-3 block tracking-[0.4em] font-bold uppercase font-['Inter',system-ui,sans-serif]`}>
                        {item.label}
                      </span>

                      {(!isMobile || (isMobile && expandedProduct === i)) && (
                        <p className="text-sm md:text-base lg:text-lg text-gray-400 leading-relaxed font-light mb-6 uppercase tracking-tight whitespace-pre-line font-['Inter',system-ui,sans-serif]">
                          {item.desc}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex gap-1.5">
                        <div className="w-1 h-1 transition-colors duration-500" style={{ backgroundColor: 'var(--current-accent)' }} />
                        <div className="w-4 h-[1px] self-center opacity-20 transition-colors duration-500" style={{ backgroundColor: 'var(--current-accent)' }} />
                      </div>

                      {isMobile && (
                        <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-gray-500 font-['Inter',system-ui,sans-serif]">
                          {expandedProduct === i ? '[ закрыть ]' : '[ подробнее ]'}
                        </span>
                      )}

                      <div className="w-1.5 h-1.5 rounded-full transition-all duration-500" style={{ backgroundColor: 'var(--current-accent)', boxShadow: `0 0 10px var(--current-accent)` }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ========================================== */}
        {/* СЕКЦИЯ: ПАРТНЕРЫ (временно скрыта) */}
        {/* ========================================== */}
        {false && (
          <section id="partners" className="mb-32 md:mb-64">
            <h2 className="text-center text-[9px] md:text-[11px] font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] text-gray-600 mb-10 md:mb-20 font-['Inter',system-ui,sans-serif]">// Партнеры</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((id) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: id * 0.1, duration: 0.3 }}
                  className="h-24 md:h-32 border border-white/5 flex items-center justify-center bg-white/[0.01] hover:bg-cyan-950/20 hover:border-cyan-500/50 transition-all group relative overflow-hidden rounded-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000"></div>
                  <span className="text-[#444] group-hover:text-cyan-400 font-bold text-[11px] md:text-sm tracking-widest uppercase relative z-10 font-['Inter',system-ui,sans-serif]">Partner_0{id}</span>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ==================== ПОДВАЛ ==================== */}
      <footer className="border-t border-white/5 py-10 md:py-16 bg-[#030303] text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
          <p className="text-gray-500 text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-light max-w-[200px] md:max-w-none font-['Inter',system-ui,sans-serif]">
            &copy; 2026 Orbit Digital // Технологии для эффективной работы.
          </p>
        </div>
      </footer>

      {/* ==================== МОДАЛЬНОЕ ОКНО ==================== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              // ИСПРАВЛЕНИЕ ЗДЕСЬ: убрал max-h-[90vh], добавил overflow-y-auto и pb-2
              className="bg-black border border-cyan-500 p-6 w-full max-w-md relative shadow-[0_0_50px_rgba(34,211,238,0.2)] rounded-3xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={closeModal} className="absolute top-3 right-4 text-cyan-500/50 hover:text-cyan-400 text-3xl focus:outline-none z-10">
                &times;
              </button>

              <h3 className="text-2xl md:text-3xl font-black mb-6 text-white tracking-tighter uppercase font-['Inter',system-ui,sans-serif] text-center pr-4">
                Связаться с нами
              </h3>

              {/* ИСПРАВЛЕНИЕ ЗДЕСЬ: добавил отступ снизу pb-4 для формы */}
              <form className="space-y-4 pb-4" onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Ваше имя"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-cyan-500 text-base font-['Inter',system-ui,sans-serif]"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email для связи"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-cyan-500 text-base font-['Inter',system-ui,sans-serif]"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+7 ___ ___ __ __"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-cyan-500 text-base font-['Inter',system-ui,sans-serif]"
                />
                <textarea
                  name="message"
                  placeholder="Как мы можем вам помочь?"
                  rows="3"
                  value={formData.message}
                  onChange={handleFormChange}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-cyan-500 resize-none text-base font-['Inter',system-ui,sans-serif]"
                ></textarea>
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-cyan-500 text-black py-4 rounded-2xl text-base font-bold uppercase tracking-widest hover:bg-cyan-400 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? 'Отправка...' : 'Отправить запрос'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;