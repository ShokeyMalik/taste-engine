/**
 * Visual MCP Contract v1 - TypeScript Types
 *
 * This file defines the complete type system for the Visual MCP.
 * All implementations MUST use these types to ensure interoperability.
 *
 * The Visual MCP transforms AI-generated UIs from generic to distinctive
 * by understanding context, deriving taste, and applying design intelligence.
 *
 * @version 1.0.0
 */

// =============================================================================
// INPUTS
// =============================================================================

/**
 * Repository metadata for stack detection
 */
export interface RepoMetadata {
  /** Detected frontend stack */
  stack: 'react' | 'vue' | 'svelte' | 'next' | 'remix' | 'astro' | 'unknown';

  /** Router type in use */
  routerType: 'react-router' | 'next-pages' | 'next-app' | 'vue-router' | 'file-based' | 'unknown';

  /** Whether Tailwind CSS is present */
  hasTailwind: boolean;

  /** Tailwind version if present */
  tailwindVersion?: string;

  /** Whether shadcn/ui components are present */
  hasShadcn: boolean;

  /** Detected component library (if any) */
  componentLibrary?: 'shadcn' | 'radix' | 'chakra' | 'mantine' | 'mui' | 'ant' | 'none';

  /** TypeScript in use */
  hasTypeScript: boolean;

  /** Detected CSS approach */
  cssApproach: 'tailwind' | 'css-modules' | 'styled-components' | 'emotion' | 'vanilla' | 'mixed';

  /** Path aliases configured (e.g., @/components) */
  pathAliases: Record<string, string>;

  /** Existing design tokens file path (if any) */
  designTokensPath?: string;
}

/**
 * Target route for generation/modification
 */
export interface TargetRoute {
  /** Route path (e.g., "/dashboard", "/marketing") */
  path: string;

  /** Operation type */
  operation: 'create' | 'modify' | 'enhance';

  /** Existing file path (for modify/enhance) */
  existingFilePath?: string;

  /** Desired output file path */
  outputFilePath: string;
}

/**
 * Page context type
 */
export type PageContext = 'product' | 'marketing' | 'docs' | 'admin' | 'auth';

/**
 * Marketing audience personas
 */
export type MarketingAudienceType = 'hotel-owner' | 'developer' | 'enterprise' | 'consumer' | 'custom';

/**
 * Marketing intent types
 */
export type MarketingIntentType = 'convert' | 'inform' | 'engage' | 'onboard';

/**
 * Custom audience definition
 */
export interface CustomAudience {
  name: string;
  traits: string[];
  visualPreferences: string[];
}

/**
 * Page context configuration
 */
export interface PageContextConfig {
  /** Primary context for the page */
  context: PageContext;

  /** Marketing-specific: target audience persona */
  audience?: MarketingAudienceType;

  /** Marketing-specific: page intent */
  intent?: MarketingIntentType;

  /** Custom audience definition (when audience = 'custom') */
  customAudience?: CustomAudience;
}

/**
 * Inspiration source type
 */
export type InspirationType = 'url' | 'screenshot' | 'figma' | 'reference-name';

/**
 * Aspects to extract from inspiration
 */
export type InspirationAspect = 'color' | 'typography' | 'spacing' | 'motion' | 'layout' | 'all';

/**
 * Inspiration source for taste derivation
 */
export interface Inspiration {
  /** Inspiration type */
  type: InspirationType;

  /** URL for web pages */
  url?: string;

  /** Local path for screenshots */
  localPath?: string;

  /** Figma file/frame URL */
  figmaUrl?: string;

  /** Named reference (e.g., "linear", "stripe", "vercel") */
  referenceName?: string;

  /** Weight for this inspiration (0-1, default 1) */
  weight?: number;

  /** Specific aspects to extract */
  extractAspects?: InspirationAspect[];
}

/**
 * Brand color constraints
 */
export interface BrandColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  [key: string]: string | undefined;
}

/**
 * Font constraints
 */
export interface FontConstraints {
  heading?: string;
  body?: string;
  mono?: string;
}

/**
 * Accessibility constraints
 */
export interface AccessibilityConstraints {
  minContrastRatio?: number;
  motionReduced?: boolean;
  screenReaderOptimized?: boolean;
}

