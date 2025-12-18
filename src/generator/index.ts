/**
 * Context-Aware Code Generator
 *
 * Generates React/Tailwind code that matches the patterns and
 * design tokens found in the existing codebase.
 */

import type {
  CodebaseAnalysis,
  ButtonPattern,
  CardPattern,
  SurfacePattern,
  DesignTokens,
} from '../analyzer';

// =============================================================================
// TYPES
// =============================================================================

export interface TasteConfig {
  abstraction: number;      // 0-1: Low = concrete buttons, High = abstract shapes
  density: number;          // 0-1: Low = spacious, High = compact
  motion: number;           // 0-1: Low = static, High = animated
  contrast: number;         // 0-1: Low = subtle, High = bold
  narrative: number;        // 0-1: Low = minimal, High = storytelling
}

export interface GenerationContext {
  analysis: CodebaseAnalysis;
  taste: TasteConfig;
  targetPath: string;
  componentType: 'page' | 'component' | 'section';
}

export interface GeneratedCode {
  code: string;
  imports: string[];
  dependencies: string[];
  explanation: string;
}

// =============================================================================
// TASTE-TO-TAILWIND MAPPINGS
// =============================================================================

/**
 * Convert abstraction level to concrete Tailwind choices
 *
 * Low abstraction (0.0-0.3): Literal, concrete, recognizable patterns
 * - Buttons look like buttons (solid bg, clear borders)
 * - Standard icons, conventional shapes
 * - Explicit labels and text
 *
 * Medium abstraction (0.3-0.7): Balanced, refined
 * - Subtle variations, soft edges
 * - Some visual interest without being distracting
 *
 * High abstraction (0.7-1.0): Minimal, geometric, artistic
 * - Ghost buttons, wire outlines
 * - Geometric shapes, abstract motifs
 * - Relies more on whitespace and composition
 */
const ABSTRACTION_MAPPINGS = {
  button: {
    low: {
      base: 'px-4 py-2 bg-primary text-white rounded-md shadow-md font-medium',
      hover: 'hover:bg-primary/90 hover:shadow-lg',
      icon: '✓ ✗ → ← + -', // Literal icons
    },
    medium: {
      base: 'px-4 py-2 bg-primary/90 text-white rounded-lg shadow-sm font-medium',
      hover: 'hover:bg-primary hover:shadow-md',
      icon: '• → ○ ●', // Mixed icons
    },
    high: {
      base: 'px-5 py-2.5 border border-primary/30 text-primary rounded-full font-light',
      hover: 'hover:bg-primary/5 hover:border-primary/50',
      icon: '○ □ △ ◇', // Abstract shapes
    },
  },
  card: {
    low: {
      base: 'bg-white border border-gray-200 rounded-lg shadow-md p-6',
      header: 'font-bold text-lg border-b pb-4 mb-4',
    },
    medium: {
      base: 'bg-white/80 border border-gray-100 rounded-xl shadow-sm p-5',
      header: 'font-semibold text-lg pb-3 mb-3',
    },
    high: {
      base: 'bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm rounded-2xl p-6',
      header: 'font-medium text-base pb-2 mb-2',
    },
  },
  surface: {
    low: {
      base: 'bg-gray-50 border border-gray-200',
    },
    medium: {
      base: 'bg-gray-50/80 border border-gray-100',
    },
    high: {
      base: 'bg-gradient-to-b from-white/5 to-transparent backdrop-blur-md',
    },
  },
};

/**
 * Convert density level to spacing choices
 */
const DENSITY_MAPPINGS = {
  low: {
    // Spacious, breathing room
    containerPadding: 'p-8 md:p-12',
    sectionGap: 'space-y-12',
    itemGap: 'gap-8',
    textSpacing: 'leading-relaxed tracking-wide',
  },
  medium: {
    containerPadding: 'p-6 md:p-8',
    sectionGap: 'space-y-8',
    itemGap: 'gap-6',
    textSpacing: 'leading-normal tracking-normal',
  },
  high: {
    // Compact, dense
    containerPadding: 'p-4 md:p-5',
    sectionGap: 'space-y-4',
    itemGap: 'gap-3',
    textSpacing: 'leading-tight tracking-tight',
  },
};

/**
 * Convert motion level to animation choices
 */
const MOTION_MAPPINGS = {
  low: {
    // Nearly static
    transition: '',
    hover: '',
    entrance: '',
    duration: 'duration-0',
  },
  medium: {
    transition: 'transition-all duration-200 ease-out',
    hover: 'hover:scale-[1.02]',
    entrance: 'animate-fadeIn',
    duration: 'duration-200',
  },
  high: {
    // Rich animations
    transition: 'transition-all duration-300 ease-out',
    hover: 'hover:scale-105 hover:-translate-y-0.5',
    entrance: 'animate-slideUp',
    duration: 'duration-300',
  },
};

