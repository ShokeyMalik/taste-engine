/**
 * Core Type Definitions for Taste Engine
 *
 * These types define the structure of theme packs and recipes.
 */

// =============================================================================
// BASIC TYPES
// =============================================================================

export type ThemeMode = 'dark' | 'light';
export type PageContext = 'product' | 'marketing';

/**
 * Marketing audience persona
 */
export type MarketingAudience = 'hotel-owner' | 'developer';

/**
 * Marketing intent
 */
export type MarketingIntent = 'convert' | 'inform' | 'engage';

// =============================================================================
// TOKEN TYPES
// =============================================================================

export interface TypeScaleToken {
  fontSize: string;
  fontWeight: string;
  letterSpacing: string;
  lineHeight: string;
  textTransform?: string;
}

export interface DensityTokens {
  tableRowHeight: string;
  tableRowHeightCompact: string;
  controlHeight: string;
  controlHeightSm: string;
  pageGutter: string;
  sectionGap: string;
  cardPadding: string;
  cardPaddingCompact: string;
}

export interface ThemeTokens {
  bg: string;
  surface: string;
  surface2: string;
  surfaceInset: string;
  border: string;
  borderSubtle: string;
  text: string;
  textMuted: string;
  accent: string;
  accentFg: string;
  accentMuted: string;
  accentSecondary: string;
  ring: string;
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  danger: string;
  dangerMuted: string;
  shadowSurface: string;
  shadowPopover: string;
  shadowGlow: string;
  radiusSurface: string;
  radiusControl: string;
  typeScale: {
    h1: TypeScaleToken;
    h2: TypeScaleToken;
    h3: TypeScaleToken;
    body: TypeScaleToken;
    kpi: TypeScaleToken;
    kpiCompact: TypeScaleToken;
    label: TypeScaleToken;
  };
  density: DensityTokens;
}

// =============================================================================
// RECIPE TYPES
// =============================================================================

export interface SurfaceRecipe {
  border: boolean;
  borderOpacity: string;
  shadow: boolean;
  shadowStrength?: 'normal' | 'strong';
  gradient?: boolean;
  gradientDirection?: string;
  gradientFrom?: string;
  gradientTo?: string;
  background?: string;
  innerHighlight?: boolean;
  innerHighlightOpacity?: string;
}

/**
 * Icon system recipe
 */
export interface IconSystemRecipe {
  defaultSize: number;
  compactSize: number;
  largeSize: number;
  strokeWidth: number;
  mutedOpacity: string;
  colorMode: 'currentColor' | 'accent' | 'muted';
}

/**
 * Placeholder/loading state recipe
 */
export interface PlaceholderRecipe {
  style: 'skeleton' | 'blur' | 'pulse';
  shimmer: boolean;
  shimmerDirection: 'ltr' | 'rtl';
  baseColor: string;
  highlightColor: string;
  borderRadius: string;
}

/**
 * Background motif recipe
 */
export interface BackgroundMotifRecipe {
  heroMotif: 'none' | 'gridLines' | 'dots' | 'noise' | 'radialGlow';
  motifSpacing?: string;
  motifOpacity: string;
  motifColor: string;
}

/**
 * Combined Media recipes
 */
export interface MediaRecipes {
  icon: IconSystemRecipe;
  placeholder: PlaceholderRecipe;
  backgroundMotif: BackgroundMotifRecipe;
}

/**
 * Motion duration presets
 */
export interface MotionDurations {
  instant: number;
  fast: number;
  normal: number;
  slow: number;
  deliberate: number;
}

/**
 * Motion easing presets
 */
export interface MotionEasings {
  default: string;
  enter: string;
  exit: string;
  spring: string;
}

/**
 * Motion behavior per context
 */
export interface MotionBehavior {
  enabled: boolean;
  loadingStyle: 'shimmer' | 'pulse' | 'none';
  hoverTransition: 'none' | 'fast' | 'normal';
  entranceAnimation: 'none' | 'fade' | 'slideUp' | 'scale';
  staggerDelay: number;
}

/**
 * Combined Motion recipes
 */
export interface MotionRecipes {
  durations: MotionDurations;
  easings: MotionEasings;
  behavior: MotionBehavior;
}

// =============================================================================
// NARRATIVE RECIPES (Marketing)
// =============================================================================

