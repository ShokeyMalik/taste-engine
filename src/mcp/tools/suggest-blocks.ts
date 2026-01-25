/**
 * Suggest Blocks MCP Tool
 *
 * Suggests appropriate blocks for a given use case.
 */

import type { BlockType, BlockPlacement, BlockCategory } from '../../blocks/types';
import { getBlockRegistry } from '../../blocks/registry';
import { suggestPageStructure } from '../../generator/page-composer';

// =============================================================================
// TYPES
// =============================================================================

export interface SuggestBlocksInput {
  /** Use case for the page */
  use_case: 'landing' | 'pricing' | 'dashboard' | 'auth' | 'docs' | 'blog' | 'profile' | 'settings';
  /** Page context */
  context?: 'marketing' | 'product';
  /** Industry (optional, for more tailored suggestions) */
  industry?: string;
  /** Specific blocks to include (optional) */
  must_include?: BlockType[];
  /** Specific blocks to exclude (optional) */
  must_exclude?: BlockType[];
}

export interface BlockSuggestion {
  /** Block type */
  block_type: BlockType;
  /** Suggested variant */
  variant: string;
  /** Why this block is suggested */
  reason: string;
  /** Available variants for this block */
  available_variants: string[];
  /** Order in page */
  order: number;
  /** Is this block optional? */
  optional: boolean;
}

export interface SuggestBlocksOutput {
  /** Suggested blocks in order */
  suggestions: BlockSuggestion[];
  /** Complete page structure */
  page_structure: BlockPlacement[];
  /** Explanation of the suggested structure */
  explanation: string;
  /** Alternative structures */
  alternatives?: Array<{
    name: string;
    description: string;
    blocks: BlockPlacement[];
  }>;
}

// =============================================================================
// TOOL DEFINITION
// =============================================================================

export const SUGGEST_BLOCKS_TOOL = {
  name: 'suggest_blocks',
  description: `Suggests appropriate UI blocks for a specific use case.

Use cases:
- landing: Marketing landing page (hero, features, testimonials, pricing, etc.)
- pricing: Dedicated pricing page
- dashboard: Product dashboard (sidebar, metrics, tables, charts)
- auth: Authentication pages (login, signup, forgot password)
- docs: Documentation pages
- blog: Blog layouts
- profile: User profile pages
- settings: Settings and preferences pages

Returns:
- Ordered list of suggested blocks with variants
- Explanation of why each block is recommended
- Alternative structures for different approaches`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      use_case: {
        type: 'string',
        enum: ['landing', 'pricing', 'dashboard', 'auth', 'docs', 'blog', 'profile', 'settings'],
        description: 'Use case for the page',
      },
      context: {
        type: 'string',
        enum: ['marketing', 'product'],
        description: 'Page context',
      },
      industry: {
        type: 'string',
        description: 'Industry for tailored suggestions (e.g., "saas", "fintech", "healthcare")',
      },
      must_include: {
        type: 'array',
        items: { type: 'string' },
        description: 'Blocks that must be included',
      },
      must_exclude: {
        type: 'array',
        items: { type: 'string' },
        description: 'Blocks to exclude',
      },
    },
    required: ['use_case'],
  },
};

// =============================================================================
// HANDLER
// =============================================================================

