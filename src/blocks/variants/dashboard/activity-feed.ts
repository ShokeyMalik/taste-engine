/**
 * Activity Feed Block Variants
 *
 * Display recent activities, events, or notifications.
 * Shows what's happening in the application.
 */

import { BlockDefinition, ActivityFeedVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const simpleVariant: BlockVariant<ActivityFeedVariant> = {
  id: 'simple',
  name: 'Simple Activity Feed',
  description:
    'Basic list of activities with timestamps. Clean and scannable.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react', 'date-fns'],
  shadcnComponents: ['Card', 'CardContent', 'CardHeader', 'CardTitle', 'ScrollArea'],
  radiusPreference: 'default',
  tags: ['simple', 'list', 'basic', 'clean'],
};

const withAvatarsVariant: BlockVariant<ActivityFeedVariant> = {
  id: 'with-avatars',
  name: 'Activity Feed with Avatars',
  description:
    'Activities with user avatars and names. Shows who did what.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react', 'date-fns'],
  shadcnComponents: [
    'Card',
    'CardContent',
    'CardHeader',
    'CardTitle',
    'Avatar',
    'AvatarImage',
    'AvatarFallback',
    'ScrollArea',
  ],
  radiusPreference: 'rounded',
  tags: ['avatars', 'users', 'social', 'team'],
};

const timelineVariant: BlockVariant<ActivityFeedVariant> = {
  id: 'timeline',
  name: 'Timeline Activity Feed',
  description:
    'Vertical timeline with connected events. Good for showing process or history.',
  complexity: 'moderate',
  requiredDependencies: ['lucide-react'],
  optionalDependencies: ['date-fns'],
  shadcnComponents: [
    'Card',
    'CardContent',
    'CardHeader',
    'CardTitle',
    'Avatar',
    'AvatarImage',
    'AvatarFallback',
    'Badge',
  ],
  radiusPreference: 'rounded',
  tags: ['timeline', 'history', 'process', 'connected'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const activityFeedBlock: BlockDefinition<ActivityFeedVariant> = {
  type: 'activity-feed',
  category: 'dashboard',
  name: 'Activity Feed',
  description:
    'Display recent activities, events, or notifications in a feed format.',

  variants: [simpleVariant, withAvatarsVariant, timelineVariant],

  defaultVariant: 'with-avatars',

  props: [
    {
      name: 'title',
      type: 'string',
      required: false,
      default: 'Recent Activity',
      description: 'Section title',
    },
    {
      name: 'activities',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description:
        'Array of activity objects with user, action, target, timestamp, and optional icon/type',
    },
    {
      name: 'maxItems',
      type: 'number',
      required: false,
      default: 10,
      description: 'Maximum items to show',
    },
    {
      name: 'showViewAll',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show "View All" link',
    },
    {
      name: 'viewAllHref',
      type: 'string',
      required: false,
      description: 'Link for "View All"',
    },
    {
      name: 'groupByDate',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Group activities by date',
    },
    {
      name: 'relativeTime',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show relative timestamps (e.g., "2 hours ago")',
    },
  ],

  slots: [],

  contextHints: {
    industry: ['saas', 'social', 'crm', 'productivity'],
    audience: ['admin', 'manager', 'operator'],
    pageType: ['product', 'admin'],
    tunerHints: {
      density: { min: 0.5, max: 0.8 },
    },
  },

  baseShadcnComponents: ['Card', 'ScrollArea'],
  baseDependencies: [],
  keywords: ['activity', 'feed', 'events', 'timeline', 'notifications', 'history'],
};

export default activityFeedBlock;