export type MotifType = 'grid' | 'noise' | 'glowField' | 'signalPaths' | 'dots' | 'radialGlow';

export interface MotifLayer {
  type: MotifType;
  opacity: number;
  color: string;
  blur?: number;
  scale?: number;
  animate?: 'none' | 'drift' | 'pulse' | 'breathe';
  zIndex?: number;
}

export interface MotifsRecipe {
  layers: MotifLayer[];
  intensity: number;
  audienceOverrides?: {
    'hotel-owner'?: Partial<MotifLayer>[];
    'developer'?: Partial<MotifLayer>[];
  };
}

export type MarketingSectionType =
  | 'hero'
  | 'narrative2'
  | 'proof3'
  | 'banner'
  | 'stackedCards'
  | 'features'
  | 'testimonials'
  | 'cta';

export interface StoryboardSection {
  type: MarketingSectionType;
  id: string;
  motion?: 'none' | 'fadeUp' | 'slideIn' | 'scale';
  withMotifs?: boolean;
  signatureBlock?: 'SignalPathGraphic' | 'StackedCards' | 'MetricRibbon' | null;
}

export interface StoryboardRecipe {
  sections: StoryboardSection[];
  audienceOverrides?: {
    'hotel-owner'?: string[];
    'developer'?: string[];
  };
}

export interface SignalPathRecipe {
  strokeColor: string;
  strokeOpacity: number;
  strokeWidth: number;
  nodeColor: string;
  nodeGlow: boolean;
  blur: number;
  gradient?: {
    from: string;
    to: string;
    direction: string;
  };
  animateOnScroll: boolean;
  complexity: 'simple' | 'medium' | 'complex';
}

export interface StackedCardsRecipe {
  rotationRange: number;
  shadowDepth: 'subtle' | 'medium' | 'dramatic';
  borderStyle: 'none' | 'subtle' | 'accent';
  hoverEffect: 'none' | 'lift' | 'tilt' | 'fan';
  visibleCards: number;
  stackDirection: 'left' | 'right' | 'center';
}

export interface MetricRibbonRecipe {
  background: 'transparent' | 'surface' | 'accent-muted' | 'gradient';
  separator: 'none' | 'line' | 'dot';
  valueStyle: 'bold' | 'light' | 'gradient';
  labelStyle: 'muted' | 'normal';
  count: 3 | 4 | 5;
}

export interface SignatureBlocksRecipe {
  signalPath: boolean;
  stackedCards: boolean;
  metricRibbon: boolean;
  signalPathConfig: SignalPathRecipe;
  stackedCardsConfig: StackedCardsRecipe;
  metricRibbonConfig: MetricRibbonRecipe;
}

export interface MotionBindingsRecipe {
  hero: {
    entrance: 'none' | 'fadeUp' | 'scale';
    motifAnimation: 'none' | 'drift' | 'breathe';
  };
  features: {
    entrance: 'none' | 'fadeUp' | 'stagger';
    staggerDelay: number;
  };
  signatureBlocks: {
    signalPath: 'none' | 'draw' | 'pulse';
    stackedCards: 'none' | 'cascade' | 'fan';
    metricRibbon: 'none' | 'countUp' | 'slideIn';
  };
}

// =============================================================================
// CONTEXT-SPECIFIC RECIPES
// =============================================================================

/**
 * Product context recipes - dense, operational, restrained
 */
