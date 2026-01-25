/**
 * Empty State Block Variants
 *
 * Placeholder content when there's no data to display.
 * Guides users on next steps.
 */

import { BlockDefinition, EmptyStateVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const simpleVariant: BlockVariant<EmptyStateVariant> = {
  id: 'simple',
  name: 'Simple Empty State',
  description:
    'Minimal empty state with icon and message. Clean and unobtrusive.',
  complexity: 'simple',
  requiredDependencies: ['lucide-react'],
  optionalDependencies: [],
  shadcnComponents: [],
  radiusPreference: 'default',
  tags: ['simple', 'minimal', 'icon', 'message'],
};

const withActionVariant: BlockVariant<EmptyStateVariant> = {
  id: 'with-action',
  name: 'Empty State with Action',
  description:
    'Empty state with a clear call-to-action button. Encourages users to take action.',
  complexity: 'simple',
  requiredDependencies: ['lucide-react'],
  optionalDependencies: [],
  shadcnComponents: ['Button'],
  radiusPreference: 'rounded',
  tags: ['action', 'cta', 'button', 'create'],
};

const illustratedVariant: BlockVariant<EmptyStateVariant> = {
  id: 'illustrated',
  name: 'Illustrated Empty State',
  description:
    'Empty state with a custom illustration. More visually engaging and friendly.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Button'],
  radiusPreference: 'rounded',
  tags: ['illustration', 'visual', 'friendly', 'engaging'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const emptyStateBlock: BlockDefinition<EmptyStateVariant> = {
  type: 'empty-state',
  category: 'shared',
  name: 'Empty State',
  description:
    'Placeholder content shown when there is no data to display.',

  variants: [simpleVariant, withActionVariant, illustratedVariant],

  defaultVariant: 'with-action',

  props: [
    {
      name: 'icon',
      type: 'string',
      required: false,
      description: 'Icon name from lucide-react',
    },
    {
      name: 'illustration',
      type: 'string',
      required: false,
      description: 'Illustration image URL (for illustrated variant)',
    },
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Empty state title/heading',
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Explanatory text',
    },
    {
      name: 'action',
      type: 'object',
      required: false,
      description: 'Primary action button configuration',
    },
    {
      name: 'secondaryAction',
      type: 'object',
      required: false,
      description: 'Secondary action (link or button)',
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      default: 'md',
      enumValues: ['sm', 'md', 'lg'],
      description: 'Size of the empty state',
    },
  ],

  slots: [],

  contextHints: {
    pageType: ['product', 'admin'],
    tunerHints: {
      narrative: { min: 0.3, max: 0.7 },
    },
  },

  baseShadcnComponents: [],
  baseDependencies: [],
  keywords: ['empty', 'no-data', 'placeholder', 'zero-state', 'onboarding'],
};

export default emptyStateBlock;
