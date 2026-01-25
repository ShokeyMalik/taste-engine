export * from './miromiro-types';
export * from './browser-automation';
export * from './design-token-extractor';
export * from './asset-extractor';

import { BrowserAutomation, withBrowser } from './browser-automation';
import { extractDesignTokens, exportAsCSSVariables, exportAsTailwindConfig } from './design-token-extractor';
import { extractAssets, categorizeAssets } from './asset-extractor';
import type { ExtractionOptions, ExtractionResult } from './miromiro-types';

/**
 * Extract everything from a URL (tokens + assets)
 */
export async function extractAll(url: string, options: ExtractionOptions = {}): Promise<ExtractionResult> {
    const startTime = Date.now();
    const {
        tokens = true,
        assets = true,
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

// Re-export key functions
export {
    BrowserAutomation,
    withBrowser,
    extractDesignTokens,
    extractAssets,
    categorizeAssets,
    exportAsCSSVariables,
    exportAsTailwindConfig,
};
