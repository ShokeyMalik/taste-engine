/**
 * Pattern Generator
 *
 * Generate SVG patterns for backgrounds, similar to Hero Patterns.
 * Pure TypeScript, no dependencies.
 */

import type { PatternOptions, PatternResult, PatternType } from './types';

// ============================================================================
// Pattern Templates
// ============================================================================

type PatternGeneratorFn = (
  size: number,
  spacing: number,
  fg: string,
  opacity: number
) => string;

const PATTERN_GENERATORS: Record<PatternType, PatternGeneratorFn> = {
  dots: (size, spacing, fg, opacity) => `
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 6}" fill="${fg}" fill-opacity="${opacity}" />`,

  lines: (size, spacing, fg, opacity) => `
    <line x1="0" y1="${size}" x2="${size}" y2="0" stroke="${fg}" stroke-width="1" stroke-opacity="${opacity}" />`,

  grid: (size, spacing, fg, opacity) => `
    <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${fg}" stroke-width="0.5" stroke-opacity="${opacity}" />`,

  zigzag: (size, spacing, fg, opacity) => {
    const h = size / 2;
    return `
    <path d="M0 ${h} l${h} -${h} l${h} ${h}" fill="none" stroke="${fg}" stroke-width="1" stroke-opacity="${opacity}" />`;
  },

  waves: (size, spacing, fg, opacity) => {
    const h = size / 4;
    return `
    <path d="M0 ${size / 2} Q${size / 4} ${h} ${size / 2} ${size / 2} T${size} ${size / 2}" fill="none" stroke="${fg}" stroke-width="1" stroke-opacity="${opacity}" />`;
  },

  circles: (size, spacing, fg, opacity) => `
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 3}" fill="none" stroke="${fg}" stroke-width="1" stroke-opacity="${opacity}" />`,

  triangles: (size, spacing, fg, opacity) => {
    const h = (size * Math.sqrt(3)) / 2;
    return `
    <polygon points="${size / 2},0 ${size},${h} 0,${h}" fill="none" stroke="${fg}" stroke-width="1" stroke-opacity="${opacity}" />`;
  },

  hexagons: (size, spacing, fg, opacity) => {
    const h = size / 2;
    const w = size * 0.866; // sqrt(3)/2
    const points = [
      [w / 2, 0],
      [w, h / 2],
      [w, (h * 3) / 2],
      [w / 2, h * 2],
      [0, (h * 3) / 2],
      [0, h / 2],
    ]
      .map((p) => p.join(','))
      .join(' ');
    return `
    <polygon points="${points}" fill="none" stroke="${fg}" stroke-width="1" stroke-opacity="${opacity}" />`;
  },

  diamonds: (size, spacing, fg, opacity) => {
    const h = size / 2;
    return `
    <polygon points="${h},0 ${size},${h} ${h},${size} 0,${h}" fill="none" stroke="${fg}" stroke-width="1" stroke-opacity="${opacity}" />`;
  },

  chevron: (size, spacing, fg, opacity) => {
    const h = size / 4;
    return `
    <path d="M0 ${size / 2} l${size / 2} -${h} l${size / 2} ${h}" fill="none" stroke="${fg}" stroke-width="1.5" stroke-opacity="${opacity}" />
    <path d="M0 ${(size * 3) / 4} l${size / 2} -${h} l${size / 2} ${h}" fill="none" stroke="${fg}" stroke-width="1.5" stroke-opacity="${opacity}" />`;
  },

  noise: (size, spacing, fg, opacity) => {
    // Generate random dots for noise effect
    const dots: string[] = [];
    const count = Math.floor((size * size) / 50);
    for (let i = 0; i < count; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 0.5 + Math.random() * 1;
      dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${fg}" fill-opacity="${opacity * Math.random()}" />`);
    }
    return dots.join('\n    ');
  },

  topography: (size, spacing, fg, opacity) => {
    // Generate contour-like lines
    const lines: string[] = [];
    const count = 4;
    for (let i = 0; i < count; i++) {
      const offset = (i * size) / count;
      const h = size / 8 + Math.random() * (size / 8);
      lines.push(`<path d="M0 ${offset + h} Q${size / 4} ${offset} ${size / 2} ${offset + h} T${size} ${offset + h}" fill="none" stroke="${fg}" stroke-width="1" stroke-opacity="${opacity * (0.3 + i * 0.2)}" />`);
    }
    return lines.join('\n    ');
  },

  circuit: (size, spacing, fg, opacity) => {
    const h = size / 4;
    return `
    <path d="M0 ${h} h${h} v${h} h${h}" fill="none" stroke="${fg}" stroke-width="1" stroke-opacity="${opacity}" />
    <circle cx="${h}" cy="${h}" r="2" fill="${fg}" fill-opacity="${opacity}" />
    <circle cx="${h * 2}" cy="${h * 2}" r="2" fill="${fg}" fill-opacity="${opacity}" />
    <path d="M${h * 3} ${h} h${h} v${h * 2}" fill="none" stroke="${fg}" stroke-width="1" stroke-opacity="${opacity}" />`;
  },

  bubbles: (size, spacing, fg, opacity) => {
    const r1 = size / 4;
    const r2 = size / 6;
    const r3 = size / 8;
    return `
    <circle cx="${size / 3}" cy="${size / 3}" r="${r1}" fill="none" stroke="${fg}" stroke-width="1" stroke-opacity="${opacity}" />
    <circle cx="${(size * 2) / 3}" cy="${(size * 2) / 3}" r="${r2}" fill="none" stroke="${fg}" stroke-width="1" stroke-opacity="${opacity * 0.7}" />
    <circle cx="${size / 6}" cy="${(size * 4) / 5}" r="${r3}" fill="none" stroke="${fg}" stroke-width="1" stroke-opacity="${opacity * 0.5}" />`;
  },
};

