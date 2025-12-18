/**
 * Visual Asset Intelligence
 *
 * Generates visual asset strategies based on inspiration analysis.
 * Instead of copying images, we generate:
 * 1. Asset briefs (what visuals to create)
 * 2. SVG patterns and backgrounds
 * 3. Chart/graph styling
 * 4. Animation specifications
 * 5. Placeholder strategies
 */

import type { ExtractedDesignLanguage, LearnedTasteProfile } from './index';

// =============================================================================
// TYPES
// =============================================================================

export interface VisualAssetStrategy {
  profile: string;

  // What visual assets the inspiration uses
  assetAnalysis: {
    heroStyle: HeroStyle;
    illustrationStyle: IllustrationStyle;
    dataVizStyle: DataVizStyle;
    motionStyle: MotionStyle;
    photographyStyle: PhotographyStyle;
  };

  // Generated assets
  generatedAssets: {
    svgPatterns: SVGPattern[];
    gradients: GradientDefinition[];
    placeholders: PlaceholderStrategy;
  };

  // Specs for creating your own assets
  assetBrief: AssetBrief;

  // Animation recipes
  animations: AnimationRecipe[];

  // Chart/graph theming
  chartTheme: ChartTheme;
}

export interface HeroStyle {
  type: 'minimal' | 'gradient-orbs' | 'geometric' | 'photo-background' | 'illustration' | 'video';
  background: string; // CSS background value
  overlay?: string;
  pattern?: string;
  description: string;
}

export interface IllustrationStyle {
  type: 'none' | 'flat' | 'isometric' | '3d' | 'hand-drawn' | 'geometric' | 'abstract';
  colors: string[];
  strokeWeight: 'thin' | 'medium' | 'thick' | 'none';
  description: string;
}

export interface DataVizStyle {
  type: 'minimal' | 'colorful' | 'monochrome' | 'gradient';
  colors: string[];
  gridStyle: 'none' | 'subtle' | 'visible';
  labelStyle: 'inside' | 'outside' | 'tooltip';
  description: string;
}

export interface MotionStyle {
  level: 'none' | 'subtle' | 'moderate' | 'expressive';
  entranceAnimation: string;
  hoverEffects: string[];
  scrollEffects: string[];
  microInteractions: string[];
}

export interface PhotographyStyle {
  type: 'none' | 'product-shots' | 'lifestyle' | 'abstract' | 'team';
  treatment: 'natural' | 'duotone' | 'high-contrast' | 'muted';
  overlay?: string;
}

export interface SVGPattern {
  name: string;
  description: string;
  svg: string;
  css: string; // How to use as background
}

export interface GradientDefinition {
  name: string;
  type: 'linear' | 'radial' | 'conic';
  css: string;
  stops: { color: string; position: string }[];
}

export interface PlaceholderStrategy {
  productShots: {
    style: string;
    background: string;
    mockupCSS: string;
  };
  avatars: {
    style: 'initials' | 'gradient' | 'icon';
    colors: string[];
  };
  emptyStates: {
    style: 'minimal' | 'illustrated' | 'icon-based';
    iconStyle: string;
  };
}

export interface AssetBrief {
  summary: string;
  heroVisual: {
    description: string;
    suggestions: string[];
    avoidance: string[];
  };
  illustrations: {
    style: string;
    suggestions: string[];
    colorPalette: string[];
  };
  photography: {
    style: string;
    treatment: string;
    suggestions: string[];
  };
  icons: {
    style: string;
    weight: string;
    suggestions: string[];
  };
}

export interface AnimationRecipe {
  name: string;
  trigger: 'load' | 'hover' | 'scroll' | 'click';
  css: string;
  framerMotion?: string;
  tailwind?: string;
}

export interface ChartTheme {
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    positive: string;
    negative: string;
    neutral: string;
  };
  grid: {
    color: string;
    opacity: number;
  };
  axis: {
    color: string;
    fontSize: string;
    fontWeight: string;
  };
  tooltip: {
    background: string;
    text: string;
    border: string;
    borderRadius: string;
  };
  // For specific chart libraries
  rechartsTheme: object;
}

