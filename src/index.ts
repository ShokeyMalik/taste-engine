/**
 * Taste Engine - Context-Aware Design System & UI Intelligence Layer
 *
 * Transform AI-generated UIs from generic to distinctive.
 * The design brain for vibe coding tools (v0, Cursor, Claude Code, Bolt).
 *
 * Core Features:
 * - Context-aware recipes (product vs marketing)
 * - 5-tuner system for instant visual adjustment
 * - Visual MCP contract for AI integration
 * - Built-in themes (Chronicle Dark, Ops Calm, Hospitality Warm)
 * - Block Registry with 22+ UI blocks (landing, dashboard, shared)
 * - Inspiration Profile system for learning from brands/URLs
 *
 * @example
 * ```tsx
 * import { themeEngine, chronicleDark } from '@taste-engine/core';
 *
 * // Register and apply a theme
 * themeEngine.registerTheme(chronicleDark);
 * themeEngine.applyTheme(chronicleDark, 'product');
 * ```
 *
 * @example With React
 * ```tsx
 * import { TasteProvider, useTaste } from '@taste-engine/core/react';
 *
 * function App() {
 *   return (
 *     <TasteProvider defaultTheme="chronicle-dark">
 *       <Dashboard />
 *     </TasteProvider>
 *   );
 * }
 *
 * function Dashboard() {
 *   const { recipes, isDarkMode } = useTaste();
 *   // Use recipes.StatCard, recipes.DataTable, etc.
 * }
 * ```
 *
 * @example Block Registry
 * ```tsx
 * import { createDefaultRegistry, heroBlock } from 'taste-engine';
 *
 * const registry = createDefaultRegistry();
 * const hero = registry.get('hero');
 * console.log(hero.variants); // ['centered', 'split', 'video-bg', 'gradient-orbs', 'minimal']
 * ```
 *
 * @version 1.0.0
 * @license MIT
 */

// Core
export * from './core';

// Tuners
export * from './tuners';

// Themes
export * from './themes';

// MCP Contract
export type {
  // Input types
  VisualMCPInput,
  RepoMetadata,
  TargetRoute,
  PageContextConfig,
  Inspiration,
  Constraints,
  TunerValues,

  // Output types
  VisualMCPOutput,
  ContextManifest,
  TasteProfile,
  Plan,
  PatchInstructions,
  VerificationChecklist,

  // Error types
  VisualMCPError,
  VisualMCPErrorCode,

  // Utility types
  PageContext as MCPPageContext,
  AppliedTuners,
} from './mcp/contract';

export {
  isPageContext,
  isValidTunerValues,
  DEFAULT_TUNERS as MCP_DEFAULT_TUNERS,
  CURRENT_CONTRACT_VERSION,
} from './mcp/contract';

// Analyzer
export type {
  CodebaseAnalysis,
  ComponentPattern,
  DesignTokens,
  ButtonPattern,
  CardPattern,
  SurfacePattern,
} from './analyzer';

export { analyzeCodebase, CodebaseAnalyzer } from './analyzer';

// Generator
export type {
  TasteConfig,
  GeneratedCode,
  GenerationContext,
  BlockGeneratorConfig,
  GenerationResult,
} from './generator';

export {
  generateCode,
  createGenerator,
  CodeGenerator,
  // Block Generator (v1.0.0)
  BlockGenerator,
  createBlockGenerator,
  generateBlock,
  generateBlocks,
  quickGenerate,
  // Page Composer (v1.0.0)
  PageComposer,
  createPageComposer,
  composePage,
  suggestPageStructure,
  composeLandingPage,
  composeDashboardPage,
} from './generator';

export type {
  PageComposerConfig,
  ComposedBlock,
} from './generator';

// Inspiration (THE CORRECT APPROACH)
export type {
  InspirationSource,
  ExtractedDesignLanguage,
  LearnedTasteProfile,
  TransformationPlan,
  Transformation,
} from './inspiration';

export {
  inspire,
  learnFromInspirations,
  createTransformer,
  InspirationScanner,
  PatternLearner,
  TransformationEngine,
  KNOWN_BRANDS,
} from './inspiration';

// Visual Assets (context-aware asset generation)
export type {
  VisualAssetStrategy,
  HeroStyle,
  IllustrationStyle,
  DataVizStyle,
  MotionStyle,
  PhotographyStyle,
  SVGPattern,
  GradientDefinition,
  PlaceholderStrategy,
  AssetBrief,
  AnimationRecipe,
  ChartTheme,
} from './inspiration';

export {
  generateVisualAssets,
  VisualAssetGenerator,
} from './inspiration';

// URL Analysis & Selective Inspirations
export type {
  URLAnalysisResult,
  SelectiveInspiration,
} from './inspiration';

