/**
 * Stats Block Variants
 *
 * Display key metrics and statistics to demonstrate scale and impact.
 * Commonly shows customer counts, revenue, uptime, etc.
 */

import { BlockDefinition, StatsVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const simpleVariant: BlockVariant<StatsVariant> = {
  id: 'simple',
  name: 'Simple Stats',
  description:
    'Clean row of large numbers with labels. Minimal and impactful.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: [],
  radiusPreference: 'default',
  tags: ['simple', 'minimal', 'numbers', 'clean'],
};

const withDescriptionVariant: BlockVariant<StatsVariant> = {
  id: 'with-description',
  name: 'Stats with Descriptions',
  description:
    'Stats with additional description text under each number. Provides context.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Card'],
  radiusPreference: 'rounded',
  tags: ['description', 'context', 'detailed', 'cards'],
};

const withIconsVariant: BlockVariant<StatsVariant> = {
  id: 'with-icons',
  name: 'Stats with Icons',
  description:
    'Each stat has an accompanying icon. Visual and scannable.',
  complexity: 'simple',
  requiredDependencies: ['lucide-react'],
  optionalDependencies: [],
  shadcnComponents: [],
  radiusPreference: 'rounded',
  tags: ['icons', 'visual', 'boxed', 'modern'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const statsBlock: BlockDefinition<StatsVariant> = {
  type: 'stats',
  category: 'landing',
  name: 'Stats Section',
  description:
    'Display key metrics and statistics to demonstrate scale, impact, and credibility.',

  variants: [simpleVariant, withDescriptionVariant, withIconsVariant],

  defaultVariant: 'simple',

  props: [
    {
      name: 'heading',
      type: 'string',
      required: false,
      description: 'Optional section heading',
    },
    {
      name: 'stats',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description:
        'Array of stat objects with value, label, description, and optional icon',
    },
    {
      name: 'animated',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Animate numbers counting up when visible',
    },
    {
      name: 'suffix',
      type: 'string',
      required: false,
      description: 'Global suffix for all stats (e.g., "+")',
    },
    {
      name: 'hasBackground',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Use accent background',
    },
  ],

  slots: [],

  contextHints: {
    industry: ['saas', 'startup', 'enterprise', 'fintech'],
    pageType: ['marketing'],
    tunerHints: {
      contrast: { min: 0.5, max: 0.8 },
    },
  },

  baseShadcnComponents: [],
  baseDependencies: [],
  keywords: ['stats', 'metrics', 'numbers', 'kpi', 'impact', 'scale', 'growth'],
};

export default statsBlock;
