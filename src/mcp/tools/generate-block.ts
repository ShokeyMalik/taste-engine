/**
 * Generate Block MCP Tool
 *
 * Generates a single UI block with specified type and variant.
 */

import type { BlockType, AppliedTuners, ComponentLibrary } from '../../blocks/types';
import type { InspirationProfile } from '../../inspiration/inspiration-profile';
import { BlockGenerator } from '../../generator/block-generator';
import { getBlockRegistry } from '../../blocks/registry';
import { DEFAULT_TUNERS } from '../../blocks/types';

// =============================================================================
// TYPES
// =============================================================================

export interface GenerateBlockInput {
  /** Block type to generate */
  block_type: BlockType;
  /** Variant to use (optional, uses default if not specified) */
  variant?: string;
  /** Context: marketing (landing pages) or product (dashboards) */
  context?: 'marketing' | 'product';
  /** Inspiration sources (URLs or brand names) */
  inspirations?: string[];
  /** Tuner values (0-1 scale) */
  tuners?: Partial<AppliedTuners>;
  /** Component library to use */
  component_library?: ComponentLibrary;
  /** Custom content overrides */
  content?: Record<string, string>;
}

export interface GenerateBlockOutput {
  /** Generated component code */
  code: string;
  /** Component name */
  component_name: string;
  /** File name */
  file_name: string;
  /** NPM dependencies required */
  dependencies: string[];
  /** CSS variables to add */
  css_variables?: Record<string, string>;
  /** Tailwind config extensions */
  tailwind_config?: object;
  /** Explanation of design choices */
  explanation: string;
  /** Block type used */
  block_type: BlockType;
  /** Variant used */
  variant: string;
}

// =============================================================================
// TOOL DEFINITION
// =============================================================================

export const GENERATE_BLOCK_TOOL = {
  name: 'generate_block',
  description: `Generates a complete React/TSX component for a specific UI block.

IMPORTANT: This tool generates blocks with DEFAULT styling unless you specify inspirations.
To customize the visual style, you MUST provide:
- inspirations: Array of brand names (e.g., ["linear", "stripe"]) or URLs to inspire the design

Available block types:
- Landing: hero, navigation, features, pricing, testimonials, faq, cta, footer, logo-cloud, stats
- Dashboard: sidebar, header, data-table, metric-cards, chart-section, activity-feed, settings-panel, command-palette
- Shared: auth, empty-state, error-page, loading

Each block has multiple variants. Use suggest_blocks to see available variants.

Known inspiration brands: linear, stripe, vercel, notion, figma, apple, github, airbnb, raycast

The generated code:
- Uses Tailwind CSS classes
- Integrates with shadcn/ui components when available
- Respects tuner settings for visual style
- Includes responsive design
- Is production-ready

Tuners (all 0-1):
- abstraction: Low = concrete/solid, High = minimal/geometric
- density: Low = spacious, High = compact
- motion: Low = static, High = animated
- contrast: Low = subtle, High = bold
- narrative: Low = functional, High = storytelling`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      block_type: {
        type: 'string',
        enum: [
          'hero', 'navigation', 'features', 'pricing', 'testimonials',
          'faq', 'cta', 'footer', 'logo-cloud', 'stats',
          'sidebar', 'header', 'data-table', 'metric-cards', 'chart-section',
          'activity-feed', 'settings-panel', 'command-palette',
          'auth', 'empty-state', 'error-page', 'loading',
        ],
        description: 'Type of UI block to generate',
      },
      variant: {
        type: 'string',
        description: 'Variant of the block (e.g., "centered", "gradient-orbs" for hero)',
      },
      context: {
        type: 'string',
        enum: ['marketing', 'product'],
        description: 'Page context: marketing (landing) or product (dashboard)',
      },
      inspirations: {
        type: 'array',
        items: { type: 'string' },
        description: 'Inspiration sources (URLs or brand names like "linear", "stripe")',
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
        description: 'Visual style tuners (0-1 scale)',
      },
      component_library: {
        type: 'string',
        enum: ['shadcn', 'radix', 'none'],
        description: 'Component library to use',
      },
      content: {
        type: 'object',
        description: 'Custom content overrides (headlines, descriptions, etc.)',
      },
    },
    required: ['block_type'],
  },
};

// =============================================================================
// HANDLER
// =============================================================================

export async function handleGenerateBlock(
  input: GenerateBlockInput,
  inspirationProfile?: InspirationProfile
): Promise<GenerateBlockOutput> {
  const registry = getBlockRegistry();
  const blockDef = registry.get(input.block_type);

  if (!blockDef) {
    throw new Error(`Unknown block type: ${input.block_type}`);
  }

  // Validate variant
  const variant = input.variant || blockDef.defaultVariant;
  const validVariant = blockDef.variants.find((v) => v.id === variant);
  if (!validVariant) {
    const available = blockDef.variants.map((v) => v.id).join(', ');
    throw new Error(
      `Invalid variant "${variant}" for ${input.block_type}. Available: ${available}`
    );
  }

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

  // Merge tuners with defaults (and inspiration-derived tuners if available)
  const tuners: AppliedTuners = {
    ...DEFAULT_TUNERS,
    ...input.tuners,
  };

  // Create generator - only apply profile if user explicitly provided inspirations
  const generator = new BlockGenerator({
    defaultLibrary: input.component_library || 'shadcn',
    defaultProfile: resolvedProfile,
    defaultTuners: tuners,
  });

  // Generate block
  const result = await generator.generate({
    blockType: input.block_type,
    variant,
    context: input.context || 'marketing',
    tuners,
    componentLibrary: input.component_library || 'shadcn',
    content: input.content,
  });

  return {
    code: result.code,
    component_name: result.componentName,
    file_name: result.fileName,
    dependencies: result.dependencies,
    css_variables: result.cssVariables,
    tailwind_config: result.tailwindConfig,
    explanation: result.explanation,
    block_type: input.block_type,
    variant: result.variantUsed,
  };
}
