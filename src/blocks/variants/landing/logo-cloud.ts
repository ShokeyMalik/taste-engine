/**
 * Logo Cloud Block Variants
 *
 * Display logos of customers, partners, or press mentions.
 * Builds credibility through association.
 */

import { BlockDefinition, LogoCloudVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const simpleVariant: BlockVariant<LogoCloudVariant> = {
  id: 'simple',
  name: 'Simple Logo Cloud',
  description:
    'Logos displayed in a simple row/grid. Grayscale by default with hover color effect.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: [],
  radiusPreference: 'default',
  tags: ['simple', 'grid', 'grayscale', 'hover'],
};

const withHeadingVariant: BlockVariant<LogoCloudVariant> = {
  id: 'with-heading',
  name: 'Logo Cloud with Heading',
  description:
    'Logo cloud with a heading like "Trusted by" or "Featured in". Adds context.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: [],
  radiusPreference: 'default',
  tags: ['heading', 'trusted-by', 'featured-in', 'context'],
};

const scrollingVariant: BlockVariant<LogoCloudVariant> = {
  id: 'scrolling',
  name: 'Scrolling Logo Cloud',
  description:
    'Infinite horizontal scroll of logos. Creates dynamic, attention-grabbing display.',
  complexity: 'moderate',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: [],
  radiusPreference: 'default',
  tags: ['scrolling', 'animated', 'infinite', 'marquee'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const logoCloudBlock: BlockDefinition<LogoCloudVariant> = {
  type: 'logo-cloud',
  category: 'landing',
  name: 'Logo Cloud',
  description:
    'Display logos of customers, partners, or press mentions for social proof.',

  variants: [simpleVariant, withHeadingVariant, scrollingVariant],

  defaultVariant: 'with-heading',

  props: [
    {
      name: 'heading',
      type: 'string',
      required: false,
      default: 'Trusted by industry leaders',
      description: 'Section heading',
    },
    {
      name: 'logos',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description: 'Array of logo objects with src, alt, and optional href',
    },
    {
      name: 'grayscale',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Display logos in grayscale',
    },
    {
      name: 'colorOnHover',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show color on hover (if grayscale is true)',
    },
    {
      name: 'logoSize',
      type: 'enum',
      required: false,
      default: 'md',
      enumValues: ['sm', 'md', 'lg'],
      description: 'Size of logos',
    },
    {
      name: 'scrollSpeed',
      type: 'number',
      required: false,
      default: 30,
      description: 'Scroll animation duration in seconds (for scrolling variant)',
    },
  ],

  slots: [],

  contextHints: {
    industry: ['saas', 'startup', 'enterprise', 'ecommerce'],
    pageType: ['marketing'],
    tunerHints: {
      abstraction: { min: 0.3, max: 0.7 },
    },
  },

  baseShadcnComponents: [],
  baseDependencies: [],
  keywords: [
    'logos',
    'customers',
    'partners',
    'trust',
    'social-proof',
    'brands',
  ],
};

export default logoCloudBlock;
