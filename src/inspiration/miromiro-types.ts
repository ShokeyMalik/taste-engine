/**
 * MiroMiro-style extraction types
 * Design token extraction, asset extraction, and style inspection
 */

// ============================================================================
// Design Tokens
// ============================================================================

export interface ColorToken {
  name: string;
  value: string; // hex, rgb, hsl
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  usage: 'primary' | 'secondary' | 'accent' | 'neutral' | 'semantic' | 'other';
  occurrences: number;
}

export interface MiromiroColorPalette {
  primary: ColorToken[];
  secondary: ColorToken[];
  accent: ColorToken[];
  neutrals: ColorToken[];
  semantic: {
    success: ColorToken[];
    warning: ColorToken[];
    error: ColorToken[];
    info: ColorToken[];
  };
  all: ColorToken[];
}

export interface TypographyToken {
  fontFamily: string;
  fontSize: string;
  fontWeight: string | number;
  lineHeight: string;
  letterSpacing?: string;
  textTransform?: string;
  usage: 'heading' | 'body' | 'caption' | 'button' | 'other';
  occurrences: number;
}

export interface TypographySystem {
  fontFamilies: string[];
  headings: TypographyToken[];
  body: TypographyToken[];
  captions: TypographyToken[];
  buttons: TypographyToken[];
  all: TypographyToken[];
}

export interface SpacingToken {
  value: string;
  pixels: number;
  usage: 'margin' | 'padding' | 'gap' | 'other';
  occurrences: number;
}

export interface SpacingScale {
  scale: number[]; // detected spacing scale (e.g., [4, 8, 12, 16, 24, 32, 48, 64])
  tokens: SpacingToken[];
}

export interface ShadowToken {
  value: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  usage: 'card' | 'dropdown' | 'modal' | 'other';
  occurrences: number;
}

export interface ShadowSystem {
  shadows: ShadowToken[];
}

export interface BorderToken {
  width: string;
  style: string;
  color: string;
  occurrences: number;
}

export interface RadiusToken {
  value: string;
  pixels: number;
  usage: 'button' | 'card' | 'input' | 'other';
  occurrences: number;
}

export interface BorderSystem {
  borders: BorderToken[];
  radii: RadiusToken[];
}

export interface MiromiroDesignTokens {
  colors: MiromiroColorPalette;
  typography: TypographySystem;
  spacing: SpacingScale;
  shadows: ShadowSystem;
  borders: BorderSystem;
  metadata: {
    url: string;
    extractedAt: string;
    elementsAnalyzed: number;
  };
}

// ============================================================================
// Assets
// ============================================================================

export interface ImageAsset {
  type: 'image';
  format: 'png' | 'jpg' | 'jpeg' | 'webp' | 'avif' | 'gif';
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  category: 'hero' | 'logo' | 'icon' | 'illustration' | 'background' | 'product' | 'other';
  size?: number; // bytes
}

export interface SVGAsset {
  type: 'svg';
  url: string;
  content: string; // SVG markup
  width?: number;
  height?: number;
  category: 'icon' | 'logo' | 'illustration' | 'pattern' | 'other';
  optimized?: string; // optimized SVG content
}

export interface VideoAsset {
  type: 'video';
  format: 'mp4' | 'webm' | 'ogg';
  url: string;
  width?: number;
  height?: number;
  category: 'hero' | 'background' | 'demo' | 'other';
  size?: number;
}

export interface LottieAsset {
  type: 'lottie';
  url: string;
  data: any; // Lottie JSON data
  category: 'icon' | 'illustration' | 'loader' | 'other';
}

export interface IconAsset {
  type: 'icon';
  format: 'svg' | 'png' | 'font';
  url: string;
  content?: string;
  name?: string;
  category: 'ui' | 'social' | 'brand' | 'other';
}

export type Asset = ImageAsset | SVGAsset | VideoAsset | LottieAsset | IconAsset;

export interface ExtractedAssets {
  images: ImageAsset[];
  svgs: SVGAsset[];
  videos: VideoAsset[];
  lottie: LottieAsset[];
  icons: IconAsset[];
  all: Asset[];
  metadata: {
    url: string;
    extractedAt: string;
    totalAssets: number;
  };
}

// ============================================================================
// Style Inspection
// ============================================================================

export interface ComputedStyles {
  // Layout
  display: string;
  position: string;
  width: string;
  height: string;
  margin: string;
  padding: string;

  // Typography
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  color: string;
  textAlign: string;

  // Background
  backgroundColor: string;
  backgroundImage: string;

  // Border
  border: string;
  borderRadius: string;

  // Effects
  boxShadow: string;
  opacity: string;
  transform: string;

  // All computed styles
  all: Record<string, string>;
}

export interface HoverStyles {
  hasHover: boolean;
  styles?: Partial<ComputedStyles>;
}

export interface AnimationStyles {
  hasAnimation: boolean;
  animations: {
    name: string;
    duration: string;
    timingFunction: string;
    delay: string;
    iterationCount: string;
  }[];
  transitions: {
    property: string;
    duration: string;
    timingFunction: string;
    delay: string;
  }[];
}

export interface ResponsiveStyles {
  breakpoints: {
    width: number;
    styles: Partial<ComputedStyles>;
  }[];
}

export interface ElementStyles {
  selector: string;
  computed: ComputedStyles;
  hover: HoverStyles;
  animations: AnimationStyles;
  responsive: ResponsiveStyles;
  metadata: {
    url: string;
    extractedAt: string;
  };
}

// ============================================================================
// Accessibility
// ============================================================================

export interface ContrastResult {
  foreground: string;
  background: string;
  ratio: number;
  wcagAA: {
    normal: boolean; // 4.5:1
    large: boolean;  // 3:1
  };
  wcagAAA: {
    normal: boolean; // 7:1
    large: boolean;  // 4.5:1
  };
  pass: boolean;
  element?: string;
}

export interface WCAGResult {
  level: 'A' | 'AA' | 'AAA' | 'fail';
  issues: {
    type: 'contrast' | 'alt-text' | 'aria' | 'heading' | 'other';
    severity: 'error' | 'warning' | 'info';
    message: string;
    element?: string;
  }[];
}

export interface Recommendation {
  type: 'color' | 'typography' | 'structure' | 'aria' | 'other';
  priority: 'high' | 'medium' | 'low';
  message: string;
  suggestion?: string;
}

export interface AccessibilityReport {
  contrast: ContrastResult[];
  wcag: WCAGResult;
  recommendations: Recommendation[];
  score: number; // 0-100
  metadata: {
    url: string;
    analyzedAt: string;
    elementsChecked: number;
  };
}

// ============================================================================
// Extraction Options
// ============================================================================

export interface ExtractionOptions {
  // What to extract
  tokens?: boolean;
  assets?: boolean;
  styles?: boolean;
  accessibility?: boolean;

  // Asset options
  downloadAssets?: boolean;
  optimizeSVGs?: boolean;

  // Token options
  exportFormat?: 'css' | 'tailwind' | 'json' | 'all';

  // Browser options
  timeout?: number;
  waitForSelector?: string;
  screenshot?: boolean;

  // Output options
  outputDir?: string;
  verbose?: boolean;
}

export interface ExtractionResult {
  tokens?: MiromiroDesignTokens;
  assets?: ExtractedAssets;
  styles?: ElementStyles[];
  accessibility?: AccessibilityReport;
  screenshot?: string; // base64 or file path
  metadata: {
    url: string;
    extractedAt: string;
    duration: number; // ms
    success: boolean;
    error?: string;
  };
}
