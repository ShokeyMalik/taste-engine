/**
 * Block Types - Core type definitions for the block registry system
 *
 * This module defines all block types, variants, and related interfaces
 * for the taste-engine block generation system.
 */

// =============================================================================
// BLOCK CATEGORY & TYPE DEFINITIONS
// =============================================================================

export type BlockCategory = 'landing' | 'dashboard' | 'shared';

export type LandingBlockType =
  | 'hero'
  | 'navigation'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'faq'
  | 'cta'
  | 'footer'
  | 'logo-cloud'
  | 'stats';

export type DashboardBlockType =
  | 'sidebar'
  | 'header'
  | 'data-table'
  | 'metric-cards'
  | 'chart-section'
  | 'activity-feed'
  | 'settings-panel'
  | 'command-palette';

export type SharedBlockType = 'auth' | 'empty-state' | 'error-page' | 'loading';

export type BlockType = LandingBlockType | DashboardBlockType | SharedBlockType;

// =============================================================================
// VARIANT TYPE DEFINITIONS
// =============================================================================

// Landing block variants
export type HeroVariant =
  | 'centered'
  | 'split'
  | 'video-bg'
  | 'gradient-orbs'
  | 'minimal';
export type NavigationVariant =
  | 'simple'
  | 'mega-menu'
  | 'sticky'
  | 'transparent';
export type FeaturesVariant =
  | 'grid'
  | 'alternating'
  | 'with-icons'
  | 'with-screenshots';
export type PricingVariant = 'simple' | 'comparison' | 'toggle-annual';
export type TestimonialsVariant = 'carousel' | 'grid' | 'single-featured';
export type FAQVariant = 'accordion' | 'two-column';
export type CTAVariant = 'simple' | 'split' | 'newsletter';
export type FooterVariant = 'simple' | 'multi-column' | 'with-newsletter';
export type LogoCloudVariant = 'simple' | 'with-heading' | 'scrolling';
export type StatsVariant = 'simple' | 'with-description' | 'with-icons';

// Dashboard block variants
export type SidebarVariant = 'collapsible' | 'mini' | 'with-sections';
export type HeaderVariant = 'simple' | 'with-search' | 'with-breadcrumbs';
export type DataTableVariant = 'simple' | 'with-filters' | 'with-pagination';
export type MetricCardsVariant = 'simple' | 'with-sparkline' | 'with-trend';
export type ChartSectionVariant = 'area' | 'bar' | 'line' | 'pie' | 'combo';
export type ActivityFeedVariant = 'simple' | 'with-avatars' | 'timeline';
export type SettingsPanelVariant = 'tabs' | 'sections' | 'modal';
export type CommandPaletteVariant = 'simple' | 'with-categories';

// Shared block variants
export type AuthVariant = 'login' | 'signup' | 'forgot-password' | 'magic-link';
export type EmptyStateVariant = 'simple' | 'with-action' | 'illustrated';
export type ErrorPageVariant = '404' | '500' | 'maintenance';
export type LoadingVariant = 'skeleton' | 'spinner' | 'shimmer';

// Union of all variants
export type BlockVariantType =
  | HeroVariant
  | NavigationVariant
  | FeaturesVariant
  | PricingVariant
  | TestimonialsVariant
  | FAQVariant
  | CTAVariant
  | FooterVariant
  | LogoCloudVariant
  | StatsVariant
  | SidebarVariant
  | HeaderVariant
  | DataTableVariant
  | MetricCardsVariant
  | ChartSectionVariant
  | ActivityFeedVariant
  | SettingsPanelVariant
  | CommandPaletteVariant
  | AuthVariant
  | EmptyStateVariant
  | ErrorPageVariant
  | LoadingVariant;

// =============================================================================
// BLOCK VARIANT DEFINITION
// =============================================================================

export interface BlockVariant<T extends string = string> {
  /** Unique identifier for the variant */
  id: T;
  /** Human-readable name */
  name: string;
  /** Description of when to use this variant */
  description: string;
  /** Preview image URL (optional) */
  previewImage?: string;
  /** Complexity level affects generation time and code size */
  complexity: 'simple' | 'moderate' | 'complex';
  /** npm packages required for this variant */
  requiredDependencies: string[];
  /** Optional npm packages that enhance the variant */
  optionalDependencies: string[];
  /** shadcn/ui components used in this variant */
  shadcnComponents: string[];
  /** Preferred border radius style */
  radiusPreference: 'default' | 'rounded' | 'sharp';
  /** Tags for searchability */
  tags: string[];
}

