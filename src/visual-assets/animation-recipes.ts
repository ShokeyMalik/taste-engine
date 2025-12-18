/**
 * Animation Recipes
 *
 * Generate animation code snippets for Framer Motion, GSAP, CSS, and Tailwind
 *
 * Features:
 * - Pre-built animation templates
 * - Copy-paste ready code
 * - Multiple library support
 * - Scroll-triggered animations
 * - Stagger effects
 */

import type {
  AnimationEffect,
  AnimationLibrary,
  AnimationOptions,
  AnimationResult,
  AnimationTiming,
} from './types';

// ============================================================================
// Timing Functions
// ============================================================================

const TIMING_MAP: Record<AnimationTiming, Record<AnimationLibrary, string>> = {
  ease: {
    'framer-motion': 'easeInOut',
    gsap: 'power2.inOut',
    css: 'ease',
    tailwind: 'ease-in-out',
  },
  'ease-in': {
    'framer-motion': 'easeIn',
    gsap: 'power2.in',
    css: 'ease-in',
    tailwind: 'ease-in',
  },
  'ease-out': {
    'framer-motion': 'easeOut',
    gsap: 'power2.out',
    css: 'ease-out',
    tailwind: 'ease-out',
  },
  'ease-in-out': {
    'framer-motion': 'easeInOut',
    gsap: 'power2.inOut',
    css: 'ease-in-out',
    tailwind: 'ease-in-out',
  },
  linear: {
    'framer-motion': 'linear',
    gsap: 'none',
    css: 'linear',
    tailwind: 'linear',
  },
  spring: {
    'framer-motion': 'spring',
    gsap: 'elastic.out(1, 0.3)',
    css: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    tailwind: 'ease-out', // No spring in Tailwind
  },
};

// ============================================================================
// Framer Motion Templates
// ============================================================================

