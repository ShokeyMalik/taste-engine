/**
 * Settings Panel Block Variants
 *
 * Settings and configuration interfaces for applications.
 * Allows users to customize their experience.
 */

import { BlockDefinition, SettingsPanelVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const tabsVariant: BlockVariant<SettingsPanelVariant> = {
  id: 'tabs',
  name: 'Tabbed Settings',
  description:
    'Settings organized in tabs. Good for many settings categories.',
  complexity: 'moderate',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [
    'Tabs',
    'TabsContent',
    'TabsList',
    'TabsTrigger',
    'Card',
    'CardContent',
    'CardDescription',
    'CardHeader',
    'CardTitle',
    'Input',
    'Label',
    'Button',
    'Switch',
    'Select',
  ],
  radiusPreference: 'default',
  tags: ['tabs', 'organized', 'categories', 'navigation'],
};

const sectionsVariant: BlockVariant<SettingsPanelVariant> = {
  id: 'sections',
  name: 'Sectioned Settings',
  description:
    'Settings in scrollable sections with a side navigation. Good for long settings pages.',
  complexity: 'moderate',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [
    'Card',
    'CardContent',
    'CardDescription',
    'CardHeader',
    'CardTitle',
    'Input',
    'Label',
    'Button',
    'Switch',
    'Select',
    'Separator',
    'ScrollArea',
  ],
  radiusPreference: 'default',
  tags: ['sections', 'scroll', 'navigation', 'long-form'],
};

const modalVariant: BlockVariant<SettingsPanelVariant> = {
  id: 'modal',
  name: 'Modal Settings',
  description:
    'Settings in a dialog/modal. Good for quick settings access.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [
    'Dialog',
    'DialogContent',
    'DialogDescription',
    'DialogHeader',
    'DialogTitle',
    'DialogTrigger',
    'DialogFooter',
    'Input',
    'Label',
    'Button',
    'Switch',
  ],
  radiusPreference: 'rounded',
  tags: ['modal', 'dialog', 'overlay', 'quick'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const settingsPanelBlock: BlockDefinition<SettingsPanelVariant> = {
  type: 'settings-panel',
  category: 'dashboard',
  name: 'Settings Panel',
  description:
    'Settings and configuration interface with various organization patterns.',

  variants: [tabsVariant, sectionsVariant, modalVariant],

  defaultVariant: 'tabs',

  props: [
    {
      name: 'title',
      type: 'string',
      required: false,
      default: 'Settings',
      description: 'Page/panel title',
    },
    {
      name: 'sections',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description: 'Settings sections with title, description, and fields',
    },
    {
      name: 'defaultSection',
      type: 'string',
      required: false,
      description: 'Default active section/tab',
    },
    {
      name: 'showSaveButton',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show save/submit button',
    },
    {
      name: 'saveButtonText',
      type: 'string',
      required: false,
      default: 'Save changes',
      description: 'Save button text',
    },
    {
      name: 'showCancel',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show cancel button',
    },
    {
      name: 'autoSave',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Auto-save on change',
    },
  ],

  slots: [
    {
      name: 'header',
      description: 'Custom header content',
      required: false,
      multiple: false,
    },
    {
      name: 'footer',
      description: 'Custom footer content',
      required: false,
      multiple: false,
    },
  ],

  contextHints: {
    industry: ['saas', 'enterprise', 'productivity'],
    audience: ['admin', 'operator', 'developer'],
    pageType: ['product', 'admin'],
    tunerHints: {
      density: { min: 0.4, max: 0.7 },
    },
  },

  baseShadcnComponents: ['Card', 'Input', 'Label', 'Button', 'Switch'],
  baseDependencies: [],
  keywords: ['settings', 'preferences', 'configuration', 'options', 'profile'],
};

export default settingsPanelBlock;
