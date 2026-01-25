/**
 * Design Token Extractor
 * Extract design tokens (colors, typography, spacing, shadows, borders) from websites
 */

import { BrowserAutomation, withBrowser } from './browser-automation';
import type {
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
} from './miromiro-types';

/**
 * Convert RGB string to RGB object
 */
function parseRGB(rgb: string): { r: number; g: number; b: number } | null {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;
    return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
    };
}

/**
 * Convert RGB to HSL
 */
function rgbToHSL(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
        s = 0,
        l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

/**
 * Convert RGB to HEX
 */
function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Categorize color usage based on HSL values
 */
function categorizeColor(hsl: { h: number; s: number; l: number }): ColorToken['usage'] {
    const { h, s, l } = hsl;

    // Neutrals (low saturation)
    if (s < 15) return 'neutral';

    // Semantic colors
    if (h >= 0 && h < 30) return 'semantic'; // Red/Orange (error/warning)
    if (h >= 30 && h < 60) return 'semantic'; // Yellow (warning)
    if (h >= 90 && h < 150) return 'semantic'; // Green (success)
    if (h >= 180 && h < 240) return 'semantic'; // Blue (info)

    // Primary/Secondary/Accent based on saturation and lightness
    if (s > 60 && l > 40 && l < 70) return 'accent';
    if (s > 40) return 'primary';

    return 'other';
}

/**
 * Extract color palette from page
 */
export async function extractColorPalette(browser: BrowserAutomation): Promise<MiromiroColorPalette> {
    const colors = await browser.extractColors();
    const colorMap = new Map<string, ColorToken>();

    // Process each color
    colors.forEach((color) => {
        const rgb = parseRGB(color);
        if (!rgb) return;

        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        const hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);
        const usage = categorizeColor(hsl);

        if (colorMap.has(hex)) {
            const existing = colorMap.get(hex)!;
            existing.occurrences++;
        } else {
            colorMap.set(hex, {
                name: hex,
                value: hex,
                rgb,
                hsl,
                usage,
                occurrences: 1,
            });
        }
    });

    const allColors = Array.from(colorMap.values()).sort((a, b) => b.occurrences - a.occurrences);

    // Categorize colors
    const primary = allColors.filter((c) => c.usage === 'primary');
    const secondary = allColors.filter((c) => c.usage === 'secondary');
    const accent = allColors.filter((c) => c.usage === 'accent');
    const neutrals = allColors.filter((c) => c.usage === 'neutral');

    // Semantic colors
    const semanticColors = allColors.filter((c) => c.usage === 'semantic');
    const success = semanticColors.filter((c) => c.hsl.h >= 90 && c.hsl.h < 150);
    const warning = semanticColors.filter((c) => c.hsl.h >= 30 && c.hsl.h < 90);
    const error = semanticColors.filter((c) => c.hsl.h >= 0 && c.hsl.h < 30);
    const info = semanticColors.filter((c) => c.hsl.h >= 180 && c.hsl.h < 240);

    return {
        primary,
        secondary,
        accent,
        neutrals,
        semantic: { success, warning, error, info },
        all: allColors,
    };
}

/**
 * Extract typography system from page
 */
export async function extractTypographySystem(browser: BrowserAutomation): Promise<TypographySystem> {
    const typographyData = await browser.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const typographyMap = new Map<string, any>();

        elements.forEach((el) => {
            const computed = window.getComputedStyle(el);
            const key = `${computed.fontFamily}|${computed.fontSize}|${computed.fontWeight}|${computed.lineHeight}`;

            const tagName = el.tagName.toLowerCase();
            let usage: 'heading' | 'body' | 'caption' | 'button' | 'other' = 'other';

            if (/^h[1-6]$/.test(tagName)) usage = 'heading';
            else if (['p', 'div', 'span', 'article', 'section'].includes(tagName)) usage = 'body';
            else if (['small', 'caption', 'figcaption'].includes(tagName)) usage = 'caption';
            else if (tagName === 'button' || el.classList.contains('button') || el.classList.contains('btn'))
                usage = 'button';

            if (typographyMap.has(key)) {
                const existing = typographyMap.get(key);
                existing.occurrences++;
            } else {
                typographyMap.set(key, {
                    fontFamily: computed.fontFamily,
                    fontSize: computed.fontSize,
                    fontWeight: computed.fontWeight,
                    lineHeight: computed.lineHeight,
                    letterSpacing: computed.letterSpacing,
                    textTransform: computed.textTransform,
                    usage,
                    occurrences: 1,
                });
            }
        });

        return Array.from(typographyMap.values());
    });

    const allTypography: TypographyToken[] = typographyData.sort((a, b) => b.occurrences - a.occurrences);

    // Extract unique font families
    const fontFamilies = Array.from(new Set(allTypography.map((t) => t.fontFamily)));

    // Categorize typography
    const headings = allTypography.filter((t) => t.usage === 'heading');
    const body = allTypography.filter((t) => t.usage === 'body');
    const captions = allTypography.filter((t) => t.usage === 'caption');
    const buttons = allTypography.filter((t) => t.usage === 'button');

    return {
        fontFamilies,
        headings,
        body,
        captions,
        buttons,
        all: allTypography,
    };
}

