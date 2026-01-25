/**
 * Data Table Block Variants
 *
 * Tables for displaying and managing data in dashboards.
 * Essential for admin interfaces and data-heavy applications.
 */

import { BlockDefinition, DataTableVariant, BlockVariant } from '../../types';

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

const simpleVariant: BlockVariant<DataTableVariant> = {
  id: 'simple',
  name: 'Simple Data Table',
  description:
    'Basic table with headers and rows. Clean presentation without extra features.',
  complexity: 'simple',
  requiredDependencies: [],
  optionalDependencies: [],
  shadcnComponents: ['Table', 'TableBody', 'TableCell', 'TableHead', 'TableHeader', 'TableRow'],
  radiusPreference: 'default',
  tags: ['simple', 'basic', 'clean', 'minimal'],
};

const withFiltersVariant: BlockVariant<DataTableVariant> = {
  id: 'with-filters',
  name: 'Data Table with Filters',
  description:
    'Table with column filters, search, and sorting. For finding specific records.',
  complexity: 'moderate',
  requiredDependencies: ['@tanstack/react-table'],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [
    'Table',
    'TableBody',
    'TableCell',
    'TableHead',
    'TableHeader',
    'TableRow',
    'Input',
    'Button',
    'DropdownMenu',
    'DropdownMenuContent',
    'DropdownMenuItem',
    'DropdownMenuTrigger',
    'Select',
    'SelectContent',
    'SelectItem',
    'SelectTrigger',
    'SelectValue',
  ],
  radiusPreference: 'default',
  tags: ['filters', 'search', 'sorting', 'advanced'],
};

const withPaginationVariant: BlockVariant<DataTableVariant> = {
  id: 'with-pagination',
  name: 'Data Table with Pagination',
  description:
    'Full-featured table with pagination, row selection, and bulk actions.',
  complexity: 'complex',
  requiredDependencies: ['@tanstack/react-table'],
  optionalDependencies: ['lucide-react'],
  shadcnComponents: [
    'Table',
    'TableBody',
    'TableCell',
    'TableHead',
    'TableHeader',
    'TableRow',
    'Button',
    'Checkbox',
    'DropdownMenu',
    'DropdownMenuContent',
    'DropdownMenuItem',
    'DropdownMenuTrigger',
    'Select',
    'SelectContent',
    'SelectItem',
    'SelectTrigger',
    'SelectValue',
    'Pagination',
    'PaginationContent',
    'PaginationItem',
    'PaginationLink',
    'PaginationNext',
    'PaginationPrevious',
  ],
  radiusPreference: 'default',
  tags: ['pagination', 'selection', 'bulk-actions', 'full-featured'],
};

// =============================================================================
// BLOCK DEFINITION
// =============================================================================

export const dataTableBlock: BlockDefinition<DataTableVariant> = {
  type: 'data-table',
  category: 'dashboard',
  name: 'Data Table',
  description:
    'Table component for displaying, filtering, sorting, and paginating data.',

  variants: [simpleVariant, withFiltersVariant, withPaginationVariant],

  defaultVariant: 'with-pagination',

  props: [
    {
      name: 'columns',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description: 'Column definitions with id, header, accessor, and options',
    },
    {
      name: 'data',
      type: 'array',
      required: true,
      arrayItemType: 'object',
      description: 'Data rows to display',
    },
    {
      name: 'pageSize',
      type: 'number',
      required: false,
      default: 10,
      description: 'Number of rows per page',
    },
    {
      name: 'searchable',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Enable global search',
    },
    {
      name: 'sortable',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Enable column sorting',
    },
    {
      name: 'selectable',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Enable row selection',
    },
    {
      name: 'actions',
      type: 'array',
      required: false,
      arrayItemType: 'object',
      description: 'Row action menu items',
    },
    {
      name: 'emptyMessage',
      type: 'string',
      required: false,
      default: 'No results found',
      description: 'Message when no data',
    },
  ],

  slots: [
    {
      name: 'toolbar',
      description: 'Custom toolbar above table',
      required: false,
      multiple: false,
    },
    {
      name: 'empty',
      description: 'Custom empty state',
      acceptedBlocks: ['empty-state'],
      required: false,
      multiple: false,
    },
  ],

  contextHints: {
    industry: ['saas', 'enterprise', 'fintech', 'crm'],
    audience: ['admin', 'operator', 'manager'],
    pageType: ['product', 'admin'],
    tunerHints: {
      density: { min: 0.6, max: 0.9 },
      abstraction: { min: 0.2, max: 0.5 },
    },
  },

  baseShadcnComponents: ['Table'],
  baseDependencies: [],
  keywords: ['table', 'data', 'grid', 'list', 'records', 'pagination', 'filter'],
};

export default dataTableBlock;
