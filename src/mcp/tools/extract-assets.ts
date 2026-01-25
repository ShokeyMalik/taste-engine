/**
 * Extract Assets MCP Tool
 *
 * Extracts visual assets (images, SVGs, videos, Lottie) from any website URL.
 */

import { extractAssets, categorizeAssets } from '../../inspiration/miromiro';
import type { ExtractedAssets } from '../../inspiration/miromiro-types';

// =============================================================================
// TYPES
// =============================================================================

export interface ExtractAssetsInput {
    /** The URL of the website to extract assets from */
    url: string;
}

export interface ExtractAssetsOutput {
    /** All extracted assets */
    assets: ExtractedAssets;
    /** Assets grouped by category */
    categorized: Record<string, any[]>;
    /** Metadata about extraction */
    metadata: {
        url: string;
        extractedAt: string;
        totalAssets: number;
    };
}

// =============================================================================
// TOOL DEFINITION
// =============================================================================

export const EXTRACT_ASSETS_TOOL = {
    name: 'extract_assets',
    description: `Extracts visual assets (images, SVG vectors, background videos, Lottie animations) from any website URL.

This tool scans the DOM and network requests of a page to identify and isolate high-quality visual assets.

Useful for:
- Downloading logos and icons from a reference site
- Finding high-quality hero photography
- Extracting animations and illustrations`,
    inputSchema: {
        type: 'object' as const,
        properties: {
            url: {
                type: 'string',
                description: 'The URL of the website to analyze (e.g., "https://airbnb.com")',
            },
        },
        required: ['url'],
    },
};

// =============================================================================
// HANDLER
// =============================================================================

export async function handleExtractAssets(
    input: ExtractAssetsInput
): Promise<ExtractAssetsOutput> {
    const assets = await extractAssets(input.url);
    const categorized = categorizeAssets(assets);

    return {
        assets,
        categorized,
        metadata: assets.metadata,
    };
}