// =============================================================================
// BLOCK PROP DEFINITIONS
// =============================================================================

export type PropType =
  | 'string'
  | 'boolean'
  | 'number'
  | 'array'
  | 'object'
  | 'slot'
  | 'enum';

export interface BlockPropDefinition {
  /** Property name */
  name: string;
  /** Property type */
  type: PropType;
  /** Whether the prop is required */
  required: boolean;
  /** Default value if not provided */
  default?: unknown;
  /** Human-readable description */
  description: string;
  /** For enum types, the allowed values */
  enumValues?: string[];
  /** For array types, the item type */
  arrayItemType?: PropType;
}

// =============================================================================
// BLOCK SLOT DEFINITIONS
// =============================================================================

export interface BlockSlot {
  /** Slot name */
  name: string;
  /** Human-readable description */
  description: string;
  /** Block types that can be placed in this slot */
  acceptedBlocks?: BlockType[];
  /** Whether this slot is required */
  required: boolean;
  /** Whether multiple blocks can be placed */
  multiple: boolean;
}

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export interface BlockDefinition<V extends string = string> {
  /** Block type identifier */
  type: BlockType;
  /** Category for organization */
  category: BlockCategory;
  /** Human-readable name */
  name: string;
  /** Description of the block's purpose */
  description: string;
  /** Available variants for this block */
  variants: BlockVariant<V>[];
  /** Default variant to use if none specified */
  defaultVariant: V;
  /** Props that can be passed to the block */
  props: BlockPropDefinition[];
  /** Slots for nested content/blocks */
  slots: BlockSlot[];
  /** Context hints for recommendations */
  contextHints: BlockContextHints;
  /** Base shadcn components used across all variants */
  baseShadcnComponents: string[];
  /** Base dependencies required for all variants */
  baseDependencies: string[];
  /** Keywords for search */
  keywords: string[];
}

export interface BlockContextHints {
  /** Industries where this block is commonly used */
  industry?: string[];
  /** Audience types this block is designed for */
  audience?: string[];
  /** Page types where this block fits */
  pageType?: ('marketing' | 'product' | 'docs' | 'auth' | 'admin')[];
  /** Recommended tuner ranges for this block */
  tunerHints?: {
    abstraction?: { min: number; max: number };
    density?: { min: number; max: number };
    motion?: { min: number; max: number };
    contrast?: { min: number; max: number };
    narrative?: { min: number; max: number };
  };
}

// =============================================================================
// BLOCK GENERATION TYPES
// =============================================================================

export interface BlockGenerationInput {
  /** Block type to generate */
  blockType: BlockType;
  /** Specific variant to use */
  variant: string;
  /** Page context affects styling */
  context: 'marketing' | 'product';
  /** Inspiration profile for styling decisions */
  inspirationProfile?: InspirationProfileRef;
  /** Codebase analysis for pattern matching */
  codebaseAnalysis?: CodebaseAnalysisRef;
  /** Tuner values for fine-tuning */
  tuners: AppliedTuners;
  /** Content data for the block */
  content?: Record<string, unknown>;
  /** Target component library */
  componentLibrary?: ComponentLibrary;
  /** Custom class name prefix */
  classNamePrefix?: string;
}

export interface BlockGenerationOutput {
  /** Generated React/TSX code */
  code: string;
  /** Component name (PascalCase) */
  componentName: string;
  /** Suggested file name */
  fileName: string;
  /** Tailwind config extensions needed */
  tailwindConfig?: TailwindConfigExtension;
  /** npm dependencies to install */
  dependencies: string[];
  /** CSS variables to add */
  cssVariables?: Record<string, string>;
  /** Slots available for composition */
  slots: Record<string, SlotInfo>;
  /** Explanation of generation choices */
  explanation: string;
  /** Variant that was used */
  variantUsed: string;
  /** How inspiration influenced the output */
  inspirationInfluence?: string;
}

