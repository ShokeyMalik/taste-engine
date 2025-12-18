/**
 * Theme Engine - Core Context-Aware Design Transformer
 *
 * The key insight: same primitives, different behavior based on page intent.
 * - product: dense, operational, restrained accent
 * - marketing: expressive, narrative, accent can breathe
 */

import type {
  ThemePack,
  ThemeTokens,
  ThemeRecipes,
  ThemeMode,
  PageContext,
  ProductRecipes,
  MarketingRecipes,
  MediaRecipes,
  MotionRecipes,
  ContextRecipes,
  LegacyRecipes,
} from './types';

// =============================================================================
// DEFAULT RECIPES
// =============================================================================

/**
 * Default Media recipes for product context
 */
function getProductMediaRecipes(mode: ThemeMode): MediaRecipes {
  return {
    icon: {
      defaultSize: 16,
      compactSize: 14,
      largeSize: 24,
      strokeWidth: 1.5,
      mutedOpacity: '0.5',
      colorMode: 'currentColor',
    },
    placeholder: {
      style: 'skeleton',
      shimmer: true,
      shimmerDirection: 'ltr',
      baseColor: mode === 'dark' ? 'surface-inset' : 'surface-2',
      highlightColor: mode === 'dark' ? 'surface' : 'surface',
      borderRadius: 'var(--ds-radius-control)',
    },
    backgroundMotif: {
      heroMotif: 'none',
      motifOpacity: '0',
      motifColor: 'border',
    },
  };
}

/**
 * Default Media recipes for marketing context
 */
function getMarketingMediaRecipes(mode: ThemeMode): MediaRecipes {
  return {
    icon: {
      defaultSize: 20,
      compactSize: 16,
      largeSize: 32,
      strokeWidth: 1.5,
      mutedOpacity: '0.6',
      colorMode: 'accent',
    },
    placeholder: {
      style: mode === 'dark' ? 'blur' : 'skeleton',
      shimmer: mode !== 'dark',
      shimmerDirection: 'ltr',
      baseColor: mode === 'dark' ? 'surface/50' : 'surface-2',
      highlightColor: mode === 'dark' ? 'accent/10' : 'surface',
      borderRadius: 'var(--ds-radius-surface)',
    },
    backgroundMotif: {
      heroMotif: mode === 'dark' ? 'radialGlow' : 'dots',
      motifSpacing: '32px',
      motifOpacity: mode === 'dark' ? '0.15' : '0.08',
      motifColor: mode === 'dark' ? 'accent' : 'border',
    },
  };
}

/**
 * Default Motion recipes for product context
 */
function getProductMotionRecipes(): MotionRecipes {
  return {
    durations: {
      instant: 50,
      fast: 150,
      normal: 200,
      slow: 300,
      deliberate: 500,
    },
    easings: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      enter: 'cubic-bezier(0, 0, 0.2, 1)',
      exit: 'cubic-bezier(0.4, 0, 1, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    behavior: {
      enabled: true,
      loadingStyle: 'shimmer',
      hoverTransition: 'fast',
      entranceAnimation: 'none',
      staggerDelay: 0,
    },
  };
}

/**
 * Default Motion recipes for marketing context
 */
function getMarketingMotionRecipes(): MotionRecipes {
  return {
    durations: {
      instant: 50,
      fast: 200,
      normal: 300,
      slow: 500,
      deliberate: 800,
    },
    easings: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      enter: 'cubic-bezier(0.22, 1, 0.36, 1)',
      exit: 'cubic-bezier(0.4, 0, 1, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    behavior: {
      enabled: true,
      loadingStyle: 'pulse',
      hoverTransition: 'normal',
      entranceAnimation: 'slideUp',
      staggerDelay: 50,
    },
  };
}

/**
 * Default Narrative recipes for marketing context
 */