const FRAMER_MOTION_TEMPLATES: Record<AnimationEffect, (opts: AnimationOptions) => string> = {
  'fade-in': (opts) => `
import { motion } from 'framer-motion';

export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: ${opts.duration || 0.5},
        delay: ${opts.delay || 0},
        ease: "${TIMING_MAP[opts.timing || 'ease']['framer-motion']}"
      }}
    >
      {children}
    </motion.div>
  );
}`,

  'slide-up': (opts) => `
import { motion } from 'framer-motion';

export function SlideUp({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: ${opts.duration || 0.5},
        delay: ${opts.delay || 0},
        ease: "${TIMING_MAP[opts.timing || 'ease-out']['framer-motion']}"
      }}
    >
      {children}
    </motion.div>
  );
}`,

  'slide-down': (opts) => `
import { motion } from 'framer-motion';

export function SlideDown({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: ${opts.duration || 0.5},
        delay: ${opts.delay || 0},
        ease: "${TIMING_MAP[opts.timing || 'ease-out']['framer-motion']}"
      }}
    >
      {children}
    </motion.div>
  );
}`,

  'slide-left': (opts) => `
import { motion } from 'framer-motion';

export function SlideLeft({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: ${opts.duration || 0.5},
        delay: ${opts.delay || 0},
        ease: "${TIMING_MAP[opts.timing || 'ease-out']['framer-motion']}"
      }}
    >
      {children}
    </motion.div>
  );
}`,

  'slide-right': (opts) => `
import { motion } from 'framer-motion';

export function SlideRight({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: ${opts.duration || 0.5},
        delay: ${opts.delay || 0},
        ease: "${TIMING_MAP[opts.timing || 'ease-out']['framer-motion']}"
      }}
    >
      {children}
    </motion.div>
  );
}`,

  'scale-in': (opts) => `
import { motion } from 'framer-motion';

export function ScaleIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: ${opts.duration || 0.4},
        delay: ${opts.delay || 0},
        ease: "${TIMING_MAP[opts.timing || 'ease-out']['framer-motion']}"
      }}
    >
      {children}
    </motion.div>
  );
}`,

  'rotate-in': (opts) => `
import { motion } from 'framer-motion';

export function RotateIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{
        duration: ${opts.duration || 0.5},
        delay: ${opts.delay || 0},
        ease: "${TIMING_MAP[opts.timing || 'ease-out']['framer-motion']}"
      }}
    >
      {children}
    </motion.div>
  );
}`,

  'stagger-fade': (opts) => `
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ${opts.stagger || 0.1},
      delayChildren: ${opts.delay || 0}
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ${opts.duration || 0.5},
      ease: "${TIMING_MAP[opts.timing || 'ease-out']['framer-motion']}"
    }
  }
};

export function StaggerFade({ children }: { children: React.ReactNode[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}`,

  'stagger-slide': (opts) => `
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ${opts.stagger || 0.1},
      delayChildren: ${opts.delay || 0}
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ${opts.duration || 0.5},
      ease: "${TIMING_MAP[opts.timing || 'ease-out']['framer-motion']}"
    }
  }
};

export function StaggerSlide({ children }: { children: React.ReactNode[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}`,

  'stagger-scale': (opts) => `
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ${opts.stagger || 0.08},
      delayChildren: ${opts.delay || 0}
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ${opts.duration || 0.4},
      ease: "${TIMING_MAP[opts.timing || 'ease-out']['framer-motion']}"
    }
  }
};

export function StaggerScale({ children }: { children: React.ReactNode[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-4 gap-4"
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}`,

  'hover-lift': (opts) => `
import { motion } from 'framer-motion';

export function HoverLift({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)"
      }}
      transition={{
        duration: ${opts.duration || 0.2},
        ease: "${TIMING_MAP[opts.timing || 'ease-out']['framer-motion']}"
      }}
    >
      {children}
    </motion.div>
  );
}`,

  'hover-glow': (opts) => `
import { motion } from 'framer-motion';

export function HoverGlow({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{
        boxShadow: "0 0 20px 5px rgba(99, 102, 241, 0.3)"
      }}
      transition={{
        duration: ${opts.duration || 0.3},
        ease: "${TIMING_MAP[opts.timing || 'ease-out']['framer-motion']}"
      }}
    >
      {children}
    </motion.div>
  );
}`,

  'hover-scale': (opts) => `
import { motion } from 'framer-motion';

export function HoverScale({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: ${opts.duration || 0.2},
        ease: "${TIMING_MAP[opts.timing || 'ease-out']['framer-motion']}"
      }}
    >
      {children}
    </motion.div>
  );
}`,

  'hover-tilt': (opts) => `
import { motion } from 'framer-motion';
import { useState } from 'react';

export function HoverTilt({ children }: { children: React.ReactNode }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) / 10;
    const rotateY = (centerX - e.clientX) / 10;
    setRotateX(rotateX);
    setRotateY(rotateY);
  };

  return (
    <motion.div
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
    >
      <motion.div
        animate={{ rotateX, rotateY }}
        transition={{ duration: ${opts.duration || 0.1}, ease: "linear" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}`,

  'scroll-reveal': (opts) => `
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "${opts.scrollTrigger?.start || '-100px'}"
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: ${opts.duration || 0.6},
        ease: "${TIMING_MAP[opts.timing || 'ease-out']['framer-motion']}"
      }}
    >
      {children}
    </motion.div>
  );
}`,

  'scroll-parallax': (opts) => `
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function ScrollParallax({
  children,
  speed = 0.5
}: {
  children: React.ReactNode;
  speed?: number;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}`,

  'pulse': (opts) => `
import { motion } from 'framer-motion';

export function Pulse({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{
        duration: ${opts.duration || 2},
        repeat: ${opts.repeat === 'infinite' ? 'Infinity' : opts.repeat || 'Infinity'},
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}`,

  'float': (opts) => `
import { motion } from 'framer-motion';

export function Float({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0]
      }}
      transition={{
        duration: ${opts.duration || 3},
        repeat: ${opts.repeat === 'infinite' ? 'Infinity' : opts.repeat || 'Infinity'},
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}`,

  'shimmer': (opts) => `
import { motion } from 'framer-motion';

export function Shimmer({ width = 200, height = 20 }: { width?: number; height?: number }) {
  return (
    <div
      style={{
        width,
        height,
        background: '#e5e7eb',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          duration: ${opts.duration || 1.5},
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
}`,

  'gradient-shift': (opts) => `
import { motion } from 'framer-motion';

export function GradientShift({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{
        background: [
          'linear-gradient(45deg, #6366f1, #8b5cf6)',
          'linear-gradient(45deg, #8b5cf6, #ec4899)',
          'linear-gradient(45deg, #ec4899, #6366f1)',
        ]
      }}
      transition={{
        duration: ${opts.duration || 5},
        repeat: ${opts.repeat === 'infinite' ? 'Infinity' : opts.repeat || 'Infinity'},
        ease: 'linear'
      }}
      style={{ padding: '2rem', borderRadius: '1rem' }}
    >
      {children}
    </motion.div>
  );
}`,

  'logo-grid': (opts) => `
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ${opts.stagger || 0.1},
      delayChildren: ${opts.delay || 0.2}
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    filter: 'blur(10px)'
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: ${opts.duration || 0.5},
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

interface Logo {
  name: string;
  src: string;
  href?: string;
}

export function LogoGrid({ logos }: { logos: Logo[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center"
    >
      {logos.map((logo, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all"
        >
          <img
            src={logo.src}
            alt={logo.name}
            className="h-8 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}`,

  'hero-entrance': (opts) => `
import { motion } from 'framer-motion';

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: ${opts.delay || 0.3}
    }
  }
};

const headlineVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ${opts.duration || 0.8},
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const ctaVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

interface HeroProps {
  headline: string;
  subtitle: string;
  cta: React.ReactNode;
}

export function HeroEntrance({ headline, subtitle, cta }: HeroProps) {
  return (
    <motion.section
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      className="text-center py-20"
    >
      <motion.h1
        variants={headlineVariants}
        className="text-5xl font-bold mb-4"
      >
        {headline}
      </motion.h1>
      <motion.p
        variants={subtitleVariants}
        className="text-xl text-gray-600 mb-8"
      >
        {subtitle}
      </motion.p>
      <motion.div variants={ctaVariants}>
        {cta}
      </motion.div>
    </motion.section>
  );
}`,

  'card-stack': (opts) => `
import { motion } from 'framer-motion';

const stackVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ${opts.stagger || 0.15}
    }
  }
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: ${opts.duration || 0.6},
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export function CardStack({ children }: { children: React.ReactNode[] }) {
  return (
    <motion.div
      variants={stackVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid gap-6"
      style={{ perspective: 1000 }}
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={cardVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}`,

  'text-reveal': (opts) => `
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ${opts.stagger || 0.03}
    }
  }
};

const charVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotateX: 90
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: ${opts.duration || 0.4},
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export function TextReveal({ text }: { text: string }) {
  const characters = text.split('');

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{ display: 'inline-flex', overflow: 'hidden' }}
    >
      {characters.map((char, i) => (
        <motion.span key={i} variants={charVariants} style={{ display: 'inline-block' }}>
          {char === ' ' ? '\\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}`,

  'counter': (opts) => `
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

export function Counter({
  from = 0,
  to,
  duration = ${opts.duration || 2}
}: {
  from?: number;
  to: number;
  duration?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const spring = useSpring(from, {
    duration: duration * 1000,
    bounce: 0
  });

  const display = useTransform(spring, (value) => Math.round(value).toLocaleString());

  useEffect(() => {
    if (isInView) {
      spring.set(to);
    }
  }, [isInView, spring, to]);

  return <motion.span ref={ref}>{display}</motion.span>;
}`,

  'progress': (opts) => `
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function Progress({
  value,
  max = 100,
  color = '#6366f1'
}: {
  value: number;
  max?: number;
  color?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const percentage = (value / max) * 100;

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: 8,
        background: '#e5e7eb',
        borderRadius: 4,
        overflow: 'hidden'
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: \`\${percentage}%\` } : { width: 0 }}
        transition={{
          duration: ${opts.duration || 1},
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        style={{
          height: '100%',
          background: color,
          borderRadius: 4
        }}
      />
    </div>
  );
}`,

  'skeleton': (opts) => `
import { motion } from 'framer-motion';

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4
}: {
  width?: number | string;
  height?: number;
  borderRadius?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: '#e5e7eb',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          duration: ${opts.duration || 1.5},
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
}`,
};

