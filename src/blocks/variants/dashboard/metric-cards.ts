/**
 * Metric Cards Block Variants
 *
 * KPI and metric display cards for dashboards.
 * Show key business metrics at a glance.
 */

import { BlockDefinition, MetricCardsVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const simpleVariant: BlockVariant<MetricCardsVariant> = {
  id: 'simple',
  name: 'Simple Metric Cards',
  description:
    'Clean cards showing metric value, label, and optional icon. Minimal and scannable.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: ['Card', 'CardContent', 'CardHeader', 'CardTitle'],
  radiusPreference: 'rounded',
  tags: ['simple', 'clean', 'minimal', 'kpi'],
};

const withSparklineVariant: BlockVariant<MetricCardsVariant> = {
  id: 'with-sparkline',
  name: 'Metric Cards with Sparklines',
  description:
    'Metrics with mini inline charts showing trend over time. Visual context for the number.',
  complexity: 'moderate',
  requiredDependencies: ['recharts'],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: ['Card', 'CardContent', 'CardHeader', 'CardTitle', 'ChartContainer'],
  radiusPreference: 'rounded',
  tags: ['sparkline', 'chart', 'trend', 'visual'],
};

const withTrendVariant: BlockVariant<MetricCardsVariant> = {
  id: 'with-trend',
  name: 'Metric Cards with Trend',
  description:
    'Metrics showing percentage change with up/down indicator. Shows growth or decline.',
  complexity: 'simple',
  requiredDependencies: ['lucide-react'],
  optionalDependencies: [],
  shadcnComponents: ['Card', 'CardContent', 'CardHeader', 'CardTitle', 'Badge'],
  radiusPreference: 'rounded',
  tags: ['trend', 'change', 'growth', 'percentage'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const metricCardsBlock: BlockDefinition<MetricCardsVariant> = {
  type: 'metric-cards',
  category: 'dashboard',
  name: 'Metric Cards',
  description:
    'Display key performance indicators and business metrics in card format.',

  variants: [simpleVariant, withSparklineVariant, withTrendVariant],

  defaultVariant: 'with-trend',

  props: [
    {
      name: 'metrics',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description:
        'Array of metric objects with value, label, icon, trend, and optional sparkline data',
    },
    {
      name: 'columns',
      type: 'number',
      required: false,
      default: 4,
      description: 'Number of columns (2, 3, or 4)',
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      default: 'default',
      enumValues: ['compact', 'default', 'large'],
      description: 'Card size variant',
    },
    {
      name: 'showComparison',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show comparison to previous period',
    },
    {
      name: 'comparisonPeriod',
      type: 'string',
      required: false,
      default: 'vs last month',
      description: 'Label for comparison period',
    },
    {
      name: 'animated',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Animate number counting',
    },
  ],

  slots: [],

  contextHints: {
    industry: ['saas', 'enterprise', 'fintech', 'ecommerce'],
    audience: ['admin', 'manager', 'executive'],
    pageType: ['product', 'admin'],
    tunerHints: {
      density: { min: 0.4, max: 0.7 },
      contrast: { min: 0.5, max: 0.8 },
    },
  },

  baseShadcnComponents: ['Card'],
  baseDependencies: [],
  keywords: ['metrics', 'kpi', 'cards', 'stats', 'dashboard', 'numbers'],
};

export default metricCardsBlock;
