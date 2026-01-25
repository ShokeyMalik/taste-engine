/**
 * shadcn/ui Token Mapper
 *
 * Maps between taste-engine design tokens and shadcn CSS variables.
 * Ensures generated code uses the correct variable names.
 */

import type { ShadcnConfig } from './types';
import type { InspirationProfile } from '../../inspiration/inspiration-profile';

// =============================================================================
// TOKEN MAPPING TYPES
// =============================================================================

export interface TokenMapping {
  tasteEngine: string;
  shadcn: string;
  description: string;
}

export interface MappedTokens {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}

export interface TailwindThemeExtension {
  colors?: Record<string, string | Record<string, string>>;
  fontFamily?: Record<string, string[]>;
  borderRadius?: Record<string, string>;
  boxShadow?: Record<string, string>;
  spacing?: Record<string, string>;
}

// =============================================================================
// COLOR MAPPINGS
// =============================================================================

/**
 * Core color mappings between taste-engine and shadcn
 */
export const COLOR_MAPPINGS: TokenMapping[] = [
  // Background colors
  { tasteEngine: '--taste-bg', shadcn: '--background', description: 'Main background' },
  { tasteEngine: '--taste-bg-secondary', shadcn: '--muted', description: 'Secondary background' },
  { tasteEngine: '--taste-surface', shadcn: '--card', description: 'Surface/card background' },

  // Text colors
  { tasteEngine: '--taste-text', shadcn: '--foreground', description: 'Primary text' },
  { tasteEngine: '--taste-text-muted', shadcn: '--muted-foreground', description: 'Muted text' },

  // Accent colors
  { tasteEngine: '--taste-accent', shadcn: '--primary', description: 'Primary accent' },
  { tasteEngine: '--taste-accent-text', shadcn: '--primary-foreground', description: 'Text on accent' },

  // Border colors
  { tasteEngine: '--taste-border', shadcn: '--border', description: 'Border color' },
  { tasteEngine: '--taste-border-subtle', shadcn: '--input', description: 'Input border' },

  // Additional mappings
  { tasteEngine: '--taste-success', shadcn: '--success', description: 'Success color' },
  { tasteEngine: '--taste-warning', shadcn: '--warning', description: 'Warning color' },
  { tasteEngine: '--taste-error', shadcn: '--destructive', description: 'Error/destructive color' },
  { tasteEngine: '--taste-info', shadcn: '--accent', description: 'Info/accent color' },
];

/**
 * shadcn CSS variable structure (HSL values)
 */
export const SHADCN_CSS_VARIABLES = {
  // Core colors
  '--background': '0 0% 100%',
  '--foreground': '240 10% 3.9%',
  '--card': '0 0% 100%',
  '--card-foreground': '240 10% 3.9%',
  '--popover': '0 0% 100%',
  '--popover-foreground': '240 10% 3.9%',
  '--primary': '240 5.9% 10%',
  '--primary-foreground': '0 0% 98%',
  '--secondary': '240 4.8% 95.9%',
  '--secondary-foreground': '240 5.9% 10%',
  '--muted': '240 4.8% 95.9%',
  '--muted-foreground': '240 3.8% 46.1%',
  '--accent': '240 4.8% 95.9%',
  '--accent-foreground': '240 5.9% 10%',
  '--destructive': '0 84.2% 60.2%',
  '--destructive-foreground': '0 0% 98%',
  '--border': '240 5.9% 90%',
  '--input': '240 5.9% 90%',
  '--ring': '240 5.9% 10%',

  // Chart colors
  '--chart-1': '12 76% 61%',
  '--chart-2': '173 58% 39%',
  '--chart-3': '197 37% 24%',
  '--chart-4': '43 74% 66%',
  '--chart-5': '27 87% 67%',

  // Radius
  '--radius': '0.5rem',
} as const;

/**
 * shadcn dark mode CSS variables
 */