export {
  analyzeURL,
  mergeSelectiveInspirations,
  URLAnalyzer,
  SelectiveInspirationMerger,
  CreativeMixer,
} from './inspiration';

// Knowledge Base (Persistent Learning)
export type {
  KnowledgeEntry,
  KnowledgeBaseStats,
  KnowledgeBaseConfig,
} from './inspiration';

export {
  InspirationKnowledgeBase,
  SmartInspirationResolver,
  getKnowledgeBase,
  getSmartResolver,
  learnInspiration,
  getLearnedInspiration,
  hasLearnedInspiration,
  getKnowledgeStats,
} from './inspiration';

// UX Context Scanner (MCP Mode - Auto-detect from Codebase)
export type {
  UXContextManifest,
  Industry,
  AudiencePersona,
  Workflow,
  WorkflowStep,
  ContentHierarchy,
  ContentItem,
  ExistingPatterns,
  LayoutPattern,
  UXComponentPattern,
  NavigationPattern,
  NavigationItem,
  DataDisplayPattern,
  UXRecommendation,
  TasteEngineContext,
} from './ux-scanner';

export {
  UXContextScanner,
  scanUXContext,
  quickScan,
  getDesignGuidelines,
  createTasteEngineContext,
} from './ux-scanner';

// Visual Assets Module (v0.5.0)
export type {
  // Placeholder types
  PlaceholderType,
  PlaceholderStyle,
  PlaceholderOptions,
  PlaceholderResult,

  // Animation types
  AnimationLibrary,
  AnimationEffect,
  AnimationTiming,
  AnimationOptions,
  AnimationResult,

  // SVG types
  SVGOptimizeOptions,
  SVGOptimizeResult,
  SVGRecommendation,

  // Pattern types
  PatternType,
  PatternOptions,
  PatternResult,
} from './visual-assets';

export {
  // Placeholder generation
  generatePlaceholder,
  PlaceholderGenerator,

  // Animation code generation
  generateAnimation,
  AnimationRecipeGenerator,

  // SVG optimization
  optimizeSVG,
  analyzeSVG,
  validateSVG,
  SVGOptimizer,

  // Pattern generation
  generatePattern,
  getPatternCSS,
  getAvailablePatternTypes,
  PatternGenerator,
} from './visual-assets';

// =============================================================================
// MIROMIRO EXTRACTION (v0.6.0 - Design Token & Asset Extraction)
// =============================================================================

export type {
  // Design token types (note: DesignTokens from analyzer is different from MiroMiro DesignTokens)
  // Renamed to avoid conflicts
  MiromiroDesignTokens,
  MiromiroColorPalette,
  ColorToken,
  TypographySystem,
  TypographyToken,
  SpacingScale,
  SpacingToken,
  ShadowSystem,
  ShadowToken,
  BorderSystem,
  BorderToken,
  RadiusToken,

  // Asset types
  ExtractedAssets,
  ImageAsset,
  SVGAsset,
  VideoAsset,
  LottieAsset,
  IconAsset,
  Asset,

  // Style inspection types
  ComputedStyles,
  HoverStyles,
  AnimationStyles,
  ResponsiveStyles,
  ElementStyles,

  // Accessibility types
  ContrastResult,
  WCAGResult,
  Recommendation as MiromiroRecommendation,
  AccessibilityReport,

  // Extraction types
  ExtractionOptions,
  ExtractionResult,
} from './inspiration';

export {
  // Browser automation
  BrowserAutomation,
  withBrowser,

  // Design token extraction
  extractDesignTokens,
  exportAsCSSVariables,
  exportAsTailwindConfig,

  // Asset extraction
  extractAssets,
  categorizeAssets,

  // Main extraction interface
  extractAll,
  quickExtract,
  exportTokens,
} from './inspiration';

// =============================================================================
// BLOCK REGISTRY (v1.0.0 - UI Intelligence Layer)
// =============================================================================

// Block types and registry
export type {
  // Core types
  BlockType,
  BlockCategory,
  BlockDefinition,
  BlockVariant,
  BlockPropDefinition,
  BlockSlot,
  BlockContextHints,

  // Variant types
  LandingBlockType,
  DashboardBlockType,
  SharedBlockType,
  HeroVariant,
  NavigationVariant,
  FeaturesVariant,
  PricingVariant,
  TestimonialsVariant,
  FAQVariant,
  CTAVariant,
  FooterVariant,
  LogoCloudVariant,
  StatsVariant,
  SidebarVariant,
  HeaderVariant,
  DataTableVariant,
  MetricCardsVariant,
  ChartSectionVariant,
  ActivityFeedVariant,
  SettingsPanelVariant,
  CommandPaletteVariant,
  AuthVariant,
  EmptyStateVariant,
  ErrorPageVariant,
  LoadingVariant,

  // Generation types
  BlockGenerationInput,
  BlockGenerationOutput,
  SlotInfo,
  TailwindConfigExtension,
  ComponentLibrary,
  ComponentLibraryConfig,
  AppliedTuners as BlockTuners,

  // Page composition types
  PageCompositionInput,
  PageCompositionOutput,
  BlockPlacement,
  PageLayoutConfig,
  BlockComponentOutput,
} from './blocks';

