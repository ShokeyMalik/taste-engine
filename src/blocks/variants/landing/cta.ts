/**
 * CTA Block Variants
 *
 * Call-to-Action sections drive conversions with prominent action prompts.
 * Usually placed before footer or between major sections.
 */

import { BlockDefinition, CTAVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const simpleVariant: BlockVariant<CTAVariant> = {
  id: 'simple',
  name: 'Simple CTA',
  description:
    'Centered headline with one or two buttons. Clean and focused on the action.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Button'],
  radiusPreference: 'default',
  tags: ['simple', 'centered', 'clean', 'minimal'],
};

const splitVariant: BlockVariant<CTAVariant> = {
  id: 'split',
  name: 'Split CTA',
  description:
    'Two-column layout with text on one side and form/action on the other.',
  complexity: 'moderate',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Button', 'Input'],
  radiusPreference: 'rounded',
  tags: ['split', 'two-column', 'form', 'balanced'],
};

const newsletterVariant: BlockVariant<CTAVariant> = {
  id: 'newsletter',
  name: 'Newsletter CTA',
  description:
    'Email capture form with input and submit button. Perfect for lead generation.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Button', 'Input'],
  radiusPreference: 'rounded',
  tags: ['newsletter', 'email', 'signup', 'form', 'lead-gen'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const ctaBlock: BlockDefinition<CTAVariant> = {
  type: 'cta',
  category: 'landing',
  name: 'CTA Section',
  description:
    'Call-to-action section to drive conversions with a prominent action prompt.',

  variants: [simpleVariant, splitVariant, newsletterVariant],

  defaultVariant: 'simple',

  props: [
    {
      name: 'heading',
      type: 'string',
      required: true,
      description: 'CTA headline',
    },
    {
      name: 'subheading',
      type: 'string',
      required: false,
      description: 'Supporting text',
    },
    {
      name: 'primaryCta',
      type: 'object',
      required: true,
      description: 'Primary action button',
    },
    {
      name: 'secondaryCta',
      type: 'object',
      required: false,
      description: 'Optional secondary action',
    },
    {
      name: 'emailPlaceholder',
      type: 'string',
      required: false,
      default: 'Enter your email',
      description: 'Placeholder for newsletter input',
    },
    {
      name: 'hasBackground',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Use accent background color',
    },
    {
      name: 'backgroundStyle',
      type: 'enum',
      required: false,
      default: 'solid',
      enumValues: ['solid', 'gradient', 'pattern'],
      description: 'Background style',
    },
  ],

  slots: [],

  contextHints: {
    industry: ['saas', 'ecommerce', 'startup', 'marketing'],
    pageType: ['marketing'],
    tunerHints: {
      contrast: { min: 0.5, max: 0.9 },
      narrative: { min: 0.4, max: 0.8 },
    },
  },

  baseShadcnComponents: ['Button'],
  baseDependencies: [],
  keywords: ['cta', 'action', 'convert', 'signup', 'subscribe', 'newsletter'],
};

export default ctaBlock;
