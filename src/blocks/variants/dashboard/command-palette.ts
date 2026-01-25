/**
 * Command Palette Block Variants
 *
 * Command menu / spotlight search for quick navigation and actions.
 * Power user feature for keyboard-driven interfaces.
 */

import { BlockDefinition, CommandPaletteVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const simpleVariant: BlockVariant<CommandPaletteVariant> = {
  id: 'simple',
  name: 'Simple Command Palette',
  description:
    'Basic command menu with search and flat list of commands. Quick and lightweight.',
  complexity: 'moderate',
  requiredDependencies: ['cmdk'],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [
    'Command',
    'CommandDialog',
    'CommandInput',
    'CommandList',
    'CommandEmpty',
    'CommandItem',
  ],
  radiusPreference: 'rounded',
  tags: ['simple', 'search', 'commands', 'spotlight'],
};

const withCategoriesVariant: BlockVariant<CommandPaletteVariant> = {
  id: 'with-categories',
  name: 'Categorized Command Palette',
  description:
    'Command menu with grouped categories. Good for apps with many features.',
  complexity: 'moderate',
  requiredDependencies: ['cmdk'],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [
    'Command',
    'CommandDialog',
    'CommandInput',
    'CommandList',
    'CommandEmpty',
    'CommandGroup',
    'CommandItem',
    'CommandSeparator',
    'CommandShortcut',
  ],
  radiusPreference: 'rounded',
  tags: ['categories', 'groups', 'organized', 'full-featured'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const commandPaletteBlock: BlockDefinition<CommandPaletteVariant> = {
  type: 'command-palette',
  category: 'dashboard',
  name: 'Command Palette',
  description:
    'Command menu (cmd+k) for quick navigation, search, and actions.',

  variants: [simpleVariant, withCategoriesVariant],

  defaultVariant: 'with-categories',

  props: [
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      default: 'Type a command or search...',
      description: 'Search input placeholder',
    },
    {
      name: 'commands',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description: 'Command items with label, icon, action, and optional category/shortcut',
    },
    {
      name: 'categories',
      type: 'array',
      required: false,
      arrayItemType: 'object',
      description: 'Category definitions for grouping',
    },
    {
      name: 'recentCommands',
      type: 'array',
      required: false,
      arrayItemType: 'string',
      description: 'Recently used command IDs',
    },
    {
      name: 'showRecent',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show recently used commands',
    },
    {
      name: 'shortcut',
      type: 'string',
      required: false,
      default: 'cmd+k',
      description: 'Keyboard shortcut to open',
    },
    {
      name: 'emptyMessage',
      type: 'string',
      required: false,
      default: 'No results found.',
      description: 'Message when no matching commands',
    },
  ],

  slots: [],

  contextHints: {
    industry: ['saas', 'developer-tools', 'productivity'],
    audience: ['developer', 'power-user', 'admin'],
    pageType: ['product', 'admin'],
    tunerHints: {
      abstraction: { min: 0.4, max: 0.7 },
      motion: { min: 0.3, max: 0.6 },
    },
  },

  baseShadcnComponents: ['Command', 'CommandDialog'],
  baseDependencies: ['cmdk'],
  keywords: ['command', 'palette', 'spotlight', 'search', 'keyboard', 'shortcuts'],
};

export default commandPaletteBlock;
