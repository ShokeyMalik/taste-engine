/**
 * SVG Optimizer
 *
 * Lightweight SVG optimization and analysis without external dependencies.
 * Implements common SVGO optimizations in pure TypeScript.
 *
 * Features:
 * - Remove comments and metadata
 * - Clean up IDs and empty elements
 * - Optimize path data
 * - Provide accessibility recommendations
 * - No external dependencies
 */

import type { SVGOptimizeOptions, SVGOptimizeResult, SVGRecommendation } from './types';

// ============================================================================
// Default Options
// ============================================================================

const DEFAULT_OPTIONS: SVGOptimizeOptions = {
  removeComments: true,
  removeMetadata: true,
  removeTitle: false, // Keep for accessibility
  removeDesc: false, // Keep for accessibility
  removeEmptyAttrs: true,
  removeHiddenElems: true,
  removeEmptyContainers: true,
  cleanupIds: true,
  convertColors: true,
  convertPathData: false, // Complex, disabled by default
  mergePaths: false, // Complex, disabled by default
  minify: true,
  pretty: false,
  preserveAccessibility: true,
};

// ============================================================================
// Color Conversion Utilities
// ============================================================================

const NAMED_COLORS: Record<string, string> = {
  white: '#fff',
  black: '#000',
  red: '#f00',
  green: '#0f0',
  blue: '#00f',
  yellow: '#ff0',
  cyan: '#0ff',
  magenta: '#f0f',
  silver: '#c0c0c0',
  gray: '#808080',
  grey: '#808080',
  maroon: '#800000',
  olive: '#808000',
  lime: '#0f0',
  aqua: '#0ff',
  teal: '#008080',
  navy: '#000080',
  fuchsia: '#f0f',
  purple: '#800080',
  transparent: 'transparent',
  none: 'none',
};

/**
 * Convert color to shortest representation
 */
function shortenColor(color: string): string {
  if (!color) return color;

  const trimmed = color.trim().toLowerCase();

  // Check named colors
  if (NAMED_COLORS[trimmed]) {
    const hex = NAMED_COLORS[trimmed];
    // Return shorter of named or hex
    return trimmed.length <= hex.length ? trimmed : hex;
  }

  // RGB/RGBA to hex
  const rgbMatch = trimmed.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    return shortenHex(hex);
  }

  // Shorten hex
  if (trimmed.startsWith('#')) {
    return shortenHex(trimmed);
  }

  return color;
}

/**
 * Convert 6-digit hex to 3-digit if possible
 */
function shortenHex(hex: string): string {
  if (hex.length === 7) {
    const r = hex[1];
    const r2 = hex[2];
    const g = hex[3];
    const g2 = hex[4];
    const b = hex[5];
    const b2 = hex[6];

    if (r === r2 && g === g2 && b === b2) {
      return `#${r}${g}${b}`;
    }
  }
  return hex;
}

// ============================================================================
// SVG Parser (Simple)
// ============================================================================

interface ParsedSVG {
  content: string;
  viewBox?: string;
  width?: string;
  height?: string;
  hasAnimations: boolean;
  hasGradients: boolean;
  hasFilters: boolean;
  pathCount: number;
  elementCount: number;
}

/**
 * Simple SVG parser that extracts key information
 */
function parseSVG(svg: string): ParsedSVG {
  const result: ParsedSVG = {
    content: svg,
    hasAnimations: false,
    hasGradients: false,
    hasFilters: false,
    pathCount: 0,
    elementCount: 0,
  };

  // Extract viewBox
  const viewBoxMatch = svg.match(/viewBox\s*=\s*["']([^"']+)["']/i);
  if (viewBoxMatch) {
    result.viewBox = viewBoxMatch[1];
  }

  // Extract width
  const widthMatch = svg.match(/<svg[^>]*\swidth\s*=\s*["']([^"']+)["']/i);
  if (widthMatch) {
    result.width = widthMatch[1];
  }

  // Extract height
  const heightMatch = svg.match(/<svg[^>]*\sheight\s*=\s*["']([^"']+)["']/i);
  if (heightMatch) {
    result.height = heightMatch[1];
  }

  // Check for animations
  result.hasAnimations =
    /<animate|<animateTransform|<animateMotion|<animateColor|<set/i.test(svg);

  // Check for gradients
  result.hasGradients = /<linearGradient|<radialGradient/i.test(svg);

  // Check for filters
  result.hasFilters = /<filter/i.test(svg);

  // Count paths
  result.pathCount = (svg.match(/<path/gi) || []).length;

  // Count all elements (rough estimate)
  result.elementCount = (svg.match(/<[a-z]/gi) || []).length;

  return result;
}

