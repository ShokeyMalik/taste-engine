/**
 * Inspiration Profile System
 *
 * Bridges the gap between inspiration sources and block generation.
 * Provides a structured profile that influences how blocks are generated.
 */

import type {
  HeroVariant,
  FeaturesVariant,
  PricingVariant,
  TestimonialsVariant,
  CTAVariant,
  SidebarVariant,
  DataTableVariant,
  AppliedTuners,
} from '../blocks/types';

// =============================================================================
// INSPIRATION PROFILE TYPES
// =============================================================================

/**
 * Structured profile extracted from inspiration sources.
 * This is the bridge between raw inspiration and block generation.
 */
export interface InspirationProfile {
  /** Unique identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Sources this profile was built from */
  sources: InspirationSourceSummary[];
  /** Creation timestamp */
  createdAt: string;
  /** Last updated timestamp */
  updatedAt: string;

  // Color preferences
  colors: ColorPalette;

  // Typography preferences
  typography: TypographyConfig;

  // Spacing preferences
  spacing: SpacingConfig;

  // Motion preferences
  motion: MotionConfig;

  // Component style preferences
  componentStyles: ComponentStyleConfig;

  // Structural archetypes
  archetypes: {
    header?: string;
    hero?: string;
    features?: string;
    interactive?: string[];
  };

  // Layout DSL (section and block structure extracted from inspirations)
  layoutDsl?: LayoutDsl;

  // Harvested assets
  assets: {
    logos: string[];
    patterns: string[];
    icons: string[];
    images?: string[];
  };

  // Block-specific preferences
  blockPreferences: BlockPreferenceConfig;

  // Derived tuner values (for backwards compatibility)
  tuners: AppliedTuners;

  // Confidence score (0-1)
  confidence: number;

  // Custom CSS variables
  cssVariables: Record<string, string>;

  // Custom Tailwind theme extensions
  tailwindExtensions: Record<string, unknown>;

  // Literal CSS motions harvested
  motionCSS?: string;

  // === NEW: Elite Design DNA Fields ===

  /** Container/card styling patterns */
  containerStyles?: ContainerStyleConfig;

  /** Background treatments and effects */
  backgrounds?: BackgroundConfig;

  /** High-value visual assets (decorative SVGs, hero images, illustrations) */
  visualAssets?: VisualAssetsConfig;

  /** Interaction and animation patterns */
  interactions?: InteractionConfig;

  /** Detected motion libraries (GSAP, Framer Motion, etc.) */
  detectedMotionLibraries?: string[];
}

// === NEW TYPE DEFINITIONS ===

export interface ContainerStyleConfig {
  /** Card shape style */
  cardShape: 'boxy' | 'rounded' | 'organic' | 'glass';
  /** Border treatment */
  borderStyle: 'solid' | 'gradient' | 'glow' | 'none';
  /** Shadow intensity */
  shadowStyle: 'none' | 'subtle' | 'elevated' | 'dramatic';
  /** Uses glass morphism effect */
  glassMorphism: boolean;
  /** Has gradient borders */
  hasGradientBorders: boolean;
  /** Uses organic/blob shapes */
  hasOrganicShapes: boolean;
}

export interface BackgroundConfig {
  /** Gradient mesh SVGs */
  gradientMeshes: string[];
  /** Has noise/grain texture overlay */
  noiseTextures: boolean;
  /** Grid or dot patterns */
  gridPatterns: string[];
  /** Floating blur orb effects */
  floatingOrbs: boolean;
  /** CSS gradients used for backgrounds */
  cssGradients: string[];
  /** Background images (hero, section backgrounds) */
  heroBackgrounds: string[];
}

export interface VisualAssetsConfig {
  /** Decorative SVGs (blobs, shapes, not icons) */
  decorativeSvgs: string[];
  /** Hero/banner images */
  heroImages: string[];
  /** Illustration graphics */
  illustrations: string[];
  /** Custom icons (not generic Lucide/HeroIcons) */
  customIcons: string[];
  /** Logo variations */
  logos: string[];
}

export interface InteractionConfig {
  /** Uses custom cursor */
  customCursor: boolean;
  /** Magnetic button effects */
  magneticButtons: boolean;
  /** Scroll animation style */
  scrollAnimations: 'none' | 'fade' | 'slide' | 'parallax' | 'stagger';
  /** Hover transform effects (actual CSS values) */
  hoverTransforms: string[];
  /** Uses GSAP or similar */
  usesAdvancedMotion: boolean;
  /** Entrance animation style */
  entranceAnimation: 'none' | 'fade-up' | 'fade-in' | 'scale' | 'blur-in' | 'slide';
}

export interface InspirationSourceSummary {
  type: 'url' | 'screenshot' | 'brand' | 'description';
  value: string;
  weight: number;
  aspects: InspirationAspect[];
  extractedAt: string;
}

// =============================================================================
// LAYOUT DSL TYPES
// =============================================================================

export interface LayoutDsl {
  sections: LayoutSection[];
}

export interface LayoutSection {
  id: string;
  role: 'hero' | 'nav' | 'features' | 'testimonial' | 'pricing' | 'cta' | 'footer' | 'content' | 'unknown';
  layout: 'stack' | 'split' | 'grid' | 'bento' | 'carousel';
  hierarchy: {
    hasHeading: boolean;
    hasSubheading: boolean;
    hasCta: boolean;
    media: 'none' | 'image' | 'video' | 'illustration';
  };
  density: 'tight' | 'normal' | 'spacious';
  columns?: number;
}

export type InspirationAspect =
  | 'colors'
  | 'typography'
  | 'spacing'
  | 'motion'
  | 'components'
  | 'blocks';

// =============================================================================
// COLOR PALETTE
// =============================================================================