// =============================================================================
// BRAND VISUAL PROFILES
// =============================================================================

const BRAND_VISUALS: Record<string, Partial<VisualAssetStrategy['assetAnalysis']>> = {
  linear: {
    heroStyle: {
      type: 'gradient-orbs',
      background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0d0d0d 100%)',
      overlay: 'bg-[radial-gradient(ellipse_at_center,_rgba(94,106,210,0.15)_0%,_transparent_70%)]',
      description: 'Dark background with subtle purple/blue gradient orbs, minimal and sophisticated',
    },
    illustrationStyle: {
      type: 'geometric',
      colors: ['#5E6AD2', '#8B5CF6', '#A78BFA'],
      strokeWeight: 'thin',
      description: 'Clean geometric shapes, often with subtle gradients',
    },
    dataVizStyle: {
      type: 'minimal',
      colors: ['#5E6AD2', '#8B5CF6', '#6366F1'],
      gridStyle: 'subtle',
      labelStyle: 'tooltip',
      description: 'Minimal charts with purple accent colors, subtle grid lines',
    },
    motionStyle: {
      level: 'subtle',
      entranceAnimation: 'fade-up',
      hoverEffects: ['scale-[1.02]', 'shadow-lg'],
      scrollEffects: ['fade-in-up'],
      microInteractions: ['button-press', 'input-focus'],
    },
    photographyStyle: {
      type: 'product-shots',
      treatment: 'high-contrast',
      overlay: 'bg-gradient-to-b from-transparent to-background/80',
    },
  },

  stripe: {
    heroStyle: {
      type: 'gradient-orbs',
      background: 'linear-gradient(180deg, #0A2540 0%, #1A1F36 100%)',
      overlay: 'bg-[radial-gradient(ellipse_at_top_right,_rgba(99,91,255,0.3)_0%,_transparent_50%),_radial-gradient(ellipse_at_bottom_left,_rgba(0,212,255,0.2)_0%,_transparent_50%)]',
      description: 'Deep blue gradient with colorful floating gradient orbs',
    },
    illustrationStyle: {
      type: '3d',
      colors: ['#635BFF', '#00D4FF', '#7A73FF', '#80E9FF'],
      strokeWeight: 'none',
      description: '3D gradient shapes, floating cards, glass morphism effects',
    },
    dataVizStyle: {
      type: 'gradient',
      colors: ['#635BFF', '#00D4FF', '#FF5F6D'],
      gridStyle: 'none',
      labelStyle: 'outside',
      description: 'Gradient-filled charts, smooth curves, vibrant colors',
    },
    motionStyle: {
      level: 'expressive',
      entranceAnimation: 'slide-up-fade',
      hoverEffects: ['translate-y-[-4px]', 'shadow-2xl', 'scale-[1.02]'],
      scrollEffects: ['parallax', 'fade-in-up', 'stagger-children'],
      microInteractions: ['button-glow', 'card-tilt', 'input-glow'],
    },
    photographyStyle: {
      type: 'none',
      treatment: 'natural',
    },
  },

  vercel: {
    heroStyle: {
      type: 'minimal',
      background: '#000000',
      pattern: 'bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem]',
      description: 'Pure black with subtle grid pattern, stark and minimal',
    },
    illustrationStyle: {
      type: 'geometric',
      colors: ['#FFFFFF', '#666666'],
      strokeWeight: 'thin',
      description: 'Minimal geometric shapes, monochrome, high contrast',
    },
    dataVizStyle: {
      type: 'monochrome',
      colors: ['#FFFFFF', '#666666', '#333333'],
      gridStyle: 'subtle',
      labelStyle: 'outside',
      description: 'Monochrome charts, clean lines, minimal decoration',
    },
    motionStyle: {
      level: 'subtle',
      entranceAnimation: 'fade',
      hoverEffects: ['opacity-80'],
      scrollEffects: ['fade-in'],
      microInteractions: ['button-press'],
    },
    photographyStyle: {
      type: 'none',
      treatment: 'natural',
    },
  },

  notion: {
    heroStyle: {
      type: 'minimal',
      background: '#FFFFFF',
      description: 'Clean white background, content-focused, minimal visual noise',
    },
    illustrationStyle: {
      type: 'hand-drawn',
      colors: ['#37352F', '#787774', '#2383E2', '#EB5757', '#0F7B6C'],
      strokeWeight: 'medium',
      description: 'Hand-drawn style illustrations, friendly and approachable',
    },
    dataVizStyle: {
      type: 'minimal',
      colors: ['#2383E2', '#EB5757', '#0F7B6C', '#9B51E0'],
      gridStyle: 'none',
      labelStyle: 'inside',
      description: 'Simple progress bars, inline charts, minimal styling',
    },
    motionStyle: {
      level: 'none',
      entranceAnimation: 'none',
      hoverEffects: ['bg-gray-100'],
      scrollEffects: [],
      microInteractions: ['checkbox-bounce'],
    },
    photographyStyle: {
      type: 'none',
      treatment: 'natural',
    },
  },

  github: {
    heroStyle: {
      type: 'geometric',
      background: 'linear-gradient(180deg, #0D1117 0%, #161B22 100%)',
      pattern: 'bg-[url("data:image/svg+xml,...")]', // Globe pattern
      description: 'Dark background with animated globe/network visualization',
    },
    illustrationStyle: {
      type: 'flat',
      colors: ['#238636', '#1F6FEB', '#8957E5', '#F78166'],
      strokeWeight: 'medium',
      description: 'Flat illustrations, Octocat mascot, tech-focused',
    },
    dataVizStyle: {
      type: 'colorful',
      colors: ['#238636', '#1F6FEB', '#8957E5', '#F78166', '#3FB950'],
      gridStyle: 'visible',
      labelStyle: 'tooltip',
      description: 'Contribution graphs, heatmaps, activity charts',
    },
    motionStyle: {
      level: 'subtle',
      entranceAnimation: 'fade',
      hoverEffects: ['bg-[#21262D]', 'border-[#30363D]'],
      scrollEffects: ['fade-in-up'],
      microInteractions: ['star-burst', 'fork-animation'],
    },
    photographyStyle: {
      type: 'team',
      treatment: 'natural',
    },
  },

  airbnb: {
    heroStyle: {
      type: 'photo-background',
      background: 'url("/hero-image.jpg") center/cover',
      overlay: 'bg-gradient-to-b from-black/40 to-transparent',
      description: 'Large lifestyle photography, warm and inviting',
    },
    illustrationStyle: {
      type: 'flat',
      colors: ['#FF385C', '#00A699', '#FC642D', '#484848'],
      strokeWeight: 'medium',
      description: 'Friendly flat illustrations, warm colors, travel-themed',
    },
    dataVizStyle: {
      type: 'colorful',
      colors: ['#FF385C', '#00A699', '#FC642D'],
      gridStyle: 'none',
      labelStyle: 'inside',
      description: 'Clean charts with brand colors, rounded elements',
    },
    motionStyle: {
      level: 'moderate',
      entranceAnimation: 'fade-up',
      hoverEffects: ['shadow-lg', 'scale-[1.02]'],
      scrollEffects: ['fade-in-up', 'parallax-images'],
      microInteractions: ['heart-pop', 'card-hover'],
    },
    photographyStyle: {
      type: 'lifestyle',
      treatment: 'natural',
      overlay: 'bg-gradient-to-t from-black/20 to-transparent',
    },
  },
};