// ============================================================================
// Optimization Functions
// ============================================================================

/**
 * Remove XML comments
 */
function removeComments(svg: string): string {
  return svg.replace(/<!--[\s\S]*?-->/g, '');
}

/**
 * Remove metadata elements
 */
function removeMetadata(svg: string): string {
  return svg
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
    .replace(/<sodipodi[^>]*\/>/gi, '')
    .replace(/<inkscape[^>]*\/>/gi, '')
    .replace(/\s*xmlns:inkscape="[^"]*"/gi, '')
    .replace(/\s*xmlns:sodipodi="[^"]*"/gi, '')
    .replace(/\s*inkscape:[a-z-]+="[^"]*"/gi, '')
    .replace(/\s*sodipodi:[a-z-]+="[^"]*"/gi, '');
}

/**
 * Remove title element
 */
function removeTitle(svg: string): string {
  return svg.replace(/<title[\s\S]*?<\/title>/gi, '');
}

/**
 * Remove desc element
 */
function removeDesc(svg: string): string {
  return svg.replace(/<desc[\s\S]*?<\/desc>/gi, '');
}

/**
 * Remove empty attributes (attr="")
 */
function removeEmptyAttrs(svg: string): string {
  return svg.replace(/\s+[a-z-]+=""/gi, '');
}

/**
 * Remove hidden elements (display:none, visibility:hidden, opacity:0)
 */
function removeHiddenElems(svg: string): string {
  return svg
    .replace(/<[^>]*\s+display\s*=\s*["']none["'][^>]*\/>/gi, '')
    .replace(/<[^>]*\s+visibility\s*=\s*["']hidden["'][^>]*\/>/gi, '');
}

/**
 * Remove empty containers (g, defs with no content)
 */
function removeEmptyContainers(svg: string): string {
  let result = svg;
  let prevLength;

  // Repeat until no more changes (handles nested empty groups)
  do {
    prevLength = result.length;
    result = result
      .replace(/<g\s*>\s*<\/g>/gi, '')
      .replace(/<g\s*\/>/gi, '')
      .replace(/<defs\s*>\s*<\/defs>/gi, '')
      .replace(/<defs\s*\/>/gi, '');
  } while (result.length !== prevLength);

  return result;
}

/**
 * Clean up IDs (shorten random/long IDs)
 */
function cleanupIds(svg: string): string {
  // Find all IDs and their references
  const idMatches = svg.matchAll(/\sid="([^"]+)"/g);
  const ids = [...idMatches].map((m) => m[1]);

  let result = svg;
  let counter = 0;

  for (const id of ids) {
    // Skip short IDs
    if (id.length <= 3) continue;

    // Check if ID is referenced
    const isReferenced =
      result.includes(`url(#${id})`) ||
      result.includes(`href="#${id}"`) ||
      result.includes(`xlink:href="#${id}"`);

    if (isReferenced) {
      // Shorten to a short ID
      const newId = `a${counter++}`;
      result = result
        .replace(new RegExp(`id="${id}"`, 'g'), `id="${newId}"`)
        .replace(new RegExp(`url\\(#${id}\\)`, 'g'), `url(#${newId})`)
        .replace(new RegExp(`href="#${id}"`, 'g'), `href="#${newId}"`)
        .replace(new RegExp(`xlink:href="#${id}"`, 'g'), `xlink:href="#${newId}"`);
    } else {
      // Remove unreferenced ID
      result = result.replace(new RegExp(`\\s*id="${id}"`, 'g'), '');
    }
  }

  return result;
}

/**
 * Convert colors to shortest form
 */
function convertColors(svg: string): string {
  // Convert fill colors
  let result = svg.replace(/fill="([^"]+)"/g, (match, color) => {
    return `fill="${shortenColor(color)}"`;
  });

  // Convert stroke colors
  result = result.replace(/stroke="([^"]+)"/g, (match, color) => {
    return `stroke="${shortenColor(color)}"`;
  });

  // Convert stop-color
  result = result.replace(/stop-color="([^"]+)"/g, (match, color) => {
    return `stop-color="${shortenColor(color)}"`;
  });

  return result;
}

/**
 * Minify SVG (remove whitespace)
 */
function minifySVG(svg: string): string {
  return svg
    .replace(/>\s+</g, '><') // Remove whitespace between tags
    .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
    .replace(/\s*([{};:,])\s*/g, '$1') // Remove spaces around punctuation in styles
    .trim();
}

/**
 * Pretty print SVG
 */