function getMarketingNarrativeRecipes(mode: ThemeMode) {
  const isDark = mode === 'dark';

  return {
    motifs: {
      layers: [
        {
          type: 'grid' as const,
          opacity: isDark ? 0.03 : 0.02,
          color: isDark ? 'accent' : 'border',
          scale: 1,
          animate: 'none' as const,
          zIndex: 0,
        },
        {
          type: 'glowField' as const,
          opacity: isDark ? 0.15 : 0.08,
          color: 'accent',
          blur: 120,
          scale: 1.5,
          animate: 'breathe' as const,
          zIndex: 1,
        },
        {
          type: 'noise' as const,
          opacity: isDark ? 0.02 : 0.015,
          color: 'text',
          scale: 1,
          animate: 'none' as const,
          zIndex: 2,
        },
      ],
      intensity: 1,
      audienceOverrides: {
        'hotel-owner': [
          { type: 'glowField' as const, opacity: isDark ? 0.18 : 0.1, color: 'accent' },
        ],
        'developer': [
          { type: 'grid' as const, opacity: isDark ? 0.05 : 0.03 },
          { type: 'signalPaths' as const, opacity: isDark ? 0.08 : 0.04, color: 'accent' },
        ],
      },
    },

    storyboard: {
      sections: [
        { type: 'hero' as const, id: 'hero', motion: 'fadeUp' as const, withMotifs: true, signatureBlock: 'SignalPathGraphic' as const },
        { type: 'narrative2' as const, id: 'narrative', motion: 'fadeUp' as const, withMotifs: false, signatureBlock: null },
        { type: 'proof3' as const, id: 'proof', motion: 'fadeUp' as const, withMotifs: false, signatureBlock: null },
        { type: 'banner' as const, id: 'metrics', motion: 'slideIn' as const, withMotifs: false, signatureBlock: 'MetricRibbon' as const },
        { type: 'stackedCards' as const, id: 'cards', motion: 'fadeUp' as const, withMotifs: false, signatureBlock: 'StackedCards' as const },
        { type: 'cta' as const, id: 'cta', motion: 'fadeUp' as const, withMotifs: true, signatureBlock: null },
      ],
      audienceOverrides: {
        'hotel-owner': ['hero', 'narrative', 'metrics', 'proof', 'cards', 'cta'],
        'developer': ['hero', 'proof', 'narrative', 'cards', 'metrics', 'cta'],
      },
    },

    signatureBlocks: {
      signalPath: true,
      stackedCards: true,
      metricRibbon: true,
      signalPathConfig: {
        strokeColor: 'accent',
        strokeOpacity: isDark ? 0.4 : 0.25,
        strokeWidth: 1.5,
        nodeColor: 'accent',
        nodeGlow: isDark,
        blur: isDark ? 8 : 4,
        gradient: {
          from: 'accent',
          to: 'accent-secondary',
          direction: '135deg',
        },
        animateOnScroll: true,
        complexity: 'medium' as const,
      },
      stackedCardsConfig: {
        rotationRange: 6,
        shadowDepth: isDark ? 'dramatic' as const : 'medium' as const,
        borderStyle: 'subtle' as const,
        hoverEffect: 'lift' as const,
        visibleCards: 3,
        stackDirection: 'right' as const,
      },
      metricRibbonConfig: {
        background: isDark ? 'surface' as const : 'accent-muted' as const,
        separator: 'line' as const,
        valueStyle: isDark ? 'gradient' as const : 'bold' as const,
        labelStyle: 'muted' as const,
        count: 4 as const,
      },
    },

    motionBindings: {
      hero: {
        entrance: 'fadeUp' as const,
        motifAnimation: 'breathe' as const,
      },
      features: {
        entrance: 'stagger' as const,
        staggerDelay: 100,
      },
      signatureBlocks: {
        signalPath: 'draw' as const,
        stackedCards: 'cascade' as const,
        metricRibbon: 'countUp' as const,
      },
    },
  };
}

// =============================================================================
// THEME NORMALIZATION
// =============================================================================

/**
 * Transform legacy theme packs to new structure
 */
