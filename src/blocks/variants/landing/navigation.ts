/**
 * Navigation Block Variants
 *
 * Navigation bars for landing pages and marketing sites.
 * Provides site-wide navigation and key actions.
 */

import { BlockDefinition, NavigationVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const simpleVariant: BlockVariant<NavigationVariant> = {
  id: 'simple',
  name: 'Simple Navigation',
  description:
    'Clean navigation with logo, links, and CTA button. No dropdowns or complex interactions.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Button', 'NavigationMenu'],
  radiusPreference: 'default',
  tags: ['simple', 'clean', 'minimal', 'basic'],
};

const megaMenuVariant: BlockVariant<NavigationVariant> = {
  id: 'mega-menu',
  name: 'Mega Menu Navigation',
  description:
    'Feature-rich navigation with dropdown mega menus. Best for sites with many pages/products.',
  complexity: 'complex',
  requiredDependencies: [],
  optionalDependencies: ['framer-motion'],
  shadcnComponents: [
    'Button',
    'NavigationMenu',
    'NavigationMenuContent',
    'NavigationMenuItem',
    'NavigationMenuLink',
    'NavigationMenuList',
    'NavigationMenuTrigger',
  ],
  radiusPreference: 'rounded',
  tags: ['mega-menu', 'dropdown', 'complex', 'enterprise'],
};

const stickyVariant: BlockVariant<NavigationVariant> = {
  id: 'sticky',
  name: 'Sticky Navigation',
  description:
    'Navigation that sticks to the top on scroll with backdrop blur effect. Modern SaaS style.',
  complexity: 'moderate',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Button', 'NavigationMenu'],
  radiusPreference: 'default',
  tags: ['sticky', 'fixed', 'blur', 'modern', 'saas'],
};

const transparentVariant: BlockVariant<NavigationVariant> = {
  id: 'transparent',
  name: 'Transparent Navigation',
  description:
    'Transparent navbar that works over hero images/videos. Becomes solid on scroll.',
  complexity: 'moderate',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Button', 'NavigationMenu'],
  radiusPreference: 'default',
  tags: ['transparent', 'overlay', 'hero-friendly', 'scroll-aware'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const navigationBlock: BlockDefinition<NavigationVariant> = {
  type: 'navigation',
  category: 'landing',
  name: 'Navigation Bar',
  description:
    'Top navigation bar with logo, links, and call-to-action buttons for marketing sites.',

  variants: [simpleVariant, megaMenuVariant, stickyVariant, transparentVariant],

  defaultVariant: 'simple',

  props: [
    {
      name: 'logo',
      type: 'object',
      required: true,
      description: 'Logo configuration (src, alt, href)',
    },
    {
      name: 'links',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description: 'Navigation links array',
    },
    {
      name: 'cta',
      type: 'object',
      required: false,
      description: 'Primary CTA button configuration',
    },
    {
      name: 'secondaryCta',
      type: 'object',
      required: false,
      description: 'Secondary action (e.g., Login)',
    },
    {
      name: 'showMobileMenu',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show hamburger menu on mobile',
    },
  ],

  slots: [],

  contextHints: {
    industry: ['saas', 'tech', 'ecommerce', 'startup'],
    pageType: ['marketing'],
    tunerHints: {
      density: { min: 0.3, max: 0.6 },
    },
  },

  baseShadcnComponents: ['Button'],
  baseDependencies: [],
  keywords: ['nav', 'navbar', 'header', 'menu', 'navigation', 'top-bar'],
};

export default navigationBlock;