/**
 * Extract spacing scale from page
 */
export async function extractSpacingScale(browser: BrowserAutomation): Promise<SpacingScale> {
    const spacingData = await browser.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const spacingMap = new Map<number, SpacingToken>();

        elements.forEach((el) => {
            const computed = window.getComputedStyle(el);

            // Extract spacing values
            const properties = [
                { prop: 'marginTop', usage: 'margin' as const },
                { prop: 'marginRight', usage: 'margin' as const },
                { prop: 'marginBottom', usage: 'margin' as const },
                { prop: 'marginLeft', usage: 'margin' as const },
                { prop: 'paddingTop', usage: 'padding' as const },
                { prop: 'paddingRight', usage: 'padding' as const },
                { prop: 'paddingBottom', usage: 'padding' as const },
                { prop: 'paddingLeft', usage: 'padding' as const },
                { prop: 'gap', usage: 'gap' as const },
            ];

            properties.forEach(({ prop, usage }) => {
                const value = computed.getPropertyValue(prop);
                const pixels = parseFloat(value);

                if (!isNaN(pixels) && pixels > 0) {
                    if (spacingMap.has(pixels)) {
                        const existing = spacingMap.get(pixels)!;
                        existing.occurrences++;
                    } else {
                        spacingMap.set(pixels, {
                            value: `${pixels}px`,
                            pixels,
                            usage,
                            occurrences: 1,
                        });
                    }
                }
            });
        });

        return Array.from(spacingMap.values());
    });

    const tokens = spacingData.sort((a, b) => b.occurrences - a.occurrences);

    // Detect spacing scale (common intervals)
    const pixelValues = tokens.map((t) => t.pixels).sort((a, b) => a - b);
    const scale: number[] = [];

    // Find base unit (GCD-like approach)
    const commonDivisors = [4, 8, 12, 16];
    let baseUnit = 8; // default

    for (const divisor of commonDivisors) {
        const matches = pixelValues.filter((v) => v % divisor === 0);
        if (matches.length > pixelValues.length * 0.6) {
            baseUnit = divisor;
            break;
        }
    }

    // Generate scale
    for (let i = 0; i <= 128; i += baseUnit) {
        if (pixelValues.includes(i)) {
            scale.push(i);
        }
    }

    return { scale, tokens };
}

/**
 * Extract shadow system from page
 */
export async function extractShadowSystem(browser: BrowserAutomation): Promise<ShadowSystem> {
    const shadowData = await browser.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const shadowMap = new Map<string, ShadowToken>();

        elements.forEach((el) => {
            const computed = window.getComputedStyle(el);
            const boxShadow = computed.boxShadow;

            if (boxShadow && boxShadow !== 'none') {
                // Parse box-shadow (simplified)
                const match = boxShadow.match(/(-?\d+px)\s+(-?\d+px)\s+(-?\d+px)\s+(-?\d+px)?\s*(.*)/);
                if (match) {
                    const tagName = el.tagName.toLowerCase();
                    let usage: 'card' | 'dropdown' | 'modal' | 'other' = 'other';

                    if (['div', 'article', 'section'].includes(tagName)) usage = 'card';
                    if (el.classList.contains('dropdown') || el.classList.contains('menu')) usage = 'dropdown';
                    if (el.classList.contains('modal') || el.classList.contains('dialog')) usage = 'modal';

                    if (shadowMap.has(boxShadow)) {
                        const existing = shadowMap.get(boxShadow)!;
                        existing.occurrences++;
                    } else {
                        shadowMap.set(boxShadow, {
                            value: boxShadow,
                            offsetX: parseFloat(match[1]),
                            offsetY: parseFloat(match[2]),
                            blur: parseFloat(match[3]),
                            spread: match[4] ? parseFloat(match[4]) : 0,
                            color: match[5] || 'rgba(0, 0, 0, 0.1)',
                            usage,
                            occurrences: 1,
                        });
                    }
                }
            }
        });

        return Array.from(shadowMap.values());
    });

    return {
        shadows: shadowData.sort((a, b) => b.occurrences - a.occurrences),
    };
}

/**
 * Extract border system from page
 */