// ============================================================================
// Main Generator Class
// ============================================================================

export class PatternGenerator {
  /**
   * Generate an SVG pattern
   */
  generate(options: PatternOptions): PatternResult {
    const {
      type,
      size = 20,
      spacing = 0,
      colors = { foreground: '#6366f1', background: '#ffffff' },
      opacity = 0.4,
      rotation = 0,
      scale = 1,
    } = options;

    const { foreground, background } = colors;
    const patternSize = size + spacing;
    const scaledSize = patternSize * scale;

    const generator = PATTERN_GENERATORS[type];
    if (!generator) {
      throw new Error(`Unknown pattern type: ${type}`);
    }

    const patternContent = generator(patternSize, spacing, foreground, opacity);

    const rotationTransform = rotation ? `transform="rotate(${rotation} ${scaledSize / 2} ${scaledSize / 2})"` : '';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${scaledSize}" height="${scaledSize}" viewBox="0 0 ${patternSize} ${patternSize}">
  <rect width="100%" height="100%" fill="${background}" />
  <g ${rotationTransform}>${patternContent}
  </g>
</svg>`;

    const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`;

    const css = `background-color: ${background};
background-image: url("${dataUri}");
background-repeat: repeat;
background-size: ${scaledSize}px ${scaledSize}px;`;

    return {
      svg,
      css,
      dataUri,
      dimensions: {
        width: scaledSize,
        height: scaledSize,
      },
    };
  }

  /**
   * Generate inline CSS background
   */
  generateCSS(options: PatternOptions): string {
    return this.generate(options).css;
  }

  /**
   * Generate multiple patterns as options
   */
  generatePreviews(
    patternTypes: PatternType[],
    baseOptions: Omit<PatternOptions, 'type'> = {}
  ): Array<{ type: PatternType; result: PatternResult }> {
    return patternTypes.map((type) => ({
      type,
      result: this.generate({ ...baseOptions, type }),
    }));
  }

  /**
   * Get all available pattern types
   */
  getAvailableTypes(): PatternType[] {
    return Object.keys(PATTERN_GENERATORS) as PatternType[];
  }
}

// ============================================================================
// Convenience Function
// ============================================================================

const generator = new PatternGenerator();

/**
 * Generate an SVG pattern
 *
 * @example
 * ```typescript
 * // Simple dots pattern
 * const dots = generatePattern({ type: 'dots' });
 *
 * // Use as CSS background
 * element.style.cssText = dots.css;
 *
 * // Or use the data URI directly
 * element.style.backgroundImage = `url("${dots.dataUri}")`;
 *
 * // Custom colors and size
 * const custom = generatePattern({
 *   type: 'hexagons',
 *   size: 30,
 *   colors: {
 *     foreground: '#8b5cf6',
 *     background: '#0f172a'
 *   },
 *   opacity: 0.3
 * });
 *
 * // With rotation
 * const rotated = generatePattern({
 *   type: 'lines',
 *   rotation: 45,
 *   size: 10
 * });
 * ```
 */
export function generatePattern(options: PatternOptions): PatternResult {
  return generator.generate(options);
}

/**
 * Get CSS string for a pattern background
 */
export function getPatternCSS(options: PatternOptions): string {
  return generator.generateCSS(options);
}

/**
 * Get all available pattern types
 */
export function getAvailablePatternTypes(): PatternType[] {
  return generator.getAvailableTypes();
}

export { PatternGenerator as default };