export interface ColorPalette {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: {
    light: string;
    dark: string;
  };
  foreground: {
    light: string;
    dark: string;
  };
  surface: {
    light: string;
    dark: string;
  };
  muted: {
    light: string;
    dark: string;
  };
  mutedForeground: {
    light: string;
    dark: string;
  };
  border: {
    light: string;
    dark: string;
  };
  gradients: GradientDefinition[];
}

export interface GradientDefinition {
  id: string;
  type: 'linear' | 'radial' | 'conic';
  angle?: number;
  stops: { color: string; position: number }[];
  cssValue: string;
}

// =============================================================================
// TYPOGRAPHY CONFIG
// =============================================================================

export interface TypographyConfig {
  headingFont: string[];
  bodyFont: string[];
  monoFont: string[];
  scale: 'tight' | 'normal' | 'loose';
  headingWeight: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  bodyWeight: 'light' | 'normal' | 'medium';
  letterSpacing: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider';
  lineHeight: 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
}

// =============================================================================
// SPACING CONFIG
// =============================================================================

export interface SpacingConfig {
  density: 'tight' | 'comfortable' | 'spacious';
  baseUnit: number; // in px (4, 8, etc.)
  sectionGap: string; // Tailwind class
  componentGap: string; // Tailwind class
  containerPadding: string; // Tailwind class
  cardPadding: string; // Tailwind class
}

// =============================================================================
// MOTION CONFIG
// =============================================================================

export interface MotionConfig {
  level: 'none' | 'subtle' | 'moderate' | 'expressive';
  duration: {
    fast: number; // ms
    normal: number;
    slow: number;
  };
  easing: string;
  entranceStyle: 'none' | 'fade' | 'slide' | 'scale' | 'blur';
  hoverEffects: boolean;
  scrollAnimations: boolean;
}

// =============================================================================
// COMPONENT STYLE CONFIG
// =============================================================================

export interface ComponentStyleConfig {
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow: 'none' | 'subtle' | 'medium' | 'dramatic';
  border: 'none' | 'subtle' | 'visible' | 'prominent';
  buttonStyle: 'solid' | 'outline' | 'ghost' | 'gradient';
  cardStyle: 'flat' | 'elevated' | 'bordered' | 'glass';
  inputStyle: 'minimal' | 'bordered' | 'filled';
  avatarStyle: 'circle' | 'rounded' | 'square';
}

// =============================================================================
// BLOCK PREFERENCE CONFIG
// =============================================================================

export interface BlockPreferenceConfig {
  hero: HeroBlockPreference;
  features: FeaturesBlockPreference;
  pricing: PricingBlockPreference;
  testimonials: TestimonialsBlockPreference;
  cta: CTABlockPreference;
  sidebar: SidebarBlockPreference;
  dataTable: DataTableBlockPreference;
}

export interface HeroBlockPreference {
  preferredVariant: HeroVariant;
  hasBackgroundPattern: boolean;
  hasGradientOverlay: boolean;
  textAlignment: 'left' | 'center' | 'right';
  minHeight: 'short' | 'medium' | 'tall' | 'full';
}

export interface FeaturesBlockPreference {
  preferredVariant: FeaturesVariant;
  iconStyle: 'minimal' | 'boxed' | 'colored' | 'gradient';
  gridColumns: 2 | 3 | 4;
  cardStyle: 'none' | 'subtle' | 'bordered' | 'elevated';
}

export interface PricingBlockPreference {
  preferredVariant: PricingVariant;
  highlightStyle: 'scale' | 'border' | 'background' | 'badge';
  showAnnualToggle: boolean;
}

export interface TestimonialsBlockPreference {
  preferredVariant: TestimonialsVariant;
  avatarStyle: 'circle' | 'square' | 'none';
  showCompanyLogo: boolean;
  showRating: boolean;
}

export interface CTABlockPreference {
  preferredVariant: CTAVariant;
  hasBackgroundPattern: boolean;
  backgroundStyle: 'solid' | 'gradient' | 'accent';
}

export interface SidebarBlockPreference {
  preferredVariant: SidebarVariant;
  iconPosition: 'left' | 'right';
  showLabels: boolean;
  collapsible: boolean;
}

export interface DataTableBlockPreference {
  preferredVariant: DataTableVariant;
  rowDensity: 'compact' | 'comfortable' | 'spacious';
  showBorders: boolean;
  stripedRows: boolean;
}

// =============================================================================
// INSPIRATION PROFILE BUILDER
// =============================================================================

export class InspirationProfileBuilder {
  private profile: Partial<InspirationProfile>;

