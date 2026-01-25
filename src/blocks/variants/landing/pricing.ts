/**
 * Pricing Block Variants
 *
 * Pricing sections display pricing tiers and plans.
 * Critical for conversion on SaaS and subscription products.
 */

import { BlockDefinition, PricingVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const simpleVariant: BlockVariant<PricingVariant> = {
  id: 'simple',
  name: 'Simple Pricing',
  description:
    'Clean pricing cards in a row. Each card shows plan name, price, features, and CTA.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: ['Button', 'Card', 'CardHeader', 'CardContent', 'CardFooter'],
  radiusPreference: 'rounded',
  tags: ['simple', 'cards', 'clean', 'basic'],
};

const comparisonVariant: BlockVariant<PricingVariant> = {
  id: 'comparison',
  name: 'Comparison Pricing',
  description:
    'Feature comparison table with plans as columns. Best for complex products with many features.',
  complexity: 'complex',
  requiredDependencies: ['lucide-react'],
  optionalDependencies: [],
  shadcnComponents: [
    'Button',
    'Table',
    'TableHeader',
    'TableBody',
    'TableRow',
    'TableHead',
    'TableCell',
  ],
  radiusPreference: 'default',
  tags: ['comparison', 'table', 'detailed', 'enterprise'],
};

const toggleAnnualVariant: BlockVariant<PricingVariant> = {
  id: 'toggle-annual',
  name: 'Toggle Annual/Monthly',
  description:
    'Pricing with toggle switch between monthly and annual billing. Shows savings for annual.',
  complexity: 'moderate',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [
    'Button',
    'Card',
    'CardHeader',
    'CardContent',
    'CardFooter',
    'Switch',
    'Badge',
  ],
  radiusPreference: 'rounded',
  tags: ['toggle', 'annual', 'monthly', 'switch', 'discount'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const pricingBlock: BlockDefinition<PricingVariant> = {
  type: 'pricing',
  category: 'landing',
  name: 'Pricing Section',
  description:
    'Display pricing tiers, plans, and feature comparisons to drive conversions.',

  variants: [simpleVariant, comparisonVariant, toggleAnnualVariant],

  defaultVariant: 'simple',

  props: [
    {
      name: 'heading',
      type: 'string',
      required: false,
      default: 'Pricing',
      description: 'Section heading',
    },
    {
      name: 'subheading',
      type: 'string',
      required: false,
      description: 'Section subheading',
    },
    {
      name: 'plans',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description:
        'Array of plan objects with name, price, features, and CTA',
    },
    {
      name: 'highlightedPlan',
      type: 'string',
      required: false,
      description: 'ID of the plan to highlight (most popular)',
    },
    {
      name: 'showAnnualToggle',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show monthly/annual billing toggle',
    },
    {
      name: 'annualDiscount',
      type: 'number',
      required: false,
      default: 20,
      description: 'Percentage discount for annual billing',
    },
    {
      name: 'currency',
      type: 'string',
      required: false,
      default: '$',
      description: 'Currency symbol',
    },
  ],

  slots: [],

  contextHints: {
    industry: ['saas', 'tech', 'startup'],
    pageType: ['marketing'],
    tunerHints: {
      density: { min: 0.4, max: 0.7 },
      contrast: { min: 0.5, max: 0.8 },
    },
  },

  baseShadcnComponents: ['Button', 'Card'],
  baseDependencies: [],
  keywords: [
    'pricing',
    'plans',
    'tiers',
    'subscription',
    'billing',
    'cost',
    'purchase',
  ],
};

export default pricingBlock;