export interface SlotInfo {
  /** Slot name */
  name: string;
  /** Block types that can fill this slot */
  accepts: BlockType[];
  /** Current content if any */
  currentContent?: string;
  /** Whether the slot is filled */
  filled: boolean;
}

export interface TailwindConfigExtension {
  theme: {
    extend: Record<string, unknown>;
  };
  plugins?: string[];
}

// =============================================================================
// COMPONENT LIBRARY TYPES
// =============================================================================

export type ComponentLibrary = 'shadcn' | 'radix' | 'none';

export interface ComponentLibraryConfig {
  /** Detected library type */
  type: ComponentLibrary;
  /** Path to components directory */
  componentsPath?: string;
  /** Path to utils (e.g., cn function) */
  utilsPath?: string;
  /** Available components */
  availableComponents: string[];
  /** CSS variable prefix */
  cssPrefix?: string;
}

// =============================================================================
// TUNER TYPES (for block context)
// =============================================================================

export interface AppliedTuners {
  /** 0-1: Concrete/literal to abstract/geometric */
  abstraction: number;
  /** 0-1: Spacious to compact */
  density: number;
  /** 0-1: Static to animated */
  motion: number;
  /** 0-1: Subtle to bold */
  contrast: number;
  /** 0-1: Minimal to storytelling */
  narrative: number;
}

// =============================================================================
// REFERENCE TYPES (for external modules)
// =============================================================================

/** Reference to InspirationProfile from inspiration module */
export interface InspirationProfileRef {
  id: string;
  name: string;
  // Full type defined in inspiration module
  [key: string]: unknown;
}

/** Reference to CodebaseAnalysis from analyzer module */
export interface CodebaseAnalysisRef {
  // Full type defined in analyzer module
  [key: string]: unknown;
}

// =============================================================================
// PAGE COMPOSITION TYPES
// =============================================================================

export interface PageCompositionInput {
  /** Page name (used for component naming) */
  name: string;
  /** Route path */
  route: string;
  /** Blocks to include in order */
  blocks: BlockPlacement[];
  /** Page context */
  context: 'marketing' | 'product';
  /** Inspiration profile */
  inspirationProfile?: InspirationProfileRef;
  /** Codebase analysis */
  codebaseAnalysis?: CodebaseAnalysisRef;
  /** Tuner values */
  tuners: AppliedTuners;
  /** Layout preferences */
  layout: PageLayoutConfig;
}

export interface BlockPlacement {
  /** Block type */
  blockType: BlockType;
  /** Variant to use */
  variant: string;
  /** Order in the page (0-indexed) */
  order: number;
  /** Props to pass to the block */
  props?: Record<string, unknown>;
  /** Content for the block */
  content?: Record<string, unknown>;
  /** Custom ID for reference */
  id?: string;
}

export interface PageLayoutConfig {
  /** Max width constraint */
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Include navigation block */
  hasNavigation: boolean;
  /** Include footer block */
  hasFooter: boolean;
  /** Spacing between sections */
  spacing: 'tight' | 'normal' | 'spacious';
}

export interface PageCompositionOutput {
  /** Complete page component code */
  pageCode: string;
  /** Suggested file name */
  fileName: string;
  /** Individual block components */
  blockComponents: BlockComponentOutput[];
  /** Combined dependencies */
  dependencies: string[];
  /** Combined Tailwind config */
  tailwindConfig: TailwindConfigExtension;
  /** Combined CSS variables */
  cssVariables: Record<string, string>;
  /** Layout wrapper code if needed */
  layoutCode?: string;
  /** Explanation of composition choices */
  explanation: string;
}