// =============================================================================
// VISUAL ASSET GENERATOR
// =============================================================================

export class VisualAssetGenerator {
  private profile: LearnedTasteProfile;

  constructor(profile: LearnedTasteProfile) {
    this.profile = profile;
  }

  /**
   * Generate complete visual asset strategy
   */
  generate(): VisualAssetStrategy {
    const brandNames = this.profile.sources
      .filter(s => s.type === 'brand')
      .map(s => s.value.toLowerCase());

    // Merge visual analysis from source brands
    const assetAnalysis = this.mergeAssetAnalysis(brandNames);

    return {
      profile: this.profile.name,
      assetAnalysis,
      generatedAssets: {
        svgPatterns: this.generateSVGPatterns(assetAnalysis),
        gradients: this.generateGradients(assetAnalysis),
        placeholders: this.generatePlaceholderStrategy(assetAnalysis),
      },
      assetBrief: this.generateAssetBrief(assetAnalysis),
      animations: this.generateAnimations(assetAnalysis),
      chartTheme: this.generateChartTheme(assetAnalysis),
    };
  }

  private mergeAssetAnalysis(brandNames: string[]): VisualAssetStrategy['assetAnalysis'] {
    // Use first brand as primary, or defaults
    const primaryBrand = brandNames[0] || 'linear';
    const brandVisuals = BRAND_VISUALS[primaryBrand] || BRAND_VISUALS.linear;

    return {
      heroStyle: brandVisuals.heroStyle || {
        type: 'minimal',
        background: this.profile.designLanguage.colors['--taste-bg'],
        description: 'Minimal background based on taste profile',
      },
      illustrationStyle: brandVisuals.illustrationStyle || {
        type: 'geometric',
        colors: [
          this.profile.designLanguage.colors['--taste-accent'],
          this.profile.designLanguage.colors['--taste-text-muted'],
        ],
        strokeWeight: 'thin',
        description: 'Clean geometric illustrations',
      },
      dataVizStyle: brandVisuals.dataVizStyle || {
        type: 'minimal',
        colors: [
          this.profile.designLanguage.colors['--taste-accent'],
        ],
        gridStyle: 'subtle',
        labelStyle: 'tooltip',
        description: 'Minimal data visualizations',
      },
      motionStyle: brandVisuals.motionStyle || {
        level: this.profile.tuners.motion > 0.6 ? 'expressive' : this.profile.tuners.motion > 0.3 ? 'subtle' : 'none',
        entranceAnimation: 'fade-up',
        hoverEffects: ['opacity-90'],
        scrollEffects: [],
        microInteractions: [],
      },
      photographyStyle: brandVisuals.photographyStyle || {
        type: 'none',
        treatment: 'natural',
      },
    };
  }

