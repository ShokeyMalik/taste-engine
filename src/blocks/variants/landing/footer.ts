/**
 * Footer Block Variants
 *
 * Footer sections provide navigation, legal info, and additional links.
 * Standard ending for all pages.
 */

import { BlockDefinition, FooterVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const simpleVariant: BlockVariant<FooterVariant> = {
  id: 'simple',
  name: 'Simple Footer',
  description:
    'Minimal footer with logo, copyright, and social links. Clean and unobtrusive.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [],
  radiusPreference: 'default',
  tags: ['simple', 'minimal', 'clean', 'compact'],
};

const multiColumnVariant: BlockVariant<FooterVariant> = {
  id: 'multi-column',
  name: 'Multi-Column Footer',
  description:
    'Full footer with multiple link columns, social links, and newsletter. Standard for larger sites.',
  complexity: 'moderate',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [],
  radiusPreference: 'default',
  tags: ['multi-column', 'full', 'comprehensive', 'standard'],
};

const withNewsletterVariant: BlockVariant<FooterVariant> = {
  id: 'with-newsletter',
  name: 'Footer with Newsletter',
  description:
    'Footer with integrated newsletter signup. Combines navigation with lead capture.',
  complexity: 'moderate',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: ['Button', 'Input'],
  radiusPreference: 'rounded',
  tags: ['newsletter', 'email', 'signup', 'lead-gen'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const footerBlock: BlockDefinition<FooterVariant> = {
  type: 'footer',
  category: 'landing',
  name: 'Footer Section',
  description:
    'Page footer with navigation links, legal information, and optional newsletter signup.',

  variants: [simpleVariant, multiColumnVariant, withNewsletterVariant],

  defaultVariant: 'multi-column',

  props: [
    {
      name: 'logo',
      type: 'object',
      required: true,
      description: 'Logo configuration (src, alt)',
    },
    {
      name: 'columns',
      type: 'array',
      required: false,
      arrayItemType: 'object',
      description: 'Link columns with title and links array',
    },
    {
      name: 'socialLinks',
      type: 'array',
      required: false,
      arrayItemType: 'object',
      description: 'Social media links with icon and url',
    },
    {
      name: 'copyright',
      type: 'string',
      required: false,
      description: 'Copyright text',
    },
    {
      name: 'legalLinks',
      type: 'array',
      required: false,
      arrayItemType: 'object',
      description: 'Legal links (Privacy, Terms, etc.)',
    },
    {
      name: 'showNewsletter',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show newsletter signup form',
    },
    {
      name: 'newsletterHeading',
      type: 'string',
      required: false,
      default: 'Subscribe to our newsletter',
      description: 'Newsletter section heading',
    },
  ],

  slots: [],

  contextHints: {
    pageType: ['marketing', 'product', 'docs'],
    tunerHints: {
      density: { min: 0.4, max: 0.7 },
    },
  },

  baseShadcnComponents: [],
  baseDependencies: [],
  keywords: ['footer', 'bottom', 'links', 'social', 'copyright', 'legal'],
};

export default footerBlock;
