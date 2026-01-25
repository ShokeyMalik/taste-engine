/**
 * Base Template Utilities
 *
 * Shared utilities for block template generation.
 * Provides common patterns, class builders, and code helpers.
 */

import type { AppliedTuners, BlockType, BlockVariant } from '../types';
import type { InspirationProfile, MotionConfig, SpacingConfig } from '../../inspiration/inspiration-profile';

// =============================================================================
// TYPES
// =============================================================================

export interface TemplateContext {
  blockType: BlockType;
  variant: string;
  tuners: AppliedTuners;
  profile?: InspirationProfile;
  componentLibrary: 'shadcn' | 'radix' | 'tailwind';
  darkMode: boolean;
}

export interface ClassBuilder {
  base: string[];
  responsive: string[];
  hover: string[];
  dark: string[];
  conditional: { condition: boolean; classes: string[] }[];
}

export interface TemplateSlot {
  name: string;
  placeholder: string;
  description: string;
}

// =============================================================================
// CLASS BUILDERS
// =============================================================================

/**
 * Build Tailwind class string from parts
 */
export function buildClasses(builder: Partial<ClassBuilder>): string {
  const parts: string[] = [];

  if (builder.base) parts.push(...builder.base);
  if (builder.responsive) parts.push(...builder.responsive);
  if (builder.hover) parts.push(...builder.hover);
  if (builder.dark) parts.push(...builder.dark);

  if (builder.conditional) {
    for (const cond of builder.conditional) {
      if (cond.condition) {
        parts.push(...cond.classes);
      }
    }
  }

  return parts.join(' ');
}

/**
 * Get spacing classes from tuner value
 */
export function getSpacingClasses(density: number, context: 'section' | 'component' | 'card'): string {
  const spacingMap = {
    section: {
      tight: 'py-12 md:py-16',
      normal: 'py-16 md:py-24',
      spacious: 'py-24 md:py-32',
    },
    component: {
      tight: 'gap-4',
      normal: 'gap-6',
      spacious: 'gap-8',
    },
    card: {
      tight: 'p-4',
      normal: 'p-6',
      spacious: 'p-8',
    },
  };

  const level = density < 0.33 ? 'tight' : density > 0.66 ? 'spacious' : 'normal';
  return spacingMap[context][level];
}

/**
 * Get motion classes from tuner value
 */
export function getMotionClasses(motion: number): string {
  if (motion < 0.2) return '';
  if (motion < 0.4) return 'transition-colors duration-150';
  if (motion < 0.6) return 'transition-all duration-200 ease-out';
  if (motion < 0.8) return 'transition-all duration-300 ease-out hover:scale-[1.02]';
  return 'transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg';
}

/**
 * Get border radius classes from profile
 */
export function getBorderRadiusClasses(profile?: InspirationProfile): string {
  if (!profile) return 'rounded-lg';

  const radiusMap: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  return radiusMap[profile.componentStyles.borderRadius] || 'rounded-lg';
}

/**
 * Get shadow classes from profile
 */
export function getShadowClasses(profile?: InspirationProfile): string {
  if (!profile) return 'shadow-sm';

  const shadowMap: Record<string, string> = {
    none: '',
    subtle: 'shadow-sm',
    medium: 'shadow-md',
    dramatic: 'shadow-lg shadow-black/10',
  };

  return shadowMap[profile.componentStyles.shadow] || 'shadow-sm';
}

/**
 * Get contrast classes from tuner
 */
export function getContrastClasses(contrast: number, element: 'text' | 'bg' | 'border'): string {
  if (element === 'text') {
    if (contrast < 0.33) return 'text-muted-foreground';
    if (contrast > 0.66) return 'text-foreground font-medium';
    return 'text-foreground';
  }
  if (element === 'bg') {
    if (contrast < 0.33) return 'bg-muted/50';
    if (contrast > 0.66) return 'bg-card';
    return 'bg-card/80';
  }
  if (element === 'border') {
    if (contrast < 0.33) return 'border-transparent';
    if (contrast > 0.66) return 'border-border';
    return 'border-border/50';
  }
  return '';
}