export async function extractBorderSystem(browser: BrowserAutomation): Promise<BorderSystem> {
    const borderData = await browser.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const borderMap = new Map<string, BorderToken>();
        const radiusMap = new Map<number, RadiusToken>();

        elements.forEach((el) => {
            const computed = window.getComputedStyle(el);

            // Borders
            const border = computed.border;
            if (border && border !== 'none' && border !== '0px none rgb(0, 0, 0)') {
                const match = border.match(/(\d+px)\s+(\w+)\s+(.*)/);
                if (match) {
                    const key = `${match[1]}|${match[2]}|${match[3]}`;
                    if (borderMap.has(key)) {
                        const existing = borderMap.get(key)!;
                        existing.occurrences++;
                    } else {
                        borderMap.set(key, {
                            width: match[1],
                            style: match[2],
                            color: match[3],
                            occurrences: 1,
                        });
                    }
                }
            }

            // Border radius
            const borderRadius = computed.borderRadius;
            if (borderRadius && borderRadius !== '0px') {
                const pixels = parseFloat(borderRadius);
                if (!isNaN(pixels) && pixels > 0) {
                    const tagName = el.tagName.toLowerCase();
                    let usage: 'button' | 'card' | 'input' | 'other' = 'other';

                    if (tagName === 'button' || el.classList.contains('button') || el.classList.contains('btn'))
                        usage = 'button';
                    else if (['div', 'article', 'section'].includes(tagName)) usage = 'card';
                    else if (['input', 'textarea', 'select'].includes(tagName)) usage = 'input';

                    if (radiusMap.has(pixels)) {
                        const existing = radiusMap.get(pixels)!;
                        existing.occurrences++;
                    } else {
                        radiusMap.set(pixels, {
                            value: borderRadius,
                            pixels,
                            usage,
                            occurrences: 1,
                        });
                    }
                }
            }
        });

        return {
            borders: Array.from(borderMap.values()),
            radii: Array.from(radiusMap.values()),
        };
    });

    return {
        borders: borderData.borders.sort((a, b) => b.occurrences - a.occurrences),
        radii: borderData.radii.sort((a, b) => b.occurrences - a.occurrences),
    };
}

/**
 * Extract all design tokens from a URL
 */
export async function extractDesignTokens(url: string): Promise<MiromiroDesignTokens> {
    const startTime = Date.now();

    return await withBrowser(
        url,
        async (browser) => {
            // Extract all token types
            const [colors, typography, spacing, shadows, borders] = await Promise.all([
                extractColorPalette(browser),
                extractTypographySystem(browser),
                extractSpacingScale(browser),
                extractShadowSystem(browser),
                extractBorderSystem(browser),
            ]);

            // Count elements analyzed
            const elementsAnalyzed = await browser.evaluate(() => document.querySelectorAll('*').length);

            return {
                colors,
                typography,
                spacing,
                shadows,
                borders,
                metadata: {
                    url,
                    extractedAt: new Date().toISOString(),
                    elementsAnalyzed,
                },
            };
        },
        { headless: true, timeout: 60000 }
    );
}

/**
 * Export design tokens as CSS variables
 */
export function exportAsCSSVariables(tokens: MiromiroDesignTokens): string {
    let css = ':root {\n';

    // Colors
    tokens.colors.primary.slice(0, 5).forEach((color, i) => {
        css += `  --color-primary-${i + 1}: ${color.value};\n`;
    });

    tokens.colors.neutrals.slice(0, 10).forEach((color, i) => {
        css += `  --color-neutral-${i + 1}: ${color.value};\n`;
    });

    // Typography
    tokens.typography.fontFamilies.forEach((font, i) => {
        css += `  --font-family-${i + 1}: ${font};\n`;
    });

    // Spacing
    tokens.spacing.scale.forEach((value, i) => {
        css += `  --spacing-${i + 1}: ${value}px;\n`;
    });

    // Shadows
    tokens.shadows.shadows.slice(0, 5).forEach((shadow, i) => {
        css += `  --shadow-${i + 1}: ${shadow.value};\n`;
    });

    // Border radius
    tokens.borders.radii.slice(0, 5).forEach((radius, i) => {
        css += `  --radius-${i + 1}: ${radius.value};\n`;
    });

    css += '}\n';
    return css;
}

/**
 * Export design tokens as Tailwind config
 */
export function exportAsTailwindConfig(tokens: MiromiroDesignTokens): object {
    const colors: Record<string, string> = {};
    tokens.colors.primary.slice(0, 5).forEach((color, i) => {
        colors[`primary-${i + 1}`] = color.value;
    });
    tokens.colors.neutrals.slice(0, 10).forEach((color, i) => {
        colors[`neutral-${i + 1}`] = color.value;
    });

    const spacing: Record<string, string> = {};
    tokens.spacing.scale.forEach((value, i) => {
        spacing[`${i + 1}`] = `${value}px`;
    });

    return {
        theme: {
            extend: {
                colors,
                spacing,
                fontFamily: {
                    sans: tokens.typography.fontFamilies[0]?.split(',') || [],
                },
            },
        },
    };
}