/**
 * Convert contrast level to visual emphasis
 */
const CONTRAST_MAPPINGS = {
  low: {
    // Subtle, soft
    textPrimary: 'text-gray-600',
    textSecondary: 'text-gray-400',
    border: 'border-gray-100',
    divider: 'border-gray-100/50',
    shadow: 'shadow-sm',
  },
  medium: {
    textPrimary: 'text-gray-800',
    textSecondary: 'text-gray-500',
    border: 'border-gray-200',
    divider: 'border-gray-200',
    shadow: 'shadow-md',
  },
  high: {
    // Bold, stark
    textPrimary: 'text-gray-950',
    textSecondary: 'text-gray-600',
    border: 'border-gray-300',
    divider: 'border-gray-300',
    shadow: 'shadow-lg',
  },
};

// =============================================================================
// CODE GENERATOR CLASS
// =============================================================================

export class CodeGenerator {
  private context: GenerationContext;
  private tasteLevel: (value: number) => 'low' | 'medium' | 'high';

  constructor(context: GenerationContext) {
    this.context = context;
    this.tasteLevel = (value: number) => {
      if (value < 0.33) return 'low';
      if (value < 0.67) return 'medium';
      return 'high';
    };
  }

  /**
   * Get abstraction-appropriate button classes
   */
  getButtonClasses(variant: 'primary' | 'secondary' | 'ghost' = 'primary'): string {
    const level = this.tasteLevel(this.context.taste.abstraction);
    const abstraction = ABSTRACTION_MAPPINGS.button[level];
    const motion = MOTION_MAPPINGS[this.tasteLevel(this.context.taste.motion)];
    const contrast = CONTRAST_MAPPINGS[this.tasteLevel(this.context.taste.contrast)];

    // Check if codebase has button patterns to match
    const existingButton = this.context.analysis.patterns.buttonVariants[0];
    if (existingButton && existingButton.baseClasses.length > 0) {
      // Use existing pattern as base, apply taste modifiers
      const baseClasses = existingButton.baseClasses.slice(0, 10).join(' ');
      return `${baseClasses} ${motion.transition} ${abstraction.hover}`;
    }

    // Generate from taste mappings
    let base = abstraction.base;

    if (variant === 'secondary') {
      base = base.replace('bg-primary', 'bg-secondary').replace('text-white', 'text-primary');
    } else if (variant === 'ghost') {
      base = `px-4 py-2 text-primary ${motion.transition} hover:bg-primary/10`;
    }

    return `${base} ${motion.transition} ${abstraction.hover}`;
  }

  /**
   * Get card classes based on taste
   */
  getCardClasses(): string {
    const abstractionLevel = this.tasteLevel(this.context.taste.abstraction);
    const contrastLevel = this.tasteLevel(this.context.taste.contrast);

    const abstraction = ABSTRACTION_MAPPINGS.card[abstractionLevel];
    const contrast = CONTRAST_MAPPINGS[contrastLevel];
    const motion = MOTION_MAPPINGS[this.tasteLevel(this.context.taste.motion)];

    // Check existing card patterns
    const existingCard = this.context.analysis.patterns.cardVariants[0];
    if (existingCard && existingCard.baseClasses.length > 0) {
      return existingCard.baseClasses.join(' ');
    }

    return `${abstraction.base} ${contrast.shadow} ${motion.transition}`;
  }

  /**
   * Get surface/container classes
   */
  getSurfaceClasses(): string {
    const level = this.tasteLevel(this.context.taste.abstraction);
    const surface = ABSTRACTION_MAPPINGS.surface[level];
    const density = DENSITY_MAPPINGS[this.tasteLevel(this.context.taste.density)];

    return `${surface.base} ${density.containerPadding}`;
  }

  /**
   * Get spacing classes based on density
   */
  getSpacingClasses(): { container: string; section: string; item: string } {
    const level = this.tasteLevel(this.context.taste.density);
    const density = DENSITY_MAPPINGS[level];

    return {
      container: density.containerPadding,
      section: density.sectionGap,
      item: density.itemGap,
    };
  }

  /**
   * Get motion classes based on motion taste
   */
  getMotionClasses(): { transition: string; hover: string; entrance: string } {
    const level = this.tasteLevel(this.context.taste.motion);
    const motion = MOTION_MAPPINGS[level];

    return {
      transition: motion.transition,
      hover: motion.hover,
      entrance: motion.entrance,
    };
  }

