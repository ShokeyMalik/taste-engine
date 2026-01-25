/**
 * Compose Page MCP Tool
 *
 * Composes multiple blocks into a cohesive page.
 */

import type { BlockType, AppliedTuners, BlockPlacement } from '../../blocks/types';
import type { InspirationProfile } from '../../inspiration/inspiration-profile';
import { PageComposer } from '../../generator/page-composer';
import { DEFAULT_TUNERS } from '../../blocks/types';

// =============================================================================
// TYPES
// =============================================================================

export interface ComposePageInput {
  /** Page name (used for component name) */
  name: string;
  /** Route path */
  route?: string;
  /** Blocks to include */
  blocks: Array<{
    block_type: BlockType;
    variant?: string;
    content?: Record<string, string>;
  }>;
  /** Page context */
  context?: 'marketing' | 'product';
  /** Inspiration sources */
  inspirations?: string[];
  /** Tuner values */
  tuners?: Partial<AppliedTuners>;
  /** Layout settings */
  layout?: {
    max_width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    spacing?: 'tight' | 'normal' | 'spacious';
    has_navigation?: boolean;
    has_footer?: boolean;
  };
}

export interface ComposePageOutput {
  /** Main page component code */
  page_code: string;
  /** Page file name */
  page_file_name: string;
  /** Individual block components */
  block_components: Array<{
    component_name: string;
    file_name: string;
    code: string;
    block_type: BlockType;
    variant: string;
  }>;
  /** Combined dependencies */
  dependencies: string[];
  /** Combined CSS variables */
  css_variables: Record<string, string>;
  /** Tailwind config extensions */
  tailwind_config: object;
  /** Explanation of composition choices */
  explanation: string;
  /** Suggested file structure */
  file_structure: string[];
}

// =============================================================================
// TOOL DEFINITION
// =============================================================================

export const COMPOSE_PAGE_TOOL = {
  name: 'compose_page',
  description: `Composes multiple UI blocks into a complete page component.

IMPORTANT: This tool generates pages with DEFAULT styling unless you specify inspirations.
To customize the visual style, you MUST provide:
- inspirations: Array of brand names (e.g., ["linear", "stripe"]) or URLs to inspire the design

Known inspiration brands: linear, stripe, vercel, notion, figma, apple, github, airbnb, raycast

Creates:
- Main page component that imports and arranges blocks
- Individual block components (separate files)
- Consistent spacing and layout
- Combined dependencies and CSS variables

Example usage:
- Landing page: navigation → hero → features → testimonials → pricing → cta → footer
- Dashboard: sidebar → header → metric-cards → data-table
- Auth page: auth block with login variant

The composition handles:
- Block ordering and spacing
- Shared design tokens
- Responsive layout wrapper
- Component imports and exports`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      name: {
        type: 'string',
        description: 'Page name (e.g., "LandingPage", "DashboardPage")',
      },
      route: {
        type: 'string',
        description: 'Route path (e.g., "/", "/dashboard")',
      },
      blocks: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            block_type: {
              type: 'string',
              description: 'Type of block',
            },
            variant: {
              type: 'string',
              description: 'Block variant',
            },
            content: {
              type: 'object',
              description: 'Custom content overrides',
            },
          },
          required: ['block_type'],
        },
        description: 'Blocks to include in order',
      },
      context: {
        type: 'string',
        enum: ['marketing', 'product'],
        description: 'Page context',
      },
      inspirations: {
        type: 'array',
        items: { type: 'string' },
        description: 'Inspiration sources',
      },
      tuners: {
        type: 'object',
        properties: {
          abstraction: { type: 'number', minimum: 0, maximum: 1 },
          density: { type: 'number', minimum: 0, maximum: 1 },
          motion: { type: 'number', minimum: 0, maximum: 1 },
          contrast: { type: 'number', minimum: 0, maximum: 1 },
          narrative: { type: 'number', minimum: 0, maximum: 1 },
        },
        description: 'Visual style tuners',
      },
      layout: {
        type: 'object',
        properties: {
          max_width: {
            type: 'string',
            enum: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
            description: 'Max width of content',
          },
          spacing: {
            type: 'string',
            enum: ['tight', 'normal', 'spacious'],
            description: 'Spacing between blocks',
          },
          has_navigation: {
            type: 'boolean',
            description: 'Whether page has navigation',
          },
          has_footer: {
            type: 'boolean',
            description: 'Whether page has footer',
          },
        },
        description: 'Layout configuration',
      },
    },
    required: ['name', 'blocks'],
  },
};

// =============================================================================
// HANDLER
// =============================================================================

export async function handleComposePage(
  input: ComposePageInput,
  inspirationProfile?: InspirationProfile
): Promise<ComposePageOutput> {
  // Build block placements with order
  // Note: variant must be resolved - if not provided, use empty string
  // and let the generator pick the default
  const blocks: BlockPlacement[] = input.blocks.map((block, index) => ({
    blockType: block.block_type,
    variant: block.variant || '',
    order: index,
    content: block.content,
  }));

  // Resolve inspiration profile from input.inspirations if provided
  let resolvedProfile = inspirationProfile;
  if (input.inspirations && input.inspirations.length > 0 && !resolvedProfile) {
    // Import and use apply inspiration to create profile from user's sources
    const { handleApplyInspiration } = await import('./apply-inspiration');
    const inspirationResult = await handleApplyInspiration({
      sources: input.inspirations,
      base_tuners: input.tuners,
    });
    resolvedProfile = inspirationResult.profile;
  }

  // Merge tuners with defaults
  const tuners: AppliedTuners = {
    ...DEFAULT_TUNERS,
    ...input.tuners,
  };

  // Create composer - only apply profile if user explicitly provided inspirations
  const composer = new PageComposer({
    defaultLibrary: 'shadcn',
    defaultProfile: resolvedProfile,
    defaultTuners: tuners,
  });

  // Compose page
  const result = await composer.compose({
    name: input.name,
    route: input.route || '/',
    context: input.context || 'marketing',
    blocks,
    tuners,
    layout: {
      maxWidth: input.layout?.max_width || 'xl',
      hasNavigation: input.layout?.has_navigation ?? true,
      hasFooter: input.layout?.has_footer ?? true,
      spacing: input.layout?.spacing || 'normal',
    },
  });

  // Build file structure suggestion
  const fileStructure = [
    `app/${input.route === '/' ? '' : input.route?.replace(/^\//, '') + '/'}page.tsx`,
    ...result.blockComponents.map(
      (block) => `components/${block.fileName}`
    ),
  ];

  return {
    page_code: result.pageCode,
    page_file_name: result.fileName,
    block_components: result.blockComponents.map((block) => ({
      component_name: block.componentName,
      file_name: block.fileName,
      code: block.code,
      block_type: block.blockType,
      variant: block.variant,
    })),
    dependencies: result.dependencies,
    css_variables: result.cssVariables,
    tailwind_config: result.tailwindConfig,
    explanation: result.explanation,
    file_structure: fileStructure,
  };
}