// ============================================================================
// CSS Keyframes Templates
// ============================================================================

const CSS_TEMPLATES: Record<string, (opts: AnimationOptions) => string> = {
  'fade-in': (opts) => `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn ${opts.duration || 0.5}s ${TIMING_MAP[opts.timing || 'ease']['css']} ${opts.delay || 0}s forwards;
}`,

  'slide-up': (opts) => `
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp ${opts.duration || 0.5}s ${TIMING_MAP[opts.timing || 'ease-out']['css']} ${opts.delay || 0}s forwards;
}`,

  'pulse': (opts) => `
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.pulse {
  animation: pulse ${opts.duration || 2}s ${TIMING_MAP[opts.timing || 'ease-in-out']['css']} infinite;
}`,

  'shimmer': (opts) => `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.shimmer {
  position: relative;
  overflow: hidden;
  background: #e5e7eb;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer ${opts.duration || 1.5}s linear infinite;
}`,

  'hover-lift': (opts) => `
.hover-lift {
  transition: transform ${opts.duration || 0.2}s ${TIMING_MAP[opts.timing || 'ease-out']['css']},
              box-shadow ${opts.duration || 0.2}s ${TIMING_MAP[opts.timing || 'ease-out']['css']};
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.2);
}`,
};

// ============================================================================
// Tailwind Templates
// ============================================================================