export function normalizeThemePack(raw: Partial<ThemePack> & { name: string; mode: ThemeMode; tokens: ThemeTokens }): ThemePack {
  // If already has product/marketing structure, use as-is
  if (raw.recipes && 'product' in raw.recipes && 'marketing' in raw.recipes) {
    return raw as ThemePack;
  }

  // Legacy format: wrap existing recipes as product, generate marketing defaults
  const productRecipes = raw.recipes as Omit<ProductRecipes, 'media' | 'motion'>;
  const mode = raw.mode;

  // Build complete product recipes with media/motion
  const fullProductRecipes: ProductRecipes = {
    ...productRecipes,
    media: getProductMediaRecipes(mode),
    motion: getProductMotionRecipes(),
  };

  const marketingRecipes: MarketingRecipes = {
    AppShell: {
      ...productRecipes.AppShell,
      backgroundTreatment: productRecipes.AppShell?.backgroundTreatment === 'chronicle' ? 'chronicle' : 'none',
    },
    Surface: {
      default: {
        ...productRecipes.Surface?.default,
        border: false,
        gradient: true,
      },
      hero: {
        border: false,
        borderOpacity: '0',
        shadow: false,
        gradient: true,
        gradientDirection: 'to bottom',
        background: 'transparent',
      },
      feature: {
        ...productRecipes.Surface?.floating,
        gradient: false,
      },
    },
    Hero: {
      titleSize: '3.5rem',
      titleWeight: '700',
      titleTracking: '-0.03em',
      titleMaxWidth: '800px',
      subtitleSize: '1.25rem',
      subtitleOpacity: '0.7',
      subtitleMaxWidth: '600px',
      spacing: {
        paddingY: '80px',
        gap: '24px',
      },
      accentGradient: mode === 'dark',
    },
    SectionHeader: {
      ...productRecipes.SectionHeader,
      style: 'centered',
      titleSize: '2.5rem',
      spacing: {
        top: '0',
        bottom: '48px',
      },
    },
    FeatureCard: {
      style: mode === 'dark' ? 'glass' : 'elevated',
      iconStyle: 'accent',
      hoverEffect: 'lift',
    },
    AccentUsage: {
      gradientAllowed: true,
      textEmphasisAllowed: true,
      backgroundGradient: mode === 'dark'
        ? `linear-gradient(135deg, hsl(${raw.tokens.accent} / 0.15), transparent)`
        : `linear-gradient(135deg, hsl(${raw.tokens.accentMuted}), transparent)`,
    },
    LayoutRhythm: {
      sectionGap: '120px',
      heroBottomGap: '80px',
      featureGap: '32px',
    },
    media: getMarketingMediaRecipes(mode),
    motion: getMarketingMotionRecipes(),
    ...getMarketingNarrativeRecipes(mode),
  };

  return {
    name: raw.name,
    mode: raw.mode,
    tokens: raw.tokens,
    recipes: {
      product: fullProductRecipes,
      marketing: marketingRecipes,
    },
  };
}

// =============================================================================
// THEME ENGINE CLASS
// =============================================================================

/**
 * Theme Engine - manages theme packs and context-aware recipe resolution
 */
export class ThemeEngine {
  private themes: Map<string, ThemePack> = new Map();
  private currentTheme: ThemePack | null = null;
  private currentContext: PageContext = 'product';

  /**
   * Register a theme pack
   */
  registerTheme(raw: Partial<ThemePack> & { name: string; mode: ThemeMode; tokens: ThemeTokens }): void {
    const normalized = normalizeThemePack(raw);
    const key = normalized.name.toLowerCase().replace(/\s+/g, '-');
    this.themes.set(key, normalized);
  }

  /**
   * Get list of available theme names
   */
  getAvailableThemes(): string[] {
    return Array.from(this.themes.keys());
  }

  /**
   * Load a theme pack by name
   */
  loadTheme(name: string): ThemePack | null {
    const key = name.toLowerCase().replace(/\s+/g, '-');
    const theme = this.themes.get(key);
    if (!theme) {
      console.warn(`Theme "${name}" not found. Available: ${this.getAvailableThemes().join(', ')}`);
      return null;
    }
    return theme;
  }

  /**
   * Get the current active theme
   */
  getCurrentTheme(): ThemePack | null {
    return this.currentTheme;
  }

  /**
   * Get current context
   */
  getCurrentContext(): PageContext {
    return this.currentContext;
  }

  /**
   * Get recipes for a specific context
   */
  getRecipesForContext(theme: ThemePack, context: PageContext): ContextRecipes {
    const recipes = theme.recipes as ThemeRecipes;

    // If legacy format (no product/marketing), return as-is (treated as product)
    if (!recipes.product && !recipes.marketing) {
      return recipes as unknown as ProductRecipes;
    }

    return context === 'marketing' ? recipes.marketing : recipes.product;
  }

