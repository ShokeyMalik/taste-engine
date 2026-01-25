/**
 * Features Block Variants
 *
 * Feature sections showcase product capabilities, benefits, or key differentiators.
 * Essential for explaining value proposition in detail.
 */

import { BlockDefinition, FeaturesVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const gridVariant: BlockVariant<FeaturesVariant> = {
  id: 'grid',
  name: 'Feature Grid',
  description:
    'Features displayed in a responsive grid layout. Each feature has icon, title, and description.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: ['Card', 'CardHeader', 'CardTitle', 'CardDescription'],
  radiusPreference: 'rounded',
  tags: ['grid', 'cards', 'simple', 'responsive'],
};

const alternatingVariant: BlockVariant<FeaturesVariant> = {
  id: 'alternating',
  name: 'Alternating Features',
  description:
    'Features alternate between text-left/image-right and text-right/image-left. Great for storytelling.',
  complexity: 'moderate',
  requiredDependencies: [],
  optionalDependencies: ['framer-motion'],
  shadcnComponents: ['Button'],
  radiusPreference: 'rounded',
  tags: ['alternating', 'zigzag', 'images', 'storytelling'],
};

const withIconsVariant: BlockVariant<FeaturesVariant> = {
  id: 'with-icons',
  name: 'Features with Icons',
  description:
    'Compact feature list with prominent icons. Icons can be boxed, colored, or minimal.',
  complexity: 'simple',
  requiredDependencies: ['lucide-react'],
  optionalDependencies: [],
  shadcnComponents: [],
  radiusPreference: 'rounded',
  tags: ['icons', 'compact', 'list', 'minimal'],
};

const withScreenshotsVariant: BlockVariant<FeaturesVariant> = {
  id: 'with-screenshots',
  name: 'Features with Screenshots',
  description:
    'Each feature includes a product screenshot or mockup. Best for visual products.',
  complexity: 'complex',
  requiredDependencies: [],
  optionalDependencies: ['framer-motion'],
  shadcnComponents: ['Card', 'Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'],
  radiusPreference: 'rounded',
  tags: ['screenshots', 'mockups', 'visual', 'product', 'tabs'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const featuresBlock: BlockDefinition<FeaturesVariant> = {
  type: 'features',
  category: 'landing',
  name: 'Features Section',
  description:
    'Showcase product features, capabilities, or benefits in an organized layout.',

  variants: [
    gridVariant,
    alternatingVariant,
    withIconsVariant,
    withScreenshotsVariant,
  ],

  defaultVariant: 'grid',

  props: [
    {
      name: 'heading',
      type: 'string',
      required: false,
      description: 'Section heading',
    },
    {
      name: 'subheading',
      type: 'string',
      required: false,
      description: 'Section subheading or description',
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description:
        'Array of feature objects with title, description, icon, and optional image',
    },
    {
      name: 'columns',
      type: 'number',
      required: false,
      default: 3,
      description: 'Number of columns in grid layout (2, 3, or 4)',
    },
    {
      name: 'iconStyle',
      type: 'enum',
      required: false,
      default: 'minimal',
      enumValues: ['minimal', 'boxed', 'colored', 'gradient'],
      description: 'Style of feature icons',
    },
  ],

  slots: [],

  contextHints: {
    industry: ['saas', 'tech', 'startup', 'ecommerce'],
    pageType: ['marketing'],
    tunerHints: {
      density: { min: 0.3, max: 0.7 },
      narrative: { min: 0.4, max: 0.8 },
    },
  },

  baseShadcnComponents: [],
  baseDependencies: [],
  keywords: [
    'features',
    'benefits',
    'capabilities',
    'highlights',
    'selling-points',
    'grid',
  ],
};

export default featuresBlock;