export interface BlockComponentOutput {
  /** Component name */
  componentName: string;
  /** Component code */
  code: string;
  /** File name */
  fileName: string;
  /** Block type */
  blockType: BlockType;
  /** Variant used */
  variant: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/** Helper to get variant type for a specific block */
export type VariantForBlock<T extends BlockType> = T extends 'hero'
  ? HeroVariant
  : T extends 'navigation'
    ? NavigationVariant
    : T extends 'features'
      ? FeaturesVariant
      : T extends 'pricing'
        ? PricingVariant
        : T extends 'testimonials'
          ? TestimonialsVariant
          : T extends 'faq'
            ? FAQVariant
            : T extends 'cta'
              ? CTAVariant
              : T extends 'footer'
                ? FooterVariant
                : T extends 'logo-cloud'
                  ? LogoCloudVariant
                  : T extends 'stats'
                    ? StatsVariant
                    : T extends 'sidebar'
                      ? SidebarVariant
                      : T extends 'header'
                        ? HeaderVariant
                        : T extends 'data-table'
                          ? DataTableVariant
                          : T extends 'metric-cards'
                            ? MetricCardsVariant
                            : T extends 'chart-section'
                              ? ChartSectionVariant
                              : T extends 'activity-feed'
                                ? ActivityFeedVariant
                                : T extends 'settings-panel'
                                  ? SettingsPanelVariant
                                  : T extends 'command-palette'
                                    ? CommandPaletteVariant
                                    : T extends 'auth'
                                      ? AuthVariant
                                      : T extends 'empty-state'
                                        ? EmptyStateVariant
                                        : T extends 'error-page'
                                          ? ErrorPageVariant
                                          : T extends 'loading'
                                            ? LoadingVariant
                                            : string;

/** Category for a block type */
export type CategoryForBlock<T extends BlockType> =
  T extends LandingBlockType
    ? 'landing'
    : T extends DashboardBlockType
      ? 'dashboard'
      : 'shared';

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isLandingBlock(type: BlockType): type is LandingBlockType {
  const landingBlocks: LandingBlockType[] = [
    'hero',
    'navigation',
    'features',
    'pricing',
    'testimonials',
    'faq',
    'cta',
    'footer',
    'logo-cloud',
    'stats',
  ];
  return landingBlocks.includes(type as LandingBlockType);
}

export function isDashboardBlock(type: BlockType): type is DashboardBlockType {
  const dashboardBlocks: DashboardBlockType[] = [
    'sidebar',
    'header',
    'data-table',
    'metric-cards',
    'chart-section',
    'activity-feed',
    'settings-panel',
    'command-palette',
  ];
  return dashboardBlocks.includes(type as DashboardBlockType);
}

export function isSharedBlock(type: BlockType): type is SharedBlockType {
  const sharedBlocks: SharedBlockType[] = [
    'auth',
    'empty-state',
    'error-page',
    'loading',
  ];
  return sharedBlocks.includes(type as SharedBlockType);
}

export function getBlockCategory(type: BlockType): BlockCategory {
  if (isLandingBlock(type)) return 'landing';
  if (isDashboardBlock(type)) return 'dashboard';
  return 'shared';
}

export function isValidTuners(tuners: unknown): tuners is AppliedTuners {
  if (!tuners || typeof tuners !== 'object') return false;
  const t = tuners as Record<string, unknown>;
  const keys = ['abstraction', 'density', 'motion', 'contrast', 'narrative'];
  return keys.every(
    (key) =>
      typeof t[key] === 'number' &&
      (t[key] as number) >= 0 &&
      (t[key] as number) <= 1
  );
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const DEFAULT_TUNERS: AppliedTuners = {
  abstraction: 0.5,
  density: 0.5,
  motion: 0.5,
  contrast: 0.5,
  narrative: 0.5,
};

export const ALL_BLOCK_TYPES: BlockType[] = [
  // Landing
  'hero',
  'navigation',
  'features',
  'pricing',
  'testimonials',
  'faq',
  'cta',
  'footer',
  'logo-cloud',
  'stats',
  // Dashboard
  'sidebar',
  'header',
  'data-table',
  'metric-cards',
  'chart-section',
  'activity-feed',
  'settings-panel',
  'command-palette',
  // Shared
  'auth',
  'empty-state',
  'error-page',
  'loading',
];

export const BLOCK_CATEGORIES: Record<BlockCategory, BlockType[]> = {
  landing: [
    'hero',
    'navigation',
    'features',
    'pricing',
    'testimonials',
    'faq',
    'cta',
    'footer',
    'logo-cloud',
    'stats',
  ],
  dashboard: [
    'sidebar',
    'header',
    'data-table',
    'metric-cards',
    'chart-section',
    'activity-feed',
    'settings-panel',
    'command-palette',
  ],
  shared: ['auth', 'empty-state', 'error-page', 'loading'],
};
