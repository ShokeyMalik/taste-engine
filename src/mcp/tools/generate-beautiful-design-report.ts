/**
 * Generate Beautiful Design Report MCP Tool
 *
 * Generates a complete, professionally designed PDF design profile for any website URL.
 */

import { generateBeautifulReport } from '../../inspiration/miromiro';

// =============================================================================
// TYPES
// =============================================================================

export interface GenerateBeautifulDesignReportInput {
    /** The URL of the website to analyze */
    url: string;
    /** The path where the generated PDF will be saved */
    output_path: string;
}

export interface GenerateBeautifulDesignReportOutput {
    /** Path to the generated PDF file */
    pdf_path: string;
    /** Success message */
    message: string;
    /** Metadata about the extraction */
    metadata: {
        url: string;
        extractedAt: string;
    };
}

// =============================================================================
// TOOL DEFINITION
// =============================================================================

export const GENERATE_BEAUTIFUL_DESIGN_REPORT_TOOL = {
    name: 'generate_beautiful_design_report',
    description: `Generates a complete, professionally designed PDF design profile for any website URL.

This tool:
1. Deeply extracts design tokens (colors, typography, spacing)
2. Isolates visual assets (logos, images, SVGs)
3. Performs an accessibility audit
4. Generates a beautifully formatted HTML report
5. Converts the report into a high-quality A4 PDF

Useful for:
- Creating professional design reference documents
- Presenting design audits to stakeholders
- Building a visual library of design inspirations`,
    inputSchema: {
        type: 'object' as const,
        properties: {
            url: {
                type: 'string',
                description: 'The URL of the website to analyze (e.g., "https://stripe.com")',
            },
            output_path: {
                type: 'string',
                description: 'The absolute path where the PDF report should be saved (e.g., "/Users/shokeymalik/Desktop/stripe-profile.pdf")',
            },
        },
        required: ['url', 'output_path'],
    },
};

// =============================================================================
// HANDLER
// =============================================================================

export async function handleGenerateBeautifulDesignReport(
    input: GenerateBeautifulDesignReportInput
): Promise<GenerateBeautifulDesignReportOutput> {
    const absolutePath = await generateBeautifulReport(input.url, input.output_path);

    return {
        pdf_path: absolutePath,
        message: `Beautiful design report generated successfully at ${absolutePath}`,
        metadata: {
            url: input.url,
            extractedAt: new Date().toISOString(),
        },
    };
}