const TAILWIND_TEMPLATES: Record<string, (opts: AnimationOptions) => string> = {
  'fade-in': () => `
{/* Add to tailwind.config.js */}
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
}

{/* Usage */}
<div className="animate-fade-in">Content</div>`,

  'slide-up': () => `
{/* Add to tailwind.config.js */}
module.exports = {
  theme: {
    extend: {
      animation: {
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
}

{/* Usage */}
<div className="animate-slide-up">Content</div>`,

  'hover-lift': () => `
{/* No config needed - use built-in utilities */}

<div className="transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
  Content
</div>`,

  'hover-scale': () => `
{/* No config needed - use built-in utilities */}

<div className="transition-transform duration-200 ease-out hover:scale-105 active:scale-95">
  Content
</div>`,

  'pulse': () => `
{/* Built-in pulse animation */}

<div className="animate-pulse">
  Content
</div>`,

  'shimmer': () => `
{/* Add to tailwind.config.js */}
module.exports = {
  theme: {
    extend: {
      animation: {
        'shimmer': 'shimmer 1.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
}

{/* Component */}
<div className="relative overflow-hidden bg-gray-200 rounded">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
</div>`,
};

// ============================================================================
// GSAP Templates
// ============================================================================

const GSAP_TEMPLATES: Record<string, (opts: AnimationOptions) => string> = {
  'fade-in': (opts) => `
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

export function FadeIn({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: ${opts.duration || 0.5},
        delay: ${opts.delay || 0},
        ease: "${TIMING_MAP[opts.timing || 'ease']['gsap']}"
      }
    );
  }, []);

  return <div ref={ref}>{children}</div>;
}`,

  'slide-up': (opts) => `
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

export function SlideUp({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: ${opts.duration || 0.5},
        delay: ${opts.delay || 0},
        ease: "${TIMING_MAP[opts.timing || 'ease-out']['gsap']}"
      }
    );
  }, []);

  return <div ref={ref}>{children}</div>;
}`,

  'stagger-fade': (opts) => `
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

export function StaggerFade({ children }: { children: React.ReactNode[] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const items = containerRef.current?.children;
    if (!items) return;

    gsap.fromTo(items,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: ${opts.duration || 0.5},
        stagger: ${opts.stagger || 0.1},
        delay: ${opts.delay || 0},
        ease: "${TIMING_MAP[opts.timing || 'ease-out']['gsap']}"
      }
    );
  }, []);

  return <div ref={containerRef}>{children}</div>;
}`,

  'scroll-reveal': (opts) => `
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: ${opts.duration || 0.6},
        ease: "${TIMING_MAP[opts.timing || 'ease-out']['gsap']}",
        scrollTrigger: {
          trigger: ref.current,
          start: "${opts.scrollTrigger?.start || 'top 80%'}",
          end: "${opts.scrollTrigger?.end || 'bottom 20%'}",
          ${opts.scrollTrigger?.scrub ? `scrub: ${typeof opts.scrollTrigger.scrub === 'number' ? opts.scrollTrigger.scrub : 1},` : ''}
        }
      }
    );
  }, []);

  return <div ref={ref}>{children}</div>;
}`,

  'logo-grid': (opts) => `
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface Logo {
  name: string;
  src: string;
}

export function LogoGrid({ logos }: { logos: Logo[] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const items = containerRef.current?.children;
    if (!items) return;

    gsap.fromTo(items,
      {
        opacity: 0,
        scale: 0.8,
        filter: 'blur(10px)'
      },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: ${opts.duration || 0.5},
        stagger: ${opts.stagger || 0.1},
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center"
    >
      {logos.map((logo, i) => (
        <div key={i} className="flex items-center justify-center p-4">
          <img
            src={logo.src}
            alt={logo.name}
            className="h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all"
          />
        </div>
      ))}
    </div>
  );
}`,
};

// ============================================================================
// Main Generator Class
// ============================================================================

export class AnimationRecipeGenerator {
  /**
   * Generate animation code for the specified effect and library
   */
  generate(name: string, options: AnimationOptions): AnimationResult {
    const { effect, library } = options;

    switch (library) {
      case 'framer-motion':
        return this.generateFramerMotion(effect, options);
      case 'gsap':
        return this.generateGSAP(effect, options);
      case 'css':
        return this.generateCSS(effect, options);
      case 'tailwind':
        return this.generateTailwind(effect, options);
      default:
        return this.generateFramerMotion(effect, options);
    }
  }