export async function handleSuggestBlocks(
  input: SuggestBlocksInput
): Promise<SuggestBlocksOutput> {
  const registry = getBlockRegistry();
  const context = input.context || (input.use_case === 'dashboard' ? 'product' : 'marketing');

  // Get base suggestions from page composer
  let baseSuggestions: BlockPlacement[] = [];

  switch (input.use_case) {
    case 'landing':
    case 'pricing':
    case 'dashboard':
    case 'auth':
    case 'docs':
      baseSuggestions = suggestPageStructure(input.use_case, context);
      break;
    case 'blog':
      baseSuggestions = getBlogStructure();
      break;
    case 'profile':
      baseSuggestions = getProfileStructure();
      break;
    case 'settings':
      baseSuggestions = getSettingsStructure();
      break;
  }

  // Apply must_include
  if (input.must_include) {
    for (const blockType of input.must_include) {
      if (!baseSuggestions.some((b) => b.blockType === blockType)) {
        baseSuggestions.push({
          blockType: blockType,
          variant: getDefaultVariant(blockType),
          order: baseSuggestions.length,
        });
      }
    }
  }

  // Apply must_exclude
  if (input.must_exclude) {
    baseSuggestions = baseSuggestions.filter(
      (b) => !input.must_exclude!.includes(b.blockType)
    );
  }

  // Re-order
  baseSuggestions = baseSuggestions.map((b, i) => ({ ...b, order: i }));

  // Build detailed suggestions
  const suggestions: BlockSuggestion[] = baseSuggestions.map((placement) => {
    const blockDef = registry.get(placement.blockType);
    const variants = blockDef?.variants.map((v) => v.id) || [];

    return {
      block_type: placement.blockType,
      variant: placement.variant || getDefaultVariant(placement.blockType),
      reason: getBlockReason(placement.blockType, input.use_case, input.industry),
      available_variants: variants,
      order: placement.order,
      optional: isOptionalBlock(placement.blockType, input.use_case),
    };
  });

  // Get alternatives
  const alternatives = getAlternativeStructures(input.use_case, context);

  // Build explanation
  const explanation = buildExplanation(input.use_case, suggestions, input.industry);

  return {
    suggestions,
    page_structure: baseSuggestions,
    explanation,
    alternatives,
  };
}

// =============================================================================
// HELPERS
// =============================================================================

function getDefaultVariant(blockType: BlockType): string {
  const defaults: Record<BlockType, string> = {
    hero: 'centered',
    navigation: 'sticky',
    features: 'grid',
    pricing: 'toggle-annual',
    testimonials: 'carousel',
    faq: 'simple',
    cta: 'simple',
    footer: 'multi-column',
    'logo-cloud': 'simple',
    stats: 'with-description',
    sidebar: 'collapsible',
    header: 'with-search',
    'data-table': 'with-pagination',
    'metric-cards': 'with-trend',
    'chart-section': 'overview',
    'activity-feed': 'with-grouping',
    'settings-panel': 'tabbed',
    'command-palette': 'spotlight',
    auth: 'login',
    'empty-state': 'with-action',
    'error-page': '404',
    loading: 'skeleton',
  };

  return defaults[blockType] || 'default';
}

function getBlockReason(blockType: BlockType, useCase: string, industry?: string): string {
  const reasons: Record<BlockType, string> = {
    hero: 'Creates strong first impression and communicates value proposition',
    navigation: 'Provides consistent navigation across the site',
    features: 'Showcases key features and benefits',
    pricing: 'Displays pricing options clearly for conversion',
    testimonials: 'Builds trust through social proof',
    faq: 'Addresses common questions and reduces support load',
    cta: 'Drives conversion with clear call-to-action',
    footer: 'Provides navigation and legal/contact links',
    'logo-cloud': 'Shows credibility through known brands/clients',
    stats: 'Displays impressive metrics and social proof',
    sidebar: 'Provides navigation in product/dashboard context',
    header: 'Shows user info, search, and quick actions',
    'data-table': 'Displays structured data with sorting/filtering',
    'metric-cards': 'Shows key metrics at a glance',
    'chart-section': 'Visualizes trends and data over time',
    'activity-feed': 'Shows recent activity and updates',
    'settings-panel': 'Organizes user preferences and settings',
    'command-palette': 'Provides keyboard-first navigation and search',
    auth: 'Handles user authentication flow',
    'empty-state': 'Guides users when no data is available',
    'error-page': 'Provides helpful error recovery',
    loading: 'Shows loading state while data loads',
  };

  let reason = reasons[blockType] || 'Useful component for this page';

  // Add industry-specific context
  if (industry) {
    switch (blockType) {
      case 'pricing':
        if (industry === 'saas') reason += '. Consider subscription-based pricing.';
        if (industry === 'enterprise') reason += '. May need contact-us option.';
        break;
      case 'testimonials':
        if (industry === 'fintech') reason += '. Emphasize security and trust.';
        if (industry === 'healthcare') reason += '. Include compliance badges.';
        break;
    }
  }

  return reason;
}