  /**
   * Get typography classes based on contrast and density
   */
  getTypographyClasses(): { heading: string; body: string; muted: string } {
    const contrastLevel = this.tasteLevel(this.context.taste.contrast);
    const densityLevel = this.tasteLevel(this.context.taste.density);

    const contrast = CONTRAST_MAPPINGS[contrastLevel];
    const density = DENSITY_MAPPINGS[densityLevel];

    // Check existing typography from analysis
    const tokens = this.context.analysis.tokens;
    const fontWeight = tokens.typography.fontWeights[0] || 'semibold';
    const fontSize = tokens.typography.fontSizes.includes('2xl') ? 'text-2xl' : 'text-xl';

    return {
      heading: `${fontSize} font-${fontWeight} ${contrast.textPrimary} ${density.textSpacing}`,
      body: `text-base ${contrast.textPrimary} ${density.textSpacing}`,
      muted: `text-sm ${contrast.textSecondary}`,
    };
  }

  /**
   * Generate a button component
   */
  generateButton(name: string = 'Button'): GeneratedCode {
    const buttonClasses = this.getButtonClasses();
    const motion = this.getMotionClasses();

    const code = `
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ${name}Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const ${name} = forwardRef<HTMLButtonElement, ${name}Props>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium',
          '${motion.transition}',
          // Variant styles
          {
            primary: '${this.getButtonClasses('primary')}',
            secondary: '${this.getButtonClasses('secondary')}',
            ghost: '${this.getButtonClasses('ghost')}',
          }[variant],
          // Size styles
          {
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4 text-base',
            lg: 'h-12 px-6 text-lg',
          }[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

${name}.displayName = '${name}';
`.trim();

    return {
      code,
      imports: ['forwardRef from react', 'cn from @/lib/utils'],
      dependencies: [],
      explanation: this.explainTasteChoices('button'),
    };
  }

  /**
   * Generate a card component
   */
  generateCard(name: string = 'Card'): GeneratedCode {
    const cardClasses = this.getCardClasses();
    const spacing = this.getSpacingClasses();
    const motion = this.getMotionClasses();
    const typography = this.getTypographyClasses();

    const code = `
import { cn } from '@/lib/utils';

export interface ${name}Props {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function ${name}({ children, className, hoverable = false }: ${name}Props) {
  return (
    <div
      className={cn(
        '${cardClasses}',
        hoverable && '${motion.hover} cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

export function ${name}Header({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('${typography.heading} pb-4 mb-4 border-b', className)}>
      {children}
    </div>
  );
}

export function ${name}Content({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('${spacing.section}', className)}>
      {children}
    </div>
  );
}

export function ${name}Footer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('pt-4 mt-4 border-t flex items-center ${spacing.item}', className)}>
      {children}
    </div>
  );
}
`.trim();

    return {
      code,
      imports: ['cn from @/lib/utils'],
      dependencies: [],
      explanation: this.explainTasteChoices('card'),
    };
  }

  /**
   * Generate a page layout
   */
  generatePageLayout(name: string = 'PageLayout'): GeneratedCode {
    const surface = this.getSurfaceClasses();
    const spacing = this.getSpacingClasses();
    const motion = this.getMotionClasses();

    const code = `
import { cn } from '@/lib/utils';

export interface ${name}Props {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function ${name}({ children, className, maxWidth = 'lg' }: ${name}Props) {
  return (
    <div className={cn('min-h-screen ${surface}', className)}>
      <main
        className={cn(
          'mx-auto w-full ${spacing.container}',
          {
            sm: 'max-w-screen-sm',
            md: 'max-w-screen-md',
            lg: 'max-w-screen-lg',
            xl: 'max-w-screen-xl',
            full: 'max-w-full',
          }[maxWidth]
        )}
      >
        <div className="${spacing.section} ${motion.entrance}">
          {children}
        </div>
      </main>
    </div>
  );
}
`.trim();

    return {
      code,
      imports: ['cn from @/lib/utils'],
      dependencies: [],
      explanation: this.explainTasteChoices('layout'),
    };
  }

