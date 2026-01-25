/**
 * Error Page Block Variants
 *
 * Error pages for 404, 500, maintenance mode, etc.
 * Handles error states gracefully.
 */

import { BlockDefinition, ErrorPageVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const notFoundVariant: BlockVariant<ErrorPageVariant> = {
  id: '404',
  name: '404 Not Found',
  description:
    'Page not found error with navigation back home. Friendly and helpful.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: ['Button'],
  radiusPreference: 'rounded',
  tags: ['404', 'not-found', 'missing', 'lost'],
};

const serverErrorVariant: BlockVariant<ErrorPageVariant> = {
  id: '500',
  name: '500 Server Error',
  description:
    'Server error page with retry option. Reassures users the issue is temporary.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: ['Button'],
  radiusPreference: 'rounded',
  tags: ['500', 'server-error', 'crash', 'retry'],
};

const maintenanceVariant: BlockVariant<ErrorPageVariant> = {
  id: 'maintenance',
  name: 'Maintenance Mode',
  description:
    'Scheduled maintenance page with expected return time. Keeps users informed.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: ['Button'],
  radiusPreference: 'rounded',
  tags: ['maintenance', 'downtime', 'scheduled', 'update'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const errorPageBlock: BlockDefinition<ErrorPageVariant> = {
  type: 'error-page',
  category: 'shared',
  name: 'Error Page',
  description:
    'Error and maintenance pages for handling various error states.',

  variants: [notFoundVariant, serverErrorVariant, maintenanceVariant],

  defaultVariant: '404',

  props: [
    {
      name: 'code',
      type: 'string',
      required: false,
      description: 'Error code to display (e.g., "404")',
    },
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Error title',
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Error description/explanation',
    },
    {
      name: 'illustration',
      type: 'string',
      required: false,
      description: 'Custom illustration URL',
    },
    {
      name: 'primaryAction',
      type: 'object',
      required: false,
      description: 'Primary action (e.g., Go Home)',
    },
    {
      name: 'secondaryAction',
      type: 'object',
      required: false,
      description: 'Secondary action (e.g., Contact Support)',
    },
    {
      name: 'showSearch',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Show search box (404 pages)',
    },
    {
      name: 'returnTime',
      type: 'string',
      required: false,
      description: 'Expected return time (maintenance)',
    },
    {
      name: 'statusUrl',
      type: 'string',
      required: false,
      description: 'Link to status page',
    },
  ],

  slots: [],

  contextHints: {
    pageType: ['marketing', 'product'],
    tunerHints: {
      narrative: { min: 0.4, max: 0.8 },
    },
  },

  baseShadcnComponents: ['Button'],
  baseDependencies: [],
  keywords: ['error', '404', '500', 'not-found', 'maintenance', 'offline'],
};

export default errorPageBlock;
