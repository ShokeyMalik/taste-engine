/**
 * Inspiration Scanner & Pattern Learner
 *
 * The CORRECT approach: Learn from EXTERNAL inspirations,
 * then apply those patterns to YOUR codebase.
 *
 * Flow:
 * 1. User provides inspiration sources (URLs, screenshots, brand names)
 * 2. We analyze those sources to extract their design language
 * 3. We create a "learned taste profile" from the inspirations
 * 4. We generate transformation plans for the user's existing code
 */

// =============================================================================
// TYPES
// =============================================================================

export interface InspirationSource {
  type: 'url' | 'screenshot' | 'brand' | 'description';
  value: string;
  weight?: number; // 0-1, how much to weight this inspiration
}

export interface ExtractedDesignLanguage {
  source: InspirationSource;

  // Visual characteristics
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
    background: string[];
    text: string[];
    gradients: string[];
  };

  // Spacing system
  spacing: {
    scale: 'tight' | 'comfortable' | 'spacious';
    baseUnit: number; // in px (4, 8, etc.)
    patterns: string[]; // e.g., "p-6", "gap-4"
  };

  // Typography
  typography: {
    headingStyle: 'bold' | 'medium' | 'light';
    bodySize: 'sm' | 'base' | 'lg';
    tracking: 'tight' | 'normal' | 'wide';
    fontStack: string[];
  };

  // Component patterns
  components: {
    buttonStyle: 'solid' | 'outline' | 'ghost' | 'gradient';
    cardStyle: 'flat' | 'elevated' | 'bordered' | 'glass';
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    shadows: 'none' | 'subtle' | 'medium' | 'dramatic';
  };

  // Motion
  motion: {
    level: 'minimal' | 'subtle' | 'expressive';
    duration: number; // ms
    easing: string;
  };

  // Overall feel
  mood: {
    formality: 'playful' | 'balanced' | 'professional';
    density: 'sparse' | 'balanced' | 'dense';
    contrast: 'low' | 'medium' | 'high';
  };
}

export interface LearnedTasteProfile {
  name: string;
  sources: InspirationSource[];
  extractedAt: string;

  // Merged design language from all sources
  designLanguage: {
    // Color tokens
    colors: {
      '--taste-bg': string;
      '--taste-bg-secondary': string;
      '--taste-surface': string;
      '--taste-surface-elevated': string;
      '--taste-border': string;
      '--taste-text': string;
      '--taste-text-muted': string;
      '--taste-accent': string;
      '--taste-accent-hover': string;
    };

    // Spacing tokens
    spacing: {
      '--taste-space-xs': string;
      '--taste-space-sm': string;
      '--taste-space-md': string;
      '--taste-space-lg': string;
      '--taste-space-xl': string;
      '--taste-space-2xl': string;
    };

    // Typography tokens
    typography: {
      '--taste-font-heading': string;
      '--taste-font-body': string;
      '--taste-text-xs': string;
      '--taste-text-sm': string;
      '--taste-text-base': string;
      '--taste-text-lg': string;
      '--taste-text-xl': string;
      '--taste-text-2xl': string;
      '--taste-tracking': string;
      '--taste-leading': string;
    };

    // Component tokens
    components: {
      '--taste-radius-sm': string;
      '--taste-radius-md': string;
      '--taste-radius-lg': string;
      '--taste-shadow-sm': string;
      '--taste-shadow-md': string;
      '--taste-shadow-lg': string;
      '--taste-transition': string;
    };
  };

  // Tailwind class recipes
  recipes: {
    button: {
      primary: string;
      secondary: string;
      ghost: string;
    };
    card: {
      base: string;
      elevated: string;
      interactive: string;
    };
    surface: {
      base: string;
      inset: string;
      overlay: string;
    };
    text: {
      heading: string;
      subheading: string;
      body: string;
      muted: string;
    };
    layout: {
      container: string;
      section: string;
      grid: string;
    };
  };

  // Tuner values (for compatibility)
  tuners: {
    abstraction: number;
    density: number;
    motion: number;
    contrast: number;
    narrative: number;
  };
}

export interface TransformationPlan {
  targetFile: string;
  currentAnalysis: {
    components: number;
    tailwindClasses: string[];
    issues: string[];
  };
  transformations: Transformation[];
  preview: string; // Generated code preview
}

export interface Transformation {
  type: 'replace-class' | 'add-class' | 'remove-class' | 'wrap-component' | 'restructure';
  location: {
    line: number;
    column: number;
  };
  original: string;
  replacement: string;
  reason: string;
}

