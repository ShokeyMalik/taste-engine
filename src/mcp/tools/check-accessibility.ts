/**
 * Check Accessibility MCP Tool
 *
 * Performs automated accessibility checks and contrast analysis.
 */

import { checkAccessibility } from '../../inspiration/miromiro';
import type { AccessibilityReport } from '../../inspiration/miromiro-types';

// =============================================================================
// TYPES
// =============================================================================

export interface CheckAccessibilityInput {
    /** The URL of the website to check */
    url: string;
}

export interface CheckAccessibilityOutput {
    /** The accessibility report */
    report: AccessibilityReport;
    /** Metadata about analysis */
    metadata: {
        url: string;
        analyzedAt: string;
    };
}

// =============================================================================
// TOOL DEFINITION
// =============================================================================

export const CHECK_ACCESSIBILITY_TOOL = {
    name: 'check_accessibility',
    description: `Runs automated WCAG accessibility checks and contrast analysis on a website.

This tool evaluates:
- Color contrast ratios for text visibility
- Proper heading hierarchy
- Missing alternative text for images
- Form labeling and ARIA attributes
- Overall accessibility score (0-100)

Useful for:
- Auditing a reference design for inclusive practices
- Ensuring a generated UI meets basic accessibility standards`,
    inputSchema: {
        type: 'object' as const,
        properties: {
            url: {
                type: 'string',
                description: 'The URL of the website to analyze',
            },
        },
        required: ['url'],
    },
};

// =============================================================================
// HANDLER
// =============================================================================

export async function handleCheckAccessibility(
    input: CheckAccessibilityInput
): Promise<CheckAccessibilityOutput> {
    const report = await checkAccessibility(input.url);

    return {
        report,
        metadata: report.metadata,
    };
}