export interface ProductRecipes {
  AppShell: {
    backgroundTreatment: 'none' | 'chronicle';
    glowColor: string;
    glowOpacity: string;
    vignetteOpacity: string;
  };
  Surface: {
    default: SurfaceRecipe;
    inset: SurfaceRecipe;
    floating: SurfaceRecipe;
  };
  StatCard: {
    style: 'minimal' | 'clean' | 'accent';
    accentMode: 'none' | 'single' | 'perCard';
    accentElement: 'none' | 'leftHairline' | 'topBorder' | 'dot';
    accentWidth?: string;
    primaryHighlight: boolean;
    valueFontStyle: string;
    labelFontStyle: string;
  };
  SectionHeader: {
    style: 'chronicle' | 'clean';
    titleWeight: string;
    subtitleOpacity: string;
    subtitleMaxWidth: string;
    spacing: {
      top: string;
      bottom: string;
    };
  };
  DataTable: {
    density: 'compact' | 'comfortable';
    headerStyle: 'muted' | 'muted-uppercase';
    rowHover: 'none' | 'subtle';
    separatorStyle: 'none' | 'faint' | 'normal';
    separatorOpacity: string;
  };
  HeroHeader: {
    style: 'chronicle' | 'clean';
    titleSize: 'h1' | 'h2';
    subtitleMuted: boolean;
    actionsGrouped: boolean;
    spacing: {
      paddingY: string;
    };
  };
  ActivityTable: {
    density: 'compact' | 'comfortable';
    headerStyle: 'muted' | 'muted-uppercase';
    headerTracking: string;
    headerOpacity: string;
    rowHover: 'none' | 'subtle';
    rowHoverBg: string;
    separatorOpacity: string;
    iconBg: string;
    iconOpacity: string;
    amountWeight: string;
    timeOpacity: string;
    containerBg: string;
    containerBorder: boolean;
    containerBorderOpacity: string;
  };
  Toolbar: {
    variant: 'inset' | 'surface';
    height: string;
    itemHeight: string;
    itemPadding: string;
    gap: string;
    separatorColor: string;
    separatorOpacity: string;
    separatorHeight: string;
  };
  media: MediaRecipes;
  motion: MotionRecipes;
}

/**
 * Marketing context recipes - expressive, narrative, accent can breathe
 */
export interface MarketingRecipes {
  AppShell: {
    backgroundTreatment: 'none' | 'chronicle' | 'gradient';
    glowColor: string;
    glowOpacity: string;
    vignetteOpacity: string;
  };
  Surface: {
    default: SurfaceRecipe;
    hero: SurfaceRecipe;
    feature: SurfaceRecipe;
  };
  Hero: {
    titleSize: string;
    titleWeight: string;
    titleTracking: string;
    titleMaxWidth: string;
    subtitleSize: string;
    subtitleOpacity: string;
    subtitleMaxWidth: string;
    spacing: {
      paddingY: string;
      gap: string;
    };
    accentGradient: boolean;
  };
  SectionHeader: {
    style: 'chronicle' | 'clean' | 'centered';
    titleWeight: string;
    titleSize: string;
    subtitleOpacity: string;
    subtitleMaxWidth: string;
    spacing: {
      top: string;
      bottom: string;
    };
  };
  FeatureCard: {
    style: 'minimal' | 'elevated' | 'glass';
    iconStyle: 'accent' | 'muted' | 'gradient';
    hoverEffect: 'none' | 'lift' | 'glow';
  };
  AccentUsage: {
    gradientAllowed: boolean;
    textEmphasisAllowed: boolean;
    backgroundGradient?: string;
  };
  LayoutRhythm: {
    sectionGap: string;
    heroBottomGap: string;
    featureGap: string;
  };
  media: MediaRecipes;
  motion: MotionRecipes;
  motifs: MotifsRecipe;
  storyboard: StoryboardRecipe;
  signatureBlocks: SignatureBlocksRecipe;
  motionBindings: MotionBindingsRecipe;
}

/**
 * Context-resolved recipes
 */
export type ContextRecipes = ProductRecipes | MarketingRecipes;

/**
 * Full theme recipes containing both contexts
 */
export interface ThemeRecipes {
  product: ProductRecipes;
  marketing: MarketingRecipes;
}

/**
 * Legacy flat recipes (for backward compatibility)
 */
export type LegacyRecipes = ProductRecipes;

/**
 * Complete theme pack
 */
export interface ThemePack {
  name: string;
  mode: ThemeMode;
  tokens: ThemeTokens;
  recipes: ThemeRecipes | LegacyRecipes;
}

/**
 * Partial product recipes for theme definitions
 * Allows themes to define only the recipes they want to override
 */
export type PartialProductRecipes = Partial<Omit<ProductRecipes, 'Surface'>> & {
  Surface?: Partial<ProductRecipes['Surface']>;
};

/**
 * Theme definition input - allows partial recipes
 * The engine will merge with defaults to create a complete ThemePack
 */
export interface ThemeDefinition {
  name: string;
  mode: ThemeMode;
  tokens: ThemeTokens;
  recipes?: PartialProductRecipes;
}
