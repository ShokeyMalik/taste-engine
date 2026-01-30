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
// =============================================================================
// ASSET & ARCHETYPE HELPERS
// =============================================================================

/**
 * Get a harvested logo from the profile
 */
export function getHarvestedLogo(profile?: InspirationProfile): string | undefined {
  return profile?.assets?.logos?.[0];
}

/**
 * Get a harvested pattern SVG from the profile
 */
export function getHarvestedPattern(profile?: InspirationProfile): string | undefined {
  return profile?.assets?.patterns?.[0];
}

/**
 * Get a harvested image from the profile
 */
export function getHarvestedImage(profile?: InspirationProfile): string | undefined {
  return profile?.assets?.images?.[0];
}

/**
 * Fallback to Unsplash source image
 */
export function getFallbackImage(query: string, size = '1600x900'): string {
  const safeQuery = encodeURIComponent(query.trim() || 'design');
  return `https://source.unsplash.com/featured/${size}?${safeQuery}`;
}

/**
 * Get a structural archetype for a specific slot
 */
export function getArchetype(profile: InspirationProfile | undefined, slot: 'header' | 'hero' | 'features'): string | undefined {
  return profile?.archetypes?.[slot];
}

/**
 * Get layout DSL section for a role
 */
export function getLayoutSection(
  profile: InspirationProfile | undefined,
  role: 'hero' | 'nav' | 'features' | 'testimonial' | 'pricing' | 'cta' | 'footer' | 'content' | 'unknown'
) {
  return profile?.layoutDsl?.sections.find((section) => section.role === role);
}

/**
 * Map layout DSL columns to Tailwind grid classes
 */
export function getGridColumns(columns?: number): string {
  if (!columns || columns <= 1) return 'grid-cols-1';
  if (columns === 2) return 'grid-cols-2';
  if (columns === 3) return 'grid-cols-3';
  if (columns === 4) return 'grid-cols-4';
  return 'grid-cols-3';
}

/**
 * Inject a custom SVG into a component wrapper
 */
export function injectSVG(svg: string, className?: string): string {
  return svg.replace('<svg', `<svg className="${className || ''}"`);
}

// =============================================================================
// PROFILE-DRIVEN STYLE INJECTION
// =============================================================================

/**
 * Asset cycling - rotate through harvested assets instead of just [0]
 */
export function getHarvestedAsset(
  profile: InspirationProfile | undefined,
  type: 'logos' | 'patterns' | 'images' | 'icons',
  index: number
): string | undefined {
  const assets = profile?.assets?.[type];
  if (!assets || assets.length === 0) return undefined;
  return assets[index % assets.length];
}

/**
 * Get multiple harvested assets for a section
 */
export function getHarvestedAssets(
  profile: InspirationProfile | undefined,
  type: 'logos' | 'patterns' | 'images' | 'icons',
  count: number
): string[] {
  const assets = profile?.assets?.[type] || [];
  if (assets.length === 0) return [];
  // Cycle through available assets
  return Array.from({ length: count }, (_, i) => assets[i % assets.length]);
}

/**
 * Get CSS variable definitions from profile colors
 */