// =============================================================================
// CONTENT PLACEHOLDERS
// =============================================================================

/**
 * Generate placeholder content for blocks
 */
export const placeholders = {
  heading: (level: 1 | 2 | 3 | 4): string => {
    const headings = {
      1: 'Build something amazing today',
      2: 'Why choose us',
      3: 'Feature title',
      4: 'Subheading',
    };
    return headings[level];
  },

  paragraph: (length: 'short' | 'medium' | 'long'): string => {
    const paragraphs = {
      short: 'A brief description that explains the key benefit.',
      medium: 'Transform your workflow with powerful tools designed for modern teams. Get started in minutes, not hours.',
      long: 'Our platform provides everything you need to build, deploy, and scale your applications. With enterprise-grade security and 99.9% uptime, you can focus on what matters most—your business.',
    };
    return paragraphs[length];
  },

  button: (type: 'primary' | 'secondary' | 'link'): string => {
    const buttons = {
      primary: 'Get started',
      secondary: 'Learn more',
      link: 'See documentation →',
    };
    return buttons[type];
  },

  stat: (): { value: string; label: string } => ({
    value: '99.9%',
    label: 'Uptime',
  }),

  testimonial: (): { quote: string; author: string; role: string; company: string } => ({
    quote: 'This product has transformed how our team works. The results speak for themselves.',
    author: 'Sarah Chen',
    role: 'Head of Product',
    company: 'TechCorp',
  }),

  feature: (): { title: string; description: string; icon: string } => ({
    title: 'Fast & Reliable',
    description: 'Built for speed with 99.9% uptime guarantee.',
    icon: 'Zap',
  }),

  navItem: (): { label: string; href: string } => ({
    label: 'Features',
    href: '/features',
  }),

  pricing: (): { name: string; price: string; features: string[] } => ({
    name: 'Pro',
    price: '$29/mo',
    features: ['Unlimited projects', 'Priority support', 'Advanced analytics'],
  }),
};

// =============================================================================
// CODE GENERATION HELPERS
// =============================================================================

/**
 * Generate import statements
 */
export function generateImports(components: string[], source: string): string {
  return `import { ${components.join(', ')} } from "${source}";`;
}

/**
 * Generate component name from block type and variant
 */
export function generateComponentName(blockType: BlockType, variant: string): string {
  const typePascal = blockType
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');

  const variantPascal = variant
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');

  return `${typePascal}${variantPascal}`;
}

/**
 * Generate file name from component name
 */
export function generateFileName(componentName: string): string {
  return componentName
    .replace(/([A-Z])/g, (m, p1, offset) =>
      offset > 0 ? `-${p1.toLowerCase()}` : p1.toLowerCase()
    ) + '.tsx';
}

/**
 * Wrap JSX in a component function
 */
export function wrapComponent(
  name: string,
  jsx: string,
  props?: string,
  imports?: string[]
): string {
  const importSection = imports?.join('\n') || '';
  const propsType = props || '{}';

  return `${importSection}

interface ${name}Props ${propsType}

export function ${name}(${props ? 'props: ' + name + 'Props' : ''}) {
  return (
${indent(jsx, 4)}
  );
}
`;
}

/**
 * Indent code by spaces
 */
export function indent(code: string, spaces: number): string {
  const pad = ' '.repeat(spaces);
  return code
    .split('\n')
    .map(line => (line.trim() ? pad + line : line))
    .join('\n');
}

// =============================================================================
// TUNER-BASED STYLING
// =============================================================================

/**
 * Apply tuners to generate CSS classes
 */