  private generateSVGPatterns(analysis: VisualAssetStrategy['assetAnalysis']): SVGPattern[] {
    const patterns: SVGPattern[] = [];
    const accent = this.profile.designLanguage.colors['--taste-accent'];
    const bg = this.profile.designLanguage.colors['--taste-bg'];

    // Grid pattern
    patterns.push({
      name: 'subtle-grid',
      description: 'Subtle background grid pattern',
      svg: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="${accent}" stroke-width="0.5" stroke-opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>`,
      css: `background-image: url("data:image/svg+xml,${encodeURIComponent(`<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="${accent}" stroke-width="0.5" stroke-opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>`)}")`,
    });

    // Dots pattern
    patterns.push({
      name: 'dots',
      description: 'Subtle dot pattern',
      svg: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="1" fill="${accent}" fill-opacity="0.15"/></svg>`,
      css: `background-image: url("data:image/svg+xml,${encodeURIComponent(`<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="1" fill="${accent}" fill-opacity="0.15"/></svg>`)}")`,
    });

    // Noise texture (for premium feel)
    patterns.push({
      name: 'noise',
      description: 'Subtle noise texture for depth',
      svg: '', // Would be a base64 noise texture
      css: `background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
    });

    return patterns;
  }

  private generateGradients(analysis: VisualAssetStrategy['assetAnalysis']): GradientDefinition[] {
    const accent = this.profile.designLanguage.colors['--taste-accent'];
    const bg = this.profile.designLanguage.colors['--taste-bg'];

    return [
      {
        name: 'hero-glow',
        type: 'radial',
        css: `radial-gradient(ellipse at top, ${accent}20 0%, transparent 70%)`,
        stops: [
          { color: `${accent}20`, position: '0%' },
          { color: 'transparent', position: '70%' },
        ],
      },
      {
        name: 'accent-gradient',
        type: 'linear',
        css: `linear-gradient(135deg, ${accent} 0%, ${this.adjustColor(accent, 1.2)} 100%)`,
        stops: [
          { color: accent, position: '0%' },
          { color: this.adjustColor(accent, 1.2), position: '100%' },
        ],
      },
      {
        name: 'fade-to-bg',
        type: 'linear',
        css: `linear-gradient(to bottom, transparent 0%, ${bg} 100%)`,
        stops: [
          { color: 'transparent', position: '0%' },
          { color: bg, position: '100%' },
        ],
      },
    ];
  }

  private generatePlaceholderStrategy(analysis: VisualAssetStrategy['assetAnalysis']): PlaceholderStrategy {
    const accent = this.profile.designLanguage.colors['--taste-accent'];
    const surface = this.profile.designLanguage.colors['--taste-surface'];

    return {
      productShots: {
        style: analysis.heroStyle.type === 'gradient-orbs' ? 'floating-card' : 'flat',
        background: analysis.heroStyle.background,
        mockupCSS: `
          .product-mockup {
            background: ${surface};
            border-radius: 12px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
          }
        `,
      },
      avatars: {
        style: 'gradient',
        colors: [accent, this.adjustColor(accent, 1.3)],
      },
      emptyStates: {
        style: analysis.illustrationStyle.type === 'hand-drawn' ? 'illustrated' : 'icon-based',
        iconStyle: analysis.illustrationStyle.strokeWeight === 'thin' ? 'stroke-1' : 'stroke-2',
      },
    };
  }

  private generateAssetBrief(analysis: VisualAssetStrategy['assetAnalysis']): AssetBrief {
    return {
      summary: `Create visuals that match the ${this.profile.name} aesthetic: ${analysis.heroStyle.description}`,

      heroVisual: {
        description: analysis.heroStyle.description,
        suggestions: this.getHeroSuggestions(analysis.heroStyle),
        avoidance: this.getHeroAvoidance(analysis.heroStyle),
      },

      illustrations: {
        style: analysis.illustrationStyle.description,
        suggestions: [
          `Use ${analysis.illustrationStyle.type} illustration style`,
          `Stroke weight: ${analysis.illustrationStyle.strokeWeight}`,
          `Keep illustrations simple and on-brand`,
        ],
        colorPalette: analysis.illustrationStyle.colors,
      },

      photography: {
        style: analysis.photographyStyle.type,
        treatment: analysis.photographyStyle.treatment,
        suggestions: this.getPhotographySuggestions(analysis.photographyStyle),
      },

      icons: {
        style: analysis.illustrationStyle.strokeWeight === 'thin' ? 'Lucide/Feather style' : 'Heroicons style',
        weight: analysis.illustrationStyle.strokeWeight,
        suggestions: [
          'Use consistent icon set throughout',
          `Match ${analysis.illustrationStyle.strokeWeight} stroke weight`,
          'Ensure icons are optically balanced',
        ],
      },
    };
  }

  private generateAnimations(analysis: VisualAssetStrategy['assetAnalysis']): AnimationRecipe[] {
    const duration = analysis.motionStyle.level === 'expressive' ? 400 :
                     analysis.motionStyle.level === 'subtle' ? 200 : 0;

    const recipes: AnimationRecipe[] = [];

    // Entrance animation
    recipes.push({
      name: 'entrance-fade-up',
      trigger: 'load',
      css: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp ${duration}ms ease-out forwards; }
      `,
      framerMotion: `{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: ${duration / 1000} } }`,
      tailwind: `animate-[fadeUp_${duration}ms_ease-out_forwards]`,
    });

    // Hover effect
    if (analysis.motionStyle.hoverEffects.length > 0) {
      recipes.push({
        name: 'hover-lift',
        trigger: 'hover',
        css: `
          .hover-lift {
            transition: transform ${duration}ms ease-out, box-shadow ${duration}ms ease-out;
          }
          .hover-lift:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.3);
          }
        `,
        tailwind: `transition-all duration-${duration} hover:-translate-y-1 hover:shadow-xl`,
      });
    }

    // Scroll animation
    if (analysis.motionStyle.scrollEffects.length > 0) {
      recipes.push({
        name: 'scroll-reveal',
        trigger: 'scroll',
        css: `
          .scroll-reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity ${duration}ms ease-out, transform ${duration}ms ease-out;
          }
          .scroll-reveal.visible {
            opacity: 1;
            transform: translateY(0);
          }
        `,
        framerMotion: `{ initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } }`,
      });
    }

    return recipes;
  }