export function getProfileCSSVariables(profile?: InspirationProfile): string {
  if (!profile?.colors) return '';

  const { primary, accent, background, foreground, muted, mutedForeground, border, surface } = profile.colors;

  const vars: string[] = [];

  // Helper to safely convert hex - only process valid hex strings
  const safeHexToHSL = (hex: unknown): string | null => {
    if (typeof hex !== 'string' || !hex.startsWith('#')) return null;
    try {
      return hexToHSL(hex);
    } catch {
      return null;
    }
  };

  // Convert hex to HSL for shadcn compatibility
  const primaryHSL = safeHexToHSL(primary);
  const accentHSL = safeHexToHSL(accent);
  const backgroundHSL = safeHexToHSL(background);
  const foregroundHSL = safeHexToHSL(foreground);
  const mutedHSL = safeHexToHSL(muted);
  const mutedForegroundHSL = safeHexToHSL(mutedForeground);
  const borderHSL = safeHexToHSL(border);
  const surfaceHSL = safeHexToHSL(surface);

  if (primaryHSL) vars.push(`--primary: ${primaryHSL};`);
  if (accentHSL) vars.push(`--accent: ${accentHSL};`);
  if (backgroundHSL) vars.push(`--background: ${backgroundHSL};`);
  if (foregroundHSL) vars.push(`--foreground: ${foregroundHSL};`);
  if (mutedHSL) vars.push(`--muted: ${mutedHSL};`);
  if (mutedForegroundHSL) vars.push(`--muted-foreground: ${mutedForegroundHSL};`);
  if (borderHSL) vars.push(`--border: ${borderHSL};`);
  if (surfaceHSL) vars.push(`--card: ${surfaceHSL};`);

  // Add gradients if available
  if (profile.colors.gradients && Array.isArray(profile.colors.gradients) && profile.colors.gradients.length > 0) {
    const gradient0 = profile.colors.gradients[0];
    if (typeof gradient0 === 'string') {
      vars.push(`--gradient-primary: ${gradient0};`);
    }
    if (profile.colors.gradients.length > 1) {
      const gradient1 = profile.colors.gradients[1];
      if (typeof gradient1 === 'string') {
        vars.push(`--gradient-secondary: ${gradient1};`);
      }
    }
  }

  return vars.length > 0 ? `:root { ${vars.join(' ')} }` : '';
}

/**
 * Convert hex color to HSL string (for shadcn CSS variables)
 */
function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Handle shorthand hex
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Get typography style string from profile
 */
export function getTypographyStyles(profile?: InspirationProfile): {
  headingFont: string;
  bodyFont: string;
  headingWeight: string;
  bodyWeight: string;
  headingTracking: string;
} {
  const defaults = {
    headingFont: 'inherit',
    bodyFont: 'inherit',
    headingWeight: '700',
    bodyWeight: '400',
    headingTracking: '-0.02em',
  };

  if (!profile?.typography) return defaults;

  const { headingFont, bodyFont, headingWeight, bodyWeight, letterSpacing } = profile.typography;

  // Safely extract first font from array or use as string
  const getFirstFont = (fonts: unknown): string => {
    if (Array.isArray(fonts) && fonts.length > 0 && typeof fonts[0] === 'string') {
      return fonts[0];
    }
    if (typeof fonts === 'string') {
      return fonts;
    }
    return defaults.headingFont;
  };

  return {
    headingFont: getFirstFont(headingFont),
    bodyFont: getFirstFont(bodyFont),
    headingWeight: typeof headingWeight === 'string' ? headingWeight : defaults.headingWeight,
    bodyWeight: typeof bodyWeight === 'string' ? bodyWeight : defaults.bodyWeight,
    headingTracking: typeof letterSpacing?.heading === 'string' ? letterSpacing.heading : defaults.headingTracking,
  };
}

/**
 * Get inline style object for typography
 */
export function getHeadingStyle(profile?: InspirationProfile): string {
  const typo = getTypographyStyles(profile);
  if (typo.headingFont === 'inherit') return '';
  return `style={{ fontFamily: '${typo.headingFont}', fontWeight: ${typo.headingWeight}, letterSpacing: '${typo.headingTracking}' }}`;
}

/**
 * Get motion/animation classes from profile
 */
export function getProfileMotionClasses(profile?: InspirationProfile, element: 'card' | 'button' | 'section' = 'card'): string {
  if (!profile?.motion) return getMotionClasses(0.5); // default medium motion

  const { duration, easing, entranceStyle } = profile.motion;
  const classes: string[] = [];

  // Duration mapping
  const durationClass = duration === 'fast' ? 'duration-150'
    : duration === 'slow' ? 'duration-500'
    : 'duration-300';

  // Easing mapping
  const easingClass = easing === 'spring' ? 'ease-out'
    : easing === 'bounce' ? 'ease-bounce'
    : easing === 'linear' ? 'ease-linear'
    : 'ease-out';

  // Base transition
  classes.push('transition-all', durationClass, easingClass);

  // Element-specific hover effects
  if (element === 'card') {
    classes.push('hover:scale-[1.02]', 'hover:shadow-lg');
  } else if (element === 'button') {
    classes.push('hover:scale-105', 'active:scale-95');
  }

  // Entrance animation if set
  if (entranceStyle === 'fade') {
    classes.push('animate-in', 'fade-in');
  } else if (entranceStyle === 'slide') {
    classes.push('animate-in', 'fade-in', 'slide-in-from-bottom-4');
  } else if (entranceStyle === 'scale') {
    classes.push('animate-in', 'fade-in', 'zoom-in-95');
  }

  return classes.join(' ');
}

