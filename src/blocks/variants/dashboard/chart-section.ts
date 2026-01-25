/**
 * Chart Section Block Variants
 *
 * Data visualization sections for dashboards.
 * Various chart types for different data representations.
 */

import { BlockDefinition, ChartSectionVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const areaVariant: BlockVariant<ChartSectionVariant> = {
  id: 'area',
  name: 'Area Chart',
  description:
    'Filled area chart for showing trends over time. Good for revenue, traffic, or cumulative data.',
  complexity: 'moderate',
  requiredDependencies: ['recharts'],
  optionalDependencies: [],
  shadcnComponents: ['Card', 'CardContent', 'CardHeader', 'CardTitle', 'ChartContainer', 'ChartTooltip'],
  radiusPreference: 'rounded',
  tags: ['area', 'trend', 'time-series', 'cumulative'],
};

const barVariant: BlockVariant<ChartSectionVariant> = {
  id: 'bar',
  name: 'Bar Chart',
  description:
    'Vertical or horizontal bar chart for comparing categories. Good for rankings or distributions.',
  complexity: 'moderate',
  requiredDependencies: ['recharts'],
  optionalDependencies: [],
  shadcnComponents: ['Card', 'CardContent', 'CardHeader', 'CardTitle', 'ChartContainer', 'ChartTooltip'],
  radiusPreference: 'rounded',
  tags: ['bar', 'comparison', 'categories', 'ranking'],
};

const lineVariant: BlockVariant<ChartSectionVariant> = {
  id: 'line',
  name: 'Line Chart',
  description:
    'Line chart for tracking changes over time. Good for comparing multiple series.',
  complexity: 'moderate',
  requiredDependencies: ['recharts'],
  optionalDependencies: [],
  shadcnComponents: ['Card', 'CardContent', 'CardHeader', 'CardTitle', 'ChartContainer', 'ChartTooltip', 'ChartLegend'],
  radiusPreference: 'rounded',
  tags: ['line', 'trend', 'time-series', 'comparison'],
};

const pieVariant: BlockVariant<ChartSectionVariant> = {
  id: 'pie',
  name: 'Pie/Donut Chart',
  description:
    'Circular chart for showing proportions. Good for market share or category breakdown.',
  complexity: 'moderate',
  requiredDependencies: ['recharts'],
  optionalDependencies: [],
  shadcnComponents: ['Card', 'CardContent', 'CardHeader', 'CardTitle', 'ChartContainer', 'ChartTooltip', 'ChartLegend'],
  radiusPreference: 'rounded',
  tags: ['pie', 'donut', 'proportions', 'breakdown'],
};

const comboVariant: BlockVariant<ChartSectionVariant> = {
  id: 'combo',
  name: 'Combo Chart',
  description:
    'Mixed bar and line chart for comparing different metrics on the same timeline.',
  complexity: 'complex',
  requiredDependencies: ['recharts'],
  optionalDependencies: [],
  shadcnComponents: ['Card', 'CardContent', 'CardHeader', 'CardTitle', 'ChartContainer', 'ChartTooltip', 'ChartLegend'],
  radiusPreference: 'rounded',
  tags: ['combo', 'mixed', 'dual-axis', 'advanced'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const chartSectionBlock: BlockDefinition<ChartSectionVariant> = {
  type: 'chart-section',
  category: 'dashboard',
  name: 'Chart Section',
  description:
    'Data visualization component with various chart types for dashboard analytics.',

  variants: [areaVariant, barVariant, lineVariant, pieVariant, comboVariant],

  defaultVariant: 'area',

  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Chart title',
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Chart description or subtitle',
    },
    {
      name: 'data',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description: 'Chart data points',
    },
    {
      name: 'xAxisKey',
      type: 'string',
      required: true,
      description: 'Data key for X axis',
    },
    {
      name: 'series',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description: 'Data series configuration',
    },
    {
      name: 'height',
      type: 'number',
      required: false,
      default: 350,
      description: 'Chart height in pixels',
    },
    {
      name: 'showLegend',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show chart legend',
    },
    {
      name: 'showGrid',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Show grid lines',
    },
    {
      name: 'stacked',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Stack multiple series (area/bar)',
    },
    {
      name: 'timeRange',
      type: 'object',
      required: false,
      description: 'Time range selector configuration',
    },
  ],

  slots: [
    {
      name: 'toolbar',
      description: 'Custom chart toolbar (date picker, export)',
      required: false,
      multiple: false,
    },
  ],

  contextHints: {
    industry: ['saas', 'fintech', 'ecommerce', 'analytics'],
    audience: ['admin', 'manager', 'analyst'],
    pageType: ['product', 'admin'],
    tunerHints: {
      density: { min: 0.3, max: 0.6 },
      contrast: { min: 0.4, max: 0.7 },
    },
  },

  baseShadcnComponents: ['Card', 'ChartContainer'],
  baseDependencies: ['recharts'],
  keywords: ['chart', 'graph', 'visualization', 'analytics', 'data-viz'],
};

export default chartSectionBlock;
