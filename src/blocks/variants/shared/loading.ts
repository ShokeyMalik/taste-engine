/**
 * Loading Block Variants
 *
 * Loading states and placeholders while content loads.
 * Provides visual feedback during async operations.
 */

import { BlockDefinition, LoadingVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const skeletonVariant: BlockVariant<LoadingVariant> = {
  id: 'skeleton',
  name: 'Skeleton Loading',
  description:
    'Placeholder skeleton that mimics content structure. Best perceived performance.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Skeleton'],
  radiusPreference: 'default',
  tags: ['skeleton', 'placeholder', 'content-aware', 'smooth'],
};

const spinnerVariant: BlockVariant<LoadingVariant> = {
  id: 'spinner',
  name: 'Spinner Loading',
  description:
    'Classic spinning loader. Simple and universally understood.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [],
  radiusPreference: 'default',
  tags: ['spinner', 'circular', 'classic', 'simple'],
};

const shimmerVariant: BlockVariant<LoadingVariant> = {
  id: 'shimmer',
  name: 'Shimmer Loading',
  description:
    'Skeleton with animated shimmer effect. More visually engaging.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Skeleton'],
  radiusPreference: 'default',
  tags: ['shimmer', 'animated', 'pulse', 'gradient'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const loadingBlock: BlockDefinition<LoadingVariant> = {
  type: 'loading',
  category: 'shared',
  name: 'Loading State',
  description:
    'Loading indicators and skeleton placeholders for async content.',

  variants: [skeletonVariant, spinnerVariant, shimmerVariant],

  defaultVariant: 'skeleton',

  props: [
    {
      name: 'type',
      type: 'enum',
      required: false,
      default: 'content',
      enumValues: ['content', 'page', 'card', 'table', 'list', 'form'],
      description: 'Type of content being loaded (affects skeleton shape)',
    },
    {
      name: 'rows',
      type: 'number',
      required: false,
      default: 3,
      description: 'Number of skeleton rows (for list/table)',
    },
    {
      name: 'showAvatar',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Include avatar placeholder',
    },
    {
      name: 'showImage',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Include image placeholder',
    },
    {
      name: 'message',
      type: 'string',
      required: false,
      description: 'Loading message to display',
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      default: 'md',
      enumValues: ['sm', 'md', 'lg'],
      description: 'Size of loading indicator',
    },
    {
      name: 'fullPage',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Center in full page',
    },
  ],

  slots: [],

  contextHints: {
    pageType: ['product', 'admin', 'marketing'],
    tunerHints: {
      motion: { min: 0.3, max: 0.7 },
    },
  },

  baseShadcnComponents: ['Skeleton'],
  baseDependencies: [],
  keywords: ['loading', 'skeleton', 'spinner', 'placeholder', 'async', 'wait'],
};

export default loadingBlock;