export const SHADCN_DARK_VARIABLES = {
  '--background': '240 10% 3.9%',
  '--foreground': '0 0% 98%',
  '--card': '240 10% 3.9%',
  '--card-foreground': '0 0% 98%',
  '--popover': '240 10% 3.9%',
  '--popover-foreground': '0 0% 98%',
  '--primary': '0 0% 98%',
  '--primary-foreground': '240 5.9% 10%',
  '--secondary': '240 3.7% 15.9%',
  '--secondary-foreground': '0 0% 98%',
  '--muted': '240 3.7% 15.9%',
  '--muted-foreground': '240 5% 64.9%',
  '--accent': '240 3.7% 15.9%',
  '--accent-foreground': '0 0% 98%',
  '--destructive': '0 62.8% 30.6%',
  '--destructive-foreground': '0 0% 98%',
  '--border': '240 3.7% 15.9%',
  '--input': '240 3.7% 15.9%',
  '--ring': '240 4.9% 83.9%',
} as const;

// =============================================================================
// MAPPER CLASS
// =============================================================================

export class ShadcnTokenMapper {
  private config: ShadcnConfig;

  constructor(config: ShadcnConfig) {
    this.config = config;
  }

  /**
   * Map taste-engine tokens to shadcn CSS variables
   */
  mapToShadcn(tasteTokens: Record<string, string>): Record<string, string> {
    const mapped: Record<string, string> = {};

    for (const mapping of COLOR_MAPPINGS) {
      if (tasteTokens[mapping.tasteEngine]) {
        const hexColor = tasteTokens[mapping.tasteEngine];
        mapped[mapping.shadcn] = this.hexToHsl(hexColor);
      }
    }

    return mapped;
  }

  /**
   * Map shadcn CSS variables to taste-engine tokens
   */
  mapFromShadcn(shadcnTokens: Record<string, string>): Record<string, string> {
    const mapped: Record<string, string> = {};

    for (const mapping of COLOR_MAPPINGS) {
      if (shadcnTokens[mapping.shadcn]) {
        const hslValue = shadcnTokens[mapping.shadcn];
        mapped[mapping.tasteEngine] = this.hslToHex(hslValue);
      }
    }

    return mapped;
  }

  /**
   * Generate CSS variables from InspirationProfile for shadcn
   */
  profileToShadcnVariables(profile: InspirationProfile): {
    light: Record<string, string>;
    dark: Record<string, string>;
  } {
    const light: Record<string, string> = {
      '--background': this.hexToHsl(profile.colors.background.light),
      '--foreground': this.hexToHsl(profile.colors.foreground.light),
      '--card': this.hexToHsl(profile.colors.surface.light),
      '--card-foreground': this.hexToHsl(profile.colors.foreground.light),
      '--popover': this.hexToHsl(profile.colors.surface.light),
      '--popover-foreground': this.hexToHsl(profile.colors.foreground.light),
      '--primary': this.hexToHsl(profile.colors.primary),
      '--primary-foreground': this.hexToHsl(profile.colors.primaryForeground),
      '--secondary': this.hexToHsl(profile.colors.secondary),
      '--secondary-foreground': this.hexToHsl(profile.colors.secondaryForeground),
      '--muted': this.hexToHsl(profile.colors.muted.light),
      '--muted-foreground': this.hexToHsl(profile.colors.mutedForeground.light),
      '--accent': this.hexToHsl(profile.colors.accent),
      '--accent-foreground': this.hexToHsl(profile.colors.accentForeground),
      '--destructive': '0 84.2% 60.2%',
      '--destructive-foreground': '0 0% 98%',
      '--border': this.hexToHsl(profile.colors.border.light),
      '--input': this.hexToHsl(profile.colors.border.light),
      '--ring': this.hexToHsl(profile.colors.primary),
      '--radius': this.getRadiusValue(profile.componentStyles.borderRadius),
    };

    const dark: Record<string, string> = {
      '--background': this.hexToHsl(profile.colors.background.dark),
      '--foreground': this.hexToHsl(profile.colors.foreground.dark),
      '--card': this.hexToHsl(profile.colors.surface.dark),
      '--card-foreground': this.hexToHsl(profile.colors.foreground.dark),
      '--popover': this.hexToHsl(profile.colors.surface.dark),
      '--popover-foreground': this.hexToHsl(profile.colors.foreground.dark),
      '--primary': this.hexToHsl(profile.colors.primary),
      '--primary-foreground': this.hexToHsl(profile.colors.primaryForeground),
      '--secondary': this.hexToHsl(profile.colors.muted.dark),
      '--secondary-foreground': this.hexToHsl(profile.colors.foreground.dark),
      '--muted': this.hexToHsl(profile.colors.muted.dark),
      '--muted-foreground': this.hexToHsl(profile.colors.mutedForeground.dark),
      '--accent': this.hexToHsl(profile.colors.accent),
      '--accent-foreground': this.hexToHsl(profile.colors.accentForeground),
      '--destructive': '0 62.8% 30.6%',
      '--destructive-foreground': '0 0% 98%',
      '--border': this.hexToHsl(profile.colors.border.dark),
      '--input': this.hexToHsl(profile.colors.border.dark),
      '--ring': this.hexToHsl(profile.colors.primary),
      '--radius': this.getRadiusValue(profile.componentStyles.borderRadius),
    };

    return { light, dark };
  }

