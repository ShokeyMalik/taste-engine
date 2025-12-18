/**
 * Visual Assets Module
 *
 * Context-aware visual asset generation for AI-powered UIs.
 *
 * Features:
 * - Placeholder images (photography, gradients, patterns)
 * - Animation code generation (Framer Motion, GSAP, CSS, Tailwind)
 * - SVG optimization and analysis
 * - Pattern generation (dots, lines, hexagons, etc.)
 *
 * @example
 * ```typescript
 * import {
 *   generatePlaceholder,
 *   generateAnimation,
 *   optimizeSVG,
 *   generatePattern
 * } from 'taste-engine';
 *
 * // Generate context-aware placeholder
 * const hero = await generatePlaceholder({
 *   type: 'hero',
 *   style: 'photography',
 *   industry: 'hospitality'
 * });
 *
 * // Generate animation code
 * const animation = generateAnimation('logo-grid', {
 *   effect: 'logo-grid',
 *   library: 'framer-motion',
 *   stagger: 0.1
 * });
 *
 * // Optimize SVG
 * const optimized = optimizeSVG(rawSvg, { minify: true });
 *
 * // Generate pattern background
 * const pattern = generatePattern({ type: 'dots', opacity: 0.3 });
 * ```
 */

// Types
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

  // Module type
  VisualAssetsModule,
} from './types';

// Placeholder Generator
export {
  generatePlaceholder,
  PlaceholderGenerator,
} from './placeholder-generator';

// Animation Recipes
export {
  generateAnimation,
  AnimationRecipeGenerator,
} from './animation-recipes';

// SVG Optimizer
export {
  optimizeSVG,
  analyzeSVG,
  validateSVG,
  SVGOptimizer,
} from './svg-optimizer';

// Pattern Generator
export {
  generatePattern,
  getPatternCSS,
  getAvailablePatternTypes,
  PatternGenerator,
} from './pattern-generator';