  constructor(name: string) {
    this.profile = {
      id: `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      sources: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      confidence: 0,
      cssVariables: {},
      tailwindExtensions: {},
      motionCSS: '',
    };
  }

  /**
   * Set profile name
   */
  name(name: string): this {
    this.profile.name = name;
    return this;
  }

  /**
   * Set literal motion CSS
   */
  motionCSS(css: string): this {
    this.profile.motionCSS = css;
    return this;
  }

  /**
   * Set container styles
   */
  containerStyles(config: ContainerStyleConfig): this {
    this.profile.containerStyles = config;
    return this;
  }

  /**
   * Set background config
   */
  backgrounds(config: BackgroundConfig): this {
    this.profile.backgrounds = config;
    return this;
  }

  /**
   * Set visual assets
   */
  visualAssets(config: VisualAssetsConfig): this {
    this.profile.visualAssets = config;
    return this;
  }

  /**
   * Set interaction config
   */
  interactions(config: InteractionConfig): this {
    this.profile.interactions = config;
    return this;
  }

  /**
   * Set detected motion libraries
   */
  detectedMotionLibraries(libraries: string[]): this {
    this.profile.detectedMotionLibraries = libraries;
    return this;
  }

  /**
   * Set color palette
   */
  colors(palette: ColorPalette): this {
    this.profile.colors = palette;
    return this;
  }

  /**
   * Set typography config
   */
  typography(config: TypographyConfig): this {
    this.profile.typography = config;
    return this;
  }

  /**
   * Set spacing config
   */
  spacing(config: SpacingConfig): this {
    this.profile.spacing = config;
    return this;
  }

  /**
   * Set motion config
   */
  motion(config: MotionConfig): this {
    this.profile.motion = config;
    return this;
  }

  /**
   * Set component styles
   */
  componentStyles(config: ComponentStyleConfig): this {
    this.profile.componentStyles = config;
    return this;
  }

  /**
   * Set structural archetypes
   */
  archetypes(config: InspirationProfile['archetypes']): this {
    this.profile.archetypes = config;
    return this;
  }

  /**
   * Set layout DSL
   */
  layoutDsl(config: LayoutDsl): this {
    this.profile.layoutDsl = config;
    return this;
  }

  /**
   * Set harvested assets
   */
  assets(assets: InspirationProfile['assets']): this {
    this.profile.assets = assets;
    return this;
  }

  /**
   * Set block preferences
   */
  blockPreferences(config: BlockPreferenceConfig): this {
    this.profile.blockPreferences = config;
    return this;
  }

  /**
   * Set tuner values
   */
  tuners(tuners: AppliedTuners): this {
    this.profile.tuners = tuners;
    return this;
  }

  /**
   * Add a source
   */
  addSource(source: InspirationSourceSummary): this {
    this.profile.sources = this.profile.sources || [];
    this.profile.sources.push(source);
    return this;
  }

  /**
   * Add CSS variables
   */
  addCssVariables(vars: Record<string, string>): this {
    this.profile.cssVariables = {
      ...this.profile.cssVariables,
      ...vars,
    };
    return this;
  }

  /**
   * Add Tailwind extensions
   */
  addTailwindExtensions(extensions: Record<string, unknown>): this {
    this.profile.tailwindExtensions = {
      ...this.profile.tailwindExtensions,
      ...extensions,
    };
    return this;
  }

  /**
   * Set confidence score
   */
  setConfidence(confidence: number): this {
    this.profile.confidence = Math.max(0, Math.min(1, confidence));
    return this;
  }

  /**
   * Build the final profile
   */
  build(): InspirationProfile {
    // Validate required fields
    if (!this.profile.colors) {
      this.profile.colors = getDefaultColorPalette();
    }
    if (!this.profile.typography) {
      this.profile.typography = getDefaultTypography();
    }
    if (!this.profile.spacing) {
      this.profile.spacing = getDefaultSpacing();
    }
    if (!this.profile.motion) {
      this.profile.motion = getDefaultMotion();
    }
    if (!this.profile.componentStyles) {
      this.profile.componentStyles = getDefaultComponentStyles();
    }
    if (!this.profile.blockPreferences) {
      this.profile.blockPreferences = getDefaultBlockPreferences();
    }
    if (!this.profile.tuners) {
      this.profile.tuners = getDefaultTuners();
    }
    if (!this.profile.archetypes) {
      this.profile.archetypes = {};
    }
    if (!this.profile.assets) {
      this.profile.assets = { logos: [], patterns: [], icons: [], images: [] };
    }
    if (!this.profile.layoutDsl) {
      this.profile.layoutDsl = { sections: [] };
    }
    if (!this.profile.containerStyles) {
      this.profile.containerStyles = getDefaultContainerStyles();
    }
    if (!this.profile.backgrounds) {
      this.profile.backgrounds = getDefaultBackgrounds();
    }
    if (!this.profile.visualAssets) {
      this.profile.visualAssets = getDefaultVisualAssets();
    }
    if (!this.profile.interactions) {
      this.profile.interactions = getDefaultInteractions();
    }
    if (!this.profile.detectedMotionLibraries) {
      this.profile.detectedMotionLibraries = [];
    }

    this.profile.updatedAt = new Date().toISOString();

    return this.profile as InspirationProfile;
  }

  /**
   * Create a builder from a URLAnalysisResult
   * Uses inline color extraction to properly extract design tokens
   */
  static fromAnalysis(analysis: any): InspirationProfileBuilder {
    const builder = new InspirationProfileBuilder(`From ${analysis.url}`);

    // Extract colors intelligently from the analysis
    const extractedColors = InspirationProfileBuilder.extractColorsFromAnalysis(analysis);

    // Apply the extracted colors
    builder.colors(extractedColors);

    // Apply typography with fallbacks
    const fonts = analysis.extractedTypography?.fontFamilies || [];
    const cleanFonts = fonts
      .map((f: string) => f.replace(/['"]/g, '').trim())
      .filter((f: string) => f && !f.includes('inherit') && !f.includes('system'));

    builder.typography({
      headingFont: cleanFonts.length > 0
        ? [cleanFonts[0], 'system-ui', 'sans-serif']
        : ['Inter', 'system-ui', 'sans-serif'],
      bodyFont: cleanFonts.length > 1
        ? [cleanFonts[1], 'system-ui', 'sans-serif']
        : cleanFonts.length > 0
          ? [cleanFonts[0], 'system-ui', 'sans-serif']
          : ['Inter', 'system-ui', 'sans-serif'],
      monoFont: ['JetBrains Mono', 'monospace'],
      scale: 'normal',
      headingWeight: 'bold',
      bodyWeight: 'normal',
      letterSpacing: 'tight',
      lineHeight: 'relaxed',
    });

    // Infer spacing from analysis
    const spacingDensity = InspirationProfileBuilder.inferSpacingDensity(analysis);
    builder.spacing({
      density: spacingDensity,
      baseUnit: spacingDensity === 'spacious' ? 8 : spacingDensity === 'tight' ? 4 : 6,
      sectionGap: spacingDensity === 'spacious' ? 'space-y-24' : 'space-y-16',
      componentGap: 'gap-4',
      containerPadding: 'px-6',
      cardPadding: 'p-6',
    });

    // Infer motion from analysis
    const hasMotion = (analysis.extractedComponents?.transitions?.length || 0) > 3 ||
                      (analysis.extractedMotion?.animationTypes?.length || 0) > 0;
    builder.motion({
      level: hasMotion ? 'moderate' : 'subtle',
      duration: { fast: 150, normal: 200, slow: 300 },
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      entranceStyle: hasMotion ? 'fade' : 'none',
      hoverEffects: true,
      scrollAnimations: hasMotion,
    });

    // Infer component styles
    const avgRadius = InspirationProfileBuilder.inferBorderRadius(analysis);
    builder.componentStyles({
      borderRadius: avgRadius,
      shadow: 'subtle',
      border: 'subtle',
      buttonStyle: 'solid',
      cardStyle: 'bordered',
      inputStyle: 'bordered',
      avatarStyle: 'circle',
    });

    // Calculate tuners from analysis
    builder.tuners({
      abstraction: 0.5,
      density: spacingDensity === 'spacious' ? 0.3 : spacingDensity === 'tight' ? 0.7 : 0.5,
      motion: hasMotion ? 0.7 : 0.4,
      contrast: 0.6,
      narrative: 0.5,
    });

    // Archetypes & Assets
    builder.archetypes(analysis.extractedArchetypes || {});
    builder.layoutDsl(analysis.layoutDsl || { sections: [] });
    builder.assets({
      logos: analysis.harvestedSVGs?.filter((s: any) => s.category === 'logo').map((s: any) => s.svg) || [],
      patterns: analysis.harvestedSVGs?.filter((s: any) => s.category === 'pattern').map((s: any) => s.svg) || [],
      icons: analysis.harvestedSVGs?.filter((s: any) => s.category === 'icon').map((s: any) => s.svg) || [],
      images: analysis.extractedImages || [],
    });

    builder.motionCSS(analysis.motionCSS || '');

    // === POPULATE NEW ELITE DESIGN DNA FIELDS ===

    // Detect container styles from the analysis
    const containerStyles = InspirationProfileBuilder.detectContainerStyles(analysis);
    builder.containerStyles(containerStyles);

    // Detect background treatments
    const backgrounds = InspirationProfileBuilder.detectBackgrounds(analysis);
    builder.backgrounds(backgrounds);

    // Detect visual assets
    const visualAssets = InspirationProfileBuilder.detectVisualAssets(analysis);
    builder.visualAssets(visualAssets);

    // Detect interaction patterns
    const interactions = InspirationProfileBuilder.detectInteractions(analysis);
    builder.interactions(interactions);

    // Detect motion libraries from motionCSS comment
    const motionLibraries = InspirationProfileBuilder.detectMotionLibraries(analysis);
    builder.detectedMotionLibraries(motionLibraries);

    return builder;
  }

  /**
   * Detect container styling patterns from analysis
   */
  private static detectContainerStyles(analysis: any): ContainerStyleConfig {
    const cssVars = analysis.cssVariables || {};
    const rawCSS = analysis.rawCSS || analysis.motionCSS || '';
    const shadows = analysis.extractedComponents?.shadows || [];
    const radii = analysis.extractedComponents?.borderRadii || [];

    // Detect glass morphism
    const hasGlassMorphism = rawCSS.includes('backdrop-filter') ||
                             rawCSS.includes('backdrop-blur') ||
                             rawCSS.includes('bg-white/') ||
                             rawCSS.includes('rgba(255') && rawCSS.includes('blur');

    // Detect gradient borders
    const hasGradientBorders = rawCSS.includes('border-image') ||
                               rawCSS.includes('gradient') && rawCSS.includes('border') ||
                               rawCSS.includes('before:bg-gradient');

    // Detect organic shapes
    const hasOrganicShapes = rawCSS.includes('blob') ||
                             rawCSS.includes('border-radius: 30%') ||
                             rawCSS.includes('border-radius: 40%') ||
                             rawCSS.includes('border-radius: 50% 30%') ||
                             radii.some((r: string) => r.includes('%') && !r.includes('50%'));

    // Determine card shape
    const avgRadius = radii.map((r: string) => parseFloat(r) || 0).filter((r: number) => r > 0);
    let cardShape: 'boxy' | 'rounded' | 'organic' | 'glass' = 'rounded';
    if (hasGlassMorphism) cardShape = 'glass';
    else if (hasOrganicShapes) cardShape = 'organic';
    else if (avgRadius.length > 0) {
      const avg = avgRadius.reduce((a: number, b: number) => a + b, 0) / avgRadius.length;
      if (avg < 4) cardShape = 'boxy';
      else if (avg >= 16) cardShape = 'organic';
    }

    // Determine border style
    let borderStyle: 'solid' | 'gradient' | 'glow' | 'none' = 'solid';
    if (hasGradientBorders) borderStyle = 'gradient';
    else if (rawCSS.includes('box-shadow') && rawCSS.includes('inset')) borderStyle = 'glow';

    // Determine shadow style
    let shadowStyle: 'none' | 'subtle' | 'elevated' | 'dramatic' = 'subtle';
    if (shadows.length === 0) shadowStyle = 'none';
    else if (shadows.some((s: string) => s.includes('20px') || s.includes('30px') || s.includes('40px'))) {
      shadowStyle = 'dramatic';
    } else if (shadows.some((s: string) => s.includes('10px') || s.includes('15px'))) {
      shadowStyle = 'elevated';
    }

    return {
      cardShape,
      borderStyle,
      shadowStyle,
      glassMorphism: hasGlassMorphism,
      hasGradientBorders,
      hasOrganicShapes,
    };
  }

  /**
   * Detect background treatments from analysis
   */
  private static detectBackgrounds(analysis: any): BackgroundConfig {
    const harvestedSVGs = analysis.harvestedSVGs || [];
    const extractedImages = analysis.extractedImages || [];
    const rawCSS = analysis.rawCSS || analysis.motionCSS || '';

    // Find gradient mesh SVGs
    const gradientMeshes = harvestedSVGs
      .filter((s: any) => s.category === 'pattern' && s.svg?.includes('Gradient'))
      .map((s: any) => s.svg)
      .slice(0, 5);

    // Detect noise textures
    const noiseTextures = rawCSS.includes('noise') ||
                          rawCSS.includes('grain') ||
                          extractedImages.some((img: string) => img.includes('noise') || img.includes('grain'));

    // Find grid patterns
    const gridPatterns = harvestedSVGs
      .filter((s: any) => s.category === 'pattern' &&
              (s.svg?.includes('grid') || s.svg?.includes('dot') || s.svg?.includes('line')))
      .map((s: any) => s.svg)
      .slice(0, 3);

    // Detect floating orbs (blur effects with absolute positioning)
    const floatingOrbs = rawCSS.includes('blur-3xl') ||
                         rawCSS.includes('blur-[') ||
                         (rawCSS.includes('position: absolute') && rawCSS.includes('blur')) ||
                         rawCSS.includes('animate-pulse') && rawCSS.includes('rounded-full');

    // Extract CSS gradients
    const gradientMatches: string[] = rawCSS.match(/(?:linear|radial|conic)-gradient\([^)]+\)/g) || [];
    const cssGradients: string[] = Array.from(new Set<string>(gradientMatches)).slice(0, 10);

    // Hero backgrounds (large images likely used for sections)
    const heroBackgrounds = extractedImages.filter((img: string) =>
      img.includes('hero') || img.includes('banner') || img.includes('background') ||
      img.includes('header') || img.includes('cover')
    ).slice(0, 5);

    return {
      gradientMeshes,
      noiseTextures,
      gridPatterns,
      floatingOrbs,
      cssGradients,
      heroBackgrounds,
    };
  }

  /**
   * Detect visual assets from analysis
   */
  private static detectVisualAssets(analysis: any): VisualAssetsConfig {
    const harvestedSVGs = analysis.harvestedSVGs || [];
    const extractedImages = analysis.extractedImages || [];

    // Decorative SVGs (patterns, blobs, shapes - not icons)
    const decorativeSvgs = harvestedSVGs
      .filter((s: any) => s.category === 'pattern' || s.category === 'illustration')
      .map((s: any) => s.svg)
      .slice(0, 10);

    // Hero images
    const heroImages = extractedImages.filter((img: string) =>
      !img.includes('icon') && !img.includes('logo') &&
      !img.includes('avatar') && !img.includes('thumbnail')
    ).slice(0, 10);

    // Illustrations
    const illustrations = harvestedSVGs
      .filter((s: any) => s.category === 'illustration')
      .map((s: any) => s.svg)
      .slice(0, 5);

    // Custom icons (from harvested SVGs marked as icons)
    const customIcons = harvestedSVGs
      .filter((s: any) => s.category === 'icon' && s.svg?.length > 200) // Filter out tiny generic icons
      .map((s: any) => s.svg)
      .slice(0, 20);

    // Logos
    const logos = harvestedSVGs
      .filter((s: any) => s.category === 'logo')
      .map((s: any) => s.svg)
      .slice(0, 5);

    return {
      decorativeSvgs,
      heroImages,
      illustrations,
      customIcons,
      logos,
    };
  }

  /**
   * Detect interaction patterns from analysis
   */
  private static detectInteractions(analysis: any): InteractionConfig {
    const rawCSS = analysis.rawCSS || analysis.motionCSS || '';
    const transitions = analysis.extractedComponents?.transitions || [];
    const motionTypes = analysis.extractedMotion?.animationTypes || [];
    const motionLibraries = analysis.extractedMotion?.libraries || [];

    // Detect custom cursor
    const customCursor = rawCSS.includes('cursor:') && !rawCSS.includes('cursor: pointer') ||
                         rawCSS.includes('cursor: none') ||
                         rawCSS.includes('cursor: url(');

    // Detect magnetic buttons
    const magneticButtons = rawCSS.includes('magnetic') ||
                           rawCSS.includes('transform') && rawCSS.includes('mouse') ||
                           motionTypes.includes('magnetic');

    // Detect scroll animation style
    let scrollAnimations: 'none' | 'fade' | 'slide' | 'parallax' | 'stagger' = 'fade';
    if (motionTypes.includes('Parallax') || rawCSS.includes('parallax') || rawCSS.includes('scroll-speed')) {
      scrollAnimations = 'parallax';
    } else if (rawCSS.includes('stagger') || rawCSS.includes('delay') && rawCSS.includes('children')) {
      scrollAnimations = 'stagger';
    } else if (rawCSS.includes('translateY') || rawCSS.includes('slide')) {
      scrollAnimations = 'slide';
    } else if (motionTypes.length === 0 && transitions.length < 3) {
      scrollAnimations = 'none';
    }

    // Extract hover transforms
    const hoverTransforms: string[] = [];
    const transformMatches = rawCSS.match(/transform:\s*([^;]+)/g) || [];
    transformMatches.forEach((match: string) => {
      const value = match.replace('transform:', '').trim();
      if (value && !value.includes('none') && !hoverTransforms.includes(value)) {
        hoverTransforms.push(value);
      }
    });

    // Detect advanced motion usage
    const usesAdvancedMotion = motionLibraries.length > 0 ||
                               rawCSS.includes('GSAP') ||
                               rawCSS.includes('Framer Motion') ||
                               rawCSS.includes('spring(') ||
                               rawCSS.includes('cubic-bezier(0.68') || // Elastic easing
                               rawCSS.includes('cubic-bezier(0.87'); // Bounce easing

    // Detect entrance animation
    let entranceAnimation: 'none' | 'fade-up' | 'fade-in' | 'scale' | 'blur-in' | 'slide' = 'fade-up';
    if (rawCSS.includes('scale(0') || rawCSS.includes('scale3d(0')) {
      entranceAnimation = 'scale';
    } else if (rawCSS.includes('blur(') && rawCSS.includes('opacity')) {
      entranceAnimation = 'blur-in';
    } else if (rawCSS.includes('translateX(') && !rawCSS.includes('translateY(')) {
      entranceAnimation = 'slide';
    } else if (!rawCSS.includes('translateY') && rawCSS.includes('opacity')) {
      entranceAnimation = 'fade-in';
    }

    return {
      customCursor,
      magneticButtons,
      scrollAnimations,
      hoverTransforms: hoverTransforms.slice(0, 10),
      usesAdvancedMotion,
      entranceAnimation,
    };
  }

  /**
   * Detect motion libraries from analysis
   */
  private static detectMotionLibraries(analysis: any): string[] {
    const libraries: string[] = [];
    const motionCSS = analysis.motionCSS || '';
    const motionTypes = analysis.extractedMotion?.libraries || [];

    // From detected motion libraries
    libraries.push(...motionTypes);

    // From motionCSS comment (our new extraction adds this)
    const commentMatch = motionCSS.match(/Motion Libraries Detected:\s*([^\n]+)/);
    if (commentMatch) {
      const detected = commentMatch[1].split(',').map((s: string) => s.trim());
      libraries.push(...detected);
    }

    return [...new Set(libraries)];
  }

  /**
   * Extract and normalize colors from URL analysis
   */
  private static extractColorsFromAnalysis(analysis: any): ColorPalette {
    const defaults = getDefaultColorPalette();

    // Helper to normalize color to hex
    const normalizeColor = (color: string): string | null => {
      if (!color) return null;
      color = color.trim();
      if (/^#[0-9A-Fa-f]{6}$/.test(color)) return color.toUpperCase();
      if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
        const r = color[1], g = color[2], b = color[3];
        return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
      }
      const rgbMatch = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
        const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
        const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`.toUpperCase();
      }
      return null;
    };

