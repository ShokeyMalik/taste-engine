/**
 * Browser Automation Layer
 * Headless browser control for design extraction using Playwright
 */

import { chromium, Browser, Page, BrowserContext } from 'playwright';

export interface BrowserOptions {
    headless?: boolean;
    timeout?: number;
    viewport?: { width: number; height: number };
    userAgent?: string;
}

export interface PageLoadOptions {
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
    timeout?: number;
    waitForSelector?: string;
}

export class BrowserAutomation {
    private browser: Browser | null = null;
    private context: BrowserContext | null = null;
    private page: Page | null = null;

    /**
     * Launch browser instance
     */
    async launch(options: BrowserOptions = {}): Promise<void> {
        const {
            headless = true,
            timeout = 30000,
            viewport = { width: 1920, height: 1080 },
            userAgent,
        } = options;

        this.browser = await chromium.launch({
            headless,
            timeout,
        });

        this.context = await this.browser.newContext({
            viewport,
            userAgent,
        });

        this.page = await this.context.newPage();

        // Polyfill __name for transpiled code (esbuild/tsup helper)
        await this.page.addInitScript(() => {
            (window as any).__name = (f: any) => f;
        });
    }

    /**
     * Navigate to URL and wait for page load
     */
    async goto(url: string, options: PageLoadOptions = {}): Promise<void> {
        if (!this.page) {
            throw new Error('Browser not launched. Call launch() first.');
        }

        const { waitUntil = 'domcontentloaded', timeout = 60000, waitForSelector } = options;

        try {
            await this.page.goto(url, { waitUntil, timeout });
            // Small fixed wait for dynamic styles/overlays
            await this.page.waitForTimeout(2000);
        } catch (e) {
            console.warn(`Navigation to ${url} timed out/failed, attempting to proceed anyway...`);
        }

        if (waitForSelector) {
            try {
                await this.page.waitForSelector(waitForSelector, { timeout: 10000 });
            } catch (e) {
                console.warn(`Wait for selector ${waitForSelector} failed, proceeding...`);
            }
        }
    }

    /**
     * Execute JavaScript in page context
     */
    async evaluate<T>(fn: () => T): Promise<T> {
        if (!this.page) {
            throw new Error('Browser not launched. Call launch() first.');
        }

        return await this.page.evaluate(fn);
    }

    /**
     * Execute JavaScript with arguments in page context
     */
    async evaluateWithArgs<T, A>(fn: (arg: A) => T | Promise<T>, arg: A): Promise<T> {
        if (!this.page) {
            throw new Error('Browser not launched. Call launch() first.');
        }

        // @ts-ignore - Playwright evaluate types can be tricky with generics
        return await this.page.evaluate(fn, arg);
    }

    /**
     * Get computed styles for an element
     */
    async getComputedStyles(selector: string): Promise<Record<string, string> | null> {
        if (!this.page) {
            throw new Error('Browser not launched. Call launch() first.');
        }

        return await this.page.evaluate((sel) => {
            const element = document.querySelector(sel);
            if (!element) return null;

            const computed = window.getComputedStyle(element);
            const styles: Record<string, string> = {};

            // Get all computed style properties
            for (let i = 0; i < computed.length; i++) {
                const prop = computed[i];
                styles[prop] = computed.getPropertyValue(prop);
            }

            return styles;
        }, selector);
    }

    /**
     * Get all elements matching selector
     */
    async querySelectorAll(selector: string): Promise<any[]> {
        if (!this.page) {
            throw new Error('Browser not launched. Call launch() first.');
        }

        return await this.page.evaluate((sel) => {
            const elements = Array.from(document.querySelectorAll(sel));
            return elements.map((el) => ({
                tagName: el.tagName,
                className: el.className,
                id: el.id,
                textContent: el.textContent?.trim().substring(0, 100),
            }));
        }, selector);
    }