  private generateFramerMotion(effect: AnimationEffect, options: AnimationOptions): AnimationResult {
    const template = FRAMER_MOTION_TEMPLATES[effect];
    if (!template) {
      return this.getUnsupportedResult(effect, 'framer-motion');
    }

    return {
      code: template(options).trim(),
      language: 'tsx',
      library: 'framer-motion',
      dependencies: ['framer-motion'],
      usage: `Import and use the component:\n\n<${this.effectToComponentName(effect)}>\n  {/* Your content */}\n</${this.effectToComponentName(effect)}>`,
    };
  }

  private generateGSAP(effect: AnimationEffect, options: AnimationOptions): AnimationResult {
    const template = GSAP_TEMPLATES[effect];
    if (!template) {
      return this.getUnsupportedResult(effect, 'gsap');
    }

    const deps = ['gsap'];
    if (effect.includes('scroll')) {
      deps.push('gsap/ScrollTrigger');
    }

    return {
      code: template(options).trim(),
      language: 'tsx',
      library: 'gsap',
      dependencies: deps,
      usage: `Import and use the component:\n\n<${this.effectToComponentName(effect)}>\n  {/* Your content */}\n</${this.effectToComponentName(effect)}>`,
    };
  }

  private generateCSS(effect: AnimationEffect, options: AnimationOptions): AnimationResult {
    const template = CSS_TEMPLATES[effect];
    if (!template) {
      return this.getUnsupportedResult(effect, 'css');
    }

    return {
      code: template(options).trim(),
      language: 'css',
      library: 'css',
      dependencies: [],
      usage: `Add the CSS to your stylesheet, then apply the class:\n\n<div class="${effect}">Content</div>`,
    };
  }

  private generateTailwind(effect: AnimationEffect, options: AnimationOptions): AnimationResult {
    const template = TAILWIND_TEMPLATES[effect];
    if (!template) {
      return this.getUnsupportedResult(effect, 'tailwind');
    }

    return {
      code: template(options).trim(),
      language: 'tsx',
      library: 'tailwind',
      dependencies: ['tailwindcss'],
      usage: 'Follow the instructions in the code to add config and use the classes.',
    };
  }

  private effectToComponentName(effect: AnimationEffect): string {
    return effect
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  private getUnsupportedResult(effect: AnimationEffect, library: AnimationLibrary): AnimationResult {
    return {
      code: `// Animation "${effect}" is not yet supported for ${library}.\n// Consider using Framer Motion for the most complete animation support.`,
      language: 'tsx',
      library,
      dependencies: [],
      usage: `This animation is not available for ${library}. Try using 'framer-motion' instead.`,
    };
  }

  /**
   * Get all available effects
   */
  getAvailableEffects(): AnimationEffect[] {
    return Object.keys(FRAMER_MOTION_TEMPLATES) as AnimationEffect[];
  }

  /**
   * Get supported libraries for an effect
   */
  getSupportedLibraries(effect: AnimationEffect): AnimationLibrary[] {
    const libraries: AnimationLibrary[] = [];

    if (FRAMER_MOTION_TEMPLATES[effect]) libraries.push('framer-motion');
    if (GSAP_TEMPLATES[effect]) libraries.push('gsap');
    if (CSS_TEMPLATES[effect]) libraries.push('css');
    if (TAILWIND_TEMPLATES[effect]) libraries.push('tailwind');

    return libraries;
  }
}

// ============================================================================
// Convenience Function
// ============================================================================

const generator = new AnimationRecipeGenerator();

/**
 * Generate animation code for the specified effect and library
 *
 * @example
 * ```typescript
 * // Framer Motion logo grid animation
 * const animation = generateAnimation('logo-grid', {
 *   effect: 'logo-grid',
 *   library: 'framer-motion',
 *   stagger: 0.1,
 *   duration: 0.5
 * });
 *
 * console.log(animation.code); // React component code
 *
 * // CSS hover effect
 * const hover = generateAnimation('hover-lift', {
 *   effect: 'hover-lift',
 *   library: 'css',
 *   duration: 0.2
 * });
 *
 * console.log(hover.code); // CSS keyframes
 * ```
 */
export function generateAnimation(name: string, options: AnimationOptions): AnimationResult {
  return generator.generate(name, options);
}

export { AnimationRecipeGenerator as default };