    // Helper to check if color is light
    const isLightColor = (hex: string): boolean => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    };

    // Helper to get contrasting color
    const getContrastingColor = (bg: string): string => {
      return isLightColor(bg) ? '#0A0A0A' : '#FAFAFA';
    };

    // Collect all colors
    const allColors: string[] = [];
    if (analysis.extractedColors) {
      allColors.push(...(analysis.extractedColors.backgrounds || []));
      allColors.push(...(analysis.extractedColors.texts || []));
      allColors.push(...(analysis.extractedColors.accents || []));
      allColors.push(...(analysis.extractedColors.borders || []));
    }

    // Extract from CSS variables if available
    if (analysis.cssVariables) {
      Object.values(analysis.cssVariables).forEach((value: any) => {
        if (typeof value === 'string') {
          const normalized = normalizeColor(value);
          if (normalized) allColors.push(normalized);
        }
      });
    }

    // Normalize and dedupe
    const normalizedColors = [...new Set(
      allColors.map(c => normalizeColor(c)).filter((c): c is string => c !== null)
    )];

    if (normalizedColors.length === 0) {
      return defaults;
    }

    // Find vibrant (saturated) color for primary
    let primaryColor = defaults.primary;
    let maxSaturation = 0;
    for (const hex of normalizedColors) {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;
      const s = max === min ? 0 : (l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min));
      if (s > maxSaturation && l > 0.2 && l < 0.8) {
        maxSaturation = s;
        primaryColor = hex;
      }
    }

    // Categorize colors
    const lightColors = normalizedColors.filter(c => isLightColor(c));
    const darkColors = normalizedColors.filter(c => !isLightColor(c));

    // Extract background colors
    const bgFromAnalysis = (analysis.extractedColors?.backgrounds || []).map(normalizeColor).filter(Boolean) as string[];
    const bgLight = bgFromAnalysis.find(c => isLightColor(c)) || lightColors[0] || '#FFFFFF';
    const bgDark = bgFromAnalysis.find(c => !isLightColor(c)) || darkColors[0] || '#0A0A0A';

    // Extract text colors
    const textFromAnalysis = (analysis.extractedColors?.texts || []).map(normalizeColor).filter(Boolean) as string[];
    const textLight = textFromAnalysis.find(c => !isLightColor(c)) || darkColors[0] || '#0A0A0A';
    const textDark = textFromAnalysis.find(c => isLightColor(c)) || lightColors[0] || '#FAFAFA';

    // Find secondary/accent colors
    const accentColors = normalizedColors.filter(c => c !== primaryColor && c !== bgLight && c !== bgDark);
    const accentColor = accentColors[0] || defaults.accent;

    return {
      primary: primaryColor,
      primaryForeground: getContrastingColor(primaryColor),
      secondary: accentColors[1] || defaults.secondary,
      secondaryForeground: '#FFFFFF',
      accent: accentColor,
      accentForeground: getContrastingColor(accentColor),
      background: { light: bgLight, dark: bgDark },
      foreground: { light: textLight, dark: textDark },
      surface: { light: lightColors[1] || '#F5F5F5', dark: darkColors[1] || '#1A1A1A' },
      muted: { light: '#F4F4F5', dark: '#27272A' },
      mutedForeground: { light: '#71717A', dark: '#A1A1AA' },
      border: { light: lightColors[2] || '#E4E4E7', dark: darkColors[2] || '#27272A' },
      gradients: [],
    };
  }

  /**
   * Infer spacing density from analysis
   */
  private static inferSpacingDensity(analysis: any): 'tight' | 'comfortable' | 'spacious' {
    const allSpacing = [
      ...(analysis.extractedSpacing?.gaps || []),
      ...(analysis.extractedSpacing?.paddings || []),
    ].map(s => parseFloat(s) || 0).filter(s => s > 0);

    if (allSpacing.length === 0) return 'comfortable';

    const avgSpacing = allSpacing.reduce((a, b) => a + b, 0) / allSpacing.length;
    if (avgSpacing >= 32) return 'spacious';
    if (avgSpacing >= 16) return 'comfortable';
    return 'tight';
  }

  /**
   * Infer border radius from analysis
   */
  private static inferBorderRadius(analysis: any): 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' {
    const radii = (analysis.extractedComponents?.borderRadii || [])
      .map((r: string) => parseFloat(r) || 0)
      .filter((r: number) => r > 0);

    if (radii.length === 0) return 'md';

    const avgRadius = radii.reduce((a: number, b: number) => a + b, 0) / radii.length;
    if (avgRadius >= 24) return 'full';
    if (avgRadius >= 16) return 'xl';
    if (avgRadius >= 12) return 'lg';
    if (avgRadius >= 8) return 'md';
    if (avgRadius >= 4) return 'sm';
    return 'none';
  }

  /**
   * Create a builder from an ExtractedDesignLanguage
   */
  static fromExtracted(ext: any): InspirationProfileBuilder {
    const builder = new InspirationProfileBuilder(`From ${ext.source.value}`);

    // Heuristic mapping
    builder.colors({
      primary: ext.colors.primary[0] || '#3B82F6',
      primaryForeground: '#FFFFFF',
      secondary: ext.colors.secondary[0] || '#6B7280',
      secondaryForeground: '#FFFFFF',
      accent: ext.colors.accent[0] || '#8B5CF6',
      accentForeground: '#FFFFFF',
      background: { light: ext.colors.background[0] || '#FFFFFF', dark: ext.colors.background[2] || '#0A0A0A' },
      foreground: { light: ext.colors.text[0] || '#0A0A0A', dark: '#FAFAFA' },
      surface: { light: ext.colors.background[1] || '#F4F4F5', dark: '#18181B' },
      muted: { light: '#F4F4F5', dark: '#27272A' },
      mutedForeground: { light: ext.colors.text[1] || '#71717A', dark: '#A1A1AA' },
      border: { light: '#E4E4E7', dark: '#27272A' },
      gradients: ext.colors.gradients.map((g: string, i: number) => ({
        id: `grad-${i}`,
        type: 'linear',
        cssValue: g,
        stops: []
      })),
    });

    builder.typography({
      headingFont: ext.typography.fontStack,
      bodyFont: ext.typography.fontStack,
      monoFont: ['JetBrains Mono', 'monospace'],
      scale: 'normal',
      headingWeight: 'semibold',
      bodyWeight: 'normal',
      letterSpacing: 'normal',
      lineHeight: 'normal',
    });

    builder.motion({
      level: ext.motion.level === 'minimal' ? 'subtle' : ext.motion.level,
      duration: { fast: 150, normal: ext.motion.duration || 200, slow: 400 },
      easing: ext.motion.easing || 'ease-out',
      entranceStyle: 'fade',
      hoverEffects: true,
      scrollAnimations: true,
    });

    builder.componentStyles({
      borderRadius: ext.components.borderRadius || 'md',
      shadow: ext.components.shadows === 'dramatic' ? 'dramatic' : 'subtle',
      border: 'subtle',
      buttonStyle: ext.components.buttonStyle || 'solid',
      cardStyle: ext.components.cardStyle || 'bordered',
      inputStyle: 'bordered',
      avatarStyle: 'circle',
    });

    return builder;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export { InspirationProfileBuilder as ProfileBuilder };


// =============================================================================
// DEFAULT VALUES
// =============================================================================

export function getDefaultColorPalette(): ColorPalette {
  return {
    primary: '#3B82F6',
    primaryForeground: '#FFFFFF',
    secondary: '#6B7280',
    secondaryForeground: '#FFFFFF',
    accent: '#8B5CF6',
    accentForeground: '#FFFFFF',
    background: { light: '#FFFFFF', dark: '#0A0A0A' },
    foreground: { light: '#0A0A0A', dark: '#FAFAFA' },
    surface: { light: '#F4F4F5', dark: '#18181B' },
    muted: { light: '#F4F4F5', dark: '#27272A' },
    mutedForeground: { light: '#71717A', dark: '#A1A1AA' },
    border: { light: '#E4E4E7', dark: '#27272A' },
    gradients: [],
  };
}

export function getDefaultTypography(): TypographyConfig {
  return {
    headingFont: ['Inter', 'system-ui', 'sans-serif'],
    bodyFont: ['Inter', 'system-ui', 'sans-serif'],
    monoFont: ['JetBrains Mono', 'Menlo', 'monospace'],
    scale: 'normal',
    headingWeight: 'semibold',
    bodyWeight: 'normal',
    letterSpacing: 'normal',
    lineHeight: 'normal',
  };
}

export function getDefaultSpacing(): SpacingConfig {
  return {
    density: 'comfortable',
    baseUnit: 4,
    sectionGap: 'py-16 md:py-24',
    componentGap: 'gap-6',
    containerPadding: 'px-4 md:px-6 lg:px-8',
    cardPadding: 'p-6',
  };
}

export function getDefaultMotion(): MotionConfig {
  return {
    level: 'subtle',
    duration: { fast: 150, normal: 200, slow: 300 },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    entranceStyle: 'fade',
    hoverEffects: true,
    scrollAnimations: false,
  };
}

export function getDefaultComponentStyles(): ComponentStyleConfig {
  return {
    borderRadius: 'md',
    shadow: 'subtle',
    border: 'subtle',
    buttonStyle: 'solid',
    cardStyle: 'bordered',
    inputStyle: 'bordered',
    avatarStyle: 'circle',
  };
}

export function getDefaultBlockPreferences(): BlockPreferenceConfig {
  return {
    hero: {
      preferredVariant: 'centered',
      hasBackgroundPattern: false,
      hasGradientOverlay: false,
      textAlignment: 'center',
      minHeight: 'medium',
    },
    features: {
      preferredVariant: 'grid',
      iconStyle: 'minimal',
      gridColumns: 3,
      cardStyle: 'subtle',
    },
    pricing: {
      preferredVariant: 'simple',
      highlightStyle: 'scale',
      showAnnualToggle: true,
    },
    testimonials: {
      preferredVariant: 'carousel',
      avatarStyle: 'circle',
      showCompanyLogo: true,
      showRating: false,
    },
    cta: {
      preferredVariant: 'simple',
      hasBackgroundPattern: false,
      backgroundStyle: 'accent',
    },
    sidebar: {
      preferredVariant: 'collapsible',
      iconPosition: 'left',
      showLabels: true,
      collapsible: true,
    },
    dataTable: {
      preferredVariant: 'with-pagination',
      rowDensity: 'comfortable',
      showBorders: true,
      stripedRows: false,
    },
  };
}

export function getDefaultTuners(): AppliedTuners {
  return {
    abstraction: 0.5,
    density: 0.5,
    motion: 0.5,
    contrast: 0.5,
    narrative: 0.5,
  };
}

export function getDefaultContainerStyles(): ContainerStyleConfig {
  return {
    cardShape: 'rounded',
    borderStyle: 'solid',
    shadowStyle: 'subtle',
    glassMorphism: false,
    hasGradientBorders: false,
    hasOrganicShapes: false,
  };
}

export function getDefaultBackgrounds(): BackgroundConfig {
  return {
    gradientMeshes: [],
    noiseTextures: false,
    gridPatterns: [],
    floatingOrbs: false,
    cssGradients: [],
    heroBackgrounds: [],
  };
}

export function getDefaultVisualAssets(): VisualAssetsConfig {
  return {
    decorativeSvgs: [],
    heroImages: [],
    illustrations: [],
    customIcons: [],
    logos: [],
  };
}

export function getDefaultInteractions(): InteractionConfig {
  return {
    customCursor: false,
    magneticButtons: false,
    scrollAnimations: 'fade',
    hoverTransforms: [],
    usesAdvancedMotion: false,
    entranceAnimation: 'fade-up',
  };
}

// =============================================================================
// PROFILE MERGING
// =============================================================================

/**
 * Merge multiple profiles with weights
 */
export function mergeProfiles(
  profiles: { profile: InspirationProfile; weight: number }[]
): InspirationProfile {
  if (profiles.length === 0) {
    return new InspirationProfileBuilder('Empty Profile').build();
  }

  if (profiles.length === 1) {
    return profiles[0].profile;
  }

  // Normalize weights
  const totalWeight = profiles.reduce((sum, p) => sum + p.weight, 0);
  const normalized = profiles.map((p) => ({
    ...p,
    weight: p.weight / totalWeight,
  }));

  // For now, use the highest weighted profile as base
  const sorted = [...normalized].sort((a, b) => b.weight - a.weight);
  const base = sorted[0].profile;

  // Merge tuners as weighted average
  const mergedTuners: AppliedTuners = {
    abstraction: normalized.reduce(
      (sum, p) => sum + p.profile.tuners.abstraction * p.weight,
      0
    ),
    density: normalized.reduce(
      (sum, p) => sum + p.profile.tuners.density * p.weight,
      0
    ),
    motion: normalized.reduce(
      (sum, p) => sum + p.profile.tuners.motion * p.weight,
      0
    ),
    contrast: normalized.reduce(
      (sum, p) => sum + p.profile.tuners.contrast * p.weight,
      0
    ),
    narrative: normalized.reduce(
      (sum, p) => sum + p.profile.tuners.narrative * p.weight,
      0
    ),
  };

  // Collect all sources
  const allSources = profiles.flatMap((p) => p.profile.sources);

  return {
    ...base,
    id: `merged-${Date.now()}`,
    name: `Merged: ${profiles.map((p) => p.profile.name).join(' + ')}`,
    sources: allSources,
    tuners: mergedTuners,
    confidence: normalized.reduce(
      (sum, p) => sum + p.profile.confidence * p.weight,
      0
    ),
    updatedAt: new Date().toISOString(),
  };
}

// =============================================================================
// PROFILE SERIALIZATION
// =============================================================================

/**
 * Serialize profile to JSON
 */
export function serializeProfile(profile: InspirationProfile): string {
  return JSON.stringify(profile, null, 2);
}

/**
 * Deserialize profile from JSON
 */
export function deserializeProfile(json: string): InspirationProfile {
  const parsed = JSON.parse(json);
  // Validate structure
  if (!parsed.id || !parsed.name || !parsed.colors) {
    throw new Error('Invalid profile JSON');
  }
  return parsed as InspirationProfile;
}