function isOptionalBlock(blockType: BlockType, useCase: string): boolean {
  const requiredByUseCase: Record<string, BlockType[]> = {
    landing: ['hero', 'navigation', 'footer'],
    pricing: ['pricing', 'navigation', 'footer'],
    dashboard: ['sidebar', 'header'],
    auth: ['auth'],
    docs: ['navigation', 'sidebar'],
    blog: ['navigation', 'footer'],
    profile: ['header', 'sidebar'],
    settings: ['sidebar', 'settings-panel'],
  };

  const required = requiredByUseCase[useCase] || [];
  return !required.includes(blockType);
}

function getBlogStructure(): BlockPlacement[] {
  return [
    { blockType: 'navigation', variant: 'sticky', order: 0 },
    { blockType: 'hero', variant: 'minimal', order: 1 },
    { blockType: 'footer', variant: 'multi-column', order: 2 },
  ];
}

function getProfileStructure(): BlockPlacement[] {
  return [
    { blockType: 'sidebar', variant: 'with-sections', order: 0 },
    { blockType: 'header', variant: 'with-search', order: 1 },
    { blockType: 'settings-panel', variant: 'tabbed', order: 2 },
  ];
}

function getSettingsStructure(): BlockPlacement[] {
  return [
    { blockType: 'sidebar', variant: 'collapsible', order: 0 },
    { blockType: 'header', variant: 'simple', order: 1 },
    { blockType: 'settings-panel', variant: 'tabbed', order: 2 },
  ];
}

function getAlternativeStructures(
  useCase: string,
  context: 'marketing' | 'product'
): Array<{ name: string; description: string; blocks: BlockPlacement[] }> {
  switch (useCase) {
    case 'landing':
      return [
        {
          name: 'Minimal Landing',
          description: 'Simple landing with just hero and CTA',
          blocks: [
            { blockType: 'navigation', variant: 'minimal', order: 0 },
            { blockType: 'hero', variant: 'centered', order: 1 },
            { blockType: 'cta', variant: 'simple', order: 2 },
            { blockType: 'footer', variant: 'simple', order: 3 },
          ],
        },
        {
          name: 'Social Proof Heavy',
          description: 'Emphasizes trust and credibility',
          blocks: [
            { blockType: 'navigation', variant: 'sticky', order: 0 },
            { blockType: 'hero', variant: 'centered', order: 1 },
            { blockType: 'logo-cloud', variant: 'marquee', order: 2 },
            { blockType: 'testimonials', variant: 'grid', order: 3 },
            { blockType: 'stats', variant: 'with-description', order: 4 },
            { blockType: 'cta', variant: 'simple', order: 5 },
            { blockType: 'footer', variant: 'multi-column', order: 6 },
          ],
        },
      ];

    case 'dashboard':
      return [
        {
          name: 'Minimal Dashboard',
          description: 'Clean dashboard with essential components',
          blocks: [
            { blockType: 'sidebar', variant: 'mini', order: 0 },
            { blockType: 'header', variant: 'simple', order: 1 },
            { blockType: 'metric-cards', variant: 'simple', order: 2 },
          ],
        },
        {
          name: 'Data-Heavy Dashboard',
          description: 'Focus on data visualization',
          blocks: [
            { blockType: 'sidebar', variant: 'collapsible', order: 0 },
            { blockType: 'header', variant: 'with-search', order: 1 },
            { blockType: 'metric-cards', variant: 'with-trend', order: 2 },
            { blockType: 'chart-section', variant: 'multi-chart', order: 3 },
            { blockType: 'data-table', variant: 'with-pagination', order: 4 },
          ],
        },
      ];

    default:
      return [];
  }
}

function buildExplanation(
  useCase: string,
  suggestions: BlockSuggestion[],
  industry?: string
): string {
  const blockCount = suggestions.length;
  const requiredCount = suggestions.filter((s) => !s.optional).length;
  const optionalCount = blockCount - requiredCount;

  let explanation = `Suggested ${blockCount} blocks for ${useCase} page`;
  explanation += ` (${requiredCount} required, ${optionalCount} optional).`;

  if (industry) {
    explanation += ` Tailored for ${industry} industry.`;
  }

  const blockList = suggestions
    .map((s) => `${s.order + 1}. ${s.block_type} (${s.variant})${s.optional ? ' [optional]' : ''}`)
    .join('\n');

  explanation += `\n\nBlock order:\n${blockList}`;

  return explanation;
}
