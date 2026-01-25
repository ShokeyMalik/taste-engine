/**
 * FAQ Block Variants
 *
 * Frequently Asked Questions sections help reduce support burden
 * and address common objections.
 */

import { BlockDefinition, FAQVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const accordionVariant: BlockVariant<FAQVariant> = {
  id: 'accordion',
  name: 'Accordion FAQ',
  description:
    'Collapsible accordion where only one question is expanded at a time. Compact and interactive.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent'],
  radiusPreference: 'default',
  tags: ['accordion', 'collapsible', 'compact', 'interactive'],
};

const twoColumnVariant: BlockVariant<FAQVariant> = {
  id: 'two-column',
  name: 'Two-Column FAQ',
  description:
    'Questions and answers displayed in a two-column layout. All answers visible.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: [],
  radiusPreference: 'default',
  tags: ['two-column', 'grid', 'visible', 'open'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const faqBlock: BlockDefinition<FAQVariant> = {
  type: 'faq',
  category: 'landing',
  name: 'FAQ Section',
  description:
    'Frequently Asked Questions section to address common questions and objections.',

  variants: [accordionVariant, twoColumnVariant],

  defaultVariant: 'accordion',

  props: [
    {
      name: 'heading',
      type: 'string',
      required: false,
      default: 'Frequently Asked Questions',
      description: 'Section heading',
    },
    {
      name: 'subheading',
      type: 'string',
      required: false,
      description: 'Section subheading',
    },
    {
      name: 'questions',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description: 'Array of question/answer objects',
    },
    {
      name: 'defaultOpen',
      type: 'number',
      required: false,
      description: 'Index of question to show open by default (accordion)',
    },
    {
      name: 'allowMultiple',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Allow multiple accordion items open at once',
    },
    {
      name: 'contactCta',
      type: 'object',
      required: false,
      description: 'Optional CTA for questions not answered (e.g., "Contact Us")',
    },
  ],

  slots: [],

  contextHints: {
    industry: ['saas', 'ecommerce', 'startup'],
    pageType: ['marketing'],
    tunerHints: {
      density: { min: 0.4, max: 0.7 },
    },
  },

  baseShadcnComponents: ['Accordion'],
  baseDependencies: [],
  keywords: ['faq', 'questions', 'answers', 'help', 'support', 'accordion'],
};

export default faqBlock;