  /**
   * Apply a theme pack to the document
   */
  applyTheme(theme: ThemePack, context: PageContext = 'product'): void {
    this.currentTheme = theme;
    this.currentContext = context;

    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Set theme mode and context
    root.setAttribute('data-theme', theme.name.toLowerCase().replace(/\s+/g, '-'));
    root.setAttribute('data-theme-mode', theme.mode);
    root.setAttribute('data-context', context);

    // Apply dark/light class for Tailwind
    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply color tokens as CSS variables
    const { tokens } = theme;

    // Core colors (HSL values)
    root.style.setProperty('--ds-bg', tokens.bg);
    root.style.setProperty('--ds-surface', tokens.surface);
    root.style.setProperty('--ds-surface-2', tokens.surface2);
    root.style.setProperty('--ds-surface-inset', tokens.surfaceInset);
    root.style.setProperty('--ds-border', tokens.border);
    root.style.setProperty('--ds-border-subtle', tokens.borderSubtle);
    root.style.setProperty('--ds-text', tokens.text);
    root.style.setProperty('--ds-text-muted', tokens.textMuted);
    root.style.setProperty('--ds-accent', tokens.accent);
    root.style.setProperty('--ds-accent-foreground', tokens.accentFg);
    root.style.setProperty('--ds-accent-muted', tokens.accentMuted);
    root.style.setProperty('--ds-accent-secondary', tokens.accentSecondary);
    root.style.setProperty('--ds-ring', tokens.ring);

    // Semantic colors
    root.style.setProperty('--ds-success', tokens.success);
    root.style.setProperty('--ds-success-muted', tokens.successMuted);
    root.style.setProperty('--ds-warning', tokens.warning);
    root.style.setProperty('--ds-warning-muted', tokens.warningMuted);
    root.style.setProperty('--ds-danger', tokens.danger);
    root.style.setProperty('--ds-danger-muted', tokens.dangerMuted);

    // Shadows
    root.style.setProperty('--ds-shadow-surface', tokens.shadowSurface);
    root.style.setProperty('--ds-shadow-popover', tokens.shadowPopover);
    root.style.setProperty('--ds-shadow-glow', tokens.shadowGlow);

    // Radii
    root.style.setProperty('--ds-radius-surface', tokens.radiusSurface);
    root.style.setProperty('--ds-radius-control', tokens.radiusControl);

    // Type scale
    Object.entries(tokens.typeScale).forEach(([key, value]) => {
      root.style.setProperty(`--ds-type-${key}-size`, value.fontSize);
      root.style.setProperty(`--ds-type-${key}-weight`, value.fontWeight);
      root.style.setProperty(`--ds-type-${key}-tracking`, value.letterSpacing);
      root.style.setProperty(`--ds-type-${key}-leading`, value.lineHeight);
      if (value.textTransform) {
        root.style.setProperty(`--ds-type-${key}-transform`, value.textTransform);
      }
    });

    // Density
    Object.entries(tokens.density).forEach(([key, value]) => {
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--ds-density-${kebabKey}`, value);
    });

    // Dispatch event for components that need to react
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme, context } }));
    }

    console.log(`[TasteEngine] Applied: ${theme.name} (${theme.mode} mode, ${context} context)`);
  }

  /**
   * Initialize theme from URL query param or default
   */
  initThemeFromUrl(
    defaultTheme: string = 'chronicle-dark',
    defaultContext: PageContext = 'product'
  ): { theme: ThemePack; context: PageContext } | null {
    if (typeof window === 'undefined') return null;

    const params = new URLSearchParams(window.location.search);
    const themeName = params.get('theme') || defaultTheme;
    const contextParam = params.get('context') as PageContext;
    const context = (contextParam === 'product' || contextParam === 'marketing') ? contextParam : defaultContext;

    const theme = this.loadTheme(themeName) || this.loadTheme(defaultTheme);
    if (!theme) return null;

    this.applyTheme(theme, context);
    return { theme, context };
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

/**
 * Default theme engine instance
 */
export const themeEngine = new ThemeEngine();

// =============================================================================
// EXPORTS
// =============================================================================

export {
  getProductMediaRecipes,
  getMarketingMediaRecipes,
  getProductMotionRecipes,
  getMarketingMotionRecipes,
  getMarketingNarrativeRecipes,
};
