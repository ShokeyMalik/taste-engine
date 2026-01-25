/**
 * Header Block Variants
 *
 * Top header bars for dashboard applications.
 * Contains search, user menu, and contextual actions.
 */

import { BlockDefinition, HeaderVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const simpleVariant: BlockVariant<HeaderVariant> = {
  id: 'simple',
  name: 'Simple Header',
  description:
    'Clean header with page title and user menu. Minimal and unobtrusive.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [
    'Button',
    'Avatar',
    'AvatarImage',
    'AvatarFallback',
    'DropdownMenu',
    'DropdownMenuContent',
    'DropdownMenuItem',
    'DropdownMenuTrigger',
  ],
  radiusPreference: 'default',
  tags: ['simple', 'minimal', 'clean', 'basic'],
};

const withSearchVariant: BlockVariant<HeaderVariant> = {
  id: 'with-search',
  name: 'Header with Search',
  description:
    'Header featuring a prominent search bar. Good for content-heavy apps.',
  complexity: 'moderate',
  requiredDependencies: ['lucide-react'],
  optionalDependencies: ['cmdk'],
  shadcnComponents: [
    'Button',
    'Avatar',
    'Input',
    'Command',
    'CommandDialog',
    'CommandInput',
    'CommandList',
    'CommandEmpty',
    'CommandGroup',
    'CommandItem',
  ],
  radiusPreference: 'rounded',
  tags: ['search', 'command', 'searchbar', 'find'],
};

const withBreadcrumbsVariant: BlockVariant<HeaderVariant> = {
  id: 'with-breadcrumbs',
  name: 'Header with Breadcrumbs',
  description:
    'Header showing navigation breadcrumbs for deep page hierarchies.',
  complexity: 'simple',
  requiredDependencies: ['lucide-react'],
  optionalDependencies: [],
  shadcnComponents: [
    'Button',
    'Avatar',
    'Breadcrumb',
    'BreadcrumbItem',
    'BreadcrumbLink',
    'BreadcrumbList',
    'BreadcrumbPage',
    'BreadcrumbSeparator',
  ],
  radiusPreference: 'default',
  tags: ['breadcrumbs', 'navigation', 'hierarchy', 'path'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const headerBlock: BlockDefinition<HeaderVariant> = {
  type: 'header',
  category: 'dashboard',
  name: 'Dashboard Header',
  description:
    'Top header bar for dashboards with search, navigation, and user menu.',

  variants: [simpleVariant, withSearchVariant, withBreadcrumbsVariant],

  defaultVariant: 'simple',

  props: [
    {
      name: 'title',
      type: 'string',
      required: false,
      description: 'Page title to display',
    },
    {
      name: 'breadcrumbs',
      type: 'array',
      required: false,
      arrayItemType: 'object',
      description: 'Breadcrumb items with label and href',
    },
    {
      name: 'user',
      type: 'object',
      required: false,
      description: 'User profile data for avatar/menu',
    },
    {
      name: 'showSearch',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show search input',
    },
    {
      name: 'searchPlaceholder',
      type: 'string',
      required: false,
      default: 'Search...',
      description: 'Search input placeholder',
    },
    {
      name: 'actions',
      type: 'array',
      required: false,
      arrayItemType: 'object',
      description: 'Action buttons to show in header',
    },
    {
      name: 'notifications',
      type: 'object',
      required: false,
      description: 'Notification bell configuration',
    },
  ],

  slots: [
    {
      name: 'actions',
      description: 'Custom action buttons/components',
      required: false,
      multiple: true,
    },
  ],

  contextHints: {
    industry: ['saas', 'enterprise', 'productivity'],
    audience: ['admin', 'operator', 'manager'],
    pageType: ['product', 'admin'],
    tunerHints: {
      density: { min: 0.4, max: 0.7 },
    },
  },

  baseShadcnComponents: ['Button', 'Avatar'],
  baseDependencies: [],
  keywords: ['header', 'topbar', 'navbar', 'search', 'breadcrumbs', 'user-menu'],
};

export default headerBlock;