  /**
   * Generate Tailwind theme extension from profile
   */
  profileToTailwindExtension(profile: InspirationProfile): TailwindThemeExtension {
    return {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: profile.typography.bodyFont,
        heading: profile.typography.headingFont,
        mono: profile.typography.monoFont,
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    };
  }

  /**
   * Generate CSS string from variables
   */
  generateCssString(variables: Record<string, string>, selector: string = ':root'): string {
    const lines = Object.entries(variables)
      .map(([key, value]) => `    ${key}: ${value};`)
      .join('\n');

    return `${selector} {\n${lines}\n}`;
  }

  /**
   * Generate full CSS with light and dark mode
   */
  generateFullCss(profile: InspirationProfile): string {
    const { light, dark } = this.profileToShadcnVariables(profile);

    const lightCss = this.generateCssString(light, ':root');
    const darkCss = this.generateCssString(dark, '.dark');

    return `${lightCss}\n\n${darkCss}`;
  }

  // =============================================================================
  // COLOR CONVERSION UTILITIES
  // =============================================================================

  /**
   * Convert hex color to HSL string (for CSS variable)
   */
  private hexToHsl(hex: string): string {
    if (!hex || !hex.startsWith('#')) {
      return '0 0% 0%';
    }

    // Remove # and parse
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    let h = 0;
    let s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    // Return HSL without hsl() wrapper - shadcn uses raw values
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  }

  /**
   * Convert HSL string to hex color
   */
  private hslToHex(hsl: string): string {
    // Parse "h s% l%" format
    const parts = hsl.split(/\s+/);
    if (parts.length < 3) return '#000000';

    const h = parseInt(parts[0]) / 360;
    const s = parseInt(parts[1]) / 100;
    const l = parseInt(parts[2]) / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /**
   * Get CSS radius value from component style
   */
  private getRadiusValue(radius: string): string {
    const radiusMap: Record<string, string> = {
      'none': '0',
      'sm': '0.25rem',
      'md': '0.5rem',
      'lg': '0.75rem',
      'xl': '1rem',
      'full': '9999px',
    };
    return radiusMap[radius] || '0.5rem';
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create a mapper from shadcn config
 */
export function createMapper(config: ShadcnConfig): ShadcnTokenMapper {
  return new ShadcnTokenMapper(config);
}

/**
 * Get Tailwind class for a taste-engine token
 */
export function getTailwindClass(token: string): string {
  const classMap: Record<string, string> = {
    '--taste-bg': 'bg-background',
    '--taste-text': 'text-foreground',
    '--taste-accent': 'bg-primary text-primary-foreground',
    '--taste-surface': 'bg-card',
    '--taste-border': 'border-border',
    '--taste-text-muted': 'text-muted-foreground',
  };
  return classMap[token] || '';
}

/**
 * Generate shadcn-compatible class names for common patterns
 */
export function getShadcnClasses(pattern: string): string {
  const patterns: Record<string, string> = {
    'card': 'rounded-lg border bg-card text-card-foreground shadow-sm',
    'button-primary': 'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90',
    'button-secondary': 'inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80',
    'button-ghost': 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
    'button-outline': 'inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
    'input': 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'label': 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    'heading-1': 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    'heading-2': 'scroll-m-20 text-3xl font-semibold tracking-tight',
    'heading-3': 'scroll-m-20 text-2xl font-semibold tracking-tight',
    'paragraph': 'leading-7 [&:not(:first-child)]:mt-6',
    'muted': 'text-sm text-muted-foreground',
  };
  return patterns[pattern] || '';
}