  /**
   * Generate a section component for marketing pages
   */
  generateSection(type: 'hero' | 'features' | 'cta' | 'testimonials'): GeneratedCode {
    const spacing = this.getSpacingClasses();
    const typography = this.getTypographyClasses();
    const motion = this.getMotionClasses();
    const button = this.getButtonClasses();

    const narrativeLevel = this.tasteLevel(this.context.taste.narrative);

    let code = '';

    if (type === 'hero') {
      // Narrative affects how much "story" the hero tells
      const heroSize = narrativeLevel === 'high' ? 'min-h-[80vh]' : narrativeLevel === 'medium' ? 'min-h-[60vh]' : 'min-h-[40vh]';

      code = `
export function HeroSection({ title, subtitle, cta }: { title: string; subtitle?: string; cta?: { label: string; href: string } }) {
  return (
    <section className="${heroSize} flex flex-col items-center justify-center text-center ${spacing.container}">
      <h1 className="text-4xl md:text-5xl lg:text-6xl ${typography.heading} ${motion.entrance}">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-6 text-lg md:text-xl ${typography.muted} max-w-2xl ${motion.entrance}" style={{ animationDelay: '100ms' }}>
          {subtitle}
        </p>
      )}
      {cta && (
        <a href={cta.href} className="mt-8 ${button} ${motion.entrance}" style={{ animationDelay: '200ms' }}>
          {cta.label}
        </a>
      )}
    </section>
  );
}
`.trim();
    } else if (type === 'features') {
      code = `
export interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function FeaturesSection({ title, features }: { title?: string; features: Feature[] }) {
  return (
    <section className="${spacing.container}">
      {title && (
        <h2 className="text-2xl md:text-3xl ${typography.heading} text-center mb-12">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${spacing.item}">
        {features.map((feature, index) => (
          <div
            key={index}
            className="${this.getCardClasses()} ${motion.entrance}"
            style={{ animationDelay: \`\${index * 100}ms\` }}
          >
            {feature.icon && (
              <div className="w-12 h-12 mb-4 text-primary">
                {feature.icon}
              </div>
            )}
            <h3 className="text-lg ${typography.heading}">{feature.title}</h3>
            <p className="mt-2 ${typography.muted}">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`.trim();
    } else if (type === 'cta') {
      code = `
export function CTASection({ title, description, primaryAction, secondaryAction }: {
  title: string;
  description?: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}) {
  return (
    <section className="${spacing.container} text-center">
      <h2 className="text-2xl md:text-3xl ${typography.heading}">
        {title}
      </h2>
      {description && (
        <p className="mt-4 ${typography.muted} max-w-2xl mx-auto">
          {description}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center ${spacing.item}">
        <a href={primaryAction.href} className="${this.getButtonClasses('primary')}">
          {primaryAction.label}
        </a>
        {secondaryAction && (
          <a href={secondaryAction.href} className="${this.getButtonClasses('ghost')}">
            {secondaryAction.label}
          </a>
        )}
      </div>
    </section>
  );
}
`.trim();
    }

    return {
      code,
      imports: [],
      dependencies: [],
      explanation: this.explainTasteChoices(type),
    };
  }

  /**
   * Generate explanation of taste choices
   */
  private explainTasteChoices(componentType: string): string {
    const taste = this.context.taste;

    const explanations: string[] = [];

    // Abstraction explanation
    if (taste.abstraction > 0.7) {
      explanations.push('Using minimal, geometric styling due to high abstraction preference');
    } else if (taste.abstraction < 0.3) {
      explanations.push('Using concrete, recognizable patterns due to low abstraction preference');
    }

    // Density explanation
    if (taste.density > 0.7) {
      explanations.push('Compact spacing for information-dense layouts');
    } else if (taste.density < 0.3) {
      explanations.push('Generous whitespace for breathing room');
    }

    // Motion explanation
    if (taste.motion > 0.7) {
      explanations.push('Rich animations and transitions for engaging interactions');
    } else if (taste.motion < 0.3) {
      explanations.push('Minimal animations for distraction-free experience');
    }

    // Contrast explanation
    if (taste.contrast > 0.7) {
      explanations.push('Bold visual hierarchy with strong contrast');
    } else if (taste.contrast < 0.3) {
      explanations.push('Subtle, soft visual treatment');
    }

    // Narrative explanation (for sections)
    if (componentType === 'hero' || componentType === 'cta') {
      if (taste.narrative > 0.7) {
        explanations.push('Prominent hero section for storytelling');
      } else if (taste.narrative < 0.3) {
        explanations.push('Compact, functional hero without excess');
      }
    }

    return explanations.length > 0
      ? `Taste choices: ${explanations.join('. ')}.`
      : 'Using balanced default styling.';
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export function createGenerator(
  analysis: CodebaseAnalysis,
  taste: TasteConfig,
  targetPath: string,
  componentType: GenerationContext['componentType'] = 'component'
): CodeGenerator {
  return new CodeGenerator({
    analysis,
    taste,
    targetPath,
    componentType,
  });
}

/**
 * Generate code based on taste and codebase analysis
 */
export function generateCode(
  analysis: CodebaseAnalysis,
  taste: TasteConfig,
  what: 'button' | 'card' | 'layout' | 'hero' | 'features' | 'cta',
  name?: string
): GeneratedCode {
  const generator = createGenerator(analysis, taste, '', 'component');

  switch (what) {
    case 'button':
      return generator.generateButton(name);
    case 'card':
      return generator.generateCard(name);
    case 'layout':
      return generator.generatePageLayout(name);
    case 'hero':
      return generator.generateSection('hero');
    case 'features':
      return generator.generateSection('features');
    case 'cta':
      return generator.generateSection('cta');
    default:
      throw new Error(`Unknown component type: ${what}`);
  }
}
