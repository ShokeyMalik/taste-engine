/**
 * Style Inspector
 * Deep CSS inspection and extraction for specific elements
 */

import { BrowserAutomation, withBrowser } from './browser-automation';
import type { ElementStyles, ComputedStyles, HoverStyles, AnimationStyles, ResponsiveStyles } from './miromiro-types';

export class StyleInspector {
    /**
     * Inspect a specific element on a page
     */
    async inspectElement(url: string, selector: string): Promise<ElementStyles> {
        return await withBrowser(
            url,
            async (browser) => {
                // Wait for element to be visible
                await browser.waitForSelector(selector);

                // Extract base computed styles
                const computed = await this.extractBaseStyles(browser, selector);

                // Extract hover styles
                const hover = await this.extractHoverStyles(browser, selector);

                // Extract animations
                const animations = await this.extractAnimationStyles(browser, selector);

                // Extract responsive styles (simulated by resizing viewport)
                const responsive = await this.extractResponsiveStyles(browser, selector);

                return {
                    selector,
                    computed,
                    hover,
                    animations,
                    responsive,
                    metadata: {
                        url,
                        extractedAt: new Date().toISOString(),
                    },
                };
            },
            { headless: true, timeout: 60000 }
        );
    }

    /**
     * Extract base computed styles
     */
    private async extractBaseStyles(browser: BrowserAutomation, selector: string): Promise<ComputedStyles> {
        const rawStyles = await browser.getComputedStyles(selector);
        if (!rawStyles) {
            throw new Error(`Element not found: ${selector}`);
        }

        return {
            display: rawStyles.display || '',
            position: rawStyles.position || '',
            width: rawStyles.width || '',
            height: rawStyles.height || '',
            margin: rawStyles.margin || '',
            padding: rawStyles.padding || '',
            fontFamily: rawStyles['font-family'] || '',
            fontSize: rawStyles['font-size'] || '',
            fontWeight: rawStyles['font-weight'] || '',
            lineHeight: rawStyles['line-height'] || '',
            color: rawStyles.color || '',
            textAlign: rawStyles['text-align'] || '',
            backgroundColor: rawStyles['background-color'] || '',
            backgroundImage: rawStyles['background-image'] || '',
            border: rawStyles.border || '',
            borderRadius: rawStyles['border-radius'] || '',
            boxShadow: rawStyles['box-shadow'] || '',
            opacity: rawStyles.opacity || '',
            transform: rawStyles.transform || '',
            all: rawStyles,
        };
    }

    /**
     * Extract styles for hover state
     */
    private async extractHoverStyles(browser: BrowserAutomation, selector: string): Promise<HoverStyles> {
        const page = browser.getPage();
        if (!page) throw new Error('Browser page not available');

        // Get current styles
        const beforeStyles = await browser.getComputedStyles(selector);
        if (!beforeStyles) return { hasHover: false };

        // Trigger hover
        await page.hover(selector);
        // Tiny delay for transitions
        await page.waitForTimeout(100);

        // Get styles after hover
        const afterStyles = await browser.getComputedStyles(selector);
        if (!afterStyles) return { hasHover: false };

        // Detect differences
        const differences: Partial<ComputedStyles> = {};
        let hasHover = false;

        // Common hover properties to check
        const propsToCheck = [
            'color', 'background-color', 'border-color', 'opacity',
            'transform', 'box-shadow', 'text-decoration'
        ];

        propsToCheck.forEach(prop => {
            if (afterStyles[prop] !== beforeStyles[prop]) {
                hasHover = true;
                // Map to ComputedStyles interface keys
                const key = this.mapToInterfaceKey(prop);
                (differences as any)[key] = afterStyles[prop];
            }
        });

        return {
            hasHover,
            styles: hasHover ? differences : undefined,
        };
    }

    /**
     * Extract animation and transition metadata
     */
    private async extractAnimationStyles(browser: BrowserAutomation, selector: string): Promise<AnimationStyles> {
        const rawStyles = await browser.getComputedStyles(selector);
        if (!rawStyles) return { hasAnimation: false, animations: [], transitions: [] };

        const animations: any[] = [];
        const transitions: any[] = [];

        // Parse animation properties
        if (rawStyles['animation-name'] && rawStyles['animation-name'] !== 'none') {
            const names = rawStyles['animation-name'].split(',');
            const durations = rawStyles['animation-duration'].split(',');
            const timings = rawStyles['animation-timing-function'].split(',');
            const delays = rawStyles['animation-delay'].split(',');
            const iterations = rawStyles['animation-iteration-count'].split(',');

            names.forEach((name, i) => {
                animations.push({
                    name: name.trim(),
                    duration: durations[i]?.trim() || '0s',
                    timingFunction: timings[i]?.trim() || 'ease',
                    delay: delays[i]?.trim() || '0s',
                    iterationCount: iterations[i]?.trim() || '1',
                });
            });
        }

        // Parse transition properties
        if (rawStyles['transition-property'] && rawStyles['transition-property'] !== 'none') {
            const properties = rawStyles['transition-property'].split(',');
            const durations = rawStyles['transition-duration'].split(',');
            const timings = rawStyles['transition-timing-function'].split(',');
            const delays = rawStyles['transition-delay'].split(',');

            properties.forEach((prop, i) => {
                transitions.push({
                    property: prop.trim(),
                    duration: durations[i]?.trim() || '0s',
                    timingFunction: timings[i]?.trim() || 'ease',
                    delay: delays[i]?.trim() || '0s',
                });
            });
        }

        return {
            hasAnimation: animations.length > 0 || transitions.length > 0,
            animations,
            transitions,
        };
    }

    /**
     * Extract styles across different screen sizes
     */
    private async extractResponsiveStyles(browser: BrowserAutomation, selector: string): Promise<ResponsiveStyles> {
        const page = browser.getPage();
        if (!page) throw new Error('Browser page not available');

        const breakpoints = [1280, 768, 375]; // Desktop, Tablet, Mobile
        const results: any[] = [];

        for (const width of breakpoints) {
            await page.setViewportSize({ width, height: 800 });
            await page.waitForTimeout(100);

            const styles = await browser.getComputedStyles(selector);
            if (styles) {
                results.push({
                    width,
                    styles: {
                        fontSize: styles['font-size'],
                        display: styles.display,
                        padding: styles.padding,
                        margin: styles.margin,
                    },
                });
            }
        }

        // Reset viewport
        await page.setViewportSize({ width: 1920, height: 1080 });

        return { breakpoints: results };
    }

    /**
     * Helper to map CSS property names to ComputedStyles interface keys
     */
    private mapToInterfaceKey(prop: string): string {
        const mapping: Record<string, string> = {
            'font-family': 'fontFamily',
            'font-size': 'fontSize',
            'font-weight': 'fontWeight',
            'line-height': 'lineHeight',
            'text-align': 'textAlign',
            'background-color': 'backgroundColor',
            'background-image': 'backgroundImage',
            'border-radius': 'borderRadius',
            'box-shadow': 'boxShadow',
        };
        return mapping[prop] || prop;
    }
}

/**
 * Convenience function to inspect an element
 */
export async function inspectElement(url: string, selector: string): Promise<ElementStyles> {
    const inspector = new StyleInspector();
    return await inspector.inspectElement(url, selector);
}