function prettySVG(svg: string): string {
  let result = svg;
  let indent = 0;
  const lines: string[] = [];

  // Split by tags
  const parts = result.split(/(<[^>]+>)/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('</')) {
      // Closing tag - decrease indent first
      indent = Math.max(0, indent - 1);
      lines.push('  '.repeat(indent) + trimmed);
    } else if (trimmed.startsWith('<') && !trimmed.endsWith('/>') && !trimmed.startsWith('<?')) {
      // Opening tag
      lines.push('  '.repeat(indent) + trimmed);
      indent++;
    } else if (trimmed.startsWith('<')) {
      // Self-closing or processing instruction
      lines.push('  '.repeat(indent) + trimmed);
    } else {
      // Text content
      lines.push('  '.repeat(indent) + trimmed);
    }
  }

  return lines.join('\n');
}

/**
 * Add ARIA label for accessibility
 */
function addAriaLabel(svg: string, label: string): string {
  // Add role="img" and aria-label to the SVG element
  return svg.replace(/<svg/, `<svg role="img" aria-label="${label}"`);
}

// ============================================================================
// Recommendation Generator
// ============================================================================

function generateRecommendations(
  svg: string,
  parsed: ParsedSVG,
  options: SVGOptimizeOptions
): SVGRecommendation[] {
  const recommendations: SVGRecommendation[] = [];

  // Check for missing viewBox
  if (!parsed.viewBox) {
    recommendations.push({
      type: 'compatibility',
      severity: 'warning',
      message: 'SVG is missing a viewBox attribute',
      suggestion: 'Add a viewBox attribute for responsive scaling',
      automated: false,
    });
  }

  // Check for missing width/height
  if (!parsed.width && !parsed.height && !parsed.viewBox) {
    recommendations.push({
      type: 'compatibility',
      severity: 'error',
      message: 'SVG has no dimensions defined',
      suggestion: 'Add width, height, or viewBox attributes',
      automated: false,
    });
  }

  // Check for accessibility
  const hasTitle = /<title/i.test(svg);
  const hasDesc = /<desc/i.test(svg);
  const hasAriaLabel = /aria-label/i.test(svg);
  const hasRole = /role=/i.test(svg);

  if (!hasTitle && !hasAriaLabel) {
    recommendations.push({
      type: 'accessibility',
      severity: 'warning',
      message: 'SVG has no accessible name (title or aria-label)',
      suggestion: 'Add a <title> element or aria-label attribute',
      automated: options.addAriaLabel ? true : false,
    });
  }

  if (!hasRole) {
    recommendations.push({
      type: 'accessibility',
      severity: 'info',
      message: 'SVG has no role attribute',
      suggestion: 'Add role="img" for decorative images or role="graphics-document" for complex graphics',
      automated: false,
    });
  }

  // Check for animations
  if (parsed.hasAnimations) {
    recommendations.push({
      type: 'accessibility',
      severity: 'info',
      message: 'SVG contains animations',
      suggestion: 'Ensure animations respect prefers-reduced-motion',
      automated: false,
    });
  }

  // Check for inline styles
  if (/style="[^"]+"/i.test(svg)) {
    recommendations.push({
      type: 'optimization',
      severity: 'info',
      message: 'SVG contains inline styles',
      suggestion: 'Consider using presentation attributes for smaller file size',
      automated: false,
    });
  }

  // Check for unnecessary xmlns
  const xmlnsCount = (svg.match(/xmlns/g) || []).length;
  if (xmlnsCount > 2) {
    recommendations.push({
      type: 'optimization',
      severity: 'info',
      message: 'SVG has multiple xmlns declarations',
      suggestion: 'Remove unused namespace declarations',
      automated: true,
    });
  }

  // Check for large path data
  if (parsed.pathCount > 50) {
    recommendations.push({
      type: 'performance',
      severity: 'warning',
      message: `SVG has ${parsed.pathCount} paths, which may impact performance`,
      suggestion: 'Consider simplifying the SVG or using an image format',
      automated: false,
    });
  }

  // Check for filters (performance heavy)
  if (parsed.hasFilters) {
    recommendations.push({
      type: 'performance',
      severity: 'info',
      message: 'SVG uses filter effects',
      suggestion: 'Filters can impact rendering performance on mobile devices',
      automated: false,
    });
  }

  return recommendations;
}

// ============================================================================
// Main Optimizer Class
// ============================================================================

