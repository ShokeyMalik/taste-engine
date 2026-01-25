/**
 * Hero Block Variants
 *
 * Hero sections are the prominent opening sections of landing pages.
 * They set the tone and communicate the primary value proposition.
 */

import { BlockDefinition, HeroVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const centeredVariant: BlockVariant<HeroVariant> = {
  id: 'centered',
  name: 'Centered Hero',
  description:
    'Classic centered layout with headline, subheadline, and CTA buttons. Best for clear, focused messaging.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Button'],
  radiusPreference: 'default',
  tags: ['centered', 'classic', 'simple', 'clean'],
};

const splitVariant: BlockVariant<HeroVariant> = {
  id: 'split',
  name: 'Split Hero',
  description:
    'Two-column layout with content on one side and image/illustration on the other. Great for showcasing product visuals.',
  complexity: 'moderate',
  requiredDependencies: [],
  optionalDependencies: ['framer-motion'],
  shadcnComponents: ['Button', 'Badge'],
  radiusPreference: 'rounded',
  tags: ['split', 'two-column', 'image', 'product'],
};

const videoBgVariant: BlockVariant<HeroVariant> = {
  id: 'video-bg',
  name: 'Video Background Hero',
  description:
    'Full-screen hero with autoplay video background. Creates immersive, dynamic first impression.',
  complexity: 'complex',
  requiredDependencies: [],
  optionalDependencies: ['framer-motion'],
  shadcnComponents: ['Button'],
  radiusPreference: 'default',
  tags: ['video', 'fullscreen', 'immersive', 'dynamic'],
};

const gradientOrbsVariant: BlockVariant<HeroVariant> = {
  id: 'gradient-orbs',
  name: 'Gradient Orbs Hero',
  description:
    'Modern hero with animated gradient orbs/blobs background. Popular with SaaS and tech products (Linear, Stripe style).',
  complexity: 'complex',
  requiredDependencies: [],
  optionalDependencies: ['framer-motion'],
  shadcnComponents: ['Button', 'Badge'],
  radiusPreference: 'rounded',
  tags: ['gradient', 'orbs', 'modern', 'saas', 'animated', 'linear', 'stripe'],
};

const minimalVariant: BlockVariant<HeroVariant> = {
  id: 'minimal',
  name: 'Minimal Hero',
  description:
    'Ultra-clean hero with just text and a single CTA. Maximum focus on copy. Vercel-style minimalism.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Button'],
  radiusPreference: 'sharp',
  tags: ['minimal', 'clean', 'vercel', 'text-focused', 'simple'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const heroBlock: BlockDefinition<HeroVariant> = {
  type: 'hero',
  category: 'landing',
  name: 'Hero Section',
  description:
    'The opening section of a landing page that captures attention and communicates the primary value proposition.',

  variants: [
    centeredVariant,
    splitVariant,
    videoBgVariant,
    gradientOrbsVariant,
    minimalVariant,
  ],

  defaultVariant: 'centered',

  props: [
    {
      name: 'headline',
      type: 'string',
      required: true,
      description: 'Main headline text (H1)',
    },
    {
      name: 'subheadline',
      type: 'string',
      required: false,
      description: 'Supporting text below the headline',
    },
    {
      name: 'primaryCta',
      type: 'object',
      required: true,
      description: 'Primary call-to-action button',
    },
    {
      name: 'secondaryCta',
      type: 'object',
      required: false,
      description: 'Optional secondary call-to-action button',
    },
    {
      name: 'badge',
      type: 'string',
      required: false,
      description: 'Optional badge/pill above the headline (e.g., "New", "Beta")',
    },
    {
      name: 'image',
      type: 'object',
      required: false,
      description: 'Hero image or illustration (for split variant)',
    },
    {
      name: 'videoUrl',
      type: 'string',
      required: false,
      description: 'Video URL for video-bg variant',
    },
    {
      name: 'alignment',
      type: 'enum',
      required: false,
      default: 'center',
      enumValues: ['left', 'center', 'right'],
      description: 'Text alignment',
    },
  ],

  slots: [
    {
      name: 'belowCta',
      description: 'Content to show below the CTA buttons (e.g., social proof)',
      acceptedBlocks: ['logo-cloud', 'stats'],
      required: false,
      multiple: false,
    },
  ],

  contextHints: {
    industry: ['saas', 'tech', 'startup', 'ecommerce', 'fintech'],
    audience: ['consumer', 'business', 'developer'],
    pageType: ['marketing'],
    tunerHints: {
      narrative: { min: 0.5, max: 1.0 },
      contrast: { min: 0.4, max: 0.9 },
    },
  },

  baseShadcnComponents: ['Button'],
  baseDependencies: [],
  keywords: [
    'hero',
    'header',
    'banner',
    'above-fold',
    'headline',
    'landing',
    'opening',
  ],
};

export default heroBlock;