/**
 * Performance constraints
 */
export interface PerformanceConstraints {
  maxBundleSizeKb?: number;
  noHeavyAnimations?: boolean;
  preferStaticGeneration?: boolean;
}

/**
 * Hard constraints that override derived values
 */
export interface Constraints {
  /** Brand colors that MUST be used */
  brandColors?: BrandColors;

  /** Font families that MUST be used */
  fonts?: FontConstraints;

  /** Components that MUST be preserved (file paths) */
  mustKeepComponents?: string[];

  /** Components that MUST NOT be modified */
  doNotModify?: string[];

  /** Accessibility requirements */
  accessibility?: AccessibilityConstraints;

  /** Performance constraints */
  performance?: PerformanceConstraints;

  /** Explicit style overrides */
  styleOverrides?: Record<string, string>;
}

/**
 * Tuner values (0-1 scale)
 */
export interface TunerValues {
  /** Abstraction level: motif intensity, signal complexity, background layers */
  abstraction?: number;

  /** Information density: gaps, maxWidth, table density, surface padding */
  density?: number;

  /** Motion level: path draw, card expansion, hover glow */
  motion?: number;

  /** Contrast level: border opacity, text muted levels */
  contrast?: number;

  /** Narrative strength: section spacing, hero height, ribbon prominence */
  narrative?: number;
}

/**
 * Complete input to Visual MCP
 */
export interface VisualMCPInput {
  /** Repository metadata */
  repo: RepoMetadata;

  /** Target routes to generate/modify */
  targets: TargetRoute[];

  /** Page context configuration */
  pageContext: PageContextConfig;

  /** Inspiration sources for taste derivation */
  inspirations?: Inspiration[];

  /** Hard constraints that override derived values */
  constraints?: Constraints;

  /** Tuner overrides (0-1 scale) */
  tuners?: TunerValues;

  /** Debug mode: include reasoning in output */
  debug?: boolean;
}

// =============================================================================
// OUTPUTS
// =============================================================================

/**
 * Resolved context manifest
 */
export interface ContextManifest {
  /** Resolved page context */
  context: PageContext;

  /** Resolved audience (marketing only) */
  audience?: string;

  /** Resolved intent (marketing only) */
  intent?: string;

  /** Confidence score (0-1) */
  confidence: number;

  /** Reasoning for context resolution */
  reasoning?: string;

  /** Detected conflicts or ambiguities */
  warnings?: string[];
}

/**
 * Motif preference scores
 */
export interface MotifPreference {
  grid: number;
  signal: number;
  noise: number;
  glow: number;
  dots: number;
}

/**
 * Taste profile source
 */
export interface TasteSource {
  inspiration: string;
  weight: number;
  extractedTraits: string[];
}

/**
 * Derived taste profile
 */
export interface TasteProfile {
  /** Overall abstraction level (0 = concrete, 1 = highly abstract) */
  abstraction: number;

  /** Visual restraint (0 = expressive, 1 = minimal) */
  restraint: number;

  /** Information density preference (0 = spacious, 1 = dense) */
  density: number;

  /** Motion philosophy (0 = static, 1 = animated) */
  motion: number;

  /** Preferred motif types */
  motifPreference: MotifPreference;

  /** Typography looseness (0 = strict, 1 = playful) */
  typographyLooseness: number;

  /** Color temperature (0 = cool, 1 = warm) */
  colorTemperature: number;

  /** Contrast level (0 = low, 1 = high) */
  contrastLevel: number;

  /** Sources that contributed to this profile */
  sources: TasteSource[];

  /** Confidence in the derived profile */
  confidence: number;

  /** Human-readable taste description */
  description: string;
}

/**
 * Page archetype
 */
export type PageArchetype =
  | 'dashboard'
  | 'list'
  | 'detail'
  | 'form'
  | 'marketing-landing'
  | 'docs'
  | 'auth'
  | 'custom';

/**
 * Storyboard section
 */
export interface StoryboardSection {
  type: string;
  order: number;
  props?: Record<string, unknown>;
}

/**
 * Storyboard configuration
 */
export interface Storyboard {
  sections: StoryboardSection[];
}