export function applyTuners(tuners: AppliedTuners): {
  container: string;
  card: string;
  text: string;
  button: string;
  section: string;
} {
  return {
    container: buildClasses({
      base: ['max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8'],
    }),

    card: buildClasses({
      base: [getBorderRadiusClasses()],
      conditional: [
        { condition: tuners.motion > 0.3, classes: ['transition-shadow', 'hover:shadow-md'] },
        { condition: tuners.contrast > 0.5, classes: ['border', 'border-border'] },
        { condition: tuners.abstraction < 0.3, classes: ['shadow-lg'] },
      ],
    }),

    text: buildClasses({
      conditional: [
        { condition: tuners.contrast > 0.6, classes: ['text-foreground'] },
        { condition: tuners.contrast <= 0.6, classes: ['text-muted-foreground'] },
        { condition: tuners.narrative > 0.6, classes: ['text-lg'] },
      ],
    }),

    button: buildClasses({
      base: ['inline-flex', 'items-center', 'justify-center', 'font-medium'],
      conditional: [
        { condition: tuners.abstraction > 0.6, classes: ['bg-primary/10', 'text-primary'] },
        { condition: tuners.abstraction <= 0.6, classes: ['bg-primary', 'text-primary-foreground'] },
        { condition: tuners.motion > 0.5, classes: ['transition-all', 'hover:scale-105'] },
      ],
    }),

    section: getSpacingClasses(tuners.density, 'section'),
  };
}

/**
 * Get animation classes from tuner
 */
export function getAnimationClasses(tuners: AppliedTuners): string {
  if (tuners.motion < 0.2) return '';
  if (tuners.motion < 0.5) return 'animate-in fade-in duration-300';
  return 'animate-in fade-in slide-in-from-bottom-4 duration-500';
}

// =============================================================================
// ICON HELPERS
// =============================================================================

/**
 * Common icon suggestions for blocks
 */
export const iconSuggestions: Record<string, string[]> = {
  features: ['Zap', 'Shield', 'Clock', 'Star', 'Check', 'ArrowRight', 'Sparkles'],
  pricing: ['Check', 'X', 'Star', 'Crown', 'Rocket'],
  stats: ['TrendingUp', 'Users', 'DollarSign', 'Activity', 'BarChart'],
  navigation: ['Menu', 'X', 'ChevronDown', 'Search', 'User'],
  sidebar: ['Home', 'Settings', 'Users', 'FileText', 'BarChart2', 'Inbox'],
  dashboard: ['Bell', 'Search', 'Settings', 'User', 'LogOut'],
  auth: ['Mail', 'Lock', 'Eye', 'EyeOff', 'Github', 'Chrome'],
  error: ['AlertTriangle', 'XCircle', 'RefreshCw', 'Home'],
  empty: ['FileQuestion', 'PlusCircle', 'Search', 'FolderOpen'],
};

/**
 * Get icon import for lucide-react
 */
export function getLucideImport(icons: string[]): string {
  return `import { ${icons.join(', ')} } from "lucide-react";`;
}

// =============================================================================
// RESPONSIVE HELPERS
// =============================================================================

/**
 * Generate responsive grid classes
 */
export function getGridClasses(
  columns: { sm?: number; md?: number; lg?: number },
  gap?: string
): string {
  const cols = [
    'grid',
    columns.sm ? `grid-cols-${columns.sm}` : 'grid-cols-1',
    columns.md ? `md:grid-cols-${columns.md}` : '',
    columns.lg ? `lg:grid-cols-${columns.lg}` : '',
    gap || 'gap-6',
  ];
  return cols.filter(Boolean).join(' ');
}

/**
 * Generate flex layout classes
 */
export function getFlexClasses(
  direction: 'row' | 'col',
  justify?: 'start' | 'center' | 'end' | 'between',
  align?: 'start' | 'center' | 'end',
  gap?: string
): string {
  const classes = [
    'flex',
    direction === 'col' ? 'flex-col' : 'flex-row',
    justify ? `justify-${justify}` : '',
    align ? `items-${align}` : '',
    gap || '',
  ];
  return classes.filter(Boolean).join(' ');
}
