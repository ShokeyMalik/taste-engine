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

  // Harvested assets
  assets: {
    logos: string[];
    patterns: string[];
    icons: string[];
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
}

export interface InspirationSourceSummary {
  type: 'url' | 'screenshot' | 'brand' | 'description';
  value: string;
  weight: number;
  aspects: InspirationAspect[];
  extractedAt: string;
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
      this.profile.assets = { logos: [], patterns: [], icons: [] };
    }

    this.profile.updatedAt = new Date().toISOString();

    return this.profile as InspirationProfile;
  }

  /**
   * Create a builder from a URLAnalysisResult
   */
  static fromAnalysis(analysis: any): InspirationProfileBuilder {
    const builder = new InspirationProfileBuilder(`From ${analysis.url}`);

    // Colors
    builder.colors({
      primary: analysis.extractedColors.accents[0] || '#3B82F6',
      primaryForeground: '#FFFFFF',
      secondary: analysis.extractedColors.accents[1] || '#6B7280',
      secondaryForeground: '#FFFFFF',
      accent: analysis.extractedColors.accents[2] || '#8B5CF6',
      accentForeground: '#FFFFFF',
      background: { light: '#FFFFFF', dark: '#0C0E14' },
      foreground: { light: '#0A0A0B', dark: '#FFFFFF' },
      surface: { light: '#F5F5F5', dark: '#161A24' },
      muted: { light: '#8B8B8B', dark: '#525252' },
      mutedForeground: { light: '#525252', dark: '#8B8B8B' },
      border: { light: '#E5E5E5', dark: '#1E293B' },
      gradients: []
    });

    // Typography
    builder.typography({
      headingFont: analysis.extractedTypography.fontFamilies.slice(0, 1),
      bodyFont: analysis.extractedTypography.fontFamilies.slice(0, 1),
      monoFont: ['JetBrains Mono', 'monospace'],
      scale: 'normal',
      headingWeight: 'bold',
      bodyWeight: 'normal',
      lineHeight: 'relaxed',
      letterSpacing: 'tight',
    });

    // Archetypes & Assets
    builder.archetypes(analysis.extractedArchetypes || {});
    builder.assets({
      logos: analysis.harvestedSVGs?.filter((s: any) => s.category === 'logo').map((s: any) => s.svg) || [],
      patterns: analysis.harvestedSVGs?.filter((s: any) => s.category === 'pattern').map((s: any) => s.svg) || [],
      icons: analysis.harvestedSVGs?.filter((s: any) => s.category === 'icon').map((s: any) => s.svg) || [],
    });

    builder.motionCSS(analysis.motionCSS || '');

    return builder;
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