    /**
     * Extract all colors from page
     */
    async extractColors(): Promise<string[]> {
        if (!this.page) {
            throw new Error('Browser not launched. Call launch() first.');
        }

        return await this.page.evaluate(() => {
            const colors = new Set<string>();
            const elements = document.querySelectorAll('*');

            elements.forEach((el) => {
                const computed = window.getComputedStyle(el);

                // Color properties to check
                const colorProps = [
                    'color',
                    'backgroundColor',
                    'borderColor',
                    'borderTopColor',
                    'borderRightColor',
                    'borderBottomColor',
                    'borderLeftColor',
                    'outlineColor',
                ];

                colorProps.forEach((prop) => {
                    const value = computed.getPropertyValue(prop);
                    if (value && value !== 'rgba(0, 0, 0, 0)' && value !== 'transparent') {
                        colors.add(value);
                    }
                });

                // Check background images for gradients
                const bgImage = computed.backgroundImage;
                if (bgImage && bgImage !== 'none') {
                    const gradientColors = bgImage.match(/rgba?\([^)]+\)/g);
                    if (gradientColors) {
                        gradientColors.forEach((c) => colors.add(c));
                    }
                }
            });

            return Array.from(colors);
        });
    }

    /**
     * Extract all images from page
     */
    async extractImages(): Promise<Array<{ src: string; alt: string; width: number; height: number }>> {
        if (!this.page) {
            throw new Error('Browser not launched. Call launch() first.');
        }

        return await this.page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('img'));
            return images.map((img) => ({
                src: img.src,
                alt: img.alt || '',
                width: img.naturalWidth,
                height: img.naturalHeight,
            }));
        });
    }

    /**
     * Extract all SVGs from page
     */
    async extractSVGs(): Promise<Array<{ content: string; width: number; height: number }>> {
        if (!this.page) {
            throw new Error('Browser not launched. Call launch() first.');
        }

        return await this.page.evaluate(() => {
            const svgs = Array.from(document.querySelectorAll('svg'));
            return svgs.map((svg) => ({
                content: svg.outerHTML,
                width: svg.width.baseVal.value,
                height: svg.height.baseVal.value,
            }));
        });
    }

    /**
     * Extract font families used on page
     */
    async extractFontFamilies(): Promise<string[]> {
        if (!this.page) {
            throw new Error('Browser not launched. Call launch() first.');
        }

        return await this.page.evaluate(() => {
            const fonts = new Set<string>();
            const elements = document.querySelectorAll('*');

            elements.forEach((el) => {
                const computed = window.getComputedStyle(el);
                const fontFamily = computed.fontFamily;
                if (fontFamily) {
                    fonts.add(fontFamily);
                }
            });

            return Array.from(fonts);
        });
    }

    /**
     * Take screenshot of page
     */
    async screenshot(options: { path?: string; fullPage?: boolean } = {}): Promise<Buffer> {
        if (!this.page) {
            throw new Error('Browser not launched. Call launch() first.');
        }

        const { path, fullPage = false } = options;

        return await this.page.screenshot({ path, fullPage });
    }

    /**
     * Get page HTML
     */
    async getHTML(): Promise<string> {
        if (!this.page) {
            throw new Error('Browser not launched. Call launch() first.');
        }

        return await this.page.content();
    }

    /**
     * Wait for selector
     */
    async waitForSelector(selector: string, timeout = 30000): Promise<void> {
        if (!this.page) {
            throw new Error('Browser not launched. Call launch() first.');
        }

        await this.page.waitForSelector(selector, { timeout });
    }

    /**
     * Scroll to bottom of page (useful for lazy-loaded content)
     */
    async scrollToBottom(): Promise<void> {
        if (!this.page) {
            throw new Error('Browser not launched. Call launch() first.');
        }

        await this.page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }

    /**
     * Close browser
     */
    async close(): Promise<void> {
        if (this.page) {
            await this.page.close();
            this.page = null;
        }

        if (this.context) {
            await this.context.close();
            this.context = null;
        }

        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    /**
     * Get current page instance (for advanced usage)
     */
    getPage(): Page | null {
        return this.page;
    }
}

/**
 * Convenience function to run extraction with auto-cleanup
 */
export async function withBrowser<T>(
    url: string,
    fn: (browser: BrowserAutomation) => Promise<T>,
    options: BrowserOptions & PageLoadOptions = {}
): Promise<T> {
    const browser = new BrowserAutomation();

    try {
        await browser.launch(options);
        await browser.goto(url, options);
        return await fn(browser);
    } finally {
        await browser.close();
    }
}