/**
 * Get spacing classes from profile
 */
export function getProfileSpacing(profile?: InspirationProfile, context: 'section' | 'component' | 'card' = 'section'): string {
  if (!profile?.spacing) return getSpacingClasses(0.5, context);

  const { scale } = profile.spacing;

  // Map scale to density value (0-1)
  const densityMap: Record<string, number> = {
    tight: 0.2,
    compact: 0.35,
    normal: 0.5,
    relaxed: 0.65,
    spacious: 0.8,
  };

  const density = densityMap[scale || 'normal'] || 0.5;
  return getSpacingClasses(density, context);
}

/**
 * Get border radius from profile for Tailwind class
 */
export function getProfileBorderRadius(profile?: InspirationProfile): string {
  if (!profile?.componentStyles?.borderRadius) return 'rounded-xl';

  const radiusMap: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  return radiusMap[profile.componentStyles.borderRadius] || 'rounded-xl';
}

/**
 * Get shadow from profile for Tailwind class
 */
export function getProfileShadow(profile?: InspirationProfile): string {
  if (!profile?.componentStyles?.shadow) return 'shadow-lg';

  const shadowMap: Record<string, string> = {
    none: '',
    subtle: 'shadow-sm',
    medium: 'shadow-md',
    dramatic: 'shadow-xl shadow-black/10',
  };

  return shadowMap[profile.componentStyles.shadow] || 'shadow-lg';
}

/**
 * Generate style tag with motion CSS and CSS variables
 */