/**
 * Motif layer type
 */
export type MotifLayerType = 'grid' | 'dots' | 'noise' | 'glowField' | 'radialGlow' | 'signalPaths';

/**
 * Single motif layer configuration
 */
export interface MotifLayerConfig {
  type: MotifLayerType;
  opacity: number;
  zIndex: number;
}

/**
 * Motifs configuration
 */
export interface MotifsConfig {
  layers: MotifLayerConfig[];
  intensity: number;
}

/**
 * Signature blocks configuration
 */
export interface SignatureBlocksConfig {
  signalPath: boolean;
  stackedCards: boolean;
  metricRibbon: boolean;
}

/**
 * Motion level
 */
export type MotionLevel = 'none' | 'subtle' | 'moderate' | 'expressive';

/**
 * Component source
 */
export type ComponentSource = 'ui2' | 'shadcn' | 'custom' | 'new';

/**
 * Component to use in plan
 */
export interface PlanComponent {
  name: string;
  source: ComponentSource;
  props?: Record<string, unknown>;
}

/**
 * Applied tuner values (all required)
 */
export interface AppliedTuners {
  abstraction: number;
  density: number;
  motion: number;
  contrast: number;
  narrative: number;
}

/**
 * Generation plan
 */
export interface Plan {
  /** Selected theme pack */
  themePack: string;

  /** Page archetype to apply */
  archetype: PageArchetype;

  /** Storyboard for marketing pages */
  storyboard?: Storyboard;

  /** Motif configuration */
  motifs: MotifsConfig;

  /** Signature blocks to include */
  signatureBlocks: SignatureBlocksConfig;

  /** Motion level */
  motionLevel: MotionLevel;

  /** Applied tuner values */
  tuners: AppliedTuners;

  /** Components to be used */
  components: PlanComponent[];

  /** Reasoning for plan decisions */
  reasoning?: string;
}

/**
 * Single edit within a file
 */
export interface FileEdit {
  /** Line range to replace (1-indexed) */
  startLine: number;
  endLine: number;
  /** New content for this range */
  newContent: string;
  /** Description of the change */
  description: string;
}

/**
 * Dependency to install
 */
export interface Dependency {
  package: string;
  version: string;
  dev: boolean;
}

/**
 * Single patch instruction
 */
export interface PatchInstruction {
  /** Operation type */
  operation: 'create' | 'modify' | 'delete';

  /** Target file path */
  filePath: string;

  /** For create: full file content */
  content?: string;

  /** For modify: list of edits */
  edits?: FileEdit[];

  /** Dependencies to install */
  dependencies?: Dependency[];

  /** Reason for this patch */
  reason: string;
}

/**
 * Impact level of patches
 */
export type ImpactLevel = 'low' | 'medium' | 'high';

/**
 * Complete patch instructions
 */
export interface PatchInstructions {
  /** Ordered list of patches to apply */
  patches: PatchInstruction[];

  /** Commands to run after patches */
  postCommands?: string[];

  /** Files that will be affected */
  affectedFiles: string[];

  /** Estimated impact level */
  impactLevel: ImpactLevel;
}

/**
 * UI guard check priority
 */
export type CheckPriority = 'required' | 'recommended' | 'optional';

/**
 * UI guard check
 */
export interface UIGuardCheck {
  /** Check name */
  name: string;
  /** Command to run */
  command: string;
  /** Expected result */
  expectedResult: string;
  /** Priority */
  priority: CheckPriority;
}

/**
 * Viewport size
 */
export interface Viewport {
  width: number;
  height: number;
}

/**
 * Screenshot baseline configuration
 */
export interface ScreenshotBaseline {
  /** Route to capture */
  route: string;
  /** Theme to use */
  theme: string;
  /** Audience (for marketing) */
  audience?: string;
  /** Viewport size */
  viewport: Viewport;
  /** Baseline file path */
  baselinePath: string;
}

/**
 * Lint check severity
 */
export type LintSeverity = 'error' | 'warning';

/**
 * Lint check configuration
 */
export interface LintCheck {
  /** Rule name */
  rule: string;
  /** Severity */
  severity: LintSeverity;
  /** Files to check */
  files: string[];
}