// =============================================================================
// KNOWN BRAND PROFILES
// =============================================================================

/**
 * Pre-analyzed design languages from popular products.
 * These serve as starting points that can be customized.
 */
export const KNOWN_BRANDS: Record<string, Partial<ExtractedDesignLanguage>> = {
  linear: {
    colors: {
      primary: ['#5E6AD2'],
      secondary: ['#8B5CF6'],
      accent: ['#5E6AD2', '#8B5CF6'],
      background: ['#0D0D0D', '#111111', '#1A1A1A'],
      text: ['#FFFFFF', '#A3A3A3', '#737373'],
      gradients: ['linear-gradient(135deg, #5E6AD2 0%, #8B5CF6 100%)'],
    },
    spacing: {
      scale: 'comfortable',
      baseUnit: 4,
      patterns: ['p-4', 'p-6', 'gap-3', 'gap-4', 'space-y-4'],
    },
    typography: {
      headingStyle: 'medium',
      bodySize: 'sm',
      tracking: 'tight',
      fontStack: ['Inter', 'system-ui', 'sans-serif'],
    },
    components: {
      buttonStyle: 'solid',
      cardStyle: 'bordered',
      borderRadius: 'md',
      shadows: 'subtle',
    },
    motion: {
      level: 'subtle',
      duration: 200,
      easing: 'ease-out',
    },
    mood: {
      formality: 'professional',
      density: 'balanced',
      contrast: 'high',
    },
  },

  stripe: {
    colors: {
      primary: ['#635BFF'],
      secondary: ['#00D4FF', '#7A73FF'],
      accent: ['#635BFF', '#00D4FF'],
      background: ['#0A2540', '#1A1F36', '#FFFFFF'],
      text: ['#FFFFFF', '#425466', '#0A2540'],
      gradients: [
        'linear-gradient(135deg, #635BFF 0%, #00D4FF 100%)',
        'linear-gradient(180deg, #0A2540 0%, #1A1F36 100%)',
      ],
    },
    spacing: {
      scale: 'spacious',
      baseUnit: 8,
      patterns: ['p-6', 'p-8', 'gap-6', 'gap-8', 'space-y-6'],
    },
    typography: {
      headingStyle: 'bold',
      bodySize: 'base',
      tracking: 'normal',
      fontStack: ['Söhne', 'system-ui', 'sans-serif'],
    },
    components: {
      buttonStyle: 'gradient',
      cardStyle: 'elevated',
      borderRadius: 'lg',
      shadows: 'medium',
    },
    motion: {
      level: 'expressive',
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    mood: {
      formality: 'professional',
      density: 'sparse',
      contrast: 'medium',
    },
  },

  vercel: {
    colors: {
      primary: ['#000000'],
      secondary: ['#666666'],
      accent: ['#0070F3', '#7928CA'],
      background: ['#000000', '#111111', '#FAFAFA'],
      text: ['#FFFFFF', '#888888', '#000000'],
      gradients: ['linear-gradient(135deg, #0070F3 0%, #7928CA 100%)'],
    },
    spacing: {
      scale: 'spacious',
      baseUnit: 8,
      patterns: ['p-6', 'p-8', 'p-12', 'gap-4', 'gap-8'],
    },
    typography: {
      headingStyle: 'bold',
      bodySize: 'base',
      tracking: 'tight',
      fontStack: ['Inter', 'system-ui', 'sans-serif'],
    },
    components: {
      buttonStyle: 'solid',
      cardStyle: 'bordered',
      borderRadius: 'md',
      shadows: 'none',
    },
    motion: {
      level: 'minimal',
      duration: 150,
      easing: 'ease',
    },
    mood: {
      formality: 'professional',
      density: 'sparse',
      contrast: 'high',
    },
  },

  notion: {
    colors: {
      primary: ['#000000'],
      secondary: ['#37352F'],
      accent: ['#2383E2', '#EB5757'],
      background: ['#FFFFFF', '#F7F6F3', '#FBFBFA'],
      text: ['#37352F', '#787774', '#9B9A97'],
      gradients: [],
    },
    spacing: {
      scale: 'comfortable',
      baseUnit: 4,
      patterns: ['p-3', 'p-4', 'gap-2', 'gap-3', 'space-y-2'],
    },
    typography: {
      headingStyle: 'bold',
      bodySize: 'base',
      tracking: 'normal',
      fontStack: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    components: {
      buttonStyle: 'ghost',
      cardStyle: 'flat',
      borderRadius: 'sm',
      shadows: 'none',
    },
    motion: {
      level: 'minimal',
      duration: 100,
      easing: 'ease',
    },
    mood: {
      formality: 'balanced',
      density: 'dense',
      contrast: 'low',
    },
  },

  github: {
    colors: {
      primary: ['#238636'],
      secondary: ['#1F6FEB'],
      accent: ['#238636', '#1F6FEB', '#8957E5'],
      background: ['#0D1117', '#161B22', '#21262D'],
      text: ['#F0F6FC', '#8B949E', '#6E7681'],
      gradients: [],
    },
    spacing: {
      scale: 'tight',
      baseUnit: 4,
      patterns: ['p-2', 'p-3', 'p-4', 'gap-2', 'gap-3'],
    },
    typography: {
      headingStyle: 'bold',
      bodySize: 'sm',
      tracking: 'normal',
      fontStack: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    },
    components: {
      buttonStyle: 'solid',
      cardStyle: 'bordered',
      borderRadius: 'md',
      shadows: 'subtle',
    },
    motion: {
      level: 'minimal',
      duration: 150,
      easing: 'ease-in-out',
    },
    mood: {
      formality: 'professional',
      density: 'dense',
      contrast: 'medium',
    },
  },

  airbnb: {
    colors: {
      primary: ['#FF385C'],
      secondary: ['#00A699', '#FC642D'],
      accent: ['#FF385C', '#00A699'],
      background: ['#FFFFFF', '#F7F7F7'],
      text: ['#222222', '#717171', '#B0B0B0'],
      gradients: [],
    },
    spacing: {
      scale: 'spacious',
      baseUnit: 8,
      patterns: ['p-4', 'p-6', 'p-8', 'gap-4', 'gap-6'],
    },
    typography: {
      headingStyle: 'bold',
      bodySize: 'base',
      tracking: 'normal',
      fontStack: ['Circular', 'system-ui', 'sans-serif'],
    },
    components: {
      buttonStyle: 'solid',
      cardStyle: 'elevated',
      borderRadius: 'lg',
      shadows: 'medium',
    },
    motion: {
      level: 'subtle',
      duration: 200,
      easing: 'ease-out',
    },
    mood: {
      formality: 'playful',
      density: 'balanced',
      contrast: 'medium',
    },
  },

  apple: {
    colors: {
      primary: ['#0071E3'],
      secondary: ['#86868B'],
      accent: ['#0071E3', '#34C759'],
      background: ['#FFFFFF', '#F5F5F7', '#000000'],
      text: ['#1D1D1F', '#86868B', '#F5F5F7'],
      gradients: [],
    },
    spacing: {
      scale: 'spacious',
      baseUnit: 8,
      patterns: ['p-8', 'p-12', 'p-16', 'gap-6', 'gap-8'],
    },
    typography: {
      headingStyle: 'bold',
      bodySize: 'lg',
      tracking: 'tight',
      fontStack: ['SF Pro Display', 'system-ui', 'sans-serif'],
    },
    components: {
      buttonStyle: 'solid',
      cardStyle: 'flat',
      borderRadius: 'lg',
      shadows: 'subtle',
    },
    motion: {
      level: 'expressive',
      duration: 400,
      easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
    mood: {
      formality: 'professional',
      density: 'sparse',
      contrast: 'high',
    },
  },
};

// =============================================================================
// INSPIRATION SCANNER
// =============================================================================

export class InspirationScanner {
  /**
   * Analyze inspiration sources and extract their design language
   */
  async scan(sources: InspirationSource[]): Promise<ExtractedDesignLanguage[]> {
    const results: ExtractedDesignLanguage[] = [];

    for (const source of sources) {
      let extracted: ExtractedDesignLanguage | null = null;

      switch (source.type) {
        case 'brand':
          extracted = this.extractFromBrand(source);
          break;
        case 'url':
          extracted = await this.extractFromUrl(source);
          break;
        case 'screenshot':
          extracted = await this.extractFromScreenshot(source);
          break;
        case 'description':
          extracted = this.extractFromDescription(source);
          break;
      }

      if (extracted) {
        results.push(extracted);
      }
    }

    return results;
  }

  /**
   * Extract design language from a known brand
   */
  private extractFromBrand(source: InspirationSource): ExtractedDesignLanguage | null {
    const brandName = source.value.toLowerCase();
    const brandData = KNOWN_BRANDS[brandName];

    if (!brandData) {
      console.warn(`Unknown brand: ${source.value}. Available: ${Object.keys(KNOWN_BRANDS).join(', ')}`);
      return null;
    }

    return {
      source,
      colors: brandData.colors || {
        primary: [],
        secondary: [],
        accent: [],
        background: [],
        text: [],
        gradients: [],
      },
      spacing: brandData.spacing || {
        scale: 'comfortable',
        baseUnit: 4,
        patterns: [],
      },
      typography: brandData.typography || {
        headingStyle: 'bold',
        bodySize: 'base',
        tracking: 'normal',
        fontStack: [],
      },
      components: brandData.components || {
        buttonStyle: 'solid',
        cardStyle: 'bordered',
        borderRadius: 'md',
        shadows: 'subtle',
      },
      motion: brandData.motion || {
        level: 'subtle',
        duration: 200,
        easing: 'ease-out',
      },
      mood: brandData.mood || {
        formality: 'balanced',
        density: 'balanced',
        contrast: 'medium',
      },
    };
  }

  /**
   * Extract design language from a URL (fetches and analyzes CSS)
   */
  private async extractFromUrl(source: InspirationSource): Promise<ExtractedDesignLanguage | null> {
    // In a full implementation, this would:
    // 1. Fetch the URL
    // 2. Parse CSS and extract variables
    // 3. Analyze computed styles
    // 4. Extract color palette, spacing patterns, etc.

    // For now, try to match to a known brand by domain
    const url = source.value.toLowerCase();

    for (const [brand, data] of Object.entries(KNOWN_BRANDS)) {
      if (url.includes(brand)) {
        return this.extractFromBrand({ ...source, type: 'brand', value: brand });
      }
    }

    // Return a placeholder that indicates URL analysis is needed
    console.log(`URL analysis for ${source.value} - would fetch and analyze CSS in production`);
    return null;
  }

  /**
   * Extract design language from a screenshot (uses vision analysis)
   */
  private async extractFromScreenshot(source: InspirationSource): Promise<ExtractedDesignLanguage | null> {
    // In a full implementation, this would:
    // 1. Use vision AI to analyze the screenshot
    // 2. Extract dominant colors
    // 3. Detect spacing patterns
    // 4. Identify component styles

    console.log(`Screenshot analysis for ${source.value} - would use vision AI in production`);
    return null;
  }

  /**
   * Extract design language from a natural language description
   */
  private extractFromDescription(source: InspirationSource): ExtractedDesignLanguage {
    const desc = source.value.toLowerCase();

    // Parse description for keywords
    const isDark = desc.includes('dark') || desc.includes('night');
    const isMinimal = desc.includes('minimal') || desc.includes('clean');
    const isPremium = desc.includes('premium') || desc.includes('luxury');
    const isPlayful = desc.includes('playful') || desc.includes('fun');
    const isDense = desc.includes('dense') || desc.includes('compact');
    const isAnimated = desc.includes('animated') || desc.includes('motion');

    return {
      source,
      colors: {
        primary: isDark ? ['#6366F1'] : ['#3B82F6'],
        secondary: ['#8B5CF6'],
        accent: isPremium ? ['#F59E0B'] : ['#10B981'],
        background: isDark ? ['#0F0F0F', '#171717', '#262626'] : ['#FFFFFF', '#F9FAFB', '#F3F4F6'],
        text: isDark ? ['#FAFAFA', '#A1A1AA', '#71717A'] : ['#111827', '#6B7280', '#9CA3AF'],
        gradients: isPremium ? ['linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'] : [],
      },
      spacing: {
        scale: isDense ? 'tight' : isPremium ? 'spacious' : 'comfortable',
        baseUnit: isDense ? 4 : 8,
        patterns: isDense ? ['p-2', 'p-3', 'gap-2'] : ['p-4', 'p-6', 'gap-4'],
      },
      typography: {
        headingStyle: isPremium ? 'bold' : 'medium',
        bodySize: isDense ? 'sm' : 'base',
        tracking: isMinimal ? 'tight' : 'normal',
        fontStack: ['Inter', 'system-ui', 'sans-serif'],
      },
      components: {
        buttonStyle: isMinimal ? 'ghost' : isPremium ? 'gradient' : 'solid',
        cardStyle: isDark ? 'bordered' : 'elevated',
        borderRadius: isPlayful ? 'lg' : 'md',
        shadows: isMinimal ? 'none' : 'subtle',
      },
      motion: {
        level: isAnimated ? 'expressive' : isMinimal ? 'minimal' : 'subtle',
        duration: isAnimated ? 300 : 200,
        easing: 'ease-out',
      },
      mood: {
        formality: isPlayful ? 'playful' : 'professional',
        density: isDense ? 'dense' : 'balanced',
        contrast: isMinimal ? 'low' : 'medium',
      },
    };
  }
}

// =============================================================================
// PATTERN LEARNER
// =============================================================================

export class PatternLearner {
  /**
   * Merge multiple extracted design languages into a single taste profile
   */
  learn(extractions: ExtractedDesignLanguage[], profileName: string): LearnedTasteProfile {
    // Weight each extraction (default to equal weights)
    const weights = extractions.map(e => e.source.weight || 1 / extractions.length);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const normalizedWeights = weights.map(w => w / totalWeight);

    // Merge colors (use primary source for now, could blend)
    const primaryExtraction = extractions[0];

    // Determine overall characteristics
    const avgDensity = this.averageEnum(
      extractions.map(e => e.mood.density),
      normalizedWeights,
      ['sparse', 'balanced', 'dense']
    );

    const avgContrast = this.averageEnum(
      extractions.map(e => e.mood.contrast),
      normalizedWeights,
      ['low', 'medium', 'high']
    );

    const avgMotion = this.averageEnum(
      extractions.map(e => e.motion.level),
      normalizedWeights,
      ['minimal', 'subtle', 'expressive']
    );

    // Build the learned profile
    const profile: LearnedTasteProfile = {
      name: profileName,
      sources: extractions.map(e => e.source),
      extractedAt: new Date().toISOString(),

      designLanguage: {
        colors: this.buildColorTokens(primaryExtraction),
        spacing: this.buildSpacingTokens(primaryExtraction),
        typography: this.buildTypographyTokens(primaryExtraction),
        components: this.buildComponentTokens(primaryExtraction),
      },

      recipes: this.buildRecipes(primaryExtraction),

      tuners: {
        abstraction: this.componentStyleToAbstraction(primaryExtraction.components),
        density: this.densityToTuner(avgDensity),
        motion: this.motionToTuner(avgMotion),
        contrast: this.contrastToTuner(avgContrast),
        narrative: this.formalityToNarrative(primaryExtraction.mood.formality),
      },
    };

    return profile;
  }

  private averageEnum<T extends string>(values: T[], weights: number[], options: T[]): T {
    const indices = values.map(v => options.indexOf(v));
    const avgIndex = indices.reduce((sum, idx, i) => sum + idx * weights[i], 0);
    return options[Math.round(avgIndex)];
  }

  private buildColorTokens(ext: ExtractedDesignLanguage): LearnedTasteProfile['designLanguage']['colors'] {
    const bg = ext.colors.background;
    const text = ext.colors.text;
    const accent = ext.colors.accent[0] || ext.colors.primary[0] || '#3B82F6';

    return {
      '--taste-bg': bg[0] || '#FFFFFF',
      '--taste-bg-secondary': bg[1] || bg[0] || '#F9FAFB',
      '--taste-surface': bg[2] || bg[1] || '#FFFFFF',
      '--taste-surface-elevated': bg[1] || '#FFFFFF',
      '--taste-border': text[2] || '#E5E7EB',
      '--taste-text': text[0] || '#111827',
      '--taste-text-muted': text[1] || '#6B7280',
      '--taste-accent': accent,
      '--taste-accent-hover': this.adjustColor(accent, 0.9),
    };
  }

  private buildSpacingTokens(ext: ExtractedDesignLanguage): LearnedTasteProfile['designLanguage']['spacing'] {
    const base = ext.spacing.baseUnit;
    return {
      '--taste-space-xs': `${base}px`,
      '--taste-space-sm': `${base * 2}px`,
      '--taste-space-md': `${base * 3}px`,
      '--taste-space-lg': `${base * 4}px`,
      '--taste-space-xl': `${base * 6}px`,
      '--taste-space-2xl': `${base * 8}px`,
    };
  }

  private buildTypographyTokens(ext: ExtractedDesignLanguage): LearnedTasteProfile['designLanguage']['typography'] {
    const fontFamily = ext.typography.fontStack.join(', ');
    const tracking = ext.typography.tracking === 'tight' ? '-0.025em' :
                     ext.typography.tracking === 'wide' ? '0.05em' : '0';

    return {
      '--taste-font-heading': fontFamily,
      '--taste-font-body': fontFamily,
      '--taste-text-xs': '0.75rem',
      '--taste-text-sm': '0.875rem',
      '--taste-text-base': '1rem',
      '--taste-text-lg': '1.125rem',
      '--taste-text-xl': '1.25rem',
      '--taste-text-2xl': '1.5rem',
      '--taste-tracking': tracking,
      '--taste-leading': '1.5',
    };
  }

  private buildComponentTokens(ext: ExtractedDesignLanguage): LearnedTasteProfile['designLanguage']['components'] {
    const radiusMap = { none: '0', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', full: '9999px' };
    const shadowMap = {
      none: 'none',
      subtle: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      medium: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      dramatic: '0 10px 15px -3px rgb(0 0 0 / 0.2)',
    };

    return {
      '--taste-radius-sm': radiusMap[ext.components.borderRadius] || '0.25rem',
      '--taste-radius-md': radiusMap[ext.components.borderRadius] || '0.5rem',
      '--taste-radius-lg': ext.components.borderRadius === 'full' ? '9999px' : '0.75rem',
      '--taste-shadow-sm': shadowMap[ext.components.shadows] || 'none',
      '--taste-shadow-md': shadowMap.medium,
      '--taste-shadow-lg': shadowMap.dramatic,
      '--taste-transition': `all ${ext.motion.duration}ms ${ext.motion.easing}`,
    };
  }

  private buildRecipes(ext: ExtractedDesignLanguage): LearnedTasteProfile['recipes'] {
    const radius = ext.components.borderRadius === 'none' ? 'rounded-none' :
                   ext.components.borderRadius === 'sm' ? 'rounded' :
                   ext.components.borderRadius === 'lg' ? 'rounded-xl' :
                   ext.components.borderRadius === 'full' ? 'rounded-full' : 'rounded-lg';

    const shadow = ext.components.shadows === 'none' ? '' :
                   ext.components.shadows === 'subtle' ? 'shadow-sm' :
                   ext.components.shadows === 'dramatic' ? 'shadow-xl' : 'shadow-md';

    const transition = ext.motion.level === 'minimal' ? 'transition-colors duration-150' :
                       ext.motion.level === 'expressive' ? 'transition-all duration-300' :
                       'transition-all duration-200';

    const padding = ext.spacing.scale === 'tight' ? 'px-3 py-1.5' :
                    ext.spacing.scale === 'spacious' ? 'px-6 py-3' : 'px-4 py-2';

    const buttonBase = `inline-flex items-center justify-center font-medium ${radius} ${transition}`;

    return {
      button: {
        primary: ext.components.buttonStyle === 'gradient'
          ? `${buttonBase} ${padding} bg-gradient-to-r from-primary to-accent text-white hover:opacity-90`
          : ext.components.buttonStyle === 'ghost'
          ? `${buttonBase} ${padding} bg-transparent hover:bg-accent/10 text-accent`
          : `${buttonBase} ${padding} bg-accent text-white hover:bg-accent/90 ${shadow}`,
        secondary: `${buttonBase} ${padding} bg-secondary text-secondary-foreground hover:bg-secondary/80`,
        ghost: `${buttonBase} ${padding} bg-transparent hover:bg-accent/10 text-foreground`,
      },
      card: {
        base: ext.components.cardStyle === 'flat'
          ? `bg-surface ${radius} p-4`
          : ext.components.cardStyle === 'bordered'
          ? `bg-surface border border-border ${radius} p-4`
          : ext.components.cardStyle === 'glass'
          ? `bg-surface/80 backdrop-blur-sm border border-border/50 ${radius} p-4`
          : `bg-surface ${radius} ${shadow} p-4`,
        elevated: `bg-surface ${radius} shadow-lg p-6`,
        interactive: `bg-surface ${radius} ${shadow} p-4 ${transition} hover:shadow-lg cursor-pointer`,
      },
      surface: {
        base: `bg-background`,
        inset: `bg-secondary ${radius}`,
        overlay: `bg-surface/95 backdrop-blur-sm ${radius} ${shadow}`,
      },
      text: {
        heading: `text-2xl font-${ext.typography.headingStyle === 'light' ? 'medium' : 'bold'} tracking-${ext.typography.tracking} text-foreground`,
        subheading: `text-lg font-medium text-foreground`,
        body: `text-${ext.typography.bodySize} text-foreground`,
        muted: `text-sm text-muted-foreground`,
      },
      layout: {
        container: ext.spacing.scale === 'spacious' ? 'max-w-6xl mx-auto px-8' : 'max-w-5xl mx-auto px-4',
        section: ext.spacing.scale === 'spacious' ? 'py-16 space-y-8' : 'py-8 space-y-4',
        grid: ext.spacing.scale === 'tight' ? 'grid gap-3' : 'grid gap-6',
      },
    };
  }

  private adjustColor(hex: string, factor: number): string {
    // Simple brightness adjustment
    return hex; // In production, would actually adjust the color
  }

  private componentStyleToAbstraction(components: ExtractedDesignLanguage['components']): number {
    // Ghost/outline = high abstraction, gradient/solid = lower
    if (components.buttonStyle === 'ghost') return 0.8;
    if (components.buttonStyle === 'outline') return 0.7;
    if (components.buttonStyle === 'gradient') return 0.4;
    return 0.5;
  }

  private densityToTuner(density: 'sparse' | 'balanced' | 'dense'): number {
    return density === 'sparse' ? 0.3 : density === 'dense' ? 0.7 : 0.5;
  }

  private motionToTuner(motion: 'minimal' | 'subtle' | 'expressive'): number {
    return motion === 'minimal' ? 0.2 : motion === 'expressive' ? 0.8 : 0.5;
  }

  private contrastToTuner(contrast: 'low' | 'medium' | 'high'): number {
    return contrast === 'low' ? 0.3 : contrast === 'high' ? 0.8 : 0.5;
  }

  private formalityToNarrative(formality: 'playful' | 'balanced' | 'professional'): number {
    return formality === 'playful' ? 0.7 : formality === 'professional' ? 0.4 : 0.5;
  }
}

// =============================================================================
// TRANSFORMATION ENGINE
// =============================================================================

export class TransformationEngine {
  private profile: LearnedTasteProfile;

  constructor(profile: LearnedTasteProfile) {
    this.profile = profile;
  }

  /**
   * Generate a transformation plan for a file
   */
  planTransformation(filePath: string, fileContent: string): TransformationPlan {
    const transformations: Transformation[] = [];
    const issues: string[] = [];

    // Find all Tailwind classes in the file
    const classMatches = fileContent.matchAll(/className=["'`]([^"'`]+)["'`]/g);
    const tailwindClasses: string[] = [];

    for (const match of classMatches) {
      tailwindClasses.push(...match[1].split(/\s+/));
    }

    // Analyze and suggest transformations
    let lineNumber = 0;
    const lines = fileContent.split('\n');

    for (const line of lines) {
      lineNumber++;

      // Look for button patterns
      if (line.includes('Button') || line.includes('button')) {
        const classMatch = line.match(/className=["'`]([^"'`]+)["'`]/);
        if (classMatch) {
          const currentClasses = classMatch[1];
          const suggestedClasses = this.profile.recipes.button.primary;

          if (currentClasses !== suggestedClasses) {
            transformations.push({
              type: 'replace-class',
              location: { line: lineNumber, column: line.indexOf('className') },
              original: currentClasses,
              replacement: suggestedClasses,
              reason: `Apply ${this.profile.name} button styling`,
            });
          }
        }
      }

      // Look for card patterns
      if (line.includes('Card') || line.match(/bg-.*rounded/)) {
        const classMatch = line.match(/className=["'`]([^"'`]+)["'`]/);
        if (classMatch) {
          const currentClasses = classMatch[1];

          // Check if it's using old patterns
          if (currentClasses.includes('bg-white') || currentClasses.includes('shadow')) {
            transformations.push({
              type: 'replace-class',
              location: { line: lineNumber, column: line.indexOf('className') },
              original: currentClasses,
              replacement: this.profile.recipes.card.base + ' ' + currentClasses.replace(/bg-white|shadow-\w+/g, '').trim(),
              reason: `Apply ${this.profile.name} card styling`,
            });
          }
        }
      }
    }

    // Generate preview of transformed code
    let previewContent = fileContent;
    for (const t of transformations.reverse()) {
      const lines = previewContent.split('\n');
      const line = lines[t.location.line - 1];
      if (line) {
        lines[t.location.line - 1] = line.replace(t.original, t.replacement);
      }
      previewContent = lines.join('\n');
    }

    return {
      targetFile: filePath,
      currentAnalysis: {
        components: transformations.length,
        tailwindClasses,
        issues,
      },
      transformations: transformations.reverse(),
      preview: previewContent,
    };
  }

  /**
   * Generate CSS variables file for the taste profile
   */
  generateCSSVariables(): string {
    const { colors, spacing, typography, components } = this.profile.designLanguage;

    return `:root {
  /* ${this.profile.name} Taste Profile */
  /* Generated from: ${this.profile.sources.map(s => s.value).join(', ')} */

  /* Colors */
  ${Object.entries(colors).map(([k, v]) => `${k}: ${v};`).join('\n  ')}

  /* Spacing */
  ${Object.entries(spacing).map(([k, v]) => `${k}: ${v};`).join('\n  ')}

  /* Typography */
  ${Object.entries(typography).map(([k, v]) => `${k}: ${v};`).join('\n  ')}

  /* Components */
  ${Object.entries(components).map(([k, v]) => `${k}: ${v};`).join('\n  ')}
}`;
  }

  /**
   * Generate Tailwind config extension for the taste profile
   */
  generateTailwindExtension(): string {
    return `// Taste Engine: ${this.profile.name}
// Add this to your tailwind.config.js extend section

module.exports = {
  theme: {
    extend: {
      colors: {
        taste: {
          bg: 'var(--taste-bg)',
          'bg-secondary': 'var(--taste-bg-secondary)',
          surface: 'var(--taste-surface)',
          'surface-elevated': 'var(--taste-surface-elevated)',
          border: 'var(--taste-border)',
          text: 'var(--taste-text)',
          'text-muted': 'var(--taste-text-muted)',
          accent: 'var(--taste-accent)',
          'accent-hover': 'var(--taste-accent-hover)',
        },
      },
      spacing: {
        'taste-xs': 'var(--taste-space-xs)',
        'taste-sm': 'var(--taste-space-sm)',
        'taste-md': 'var(--taste-space-md)',
        'taste-lg': 'var(--taste-space-lg)',
        'taste-xl': 'var(--taste-space-xl)',
        'taste-2xl': 'var(--taste-space-2xl)',
      },
      borderRadius: {
        'taste-sm': 'var(--taste-radius-sm)',
        'taste-md': 'var(--taste-radius-md)',
        'taste-lg': 'var(--taste-radius-lg)',
      },
      boxShadow: {
        'taste-sm': 'var(--taste-shadow-sm)',
        'taste-md': 'var(--taste-shadow-md)',
        'taste-lg': 'var(--taste-shadow-lg)',
      },
      transitionProperty: {
        taste: 'var(--taste-transition)',
      },
    },
  },
};`;
  }
}

// =============================================================================
// MAIN API
// =============================================================================

/**
 * Learn from inspiration sources and create a taste profile
 */
export async function learnFromInspirations(
  sources: (string | InspirationSource)[],
  profileName: string = 'Custom'
): Promise<LearnedTasteProfile> {
  // Normalize sources
  const normalizedSources: InspirationSource[] = sources.map(s => {
    if (typeof s === 'string') {
      // Auto-detect type
      if (s.startsWith('http')) {
        return { type: 'url', value: s };
      } else if (s.includes('.png') || s.includes('.jpg') || s.includes('.webp')) {
        return { type: 'screenshot', value: s };
      } else if (KNOWN_BRANDS[s.toLowerCase()]) {
        return { type: 'brand', value: s };
      } else {
        return { type: 'description', value: s };
      }
    }
    return s;
  });

  // Scan inspirations
  const scanner = new InspirationScanner();
  const extractions = await scanner.scan(normalizedSources);

  if (extractions.length === 0) {
    throw new Error('Could not extract design language from any inspiration source');
  }

  // Learn from extractions
  const learner = new PatternLearner();
  return learner.learn(extractions, profileName);
}

/**
 * Create a transformation engine from a learned profile
 */
export function createTransformer(profile: LearnedTasteProfile): TransformationEngine {
  return new TransformationEngine(profile);
}

/**
 * Quick API: Learn from inspirations and get transformation tools
 */
export async function inspire(
  inspirations: string[],
  profileName?: string
): Promise<{
  profile: LearnedTasteProfile;
  transformer: TransformationEngine;
  cssVariables: string;
  tailwindConfig: string;
}> {
  const profile = await learnFromInspirations(inspirations, profileName);
  const transformer = createTransformer(profile);

  return {
    profile,
    transformer,
    cssVariables: transformer.generateCSSVariables(),
    tailwindConfig: transformer.generateTailwindExtension(),
  };
}

// Re-export visual assets module
export * from './visual-assets';

// Re-export URL analyzer and selective inspirations
export * from './url-analyzer';

