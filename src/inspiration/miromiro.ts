export * from './miromiro-types';
export * from './browser-automation';
export * from './design-token-extractor';
export * from './asset-extractor';
export * from './style-inspector';
export * from './accessibility-analyzer';

import { BrowserAutomation, withBrowser } from './browser-automation';
import { extractDesignTokens, exportAsCSSVariables, exportAsTailwindConfig } from './design-token-extractor';
import { extractAssets, categorizeAssets } from './asset-extractor';
import { inspectElement } from './style-inspector';
import { checkAccessibility } from './accessibility-analyzer';
import { DesignReportGenerator } from './report-generator';
import { PDFService } from './pdf-service';
import { URLAnalyzer } from './url-analyzer';
import type { ExtractionOptions, ExtractionResult, ComponentPattern, MotionData } from './miromiro-types';

/**
 * Extract everything from a URL (tokens + assets)
 */
async function extractAll(url: string, options: ExtractionOptions = {}): Promise<ExtractionResult> {
    const startTime = Date.now();
    const {
        tokens = true,
        assets = true,
        styles = false,
        accessibility = false,
        selector = '',
        screenshot = false,
        timeout = 60000,
    } = options;

    try {
        const results: Partial<ExtractionResult> = {};

        // Extract tokens
        if (tokens) {
            results.tokens = await extractDesignTokens(url);
        }

        // Extract assets
        if (assets) {
            results.assets = await extractAssets(url);
        }

        // Extract element styles
        if (styles && selector) {
            results.styles = [await inspectElement(url, selector)];
        }

        // Check accessibility
        if (accessibility) {
            results.accessibility = await checkAccessibility(url);
        }

        // Unified browser session for Taste Engine features
        await withBrowser(url, async (browser) => {
            const html = await browser.getHTML();
            const analyzer = new URLAnalyzer();

            // Extract Motion & Global Keyframes
            results.motion = analyzer.extractMotion(html, '') as MotionData;
            results.globalMotion = await extractGlobalMotion(browser);

            // Extract basic patterns
            results.patterns = await extractComponentPatterns(browser);

            // Take screenshot if requested
            if (screenshot) {
                const screenshotBuffer = await browser.screenshot({ fullPage: true });
                results.screenshot = screenshotBuffer.toString('base64');
            }
        }, { timeout });

        const duration = Date.now() - startTime;

        return {
            ...results,
            metadata: {
                url,
                extractedAt: new Date().toISOString(),
                duration,
                success: true,
            },
        } as ExtractionResult;
    } catch (error) {
        const duration = Date.now() - startTime;
        return {
            metadata: {
                url,
                extractedAt: new Date().toISOString(),
                duration,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
        } as ExtractionResult;
    }
}

/**
 * Quick extraction - just tokens
 */
async function quickExtract(url: string) {
    return await extractDesignTokens(url);
}

/**
 * Export tokens in multiple formats
 */
function exportTokens(tokens: any, format: 'css' | 'tailwind' | 'json' | 'all' = 'all') {
    const exports: any = {};

    if (format === 'css' || format === 'all') {
        exports.css = exportAsCSSVariables(tokens);
    }

    if (format === 'tailwind' || format === 'all') {
        exports.tailwind = exportAsTailwindConfig(tokens);
    }

    if (format === 'json' || format === 'all') {
        exports.json = JSON.stringify(tokens, null, 2);
    }

    return format === 'all' ? exports : exports[format];
}

/**
 * Generate a complete, beautifully designed HTML profile for a URL
 */
async function generateUltimateHTML(url: string, selector?: string): Promise<string> {
    // 1. Perform full extraction
    const extraction = await extractAll(url, {
        tokens: true,
        assets: true,
        accessibility: true,
        screenshot: true,
        styles: !!selector,
        selector
    });

    if (!extraction.metadata.success) {
        throw new Error(`Extraction failed: ${extraction.metadata.error}`);
    }

    // 2. Generate HTML report
    const reportGenerator = new DesignReportGenerator();
    return reportGenerator.generateHTML(extraction);
}

/**
 * Generate a complete, beautifully designed PDF report for a URL
 */
async function generateBeautifulReport(url: string, outputPath: string): Promise<string> {
    const html = await generateUltimateHTML(url);

    // 3. Convert to PDF
    const pdfService = new PDFService();
    return await pdfService.generatePDF(html, outputPath);
}

/**
 * Helper to extract component patterns using browser diagnostics
 */
async function extractComponentPatterns(browser: BrowserAutomation): Promise<ComponentPattern[]> {
    return await browser.evaluate(() => {
        const patterns: ComponentPattern[] = [];

        // Buttons
        const buttons = document.querySelectorAll('button, .btn, [role="button"]');
        if (buttons.length > 0) {
            patterns.push({
                name: 'Action Buttons',
                type: 'button',
                count: buttons.length,
                variants: ['primary', 'hover-state', 'active-state']
            });
        }

        // Cards
        const cards = document.querySelectorAll('[class*="card"], [class*="Card"], article');
        if (cards.length > 0) {
            patterns.push({
                name: 'Content Cards',
                type: 'card',
                count: cards.length,
                variants: ['elevated', 'bordered']
            });
        }

        // Inputs
        const inputs = document.querySelectorAll('input, select, textarea');
        if (inputs.length > 0) {
            patterns.push({
                name: 'Form Controls',
                type: 'input',
                count: inputs.length,
                variants: ['text-entry', 'validation-ready']
            });
        }

        // Navigation
        const navs = document.querySelectorAll('nav, [role="navigation"]');
        if (navs.length > 0) {
            patterns.push({
                name: 'Navigation Shell',
                type: 'layout',
                count: navs.length
            });
        }

        return patterns;
    });
}

/**
 * Extract all @keyframes from the document
 */
async function extractGlobalMotion(browser: BrowserAutomation): Promise<{ name: string; css: string }[]> {
    return await browser.evaluate(() => {
        const keyframes: { name: string; css: string }[] = [];
        try {
            for (const sheet of Array.from(document.styleSheets)) {
                try {
                    for (const rule of Array.from(sheet.cssRules)) {
                        if (rule.constructor.name === 'CSSKeyframesRule') {
                            const kRule = rule as CSSKeyframesRule;
                            keyframes.push({
                                name: kRule.name,
                                css: kRule.cssText
                            });
                        }
                    }
                } catch (e) { } // Cross-origin
            }
        } catch (e) { }
        return keyframes;
    });
}

// Re-export key functions
export {
    BrowserAutomation,
    withBrowser,
    extractAll,
    quickExtract,
    extractDesignTokens,
    extractAssets,
    categorizeAssets,
    inspectElement,
    checkAccessibility,
    generateUltimateHTML,
    generateBeautifulReport,
    exportTokens,
    exportAsCSSVariables,
    exportAsTailwindConfig,
};
