/**
 * Extract Design Tokens MCP Tool
 *
 * Extracts design tokens (colors, typography, spacing, etc.) from any website URL.
 */

import { extractDesignTokens, exportTokens } from '../../inspiration/miromiro';
import type { MiromiroDesignTokens } from '../../inspiration/miromiro-types';

// =============================================================================
// TYPES
// =============================================================================

export interface ExtractDesignTokensInput {
    /** The URL of the website to extract tokens from */
    url: string;
    /** Export format for tokens */
    format?: 'css' | 'tailwind' | 'json' | 'all';
}

export interface ExtractDesignTokensOutput {
    /** The raw design tokens extracted */
    tokens: MiromiroDesignTokens;
    /** Exported formats */
    exports: {
        css?: string;
        tailwind?: object;
        json?: string;
    };
    /** Metadata about extraction */
    metadata: {
        url: string;
        extractedAt: string;
        elementsAnalyzed: number;
    };
}

// =============================================================================
// TOOL DEFINITION
// =============================================================================

export const EXTRACT_DESIGN_TOKENS_TOOL = {
    name: 'extract_design_tokens',
    description: `Extracts design system tokens (colors, typography, spacing, shadows, borders) from any website URL.

This tool uses a headless browser to deeply analyze the website's CSS and computed styles
to reconstruct its design system.

Useful for:
- Learning the design language of a reference brand
- Extracting color palettes and typography scales
- Replicating styles in a new project`,
    inputSchema: {
        type: 'object' as const,
        properties: {
            url: {
                type: 'string',
                description: 'The URL of the website to analyze (e.g., "https://stripe.com")',
            },
            format: {
                type: 'string',
                enum: ['css', 'tailwind', 'json', 'all'],
                description: 'The desired export format for the design tokens',
                default: 'all',
            },
        },
        required: ['url'],
    },
};

// =============================================================================
// HANDLER
// =============================================================================

export async function handleExtractDesignTokens(
    input: ExtractDesignTokensInput
): Promise<ExtractDesignTokensOutput> {
    const tokens = await extractDesignTokens(input.url);
    const exports = exportTokens(tokens, input.format || 'all');

    return {
        tokens,
        exports: input.format === 'all' ? exports : { [input.format || 'all']: exports },
        metadata: tokens.metadata,
    };
}
