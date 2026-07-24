import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import {
  Menu, X, ChevronDown, ChevronRight, Star,
  Clock, Users, Award, Zap, Play, CheckCircle,
  ArrowRight, Mail, Phone, MapPin, Globe
} from 'lucide-react';
import ThankYouPage from './ThankYouPage';

// Razorpay payment link
const RAZORPAY_URL = "https://rzp.io/rzp/EkTf9JZo";

// ------------------------------------------------------------
// 1. CUSTOM CURSOR COMPONENT
// ------------------------------------------------------------
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const isHovering = useRef(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!cursorRef.current) return;
      const { clientX, clientY } = e;
      cursorRef.current.style.transform = `translate3d(${clientX - 12}px, ${clientY - 12}px, 0)`;
    };
    const onMouseEnter = (e) => { isHovering.current = true; };
    const onMouseLeave = (e) => { isHovering.current = false; };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-50 w-6 h-6 rounded-full bg-blue-500/30 backdrop-blur-xl border border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-transform duration-75 ease-out"
      style={{ left: 0, top: 0, willChange: 'transform' }}
    />
  );
};

// ------------------------------------------------------------
// 2. FADE IN COMPONENT (scroll‑triggered)
// ------------------------------------------------------------
const FadeIn = ({
  children, delay = 0, duration = 0.7, x = 0, y = 30,
  className = '', once = true, amount = 0.2
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ------------------------------------------------------------
// 3. MAGNETIC BUTTON (mouse‑following effect)
// ------------------------------------------------------------
const MagneticButton = ({ children, className = '' }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    const strength = 3;
    setPosition({ x: x / strength, y: y / strength });
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsActive(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
        transition: {
          type: 'tween',
          duration: isActive ? 0.3 : 0.6,
          ease: isActive ? 'easeOut' : 'easeInOut',
        },
      }}
      className={`inline-block ${className}`}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
};

// ------------------------------------------------------------
// 4. ANIMATED TEXT (character‑by‑character scroll reveal)
// ------------------------------------------------------------
const AnimatedText = ({ text, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = useMemo(() => text.split(' '), [text]);

  return (
    <p ref={ref} className={`relative ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 0.8 / words.length;
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
        return (
          <span key={i}>
            <span className="relative inline-block">
              <span className="opacity-20">{word}</span>
              <motion.span
                style={{ opacity }}
                className="absolute inset-0"
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 && ' '}
          </span>
        );
      })}
    </p>
  );
};

// ------------------------------------------------------------
// 5. MARQUEE (scroll‑driven horizontal movement)
// ------------------------------------------------------------
const Marquee = () => {
  const logos = [
    { name: 'Hugging Face', color: '#FFD21E', icon: '🤗' },
    { name: 'Nano Banana', color: '#FBBF24', icon: '🍌' },
    { name: 'Gemini', color: '#4285F4', icon: '✦' },
    { name: 'n8n', color: '#EA4B71', icon: null, text: 'n8n' },
    { name: 'Google Flow', color: '#34A853', icon: '▶' },
    { name: 'Antigravity', color: '#8B5CF6', icon: '⬡' },
    { name: 'Claude Code', color: '#D97757', icon: '◈' },
    { name: 'ChatGPT', color: '#10A37F', icon: '◉' },
    { name: 'Hermes Agent', color: '#06B6D4', icon: '⬢' },
    { name: 'Perplexity', color: '#20B2AA', icon: '◎' },
    { name: 'Midjourney', color: '#E0E0E0', icon: '◆' },
    { name: 'Cursor AI', color: '#A78BFA', icon: '▣' },
    { name: 'Notion AI', color: '#FFFFFF', icon: '◧' },
  ];

  // Split into two rows
  const row1Logos = logos.slice(0, 7);
  const row2Logos = logos.slice(7);

  // Quadruple for seamless looping
  const row1 = [...row1Logos, ...row1Logos, ...row1Logos, ...row1Logos];
  const row2 = [...row2Logos, ...row2Logos, ...row2Logos, ...row2Logos];

  const LogoCard = ({ logo }) => (
    <div className="flex-shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 select-none">
      <span
        className="text-xl leading-none font-bold"
        style={{ color: logo.color }}
      >
        {logo.icon || logo.text}
      </span>
      <span className="text-sm font-semibold text-[#D7E2EA]/80 whitespace-nowrap tracking-wide">
        {logo.name}
      </span>
    </div>
  );

  return (
    <section className="bg-[#111111] py-12 sm:py-16 md:py-20 overflow-hidden">
      <div className="relative">
        {/* Row 1 – scrolls LEFT */}
        <div className="flex gap-4 mb-4 logo-scroll-left">
          {row1.map((logo, i) => (
            <LogoCard key={`r1-${i}`} logo={logo} />
          ))}
        </div>

        {/* Row 2 – scrolls RIGHT */}
        <div className="flex gap-4 logo-scroll-right">
          {row2.map((logo, i) => (
            <LogoCard key={`r2-${i}`} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ------------------------------------------------------------
// 6. STICKY CARD STACK (for Modules)
// ------------------------------------------------------------
const StickyCardStack = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const BASE = import.meta.env.BASE_URL;

  const modules = [
    {
      id: '01',
      title: 's',
      desc: 'No jargon, no overwhelm. Understand ChatGPT and Claude, see real examples of AI growing businesses.',
      who: '',
      bgImage: `${BASE}module-01.png`,
    },
    {
      id: '02',
      title: '',
      desc: 'Learn prompt psychology for ads, landing pages, sales copy – ready‑made frameworks for hooks and CTAs.',
      who: '',
      bgImage: `${BASE}module-02.png`,
    },
    {
      id: '03',
      title: '',
      desc: 'Designer‑quality visuals in 90 seconds. Workflows for thumbnails, ads, and short‑form video – no Photoshop.',
      who: '',
      bgImage: `${BASE}module-03.png`,
    },
    {
      id: '04',
      title: '',
      desc: 'Produce weeks of scripts (reels, ads, webinars) in a single afternoon using hook and CTA frameworks.',
      who: '',
      bgImage: `${BASE}module-04.png`,
    },
    {
      id: '05',
      title: '',
      desc: 'Build an AI‑powered presence on Instagram & YouTube without showing your face – same reach, zero screen time.',
      who: '',
      bgImage: `${BASE}module-05.png`,
    },
    {
      id: '06',
      title: '',
      desc: 'Turn each skill into real income: freelancing, agency, content monetisation, automated systems – your roadmap.',
      who: '',
      bgImage: `${BASE}module-06.png`,
    },
    {
      id: '07',
      title: '',
      desc: 'Build and deploy autonomous AI agents that perform multi-step tasks, research, and automate operations for your business.',
      who: '',
      bgImage: `${BASE}module-07.png`,
    },
  ];

  const totalCards = modules.length;
  const scaleFactors = modules.map((_, index) => 1 - (totalCards - 1 - index) * 0.03);

  return (
    <section ref={containerRef} className="relative bg-[#111111] py-20 sm:py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
        <FadeIn>
          <h2 className="text-center text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tight bg-gradient-to-b from-[#646973] to-[#BBCCD7] text-transparent bg-clip-text">
            Modules
          </h2>
        </FadeIn>

        <div className="relative mt-16 md:mt-24" style={{ height: `${totalCards * 100}vh` }}>
          {modules.map((mod, index) => {
            const targetScale = scaleFactors[index];
            const topOffset = index * 28;

            // We'll use useTransform to scale the card as we scroll
            // We need a separate scroll progress for each card
            // For simplicity, we'll use a single scrollYProgress and compute range
            const start = index / totalCards;
            const end = (index + 1) / totalCards;
            const scale = useTransform(scrollYProgress, [start, end], [1, targetScale]);
            const y = useTransform(scrollYProgress, [start, end], [0, -topOffset]);

            return (
              <motion.div
                key={mod.id}
                className="sticky top-28 md:top-36 w-full h-[85vh] flex items-center justify-center"
                style={{ scale, y }}
              >
                <div className="relative w-full max-w-6xl h-[80vh] bg-[#111111] border-2 border-[#D7E2EA] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] overflow-hidden">
                  {/* Background image inset so top poster title is never clipped by rounded corners or navbar */}
                  <div className="absolute inset-2 sm:inset-4 md:inset-6 pointer-events-none select-none flex items-center justify-center">
                    <img
                      src={mod.bgImage}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover md:object-contain object-top md:object-center opacity-100 rounded-[24px] sm:rounded-[36px] md:rounded-[44px]"
                    />
                  </div>
                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-[1] pointer-events-none" />
                  {/* Card content sits above the image */}
                  <div className="relative z-10 w-full h-full p-6 sm:p-8 md:p-10 flex flex-col">
                    <div className="flex items-start justify-between">
                      <span className="text-6xl sm:text-8xl md:text-9xl font-black text-[#D7E2EA] opacity-20">
                        {mod.id}
                      </span>
                      <div className="text-right">
                        <div className="text-sm uppercase tracking-widest text-[#D7E2EA]/60">{mod.who}</div>
                      </div>
                    </div>
                    <div className="flex-1 flex items-end justify-center pb-6 sm:pb-8">
                      <p className="text-white text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-center leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {mod.desc}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <div className="w-16 h-16 rounded-full border-2 border-[#D7E2EA]/30 flex items-center justify-center text-[#D7E2EA]">
                        <ArrowRight className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ------------------------------------------------------------
// 7. TESTIMONIAL CAROUSEL (auto‑playing)
// ------------------------------------------------------------
const TestimonialCarousel = () => {
  const testimonials = [
    {
      name: 'Aryan S.',
      role: 'Freelancer, Pune',
      text: 'After Pranshul\'s workshop I landed three clients in the same week using AI tools. I honestly didn\'t even know AI properly before this. It\'s real.',
      rating: 5,
    },
    {
      name: 'Priya K.',
      role: 'Content Creator, Delhi',
      text: 'I\'d paid ₹15,000 for a course before and learned less than I did in this ₹9 session. Seriously — this much value for ₹9? Unbelievable.',
      rating: 5,
    },
    {
      name: 'Rahul V.',
      role: 'Agency Owner, Mumbai',
      text: 'The Script Engine module changed how I work. I now batch a full month of content in one Sunday. My Instagram went from 800 to 12,000 in six weeks.',
      rating: 5,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {testimonials.map((t, i) => (
          <div key={i} className="w-full flex-shrink-0 px-5 sm:px-8 md:px-10">
            <div className="max-w-3xl mx-auto bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a]">
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-[#D7E2EA] text-lg sm:text-xl leading-relaxed">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-sm text-[#D7E2EA]/60">{t.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-3 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${i === activeIndex ? 'bg-blue-500 w-8' : 'bg-[#2a2a2a]'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

// ------------------------------------------------------------
// 8. ANIMATED NUMBER COUNTERS
// ------------------------------------------------------------
const AnimatedCounter = ({ target, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

// ------------------------------------------------------------
// 9. FAQ ACCORDION
// ------------------------------------------------------------
const FAQItem = ({ question, answer, isOpen, toggle }) => {
  return (
    <div className="border-b border-[#2a2a2a] py-6">
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full text-left text-white text-lg font-medium hover:text-blue-400 transition-colors"
      >
        <span>{question}</span>
        {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pt-4 text-[#D7E2EA]/80 leading-relaxed">{answer}</p>
      </motion.div>
    </div>
  );
};

// ------------------------------------------------------------
// 10. COMPARISON SECTION
// ------------------------------------------------------------
const ComparisonSection = () => {
  const negativeItems = [
    "Pre-recorded videos you'll never finish",
    'Slide decks about tools you never open',
    '"Use ChatGPT to write emails" — that\'s it',
    'No accountability, no project, no proof',
    'Instructor who has never built anything outside the course',
  ];

  const positiveItems = [
    'Live, 2-hour, build-alongside session',
    '10+ tools demoed hands-on, not in theory',
    'You leave with a real AI project (website / video / pitch )',
    'Same workflows used at TheAdsLancer for real client work',
    'Taught by someone running a 15+-person AI-first agency',
  ];

  return (
    <section className="relative bg-[#111111] py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10 overflow-hidden">
      {/* Large watermark text behind the headline */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none select-none comparison-watermark">
        <span className="text-[16rem] sm:text-[20rem] md:text-[26rem] font-black text-white/[0.03] leading-none block">
          AI
        </span>
      </div>

      {/* Subtle blue glow on the right (matching existing blue accent) */}
      <div
        className="absolute top-0 right-0 w-[500px] h-full pointer-events-none opacity-[0.06]"
        style={{
          background:
            'radial-gradient(ellipse at 80% 50%, rgba(59,130,246,0.6) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_1fr] gap-8 lg:gap-10 items-start">
          {/* Left Column — Headline */}
          <FadeIn className="flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.15]">
              There are{' '}
              <span className="text-blue-400 italic">1,000 AI courses.</span>{' '}
              Almost none make you actually{' '}
              <span className="text-blue-400 italic">Ship</span>{' '}
              something.
            </h2>
            <p className="text-[#D7E2EA]/50 text-sm sm:text-base mt-6 leading-relaxed max-w-md">
              Most AI content teaches you concepts. You leave with notes and
              tab-fatigue. This masterclass is different by design.
            </p>
          </FadeIn>

          {/* Center Card — Negative */}
          <FadeIn delay={0.15} y={20}>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 sm:p-8 h-full hover:border-[#3a3a3a] transition-colors duration-300">
              <h3 className="text-white text-lg sm:text-xl font-bold mb-6">
                Watch. Take notes. Forget.
              </h3>
              <ul className="space-y-4">
                {negativeItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-400 mt-0.5 flex-shrink-0 text-sm font-bold">
                      ✕
                    </span>
                    <span className="text-[#D7E2EA]/60 text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* Right Card — Positive */}
          <FadeIn delay={0.3} y={20}>
            <div className="bg-[#1a1a1a] border border-blue-500/20 rounded-2xl p-6 sm:p-8 h-full hover:border-blue-500/40 transition-colors duration-300 relative overflow-hidden">
              {/* Subtle inner glow for the "good" card */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.8) 0%, transparent 60%)',
                }}
              />
              <h3 className="relative text-white text-lg sm:text-xl font-bold mb-6">
                Build. Ship. Have something to show
              </h3>
              <ul className="relative space-y-4">
                {positiveItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[#D7E2EA]/70 text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ------------------------------------------------------------
// 11. ANNOUNCEMENT BANNER (sticky bottom)
// ------------------------------------------------------------
const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-0 left-0 w-full z-50"
        >
          {/* Outer glow */}
          <div className="absolute -top-4 left-0 w-full h-8 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none" />

          <div className="relative bg-[#161616]/95 backdrop-blur-xl border-t border-blue-500/20 overflow-hidden">
            {/* Animated shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.08) 50%, transparent 100%)',
                width: '200%',
              }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 2,
              }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
              {/* Left: Announcement text */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                {/* Pulsing live dot */}
                <span className="relative flex-shrink-0">
                  <span className="absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
                </span>

                <p className="text-[#D7E2EA] text-sm sm:text-base font-medium truncate">
                  <span className="hidden sm:inline">🔴 Live Webinar · </span>
                  <span className="text-white font-bold">Only ₹9</span>
                  <span className="hidden md:inline"> · Seats are filling fast — don't miss out!</span>
                  <span className="inline md:hidden"> · Seats filling fast!</span>
                </p>
              </div>

              {/* Right: CTA + Close */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Pulsing-glow CTA button */}
                <motion.a
                  href={RAZORPAY_URL}
                  className="relative bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base px-5 sm:px-7 py-2 sm:py-2.5 rounded-full transition-colors shadow-lg shadow-blue-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Glow ring pulse */}
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-blue-400/60"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  Register ₹9
                </motion.a>

                {/* Dismiss button */}
                <button
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => setIsDismissed(true), 300);
                  }}
                  className="text-[#D7E2EA]/40 hover:text-white transition-colors p-1"
                  aria-label="Dismiss announcement"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ------------------------------------------------------------
// 12. TAKEAWAYS SECTION
// ------------------------------------------------------------
const TakeawaysSection = () => {
  const takeaways = [
    {
      icon: '20+',
      title: 'AI Tools, Live in Action',
      desc: 'ChatGPT, Perplexity, Runway, Midjourney, and more — a working tour showing exactly which tool to open for which job. No more confusion, pure clarity.',
      highlighted: false,
    },
    {
      icon: 'Q&A',
      title: 'Live, with a Real Human',
      desc: 'Ask anything during the call. Real answers from someone who uses this stack daily for client work — not a pre-recorded video pretending to be live.',
      highlighted: false,
    },
    {
      icon: 'PDF',
      title: "Resource Pack You'll Actually Open",
      desc: 'Prompts, tool shortlists, and the workflows Pranshul uses in his agency — sent after the session. Bookmark it, share it, refer back to it.',
      highlighted: false,
    },
    {
      icon: '∞',
      title: 'An Immediate Productivity Lift',
      desc: 'A handful of workflows you can plug into your week immediately. Not life-changing — just saving you hours.',
      highlighted: false,
    },
    {
      icon: 'AI+',
      title: 'A Sense of "What is Possible"',
      desc: "A clear-eyed look at image gen, video gen, no-code builders, and AI decks. You won't master them in 2 hours — but you'll know exactly what's worth learning deeper, and what isn't.",
      highlighted: 'gold',
    },
    {
      icon: '🏆',
      title: 'Certificate of Attendance',
      desc: "Proof that you showed up. Post it on LinkedIn if it helps — signaling that you're paying attention to where work is heading.",
      highlighted: false,
    },
  ];

  return (
    <section className="bg-[#111111] py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <FadeIn>
          <p className="text-blue-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
            <span className="w-6 h-px bg-blue-400 inline-block" />
            TAKEAWAYS
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3 max-w-xl">
            What you'll{' '}
            <span className="text-blue-400 italic">gain</span>{' '}
            from this masterclass
          </h2>
        </FadeIn>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 mt-12 rounded-2xl overflow-hidden">
          {takeaways.map((item, i) => (
            <FadeIn key={i} delay={i * 0.08} y={15}>
              <div
                className={`group p-6 sm:p-8 h-full transition-all duration-300 ${item.highlighted === 'gold'
                    ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-slate-950 shadow-xl shadow-amber-500/10 hover:brightness-105'
                    : item.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-500'
                      : 'bg-[#1a1a1a] text-[#D7E2EA] hover:bg-blue-600 hover:text-white'
                  }`}
              >
                {/* Large icon/text */}
                <div
                  className={`text-4xl sm:text-5xl font-black leading-none mb-4 transition-colors duration-300 ${item.highlighted === 'gold'
                      ? 'text-slate-950'
                      : item.highlighted
                        ? 'text-white'
                        : 'text-blue-400 group-hover:text-white'
                    }`}
                >
                  {item.icon}
                </div>

                {/* Subtitle */}
                <h3
                  className={`text-base sm:text-lg font-bold mb-3 transition-colors duration-300 ${item.highlighted === 'gold'
                      ? 'text-slate-950'
                      : 'text-white'
                    }`}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-sm leading-relaxed transition-colors duration-300 ${item.highlighted === 'gold'
                      ? 'text-slate-900/90'
                      : item.highlighted
                        ? 'text-white/85'
                        : 'text-[#D7E2EA]/60 group-hover:text-white/85'
                    }`}
                >
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// ------------------------------------------------------------
// 13. STARFIELD BACKGROUND (pure CSS twinkling stars + parallax)
// ------------------------------------------------------------
const StarfieldBackground = () => {
  // Generate random star positions once
  const layers = useMemo(() => {
    const createStars = (count, sizeRange, opacityRange) =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        opacity: opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0]),
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 4,
      }));

    return [
      { stars: createStars(80, [0.5, 1.2], [0.3, 0.7]), className: 'starfield-layer-1' },
      { stars: createStars(40, [1.2, 2.2], [0.4, 0.8]), className: 'starfield-layer-2' },
      { stars: createStars(15, [2, 3.5], [0.5, 1]), className: 'starfield-layer-3' },
    ];
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      {layers.map((layer, li) => (
        <div key={li} className={`absolute inset-0 ${layer.className}`}>
          {layer.stars.map((s) => (
            <span
              key={s.id}
              className="starfield-star"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                opacity: s.opacity,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ------------------------------------------------------------
// 14. MAIN APP
// ------------------------------------------------------------
function App() {
  const BASE = import.meta.env.BASE_URL;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  // Smooth scroll with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Hero mouse spotlight tracker
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (hero) {
        hero.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const faqs = [
    {
      q: "I'm a complete beginner. Is this really for me?",
      a: "Yes — it's built for beginners. Module 1 starts from zero, with no jargon. If you can send a WhatsApp message, you can follow along.",
    },
    {
      q: "Do I need coding or a technical background?",
      a: "None at all. Nothing in this session requires code. It's designed for creators, freelancers, and business owners — not developers.",
    },
    {
      q: "Can I actually earn from this?",
      a: "The skills are real and in demand, and Module 6 is dedicated entirely to income models. Your results will depend on how consistently you apply what you learn — but you'll leave with a clear, doable plan.",
    },
    {
      q: "What if I miss the live session?",
      a: "You get the recording with lifetime access. Register either way so your seat and bonuses are locked in.",
    },
    {
      q: "Why only ₹9? It feels like there must be a catch.",
      a: "Fair question. We keep it at ₹9 so price is never the reason someone misses out — and so the room is full of people who actually show up and apply it. We'd rather earn your trust in this session than charge you a fortune before you've seen the value. There's no hidden charge to attend.",
    },
    {
      q: "What happens right after I pay?",
      a: "You get instant confirmation, the joining link by email/WhatsApp, and access to the private community. That's it — you're in.",
    },
  ];

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="bg-[#111111] text-white font-['Plus_Jakarta_Sans'] overflow-x-clip">
      <StarfieldBackground />
      <CustomCursor />
      <AnnouncementBanner />

      {/* Unified Top Header & Navigation */}
      <header className="fixed top-0 left-0 w-full z-50">
        {/* Top Strip: Countdown & Date */}
        {(() => {
          const [timeLeft, setTimeLeft] = React.useState({ d: 0, h: 0, m: 0, s: 0 });
          React.useEffect(() => {
            const target = new Date('2026-08-02T12:00:00+05:30').getTime();
            const tick = () => {
              const diff = Math.max(0, target - Date.now());
              setTimeLeft({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
              });
            };
            tick();
            const id = setInterval(tick, 1000);
            return () => clearInterval(id);
          }, []);
          const pad = (n) => String(n).padStart(2, '0');
          const isLive = timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0;
          return (
            <div className="bg-[#141414]/95 backdrop-blur-md border-b border-blue-500/20 py-1.5 px-4 select-none">
              <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 text-center">
                <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                  {isLive ? '🔴 WEBINAR IS LIVE NOW!' : '🔴 STARTS IN'}
                </span>
                {!isLive && (
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {[
                      { val: timeLeft.d, label: 'D' },
                      { val: timeLeft.h, label: 'H' },
                      { val: timeLeft.m, label: 'M' },
                      { val: timeLeft.s, label: 'S' },
                    ].map((unit, i) => (
                      <React.Fragment key={unit.label}>
                        {i > 0 && <span className="text-blue-400/50 font-bold text-xs">:</span>}
                        <div className="bg-blue-500/15 border border-blue-500/25 rounded px-1.5 py-0.5 min-w-[28px] sm:min-w-[34px] text-center">
                          <span className="text-white font-bold text-xs sm:text-sm tabular-nums">{pad(unit.val)}</span>
                          <span className="text-blue-400/70 text-[8px] sm:text-[9px] font-semibold ml-0.5">{unit.label}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                )}
                <span className="hidden sm:inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] px-2 py-0.5 rounded-full font-medium">
                  🗓️ 2 Aug · 12 PM IST
                </span>
              </div>
            </div>
          );
        })()}

        {/* Main Navbar Bar */}
        <div className="px-3 sm:px-6 md:px-10 pt-2 pb-1">
          <nav className="flex items-center justify-between max-w-7xl mx-auto bg-[#161616]/90 backdrop-blur-xl border border-white/10 rounded-full px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="text-xl sm:text-2xl font-bold text-white">PRANSHUL AI<span className="text-blue-400">.</span></div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 text-[#D7E2EA] font-medium uppercase tracking-wider text-sm lg:text-base">
              <a href="#problem" className="hover:text-blue-400 transition-colors">Problem</a>
              <a href="#modules" className="hover:text-blue-400 transition-colors">Modules</a>
              <a href="#trainer" className="hover:text-blue-400 transition-colors">Trainer</a>
              <a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a>
              <a href={RAZORPAY_URL} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors">
                Register ₹9
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-white p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden max-w-7xl mx-auto mt-2 bg-[#161616]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            >
              <a href="#problem" className="text-[#D7E2EA] hover:text-blue-400" onClick={() => setIsMenuOpen(false)}>Problem</a>
              <a href="#modules" className="text-[#D7E2EA] hover:text-blue-400" onClick={() => setIsMenuOpen(false)}>Modules</a>
              <a href="#trainer" className="text-[#D7E2EA] hover:text-blue-400" onClick={() => setIsMenuOpen(false)}>Trainer</a>
              <a href="#faq" className="text-[#D7E2EA] hover:text-blue-400" onClick={() => setIsMenuOpen(false)}>FAQ</a>
              <a href={RAZORPAY_URL} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-center transition-colors" onClick={() => setIsMenuOpen(false)}>
                Register ₹9
              </a>
            </motion.div>
          )}
        </div>
      </header>

      {/* ------------------------------------------------------------
          HERO SECTION
          ------------------------------------------------------------ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center items-center pt-32 sm:pt-36 md:pt-40 pb-20 md:pb-32 overflow-hidden">
        {/* Aurora Gradient Mesh Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#111111] to-[#111111]" />

          {/* Aurora blob 1 – large blue */}
          <div className="aurora-blob-1 absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full opacity-[0.12]"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(59,130,246,0) 70%)', top: '-15%', left: '-10%' }} />

          {/* Aurora blob 2 – purple/violet */}
          <div className="aurora-blob-2 absolute w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full opacity-[0.10]"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(139,92,246,0) 70%)', top: '10%', right: '-15%' }} />

          {/* Aurora blob 3 – cyan/teal */}
          <div className="aurora-blob-3 absolute w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full opacity-[0.10]"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, rgba(6,182,212,0) 70%)', bottom: '5%', left: '20%' }} />

          {/* Aurora blob 4 – deep indigo accent */}
          <div className="aurora-blob-4 absolute w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full opacity-[0.08]"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.8) 0%, rgba(99,102,241,0) 70%)', top: '40%', left: '50%' }} />

          {/* Mouse-following spotlight */}
          <div
            className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full transition-all duration-300 ease-out pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.05) 30%, transparent 70%)',
              left: mousePos.x - 400,
              top: mousePos.y - 400,
            }}
          />

          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-5 sm:px-8 flex flex-col items-center">
          <FadeIn delay={0} y={-20}>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <span className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300">
                Limited Seats
              </span>
              <span className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                Live Webinar
              </span>
              <span className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
                Beginner Friendly
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} y={40}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight max-w-5xl mx-auto">
              <span className="bg-gradient-to-b from-white via-[#E2E8F0] to-[#94A3B8] text-transparent bg-clip-text">
                Every Skill That's Making People Rich With AI —
              </span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">
                In One Night.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.35} y={20} className="mt-6">
            <p className="text-[#D7E2EA]/80 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
              7 high-income AI skills. One live session. Zero technical background needed. Learn what's actually working – from someone who uses it daily.
            </p>
          </FadeIn>

          {/* Creative Event Date Card */}
          <FadeIn delay={0.45} y={20} className="mt-8 w-full max-w-3xl mx-auto px-4">
            <div className="relative group bg-gradient-to-r from-blue-950/40 via-[#161b26]/70 to-purple-950/40 border border-blue-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-400/50 transition-all duration-300">
              <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center md:text-left">
                <div className="pt-2 md:pt-0 md:pr-4 flex flex-col justify-center items-center md:items-start">
                  <span className="text-[#D7E2EA]/60 text-[11px] uppercase tracking-widest font-semibold flex items-center gap-1">
                    📅 Event Date
                  </span>
                  <span className="text-white font-extrabold text-lg sm:text-xl mt-0.5">2 Aug 2026</span>
                  <span className="text-blue-400 text-xs font-medium">Sunday</span>
                </div>

                <div className="pt-2 md:pt-0 md:px-4 flex flex-col justify-center items-center md:items-start">
                  <span className="text-[#D7E2EA]/60 text-[11px] uppercase tracking-widest font-semibold flex items-center gap-1">
                    🕘 Live Time
                  </span>
                  <span className="text-white font-extrabold text-lg sm:text-xl mt-0.5">12:00 PM</span>
                  <span className="text-blue-400 text-xs font-medium">Afternoon (IST)</span>
                </div>

                <div className="pt-3 md:pt-0 md:px-4 flex flex-col justify-center items-center md:items-start">
                  <span className="text-[#D7E2EA]/60 text-[11px] uppercase tracking-widest font-semibold flex items-center gap-1">
                    ⏳ Duration
                  </span>
                  <span className="text-white font-extrabold text-lg sm:text-xl mt-0.5">2 Hours</span>
                  <span className="text-emerald-400 text-xs font-medium">Live + Q&A</span>
                </div>

                <div className="pt-3 md:pt-0 md:pl-4 flex flex-col justify-center items-center md:items-start">
                  <span className="text-[#D7E2EA]/60 text-[11px] uppercase tracking-widest font-semibold flex items-center gap-1">
                    💻 Access
                  </span>
                  <span className="text-white font-extrabold text-lg sm:text-xl mt-0.5">Online</span>
                  <span className="text-cyan-400 text-xs font-medium">Private Stream</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* YouTube Video Embed */}
          <FadeIn delay={0.5} y={30} className="mt-12 w-full max-w-4xl mx-auto px-4">
            <div className="relative aspect-video w-full rounded-2xl md:rounded-[32px] overflow-hidden border border-white/10 video-glow bg-[#1a1a1a]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/EhM2AAyx16M"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </FadeIn>

          {/* Trainer Info, CTA & Social Proof */}
          <FadeIn delay={0.65} y={20} className="mt-10 w-full max-w-4xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md w-full">
              <div className="text-center md:text-left">
                <p className="text-[#D7E2EA]/60 text-xs uppercase tracking-wider font-semibold">Trainer & Host</p>
                <h3 className="text-xl font-bold text-white mt-1">Pranshul</h3>
                <p className="text-blue-400 text-sm font-semibold">AI Creator & Trainer</p>
              </div>

              <div className="flex flex-col items-center md:items-end gap-3">
                <MagneticButton>
                  <a
                    href={RAZORPAY_URL}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-blue-500/30 transition-all inline-block text-center min-w-[240px]"
                  >
                    Book My Seat for ₹9
                  </a>
                </MagneticButton>
                <p className="text-xs text-[#D7E2EA]/60 font-bold tracking-wider uppercase">
                  ⚡ 26+ Professionals are already ahead of you
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ------------------------------------------------------------
          MARQUEE
          ------------------------------------------------------------ */}
      <Marquee />

      {/* ------------------------------------------------------------
          COMPARISON SECTION (Why This Is Different)
          ------------------------------------------------------------ */}
      <ComparisonSection />

      {/* ------------------------------------------------------------
          PROBLEM SECTION
          ------------------------------------------------------------ */}
      <section id="problem" className="bg-[#111111] py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-blue-400 font-semibold uppercase tracking-wider text-sm">THE REAL PROBLEM</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2">
              If any of this sounds like you, you're not behind — you've just never been shown a clear path.
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {[
              "You've watched hours of YouTube and you're more confused than when you started.",
              "You keep hearing 'AI will take your job,' and the worry is growing.",
              "The courses that promise answers cost ₹10,000–₹50,000 — with no guarantee.",
              "Everyone online seems to be 'scaling with AI' while you're stuck.",
              "There are too many tools and no starting point.",
              "You create content, but it doesn't get seen and clients don't come.",
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.05} y={10}>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <p className="text-[#D7E2EA]">{item}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3} className="mt-12">
            <div className="bg-[#1a1a1a] border border-blue-500/20 rounded-2xl p-6 text-center">
              <p className="text-[#D7E2EA] text-lg">
                Here's the honest truth: AI is the biggest income opportunity of this decade — and most people are missing it for one reason only. No one has shown them a clear, practical, jargon‑free path. That's exactly what this one night fixes.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ------------------------------------------------------------
          THE SHIFT
          ------------------------------------------------------------ */}
      <section className="bg-[#111111] py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-blue-400 font-semibold uppercase tracking-wider text-sm">THE SHIFT</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2">
              AI isn't the threat. Being the only person in the room who can't use it — that's the threat.
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {[
              { icon: '⚡', label: '10× Content Speed' },
              { icon: '🎨', label: 'No Design Background Needed' },
              { icon: '💰', label: 'Start Earning from Week One' },
              { icon: '🆓', label: '₹0 in Extra Tools to Begin' },
              { icon: '⏰', label: 'Up to 8 Hours Automated Weekly' },
              { icon: '🚫', label: 'Zero Coding. Ever.' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.05} y={10}>
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-[#D7E2EA] font-medium">{item.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------
          MODULES (Sticky Card Stack)
          ------------------------------------------------------------ */}
      <section id="modules" className="bg-[#111111]">
        <StickyCardStack />
      </section>

      {/* ------------------------------------------------------------
          TAKEAWAYS (What You'll Gain)
          ------------------------------------------------------------ */}
      <TakeawaysSection />

      {/* ------------------------------------------------------------
          REAL OUTCOMES
          ------------------------------------------------------------ */}
      <section className="bg-[#111111] py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-blue-400 font-semibold uppercase tracking-wider text-sm">IMAGINE 90 DAYS FROM TONIGHT</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2">Real Outcomes You Can Achieve</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 mt-10">
            {[
              {
                title: 'Produce Content 10× Faster',
                desc: 'What took three hours now takes twenty minutes. You show up consistently, grow your audience, and don\'t burn out.',
              },
              {
                title: 'Land Your First AI Client',
                desc: 'Charge for AI‑powered content, creatives, scripts, or automation. Clients exist and they\'re looking – you just needed the skill.',
              },
              {
                title: 'Your Channel is Growing – Faceless',
                desc: 'Start that YouTube or Instagram channel. Runs on AI, takes a couple of hours a week, and grows on its own.',
              },
              {
                title: 'You\'re Not Afraid of AI Anymore',
                desc: 'While others panic, you\'re the one doing the replacing. You\'re on the right side of the shift – and it feels good.',
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1} y={15}>
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-[#D7E2EA]/80 mt-2">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-10 text-center">
            <p className="text-sm text-[#D7E2EA]/50">*Results vary and depend on your effort, niche, and consistency. This workshop is education, not a guaranteed‑income promise.</p>
          </FadeIn>
        </div>
      </section>

      {/* ------------------------------------------------------------
          WHO THIS IS FOR
          ------------------------------------------------------------ */}
      <section className="bg-[#111111] py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-blue-400 font-semibold uppercase tracking-wider text-sm">WHO THIS WEBINAR IS FOR</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2">This is for you if you're a:</h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
            {[
              'Student',
              'Freelancer',
              'Content Creator',
              'Job‑seeker',
              'Coach / Consultant',
              'Small Business Owner',
              'Agency Owner',
              'Complete Beginner',
            ].map((role, i) => (
              <FadeIn key={i} delay={i * 0.03} y={10}>
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-center text-[#D7E2EA] hover:border-blue-500/50 transition-colors">
                  {role}
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="mt-8 text-center text-[#D7E2EA]/70">
            <p>📱 A phone or laptop · An open mind · Two hours tonight. Zero experience needed.</p>
          </FadeIn>
        </div>
      </section>

      {/* ------------------------------------------------------------
          BONUSES
          ------------------------------------------------------------ */}
      <section className="bg-[#111111] py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-blue-400 font-semibold uppercase tracking-wider text-sm">BONUSES INCLUDED FREE</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2">When you reserve your ₹9 seat, you also get:</h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-6 mt-10">
            {[
              { icon: '📹', title: 'Live Recording', desc: 'Lifetime access – watch anytime.', value: '₹499' },
              { icon: '📝', title: 'Starter Prompt Pack', desc: 'Copy‑paste prompts for content, ads, client work.', value: '₹999' },
              { icon: '🛠️', title: 'AI Tool Cheat‑Sheet', desc: 'Exact free tools we use – ₹0 to start.', value: '₹299' },
              { icon: '👥', title: 'Private Community', desc: 'Ask questions, share wins, get feedback.', value: 'Priceless' },
            ].map((bonus, i) => (
              <FadeIn key={i} delay={i * 0.08} y={15}>
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 flex items-start gap-4">
                  <div className="text-3xl">{bonus.icon}</div>
                  <div>
                    <h3 className="text-white font-semibold">{bonus.title}</h3>
                    <p className="text-[#D7E2EA]/70 text-sm">{bonus.desc}</p>
                    <span className="inline-block mt-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">{bonus.value}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-10 text-center">
            <p className="text-[#D7E2EA] text-lg">Total value: ₹1,797+ – Your price today: <span className="text-white font-bold">₹9</span></p>
          </FadeIn>
        </div>
      </section>

      {/* ------------------------------------------------------------
          TRAINER (with AnimatedText)
          ------------------------------------------------------------ */}
      <section id="trainer" className="bg-[#111111] py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-blue-400 font-semibold uppercase tracking-wider text-sm">MEET PRANSHUL</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2">
              I'm not your guru. I'm the person who was standing exactly where you are — just a little earlier.
            </h2>
          </FadeIn>

          <div className="mt-10 flex flex-col md:flex-row gap-10 items-center">
            <motion.div
              className="relative flex-shrink-0"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Animated pulsing glow ring */}
              <motion.div
                className="absolute -inset-3 rounded-full bg-gradient-to-tr from-blue-500/40 via-purple-500/20 to-cyan-500/40 blur-lg"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              {/* Spinning border ring */}
              <motion.div
                className="absolute -inset-1 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)',
                  padding: '3px',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-full h-full rounded-full bg-[#111111]" />
              </motion.div>
              {/* Floating image */}
              <motion.div
                className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500/30"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <img
                  src={`${BASE}WhatsApp Image 2026-06-14 at 3.44.44 PM.jpeg`}
                  alt="Pranshul"
                  className="w-full h-full object-cover object-top"
                />
              </motion.div>
            </motion.div>
            <div className="flex-1">
              <AnimatedText
                text="Two years ago I was in the same place: watching endless YouTube videos, staying confused, never actually applying anything. Then I made a decision — one year, all-in on AI. No shortcuts. Daily practice. Over the next two years I turned AI tools into a real business engine: for producing content, delivering client work, and generating income. In this workshop I'm sharing only what actually worked — no fluff, no recycled YouTube advice. Just the direct path I wish someone had handed me."
                className="text-[#D7E2EA] text-lg leading-relaxed"
              />
              <div className="flex flex-wrap gap-6 mt-6 text-sm">
                <div><span className="text-blue-400 font-bold"><AnimatedCounter target={3200} /></span>+ students trained</div>
                <div><span className="text-blue-400 font-bold"><AnimatedCounter target={2} /></span>+ years daily AI work</div>
                <div><span className="text-blue-400 font-bold"><AnimatedCounter target={1000} />+</span> clients served</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------
          TESTIMONIALS (Auto‑playing carousel)
          ------------------------------------------------------------ */}
      <section className="bg-[#111111] py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-blue-400 font-semibold uppercase tracking-wider text-sm">REAL PEOPLE. REAL RESULTS.</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2">What our community says</h2>
          </FadeIn>
          <div className="mt-10">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------
          FAQ
          ------------------------------------------------------------ */}
      <section id="faq" className="bg-[#111111] py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="text-blue-400 font-semibold uppercase tracking-wider text-sm">FAQ</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2">Got questions? We've got answers.</h2>
          </FadeIn>

          <div className="mt-10 space-y-1">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.q}
                answer={faq.a}
                isOpen={faqOpen === i}
                toggle={() => toggleFaq(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------
          URGENCY / REGISTER SECTION
          ------------------------------------------------------------ */}
      <section id="register" className="bg-[#111111] py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10 border-t border-[#2a2a2a]">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <div className="inline-block bg-red-500/20 text-red-400 text-sm font-medium px-4 py-1 rounded-full border border-red-400/30 mb-6">
              🔴 REGISTRATION CLOSING SOON
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              This ₹9 price won't last, and the seats are real.
            </h2>
            <p className="text-[#D7E2EA] text-lg mt-4 max-w-2xl mx-auto">
              We keep each live batch small on purpose – the smaller the room, the better the experience. The last batch filled in 48 hours.
            </p>
            <div className="mt-6 text-sm text-[#D7E2EA]/70">
              📅 Live on 2 August 2026 at 12:00 PM · Seats remaining: <span className="text-white font-bold">12</span>
            </div>

            <div className="mt-10">
              <MagneticButton>
                <a
                  href={RAZORPAY_URL}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-4 rounded-full shadow-lg shadow-blue-500/30 text-lg inline-block transition-all"
                >
                  Lock In My ₹9 Seat
                </a>
              </MagneticButton>
              <p className="text-xs text-[#D7E2EA]/40 mt-4">🔒 Secure payment · WhatsApp + recording access after register</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ------------------------------------------------------------
          FINAL CTA
          ------------------------------------------------------------ */}
      <section className="bg-[#111111] py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10 border-t border-[#2a2a2a]">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight bg-gradient-to-b from-[#646973] to-[#BBCCD7] text-transparent bg-clip-text">
              A year from now, where will you be?
            </h2>
            <p className="text-[#D7E2EA] text-xl mt-6 max-w-2xl mx-auto">
              The people who learn AI now will be the ones leading the next client race, the next hire, the next opportunity. The people who wait will be the ones wishing they'd started tonight.
            </p>
            <p className="text-[#D7E2EA]/60 mt-4 italic">The AI opportunity isn't closing forever. But the ₹9 window is.</p>

            <div className="mt-10">
              <MagneticButton>
                <a
                  href={RAZORPAY_URL}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-4 rounded-full shadow-lg shadow-blue-500/30 text-lg inline-block transition-all"
                >
                  Reserve My Seat — Start Tonight for ₹9
                </a>
              </MagneticButton>
              <div className="flex justify-center gap-4 mt-4 text-sm text-[#D7E2EA]/40">
                <span>🔒 Secure payment</span>
                <span>📹 Recording included</span>
                <span>👥 Private community access</span>
              </div>
              <p className="text-sm text-[#D7E2EA]/40 mt-2">📅 2 August 2026 · 🕘 12:00 PM Afternoon · ⏳ 2 Hours · 💻 Online</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] py-8 text-center text-[#D7E2EA]/40 text-sm border-t border-[#1a1a1a]">
        © 2026 AI Webinar. All rights reserved.
      </footer>
    </div>
  );
}

// ponytail: hash routing — works on GitHub Pages static hosting, no server config needed
export default function Root() {
  if (window.location.hash === '#/thank-you') return <ThankYouPage />;
  return <App />;
}