export function getProfileStyleTag(profile?: InspirationProfile): string {
  const parts: string[] = [];

  // CSS Variables from colors
  const cssVars = getProfileCSSVariables(profile);
  if (cssVars) parts.push(cssVars);

  // Motion CSS
  if (profile?.motionCSS) {
    parts.push(profile.motionCSS);
  }

  // Typography import if custom font
  const typo = getTypographyStyles(profile);
  if (typo.headingFont !== 'inherit' && !typo.headingFont.includes('system')) {
    // Create Google Fonts import for common fonts
    const fontName = typo.headingFont.split(',')[0].trim().replace(/['"]/g, '');
    parts.push(`@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700;800;900&display=swap');`);
  }

  if (parts.length === 0) return '';

  const escapedCSS = parts.join('\n').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  return `<style dangerouslySetInnerHTML={{ __html: \`${escapedCSS}\` }} />`;
}

/**
 * Get gradient background class or inline style
 */
export function getGradientStyle(profile?: InspirationProfile): string {
  if (!profile?.colors?.gradients || !Array.isArray(profile.colors.gradients) || profile.colors.gradients.length === 0) {
    return 'bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent';
  }

  // Use first gradient if it's a valid CSS gradient string
  const gradient = profile.colors.gradients[0];
  if (typeof gradient === 'string' && (gradient.includes('linear-gradient') || gradient.includes('radial-gradient'))) {
    return `style={{ background: '${gradient}' }}`;
  }

  return 'bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent';
}

/**
 * Build a complete card component class string from profile
 */
export function getProfileCardClasses(profile?: InspirationProfile): string {
  const classes = [
    getProfileBorderRadius(profile),
    getProfileShadow(profile),
    getProfileMotionClasses(profile, 'card'),
    'border border-border/60 bg-card/60 backdrop-blur',
  ];
  return classes.filter(Boolean).join(' ');
}

/**
 * Build a complete button class string from profile
 */
export function getProfileButtonClasses(profile?: InspirationProfile, variant: 'primary' | 'secondary' = 'primary'): string {
  const classes = [
    getProfileBorderRadius(profile),
    getProfileMotionClasses(profile, 'button'),
    variant === 'primary'
      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
      : 'border border-border bg-background hover:bg-muted',
    'px-6 py-3 font-medium',
  ];
  return classes.filter(Boolean).join(' ');
}

// =============================================================================
// ELITE DESIGN PATTERN HELPERS
// =============================================================================

/**
 * Get glass morphism classes for premium containers
 */
export function getGlassMorphismClasses(profile?: InspirationProfile): string {
  if (!profile?.containerStyles?.glassMorphism) {
    // Return a subtle version even if not detected - more premium feel
    return 'bg-white/5 backdrop-blur-sm border border-white/10';
  }
  return 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/5';
}

/**
 * Check if profile uses glass morphism
 */
export function usesGlassMorphism(profile?: InspirationProfile): boolean {
  return profile?.containerStyles?.glassMorphism === true;
}

/**
 * Get gradient border wrapper classes
 * Returns classes for a parent container that creates a gradient border effect
 */
export function getGradientBorderClasses(profile?: InspirationProfile): string {
  if (!profile?.containerStyles?.hasGradientBorders) {
    return '';
  }
  return `relative before:absolute before:inset-0 before:rounded-2xl before:p-[1px]
          before:bg-gradient-to-br before:from-primary/50 before:via-accent/30 before:to-transparent
          before:-z-10 before:pointer-events-none`;
}

/**
 * Generate floating orb background elements JSX
 */
export function generateFloatingOrbsJSX(profile?: InspirationProfile): string {
  // Always generate some ambient orbs for premium feel
  const hasOrbs = profile?.backgrounds?.floatingOrbs !== false;
  if (!hasOrbs && profile?.backgrounds?.floatingOrbs === false) return '';

  return `
      {/* Floating Orb Backgrounds */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse delay-1000 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />`;
}

/**
 * Get gradient text classes for headlines
 */
export function getGradientTextClasses(profile?: InspirationProfile): string {
  // Check if profile has gradients defined
  const hasGradients = profile?.colors?.gradients && profile.colors.gradients.length > 0;

  if (hasGradients) {
    return `bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%] animate-gradient`;
  }

  // Default premium gradient
  return `bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%]`;
}

/**
 * Get organic container shape classes (blobs, curves)
 */
export function getOrganicContainerClasses(profile?: InspirationProfile): string {
  if (!profile?.containerStyles?.hasOrganicShapes) {
    return 'rounded-2xl';
  }

  // Organic shapes use larger border radius with slight asymmetry
  return 'rounded-[2rem] md:rounded-[3rem]';
}

/**
 * Get card classes based on detected container style
 */
export function getEliteCardClasses(profile?: InspirationProfile): string {
  const containerStyle = profile?.containerStyles;
  const classes: string[] = [];

  // Base shape
  if (containerStyle?.cardShape === 'glass') {
    classes.push('bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl');
  } else if (containerStyle?.cardShape === 'organic') {
    classes.push('rounded-[2rem] border border-border/40 bg-card/80');
  } else {
    classes.push('border border-border/60 bg-card/60');
  }

  // Border style
  if (containerStyle?.borderStyle === 'gradient') {
    classes.push('relative overflow-hidden');
  } else if (containerStyle?.borderStyle === 'glow') {
    classes.push('shadow-lg shadow-primary/20');
  }

  // Shadow style
  if (containerStyle?.shadowStyle === 'dramatic') {
    classes.push('shadow-2xl shadow-black/10');
  } else if (containerStyle?.shadowStyle === 'elevated') {
    classes.push('shadow-xl');
  } else if (containerStyle?.shadowStyle === 'subtle') {
    classes.push('shadow-md');
  }

  // Border radius
  if (!containerStyle?.cardShape || containerStyle.cardShape === 'rounded') {
    classes.push(getProfileBorderRadius(profile));
  }

  // Motion
  classes.push(getProfileMotionClasses(profile, 'card'));

  return classes.join(' ');
}

/**
 * Get section background treatment
 */
export function getSectionBackgroundJSX(profile?: InspirationProfile, variant: 'hero' | 'features' | 'cta' = 'hero'): string {
  const backgrounds = profile?.backgrounds;
  const parts: string[] = [];

  // Add floating orbs if detected or for hero sections
  if (backgrounds?.floatingOrbs || variant === 'hero') {
    parts.push(generateFloatingOrbsJSX(profile));
  }

  // Add grid pattern if detected
  if (backgrounds?.gridPatterns && backgrounds.gridPatterns.length > 0) {
    parts.push(`
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />`);
  }

  // Add noise texture if detected
  if (backgrounds?.noiseTextures) {
    parts.push(`
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\'0 0 256 256\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noiseFilter\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.65\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noiseFilter)\\'/%3E%3C/svg%3E")' }} />`);
  }

  return parts.join('\n');
}

/**
 * Get hero background image JSX if available
 */
export function getHeroBackgroundImageJSX(profile?: InspirationProfile): string {
  const heroImages = profile?.backgrounds?.heroBackgrounds || profile?.visualAssets?.heroImages || [];

  if (heroImages.length === 0) return '';

  const heroImage = heroImages[0];
  return `
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="${heroImage}"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>`;
}

/**
 * Get decorative SVG element JSX
 */
export function getDecorativeSVGJSX(profile?: InspirationProfile, index: number = 0): string {
  const decorativeSvgs = profile?.visualAssets?.decorativeSvgs || [];

  if (decorativeSvgs.length === 0) return '';

  const svg = decorativeSvgs[index % decorativeSvgs.length];
  // Sanitize and wrap SVG
  const safeSvg = svg.replace(/"/g, "'").replace(/\n/g, '');

  return `<div className="absolute inset-0 opacity-10 pointer-events-none" dangerouslySetInnerHTML={{ __html: "${safeSvg}" }} />`;
}

/**
 * Get entrance animation classes based on profile
 */
export function getEntranceAnimationClasses(profile?: InspirationProfile, delay: number = 0): string {
  const entranceStyle = profile?.interactions?.entranceAnimation || 'fade-up';
  const classes: string[] = ['animate-in'];

  switch (entranceStyle) {
    case 'fade-up':
      classes.push('fade-in', 'slide-in-from-bottom-4');
      break;
    case 'fade-in':
      classes.push('fade-in');
      break;
    case 'scale':
      classes.push('fade-in', 'zoom-in-95');
      break;
    case 'blur-in':
      classes.push('fade-in');
      break;
    case 'slide':
      classes.push('fade-in', 'slide-in-from-left-4');
      break;
    default:
      classes.push('fade-in', 'slide-in-from-bottom-4');
  }

  // Add duration and delay
  classes.push('duration-700');
  if (delay > 0) {
    classes.push(`delay-${delay * 100}`);
  }

  return classes.join(' ');
}

/**
 * Get scroll animation trigger attribute for elements
 */
export function getScrollAnimationProps(profile?: InspirationProfile): string {
  const scrollAnimation = profile?.interactions?.scrollAnimations || 'fade';

  if (scrollAnimation === 'none') return '';

  // Return Framer Motion-compatible props
  return `
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}`;
}

/**
 * Get custom icon from profile or fallback to Lucide
 */
export function getIconComponent(profile?: InspirationProfile, index: number = 0, fallbackIcon: string = 'Star'): string {
  const customIcons = profile?.visualAssets?.customIcons || [];

  if (customIcons.length === 0) {
    return `<${fallbackIcon} className="h-5 w-5 text-primary" />`;
  }

  const icon = customIcons[index % customIcons.length];
  // Return as dangerouslySetInnerHTML for SVG
  return `<span className="h-5 w-5 text-primary" dangerouslySetInnerHTML={{ __html: '${icon.replace(/'/g, "\\'")}' }} />`;
}

/**
 * Build complete elite section wrapper
 */
export function getEliteSectionClasses(profile?: InspirationProfile): string {
  const classes = [
    'relative overflow-hidden',
    getProfileSpacing(profile, 'section'),
    'bg-background text-foreground',
  ];
  return classes.join(' ');
}

/**
 * Generate CSS for gradient animation keyframes
 */
export function getGradientAnimationCSS(): string {
  return `
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient {
  animation: gradient 8s ease infinite;
}`;
}
