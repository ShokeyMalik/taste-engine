/**
 * Visual Assets Module - Types
 *
 * Context-aware placeholder generation, animation recipes, and SVG optimization
 */

// ============================================================================
// Placeholder Types
// ============================================================================

export type PlaceholderType =
  | 'hero'           // Full-width hero images
  | 'avatar'         // User/profile avatars
  | 'product'        // Product/item images
  | 'testimonial'    // Testimonial background/avatar
  | 'thumbnail'      // Small preview images
  | 'logo'           // Company/brand logos
  | 'icon'           // UI icons
  | 'background'     // Page/section backgrounds
  | 'card'           // Card images
  | 'gallery';       // Gallery items

export type PlaceholderStyle =
  | 'photography'    // Real photos (Unsplash, Lorem Picsum)
  | 'abstract'       // Abstract patterns/shapes
  | 'gradient'       // Gradient backgrounds
  | 'pattern'        // SVG patterns (Hero Patterns style)
  | 'illustration'   // Illustrated placeholders
  | 'solid';         // Solid color

export type Industry =
  | 'hospitality'
  | 'ecommerce'
  | 'saas'
  | 'healthcare'
  | 'fintech'
  | 'education'
  | 'social'
  | 'productivity'
  | 'developer-tools'
  | 'marketing'
  | 'crm'
  | 'generic';

export interface PlaceholderOptions {
  type: PlaceholderType;
  style?: PlaceholderStyle;
  industry?: Industry;
  dimensions?: [number, number]; // [width, height]
  theme?: 'light' | 'dark';
  seed?: string; // For consistent generation
  text?: string; // Text to display (for avatars, patterns)
  colors?: string[]; // Custom color palette
}

export interface PlaceholderResult {
  url: string;
  dataUri?: string; // Base64 data URI for inline use
  svg?: string; // Raw SVG if applicable
  alt: string;
  attribution?: {
    source: string;
    author?: string;
    license?: string;
    url?: string;
  };
  dimensions: {
    width: number;
    height: number;
  };
  metadata: {
    type: PlaceholderType;
    style: PlaceholderStyle;
    generated: boolean;
  };
}

// ============================================================================
// Animation Types
// ============================================================================

export type AnimationLibrary = 'framer-motion' | 'gsap' | 'css' | 'tailwind';

export type AnimationEffect =
  // Entrance animations
  | 'fade-in'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'rotate-in'
  // Stagger animations
  | 'stagger-fade'
  | 'stagger-slide'
  | 'stagger-scale'
  // Hover animations
  | 'hover-lift'
  | 'hover-glow'
  | 'hover-scale'
  | 'hover-tilt'
  // Scroll animations
  | 'scroll-reveal'
  | 'scroll-parallax'
  // Loop animations
  | 'pulse'
  | 'float'
  | 'shimmer'
  | 'gradient-shift'
  // Complex animations
  | 'logo-grid'       // Staggered logo reveal
  | 'hero-entrance'   // Hero section entrance
  | 'card-stack'      // Stacked card reveal
  | 'text-reveal'     // Character/word reveal
  | 'counter'         // Number counting up
  | 'progress'        // Progress bar animation
  | 'skeleton';       // Skeleton loading

export type AnimationTiming = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring';

export interface AnimationOptions {
  effect: AnimationEffect;
  library: AnimationLibrary;
  duration?: number; // seconds
  delay?: number; // seconds
  stagger?: number; // seconds between items
  timing?: AnimationTiming;
  repeat?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate';
  // Scroll-specific
  scrollTrigger?: {
    start?: string; // e.g., 'top 80%'
    end?: string;
    scrub?: boolean | number;
  };
  // Spring-specific (Framer Motion)
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
}

export interface AnimationResult {
  code: string; // Generated code
  language: 'tsx' | 'css' | 'js';
  library: AnimationLibrary;
  dependencies: string[]; // npm packages needed
  usage: string; // How to use the generated code
  preview?: string; // CSS-only preview if possible
}

// ============================================================================
// SVG Optimizer Types
// ============================================================================

export interface SVGOptimizeOptions {
  removeComments?: boolean;
  removeMetadata?: boolean;
  removeTitle?: boolean;
  removeDesc?: boolean;
  removeEmptyAttrs?: boolean;
  removeHiddenElems?: boolean;
  removeEmptyContainers?: boolean;
  cleanupIds?: boolean;
  convertColors?: boolean; // Convert to shorter hex
  convertPathData?: boolean; // Optimize path commands
  mergePaths?: boolean;
  minify?: boolean;
  pretty?: boolean; // Pretty print output
  // Accessibility
  addAriaLabel?: string;
  preserveAccessibility?: boolean;
}

export interface SVGOptimizeResult {
  svg: string; // Optimized SVG string
  originalSize: number; // bytes
  optimizedSize: number; // bytes
  savings: number; // percentage
  recommendations: SVGRecommendation[];
  metadata: {
    viewBox?: string;
    width?: string;
    height?: string;
    hasAnimations: boolean;
    hasGradients: boolean;
    hasFilters: boolean;
    pathCount: number;
    elementCount: number;
  };
}

export interface SVGRecommendation {
  type: 'optimization' | 'accessibility' | 'performance' | 'compatibility';
  severity: 'info' | 'warning' | 'error';
  message: string;
  suggestion?: string;
  automated?: boolean; // Can be auto-fixed
}

// ============================================================================
// Pattern Generator Types
// ============================================================================

export type PatternType =
  | 'dots'
  | 'lines'
  | 'grid'
  | 'zigzag'
  | 'waves'
  | 'circles'
  | 'triangles'
  | 'hexagons'
  | 'diamonds'
  | 'chevron'
  | 'noise'
  | 'topography'
  | 'circuit'
  | 'bubbles';

export interface PatternOptions {
  type: PatternType;
  size?: number; // Pattern unit size
  spacing?: number;
  colors?: {
    foreground: string;
    background: string;
  };
  opacity?: number;
  rotation?: number; // degrees
  scale?: number;
}

export interface PatternResult {
  svg: string;
  css: string; // background-image CSS
  dataUri: string;
  dimensions: {
    width: number;
    height: number;
  };
}

// ============================================================================
// Module Exports
// ============================================================================

export interface VisualAssetsModule {
  generatePlaceholder: (options: PlaceholderOptions) => Promise<PlaceholderResult>;
  generateAnimation: (name: string, options: AnimationOptions) => AnimationResult;
  optimizeSVG: (svg: string, options?: SVGOptimizeOptions) => SVGOptimizeResult;
  generatePattern: (options: PatternOptions) => PatternResult;
}
