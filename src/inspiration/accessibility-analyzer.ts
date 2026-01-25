/**
 * Accessibility Analyzer
 * WCAG compliance checking and contrast analysis
 */

import { BrowserAutomation, withBrowser } from './browser-automation';
import type { AccessibilityReport, ContrastResult, WCAGResult, Recommendation } from './miromiro-types';

export class AccessibilityAnalyzer {
    /**
     * Analyze accessibility of a page
     */
    async analyzeAccessibility(url: string): Promise<AccessibilityReport> {
        return await withBrowser(
            url,
            async (browser) => {
                const contrast = await this.checkPageContrast(browser);
                const wcag = await this.checkWCAGCompliance(browser);
                const recommendations = this.generateRecommendations(contrast, wcag);

                // Calculate a rough score
                const score = this.calculateScore(contrast, wcag);

                return {
                    contrast,
                    wcag,
                    recommendations,
                    score,
                    metadata: {
                        url,
                        analyzedAt: new Date().toISOString(),
                        elementsChecked: await browser.evaluate(() => document.querySelectorAll('*').length),
                    },
                };
            },
            { headless: true, timeout: 60000 }
        );
    }

    /**
     * Check contrast ratios for key elements on the page
     */
    private async checkPageContrast(browser: BrowserAutomation): Promise<ContrastResult[]> {
        return await browser.evaluate(() => {
            const results: any[] = [];
            const elements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, button, a, label, span'));

            // Helper to convert hex/rgb to luminance
            const getLuminance = (r: number, g: number, b: number) => {
                const a = [r, g, b].map(v => {
                    v /= 255;
                    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
                });
                return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
            };

            const getContrast = (rgb1: number[], rgb2: number[]) => {
                const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
                const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
                return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
            };

            const parseRGB = (color: string) => {
                const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
            };

            elements.slice(0, 50).forEach(el => {
                const style = window.getComputedStyle(el);
                const fg = parseRGB(style.color);
                const bg = parseRGB(style.backgroundColor);

                // Skip hidden/empty elements
                if (style.display === 'none' || style.visibility === 'hidden' || el.textContent?.trim() === '') return;

                const ratio = getContrast(fg, bg);
                const fontSize = parseFloat(style.fontSize);
                const fontWeight = style.fontWeight;
                const isLarge = fontSize >= 24 || (fontSize >= 18.6 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));

                results.push({
                    foreground: style.color,
                    background: style.backgroundColor,
                    ratio: Math.round(ratio * 100) / 100,
                    wcagAA: {
                        normal: ratio >= 4.5,
                        large: ratio >= 3.0,
                    },
                    wcagAAA: {
                        normal: ratio >= 7.0,
                        large: ratio >= 4.5,
                    },
                    pass: isLarge ? ratio >= 3.0 : ratio >= 4.5,
                    element: `${el.tagName.toLowerCase()}${el.className ? '.' + el.className.split(' ').join('.') : ''}`,
                });
            });

            return results;
        });
    }

    /**
     * Check general WCAG compliance issues
     */
    private async checkWCAGCompliance(browser: BrowserAutomation): Promise<WCAGResult> {
        const issues = await browser.evaluate(() => {
            const detectedIssues: any[] = [];

            // Check Images for Alt text
            document.querySelectorAll('img').forEach(img => {
                if (!img.alt && !img.hasAttribute('aria-hidden')) {
                    detectedIssues.push({
                        type: 'alt-text',
                        severity: 'error',
                        message: 'Image missing alternative text',
                        element: 'img'
                    });
                }
            });

            // Check form fields for labels
            document.querySelectorAll('input, select, textarea').forEach(input => {
                const id = input.getAttribute('id');
                const hasLabel = id ? !!document.querySelector(`label[for="${id}"]`) : !!input.closest('label');
                if (!hasLabel && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                    detectedIssues.push({
                        type: 'aria',
                        severity: 'error',
                        message: 'Form field missing associated label or aria-label',
                        element: input.tagName.toLowerCase()
                    });
                }
            });

            // Check for sequential headings
            let lastLevel = 0;
            document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
                const level = parseInt(h.tagName[1]);
                if (level > lastLevel + 1 && lastLevel !== 0) {
                    detectedIssues.push({
                        type: 'heading',
                        severity: 'warning',
                        message: `Skipped heading level from h${lastLevel} to h${level}`,
                        element: h.tagName.toLowerCase()
                    });
                }
                lastLevel = level;
            });

            // Check for language attribute
            if (!document.documentElement.getAttribute('lang')) {
                detectedIssues.push({
                    type: 'other',
                    severity: 'error',
                    message: 'HTML tag missing lang attribute',
                    element: 'html'
                });
            }

            return detectedIssues;
        });

        return {
            level: issues.length === 0 ? 'AAA' : issues.some(i => i.severity === 'error') ? 'fail' : 'AA',
            issues
        };
    }

    /**
     * Generate recommendations based on analysis
     */
    private generateRecommendations(contrast: ContrastResult[], wcag: WCAGResult): Recommendation[] {
        const recommendations: Recommendation[] = [];

        // Contrast recommendations
        const failedContrast = contrast.filter(c => !c.pass);
        if (failedContrast.length > 0) {
            recommendations.push({
                type: 'color',
                priority: 'high',
                message: `${failedContrast.length} elements have poor color contrast ratio.`,
                suggestion: 'Adjust text or background colors to meet WCAG 2.1 AA standards (4.5:1 for normal text).'
            });
        }

        // Alt text recommendations
        if (wcag.issues.some(i => i.type === 'alt-text')) {
            recommendations.push({
                type: 'typography',
                priority: 'high',
                message: 'Multiple images are missing descriptive alt text.',
                suggestion: 'Add descriptive ALT attributes to all meaningful images, or aria-hidden="true" for decorative ones.'
            });
        }

        // Aria recommendations
        if (wcag.issues.some(i => i.type === 'aria')) {
            recommendations.push({
                type: 'aria',
                priority: 'high',
                message: 'Some interactive elements lack accessible names.',
                suggestion: 'Provide labels or aria-label attributes for all form controls and buttons.'
            });
        }

        return recommendations;
    }

    /**
     * Calculate overall accessibility score
     */
    private calculateScore(contrast: ContrastResult[], wcag: WCAGResult): number {
        let score = 100;

        // Penalize for contrast failures
        const contrastFailRate = contrast.length > 0 ? contrast.filter(c => !c.pass).length / contrast.length : 0;
        score -= contrastFailRate * 30;

        // Penalize for errors
        score -= wcag.issues.filter(i => i.severity === 'error').length * 5;

        // Penalize for warnings
        score -= wcag.issues.filter(i => i.severity === 'warning').length * 2;

        return Math.max(0, Math.min(100, Math.round(score)));
    }
}

/**
 * Convenience function to check accessibility
 */
export async function checkAccessibility(url: string): Promise<AccessibilityReport> {
    const analyzer = new AccessibilityAnalyzer();
    return await analyzer.analyzeAccessibility(url);
}