export {
  // Registry
  BlockRegistry,
  getBlockRegistry,
  resetBlockRegistry,

  // Block collections
  allBlocks,
  landingBlocks,
  dashboardBlocks,
  sharedBlocks,

  // Individual landing blocks
  heroBlock,
  navigationBlock,
  featuresBlock,
  pricingBlock,
  testimonialsBlock,
  faqBlock,
  ctaBlock,
  footerBlock,
  logoCloudBlock,
  statsBlock,

  // Individual dashboard blocks
  sidebarBlock,
  headerBlock,
  dataTableBlock,
  metricCardsBlock,
  chartSectionBlock,
  activityFeedBlock,
  settingsPanelBlock,
  commandPaletteBlock,

  // Individual shared blocks
  authBlock,
  emptyStateBlock,
  errorPageBlock,
  loadingBlock,

  // Utilities
  registerDefaultBlocks,
  createDefaultRegistry,
  hasBlock,
  getBlockDefinition,
  BLOCK_COUNTS,

  // Type guards
  isLandingBlock,
  isDashboardBlock,
  isSharedBlock,
  getBlockCategory,
  isValidTuners,

  // Constants
  DEFAULT_TUNERS,
  ALL_BLOCK_TYPES,
  BLOCK_CATEGORIES,
} from './blocks';

export type { BlockRecommendation, RecommendationContext, BlockSearchOptions } from './blocks';

// =============================================================================
// INSPIRATION PROFILE (v1.0.0 - Design Intelligence)
// =============================================================================

export type {
  InspirationProfile,
  InspirationSourceSummary,
  InspirationAspect,
  ColorPalette,
  GradientDefinition as ProfileGradient,
  TypographyConfig,
  SpacingConfig,
  MotionConfig,
  ComponentStyleConfig,
  BlockPreferenceConfig,
  HeroBlockPreference,
  FeaturesBlockPreference,
  PricingBlockPreference,
  TestimonialsBlockPreference,
  CTABlockPreference,
  SidebarBlockPreference,
  DataTableBlockPreference,
} from './inspiration/inspiration-profile';

export {
  InspirationProfileBuilder,
  ProfileBuilder,
  mergeProfiles,
  serializeProfile,
  deserializeProfile,
  getDefaultColorPalette,
  getDefaultTypography,
  getDefaultSpacing,
  getDefaultMotion,
  getDefaultComponentStyles,
  getDefaultBlockPreferences,
  getDefaultTuners,
} from './inspiration/inspiration-profile';

export {
  fromExtractedDesignLanguage,
  fromLearnedTasteProfile,
} from './inspiration/profile-converter';

// =============================================================================
// COMPONENT LIBRARY INTEGRATIONS (v1.0.0 - Library Detection & Mapping)
// =============================================================================

export type {
  // shadcn types
  ShadcnComponentsJson,
  ShadcnConfig,
  ShadcnComponent,
  ShadcnComponentInfo,
  TokenMapping,
  MappedTokens,
  TailwindThemeExtension,
  ComponentUsage,
  BlockComponentMapping,

  // Library detection types
  ComponentLibrary as DetectedLibrary,
  LibraryDetectionResult,
} from './integrations';

export {
  // shadcn detection
  detectShadcn,
  detectCnUtility,
  ShadcnDetector,

  // Token mapping
  ShadcnTokenMapper,
  createMapper,
  getTailwindClass,
  getShadcnClasses,
  SHADCN_CSS_VARIABLES,
  SHADCN_DARK_VARIABLES,
  COLOR_MAPPINGS,

  // Component knowledge
  ShadcnComponentKnowledge,
  createComponentKnowledge,
  getAvailableBlocks,
  getBlocksByInstallStatus,
  getComponentTemplate,
  BLOCK_COMPONENT_MAPPINGS,
  SHADCN_COMPONENTS,

  // Library detection
  detectComponentLibrary,
  getCssVariablePrefix,
  getTailwindConventions,

  // Full integration
  initializeShadcnIntegration,
  hasShadcn,
  getShadcnSummary,
} from './integrations';