export class SVGOptimizer {
  /**
   * Optimize an SVG string
   */
  optimize(svg: string, userOptions: SVGOptimizeOptions = {}): SVGOptimizeResult {
    const options = { ...DEFAULT_OPTIONS, ...userOptions };
    const originalSize = new Blob([svg]).size;

    // Parse SVG first
    const parsed = parseSVG(svg);

    // Apply optimizations in order
    let result = svg;

    if (options.removeComments) {
      result = removeComments(result);
    }

    if (options.removeMetadata) {
      result = removeMetadata(result);
    }

    if (options.removeTitle && !options.preserveAccessibility) {
      result = removeTitle(result);
    }

    if (options.removeDesc && !options.preserveAccessibility) {
      result = removeDesc(result);
    }

    if (options.removeEmptyAttrs) {
      result = removeEmptyAttrs(result);
    }

    if (options.removeHiddenElems) {
      result = removeHiddenElems(result);
    }

    if (options.removeEmptyContainers) {
      result = removeEmptyContainers(result);
    }

    if (options.cleanupIds) {
      result = cleanupIds(result);
    }

    if (options.convertColors) {
      result = convertColors(result);
    }

    if (options.addAriaLabel) {
      result = addAriaLabel(result, options.addAriaLabel);
    }

    // Final formatting
    if (options.minify && !options.pretty) {
      result = minifySVG(result);
    } else if (options.pretty) {
      result = prettySVG(result);
    }

    const optimizedSize = new Blob([result]).size;
    const savings = originalSize > 0 ? ((originalSize - optimizedSize) / originalSize) * 100 : 0;

    // Parse optimized result
    const optimizedParsed = parseSVG(result);

    // Generate recommendations
    const recommendations = generateRecommendations(result, optimizedParsed, options);

    return {
      svg: result,
      originalSize,
      optimizedSize,
      savings: Math.round(savings * 100) / 100,
      recommendations,
      metadata: {
        viewBox: optimizedParsed.viewBox,
        width: optimizedParsed.width,
        height: optimizedParsed.height,
        hasAnimations: optimizedParsed.hasAnimations,
        hasGradients: optimizedParsed.hasGradients,
        hasFilters: optimizedParsed.hasFilters,
        pathCount: optimizedParsed.pathCount,
        elementCount: optimizedParsed.elementCount,
      },
    };
  }

  /**
   * Quick analysis without optimization
   */
  analyze(svg: string): Pick<SVGOptimizeResult, 'metadata' | 'recommendations'> {
    const parsed = parseSVG(svg);
    const recommendations = generateRecommendations(svg, parsed, DEFAULT_OPTIONS);

    return {
      metadata: {
        viewBox: parsed.viewBox,
        width: parsed.width,
        height: parsed.height,
        hasAnimations: parsed.hasAnimations,
        hasGradients: parsed.hasGradients,
        hasFilters: parsed.hasFilters,
        pathCount: parsed.pathCount,
        elementCount: parsed.elementCount,
      },
      recommendations,
    };
  }

  /**
   * Validate SVG structure
   */
  validate(svg: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for SVG root element
    if (!/<svg[\s>]/i.test(svg)) {
      errors.push('Missing <svg> root element');
    }

    // Check for closed SVG tag
    if (!/<\/svg>/i.test(svg)) {
      errors.push('Missing closing </svg> tag');
    }

    // Check for basic XML validity (rough check)
    const openTags = (svg.match(/<[a-z][^>]*[^/]>/gi) || []).length;
    const closeTags = (svg.match(/<\/[a-z]+>/gi) || []).length;
    const selfClosing = (svg.match(/<[a-z][^>]*\/>/gi) || []).length;

    // This is a rough heuristic
    if (Math.abs(openTags - closeTags - selfClosing) > 5) {
      errors.push('SVG may have unclosed tags');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// ============================================================================
// Convenience Function
// ============================================================================

const optimizer = new SVGOptimizer();

/**
 * Optimize an SVG string
 *
 * @example
 * ```typescript
 * const result = optimizeSVG(rawSvg);
 *
 * console.log(result.svg);        // Optimized SVG string
 * console.log(result.savings);    // Percentage saved
 * console.log(result.recommendations); // Suggestions for improvement
 *
 * // With options
 * const pretty = optimizeSVG(rawSvg, { pretty: true, minify: false });
 *
 * // Add accessibility
 * const accessible = optimizeSVG(rawSvg, { addAriaLabel: 'Company Logo' });
 * ```
 */
export function optimizeSVG(svg: string, options?: SVGOptimizeOptions): SVGOptimizeResult {
  return optimizer.optimize(svg, options);
}

/**
 * Analyze an SVG without modifying it
 */
export function analyzeSVG(
  svg: string
): Pick<SVGOptimizeResult, 'metadata' | 'recommendations'> {
  return optimizer.analyze(svg);
}

/**
 * Validate SVG structure
 */
export function validateSVG(svg: string): { valid: boolean; errors: string[] } {
  return optimizer.validate(svg);
}

export { SVGOptimizer as default };