  private generateChartTheme(analysis: VisualAssetStrategy['assetAnalysis']): ChartTheme {
    const colors = analysis.dataVizStyle.colors;
    const textMuted = this.profile.designLanguage.colors['--taste-text-muted'];
    const surface = this.profile.designLanguage.colors['--taste-surface'];
    const border = this.profile.designLanguage.colors['--taste-border'];

    return {
      colors: {
        primary: colors[0] || this.profile.designLanguage.colors['--taste-accent'],
        secondary: colors[1] || textMuted,
        tertiary: colors[2] || border,
        positive: '#10B981',
        negative: '#EF4444',
        neutral: textMuted,
      },
      grid: {
        color: border,
        opacity: analysis.dataVizStyle.gridStyle === 'none' ? 0 :
                 analysis.dataVizStyle.gridStyle === 'subtle' ? 0.1 : 0.2,
      },
      axis: {
        color: textMuted,
        fontSize: '12px',
        fontWeight: '500',
      },
      tooltip: {
        background: surface,
        text: this.profile.designLanguage.colors['--taste-text'],
        border: border,
        borderRadius: this.profile.designLanguage.components['--taste-radius-md'],
      },
      rechartsTheme: {
        // Ready-to-use Recharts config
        colors: colors,
        cartesianGrid: {
          strokeDasharray: analysis.dataVizStyle.gridStyle === 'subtle' ? '3 3' : undefined,
          stroke: border,
          strokeOpacity: analysis.dataVizStyle.gridStyle === 'none' ? 0 : 0.1,
        },
        xAxis: {
          stroke: border,
          tick: { fill: textMuted, fontSize: 12 },
        },
        yAxis: {
          stroke: border,
          tick: { fill: textMuted, fontSize: 12 },
        },
      },
    };
  }

