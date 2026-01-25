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
import type { ExtractionOptions, ExtractionResult } from './miromiro-types';

/**
 * Extract everything from a URL (tokens + assets)
 */
export async function extractAll(url: string, options: ExtractionOptions = {}): Promise<ExtractionResult> {
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

        // Take screenshot if requested
        if (screenshot) {
            await withBrowser(url, async (browser) => {
                const screenshotBuffer = await browser.screenshot({ fullPage: true });
                results.screenshot = screenshotBuffer.toString('base64');
            }, { timeout });
        }

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
        };
    }
}

/**
 * Quick extraction - just tokens
 */
export async function quickExtract(url: string) {
    return await extractDesignTokens(url);
}

/**
 * Export tokens in multiple formats
 */
export function exportTokens(tokens: any, format: 'css' | 'tailwind' | 'json' | 'all' = 'all') {
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
 * Generate a complete, beautifully designed PDF report for a URL
 */
export async function generateBeautifulReport(url: string, outputPath: string): Promise<string> {
    // 1. Perform full extraction
    const extraction = await extractAll(url, {
        tokens: true,
        assets: true,
        accessibility: true,
        screenshot: true
    });

    if (!extraction.metadata.success) {
        throw new Error(`Extraction failed: ${extraction.metadata.error}`);
    }

    // 2. Generate HTML report
    const reportGenerator = new DesignReportGenerator();
    const html = reportGenerator.generateHTML(extraction);

    // 3. Convert to PDF
    const pdfService = new PDFService();
    return await pdfService.generatePDF(html, outputPath);
}

// Re-export key functions
export {
    BrowserAutomation,
    withBrowser,
    extractDesignTokens,
    extractAssets,
    categorizeAssets,
    inspectElement,
    checkAccessibility,
    exportAsCSSVariables,
    exportAsTailwindConfig,
};
