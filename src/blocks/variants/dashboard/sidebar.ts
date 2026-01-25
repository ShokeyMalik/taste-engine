/**
 * Sidebar Block Variants
 *
 * Navigation sidebars for dashboard applications.
 * Primary navigation for product interfaces.
 */

import { BlockDefinition, SidebarVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const collapsibleVariant: BlockVariant<SidebarVariant> = {
  id: 'collapsible',
  name: 'Collapsible Sidebar',
  description:
    'Full sidebar that can collapse to icons-only mode. Best for power users who need screen space.',
  complexity: 'moderate',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [
    'Sidebar',
    'SidebarContent',
    'SidebarGroup',
    'SidebarGroupContent',
    'SidebarGroupLabel',
    'SidebarMenu',
    'SidebarMenuButton',
    'SidebarMenuItem',
    'SidebarProvider',
    'SidebarTrigger',
    'Tooltip',
  ],
  radiusPreference: 'default',
  tags: ['collapsible', 'responsive', 'toggle', 'power-user'],
};

const miniVariant: BlockVariant<SidebarVariant> = {
  id: 'mini',
  name: 'Mini Sidebar',
  description:
    'Compact sidebar showing only icons. Maximizes content area while maintaining navigation.',
  complexity: 'simple',
  requiredDependencies: ['lucide-react'],
  optionalDependencies: [],
  shadcnComponents: ['Tooltip', 'TooltipContent', 'TooltipProvider', 'TooltipTrigger'],
  radiusPreference: 'rounded',
  tags: ['mini', 'icons-only', 'compact', 'minimal'],
};

const withSectionsVariant: BlockVariant<SidebarVariant> = {
  id: 'with-sections',
  name: 'Sidebar with Sections',
  description:
    'Organized sidebar with grouped navigation sections. Good for apps with many features.',
  complexity: 'moderate',
  requiredDependencies: ['lucide-react'],
  optionalDependencies: [],
  shadcnComponents: [
    'Sidebar',
    'SidebarContent',
    'SidebarGroup',
    'SidebarGroupContent',
    'SidebarGroupLabel',
    'SidebarMenu',
    'SidebarMenuButton',
    'SidebarMenuItem',
    'SidebarProvider',
    'Collapsible',
    'CollapsibleContent',
    'CollapsibleTrigger',
    'Separator',
  ],
  radiusPreference: 'default',
  tags: ['sections', 'grouped', 'organized', 'enterprise'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const sidebarBlock: BlockDefinition<SidebarVariant> = {
  type: 'sidebar',
  category: 'dashboard',
  name: 'Sidebar Navigation',
  description:
    'Primary navigation sidebar for dashboard and application interfaces.',

  variants: [collapsibleVariant, miniVariant, withSectionsVariant],

  defaultVariant: 'collapsible',

  props: [
    {
      name: 'logo',
      type: 'object',
      required: true,
      description: 'Logo configuration (src, alt, href)',
    },
    {
      name: 'navigation',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description: 'Navigation items with label, icon, href, and optional children',
    },
    {
      name: 'sections',
      type: 'array',
      required: false,
      arrayItemType: 'object',
      description: 'Grouped sections for with-sections variant',
    },
    {
      name: 'footer',
      type: 'object',
      required: false,
      description: 'Footer content (user profile, settings, logout)',
    },
    {
      name: 'defaultCollapsed',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Start in collapsed state',
    },
    {
      name: 'activeItem',
      type: 'string',
      required: false,
      description: 'Currently active navigation item',
    },
  ],

  slots: [
    {
      name: 'footer',
      description: 'Content at bottom of sidebar (user menu, settings)',
      required: false,
      multiple: false,
    },
  ],

  contextHints: {
    industry: ['saas', 'enterprise', 'fintech', 'productivity'],
    audience: ['admin', 'operator', 'manager'],
    pageType: ['product', 'admin'],
    tunerHints: {
      density: { min: 0.5, max: 0.8 },
      abstraction: { min: 0.3, max: 0.6 },
    },
  },

  baseShadcnComponents: ['Sidebar', 'SidebarProvider'],
  baseDependencies: ['lucide-react'],
  keywords: ['sidebar', 'nav', 'navigation', 'menu', 'left-panel', 'drawer'],
};

export default sidebarBlock;