  private getHeroSuggestions(style: HeroStyle): string[] {
    switch (style.type) {
      case 'gradient-orbs':
        return [
          'Use CSS radial gradients for glowing orb effects',
          'Keep orbs subtle (10-20% opacity)',
          'Position orbs off-center for visual interest',
          'Consider animated floating effect',
        ];
      case 'minimal':
        return [
          'Let content be the hero',
          'Use subtle patterns for texture',
          'Consider animated text entrance',
        ];
      case 'geometric':
        return [
          'Create SVG geometric patterns',
          'Use brand colors at low opacity',
          'Consider animated line drawing',
        ];
      case 'photo-background':
        return [
          'Use high-quality, relevant imagery',
          'Apply overlay for text readability',
          'Consider parallax scroll effect',
        ];
      default:
        return ['Keep it simple and on-brand'];
    }
  }

  private getHeroAvoidance(style: HeroStyle): string[] {
    switch (style.type) {
      case 'gradient-orbs':
        return ['Avoid too many competing gradient orbs', 'Don\'t make orbs too bright'];
      case 'minimal':
        return ['Avoid adding unnecessary visual elements', 'Don\'t use stock photos'];
      default:
        return ['Avoid cluttering the hero area'];
    }
  }

  private getPhotographySuggestions(style: PhotographyStyle): string[] {
    if (style.type === 'none') {
      return ['Focus on illustrations and UI screenshots instead'];
    }
    return [
      `Use ${style.treatment} treatment for consistency`,
      `Focus on ${style.type} style imagery`,
      style.overlay ? 'Apply consistent overlay to all photos' : 'Keep photos clean',
    ];
  }

  private adjustColor(hex: string, factor: number): string {
    // Simple color adjustment (in production, use proper color library)
    return hex;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export function generateVisualAssets(profile: LearnedTasteProfile): VisualAssetStrategy {
  const generator = new VisualAssetGenerator(profile);
  return generator.generate();
}