/**
 * Accessibility check type
 */
export type A11yCheckType = 'contrast' | 'aria' | 'keyboard' | 'screen-reader';

/**
 * Accessibility standard
 */
export type A11yStandard = 'WCAG-AA' | 'WCAG-AAA';

/**
 * Accessibility check configuration
 */
export interface A11yCheck {
  /** Check type */
  type: A11yCheckType;
  /** Target elements */
  selector?: string;
  /** Expected standard */
  standard: A11yStandard;
}

/**
 * Build verification configuration
 */
export interface BuildCheck {
  command: string;
  maxDurationMs: number;
  expectSuccess: boolean;
}

/**
 * Verification checklist
 */
export interface VerificationChecklist {
  /** UI guard checks to run */
  uiGuard: UIGuardCheck[];

  /** Screenshot baselines to capture/compare */
  screenshotBaselines: ScreenshotBaseline[];

  /** Lint rules to verify */
  lintChecks: LintCheck[];

  /** Accessibility checks */
  a11yChecks: A11yCheck[];

  /** Build verification */
  buildCheck: BuildCheck;
}

/**
 * Debug information
 */
export interface DebugInfo {
  inspirationAnalysis: Record<string, unknown>;
  tasteDerivation: Record<string, unknown>;
  planningDecisions: Record<string, unknown>;
  timing: Record<string, number>;
}

/**
 * Contract version
 */
export type ContractVersion = '1.0.0';

/**
 * Complete Visual MCP output
 */
export interface VisualMCPOutput {
  /** Version of the contract */
  contractVersion: ContractVersion;

  /** Timestamp of generation */
  timestamp: string;

  /** Resolved context */
  contextManifest: ContextManifest;

  /** Derived taste profile */
  tasteProfile: TasteProfile;

  /** Generation plan */
  plan: Plan;

  /** File patches to apply */
  patchInstructions: PatchInstructions;

  /** Verification steps */
  verificationChecklist: VerificationChecklist;

  /** Overall confidence (0-1) */
  confidence: number;

  /** Warnings or issues detected */
  warnings: string[];

  /** Debug information (when debug=true) */
  debug?: DebugInfo;
}

// =============================================================================
// ERRORS
// =============================================================================

/**
 * Error codes
 */
export type VisualMCPErrorCode =
  | 'REPO_ANALYSIS_FAILED'
  | 'UNSUPPORTED_STACK'
  | 'INSPIRATION_UNREACHABLE'
  | 'TASTE_DERIVATION_FAILED'
  | 'CONSTRAINT_CONFLICT'
  | 'PLAN_GENERATION_FAILED'
  | 'PATCH_CONFLICT'
  | 'VERIFICATION_SETUP_FAILED';

/**
 * Error response
 */
export interface VisualMCPError {
  /** Error code */
  code: VisualMCPErrorCode;

  /** Human-readable message */
  message: string;

  /** Detailed description */
  details?: string;

  /** Recoverable: can retry with modifications */
  recoverable: boolean;

  /** Suggested fixes */
  suggestions?: string[];

  /** Partial output if available */
  partialOutput?: Partial<VisualMCPOutput>;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Type guard for checking if a value is a valid PageContext
 */
export function isPageContext(value: unknown): value is PageContext {
  return ['product', 'marketing', 'docs', 'admin', 'auth'].includes(value as string);
}

/**
 * Type guard for checking if a value is a valid TunerValues object
 */
export function isValidTunerValues(value: unknown): value is TunerValues {
  if (typeof value !== 'object' || value === null) return false;
  const tuners = value as TunerValues;
  const keys = ['abstraction', 'density', 'motion', 'contrast', 'narrative'] as const;
  for (const key of keys) {
    if (tuners[key] !== undefined) {
      if (typeof tuners[key] !== 'number' || tuners[key]! < 0 || tuners[key]! > 1) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Default tuner values
 */
export const DEFAULT_TUNERS: AppliedTuners = {
  abstraction: 0.5,
  density: 0.5,
  motion: 0.5,
  contrast: 0.5,
  narrative: 0.5,
};

/**
 * Current contract version
 */
export const CURRENT_CONTRACT_VERSION: ContractVersion = '1.0.0';
