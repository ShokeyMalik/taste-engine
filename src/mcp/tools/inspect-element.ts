/**
 * Inspect Element MCP Tool
 *
 * Provides deep CSS inspection and style extraction for specific elements.
 */

import { inspectElement } from '../../inspiration/miromiro';
import type { ElementStyles } from '../../inspiration/miromiro-types';

// =============================================================================
// TYPES
// =============================================================================

export interface InspectElementInput {
    /** The URL of the website */
    url: string;
    /** CSS selector for the element to inspect */
    selector: string;
}

export interface InspectElementOutput {
    /** The extracted styles for the element */
    styles: ElementStyles;
    /** Metadata about extraction */
    metadata: {
        url: string;
        extractedAt: string;
    };
}

// =============================================================================
// TOOL DEFINITION
// =============================================================================

export const INSPECT_ELEMENT_TOOL = {
    name: 'inspect_element',
    description: `Provides deep style inspection for a specific UI element on a website.

This tool extracts:
- All computed CSS properties
- Hover state style changes
- Animation and transition metadata
- Responsive style changes across breakpoints

Useful for:
- Replicating a specific component (e.g., a "hero button" from Stripe)
- Understanding complex CSS transitions and transforms
- Debugging visual differences between your implementation and a reference`,
    inputSchema: {
        type: 'object' as const,
        properties: {
            url: {
                type: 'string',
                description: 'The URL of the website containing the element',
            },
            selector: {
                type: 'string',
                description: 'CSS selector for the target element (e.g., ".hero-button", "nav a:first-child")',
            },
        },
        required: ['url', 'selector'],
    },
};

// =============================================================================
// HANDLER
// =============================================================================

export async function handleInspectElement(
    input: InspectElementInput
): Promise<InspectElementOutput> {
    const styles = await inspectElement(input.url, input.selector);

    return {
        styles,
        metadata: styles.metadata,
    };
}
