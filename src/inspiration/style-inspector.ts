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
     * Extract animation and transition metadata (including high-fidelity code)
     */
    private async extractAnimationStyles(browser: BrowserAutomation, selector: string): Promise<AnimationStyles> {
        const rawStyles = await browser.getComputedStyles(selector);
        if (!rawStyles) return { hasAnimation: false, animations: [], transitions: [] };

        // Execute in browser context for stylesheet access
        const motionDetails = await browser.evaluateWithArgs((sel: string) => {
            const el = document.querySelector(sel);
            if (!el) return null;

            const styles = window.getComputedStyle(el);
            const animations: any[] = [];
            const transitions: any[] = [];

            // 1. Capture Animation Code (@keyframes)
            if (styles.animationName && styles.animationName !== 'none') {
                const names = styles.animationName.split(',').map(n => n.trim());
                const durations = styles.animationDuration.split(',').map(n => n.trim());
                const timings = styles.animationTimingFunction.split(',').map(n => n.trim());
                const delays = styles.animationDelay.split(',').map(n => n.trim());
                const iterations = styles.animationIterationCount.split(',').map(n => n.trim());

                names.forEach((name, i) => {
                    let keyframesCode = '';
                    // Find the @keyframes rule in stylesheets
                    try {
                        for (const sheet of Array.from(document.styleSheets)) {
                            try {
                                for (const rule of Array.from(sheet.cssRules)) {
                                    if (rule.constructor.name === 'CSSKeyframesRule' && (rule as any).name === name) {
                                        keyframesCode = (rule as any).cssText;
                                        break;
                                    }
                                }
                            } catch (e) { /* cross-origin sheet */ }
                            if (keyframesCode) break;
                        }
                    } catch (e) { }

                    animations.push({
                        name,
                        duration: durations[i] || '0s',
                        timingFunction: timings[i] || 'ease',
                        delay: delays[i] || '0s',
                        iterationCount: iterations[i] || '1',
                        keyframes: keyframesCode
                    });
                });
            }

            // 2. Capture Transition Code
            if (styles.transitionProperty && styles.transitionProperty !== 'none') {
                const props = styles.transitionProperty.split(',').map(p => p.trim());
                const durations = styles.transitionDuration.split(',').map(p => p.trim());
                const timings = styles.transitionTimingFunction.split(',').map(p => p.trim());
                const delays = styles.transitionDelay.split(',').map(p => p.trim());

                props.forEach((property, i) => {
                    transitions.push({
                        property,
                        duration: durations[i] || '0s',
                        timingFunction: timings[i] || 'ease',
                        delay: delays[i] || '0s',
                        css: `transition: ${property} ${durations[i]} ${timings[i]} ${delays[i]};`
                    });
                });
            }

            return { animations, transitions };
        }, selector);

        if (!motionDetails) return { hasAnimation: false, animations: [], transitions: [] };

        return {
            hasAnimation: motionDetails.animations.length > 0 || motionDetails.transitions.length > 0,
            animations: motionDetails.animations,
            transitions: motionDetails.transitions,
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
