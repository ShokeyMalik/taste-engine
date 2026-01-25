/**
 * shadcn/ui Component Knowledge
 *
 * Provides component knowledge and generation helpers for shadcn/ui.
 * Maps block requirements to shadcn component combinations.
 */

import type { ShadcnComponent, ShadcnConfig } from './types';
import type { BlockType } from '../../blocks/types';

// =============================================================================
// COMPONENT KNOWLEDGE TYPES
// =============================================================================

export interface ComponentUsage {
  component: ShadcnComponent;
  subComponents: string[];
  purpose: string;
  importPath: string;
}

export interface BlockComponentMapping {
  blockType: BlockType;
  required: ComponentUsage[];
  optional: ComponentUsage[];
  additionalImports: string[];
}

export interface ComponentCodeTemplate {
  component: ShadcnComponent;
  basicUsage: string;
  withVariants: Record<string, string>;
  propsInterface: string;
}

// =============================================================================
// BLOCK TO COMPONENT MAPPINGS
// =============================================================================

/**
 * Maps each block type to the shadcn components it typically uses
 */
export const BLOCK_COMPONENT_MAPPINGS: BlockComponentMapping[] = [
  // Landing blocks
  {
    blockType: 'hero',
    required: [
      { component: 'Button', subComponents: [], purpose: 'CTA buttons', importPath: '@/components/ui/button' },
    ],
    optional: [
      { component: 'Badge', subComponents: [], purpose: 'Labels/tags', importPath: '@/components/ui/badge' },
      { component: 'Avatar', subComponents: ['AvatarImage', 'AvatarFallback'], purpose: 'User testimonials', importPath: '@/components/ui/avatar' },
    ],
    additionalImports: ['lucide-react'],
  },
  {
    blockType: 'navigation',
    required: [
      { component: 'Button', subComponents: [], purpose: 'Nav actions', importPath: '@/components/ui/button' },
      { component: 'NavigationMenu', subComponents: ['NavigationMenuList', 'NavigationMenuItem', 'NavigationMenuTrigger', 'NavigationMenuContent', 'NavigationMenuLink'], purpose: 'Main navigation', importPath: '@/components/ui/navigation-menu' },
    ],
    optional: [
      { component: 'DropdownMenu', subComponents: ['DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem'], purpose: 'Mobile menu', importPath: '@/components/ui/dropdown-menu' },
      { component: 'Sheet', subComponents: ['SheetTrigger', 'SheetContent'], purpose: 'Mobile drawer', importPath: '@/components/ui/sheet' },
    ],
    additionalImports: ['lucide-react'],
  },
  {
    blockType: 'features',
    required: [
      { component: 'Card', subComponents: ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent'], purpose: 'Feature cards', importPath: '@/components/ui/card' },
    ],
    optional: [
      { component: 'Tabs', subComponents: ['TabsList', 'TabsTrigger', 'TabsContent'], purpose: 'Tabbed features', importPath: '@/components/ui/tabs' },
      { component: 'Badge', subComponents: [], purpose: 'Feature labels', importPath: '@/components/ui/badge' },
    ],
    additionalImports: ['lucide-react'],
  },
  {
    blockType: 'pricing',
    required: [
      { component: 'Card', subComponents: ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'], purpose: 'Pricing cards', importPath: '@/components/ui/card' },
      { component: 'Button', subComponents: [], purpose: 'Purchase buttons', importPath: '@/components/ui/button' },
    ],
    optional: [
      { component: 'Switch', subComponents: [], purpose: 'Billing toggle', importPath: '@/components/ui/switch' },
      { component: 'Badge', subComponents: [], purpose: 'Popular/recommended', importPath: '@/components/ui/badge' },
      { component: 'Tooltip', subComponents: ['TooltipTrigger', 'TooltipContent', 'TooltipProvider'], purpose: 'Feature info', importPath: '@/components/ui/tooltip' },
    ],
    additionalImports: ['lucide-react'],
  },
  {
    blockType: 'testimonials',
    required: [
      { component: 'Card', subComponents: ['CardContent'], purpose: 'Testimonial cards', importPath: '@/components/ui/card' },
      { component: 'Avatar', subComponents: ['AvatarImage', 'AvatarFallback'], purpose: 'User avatars', importPath: '@/components/ui/avatar' },
    ],
    optional: [
      { component: 'Carousel', subComponents: ['CarouselContent', 'CarouselItem', 'CarouselPrevious', 'CarouselNext'], purpose: 'Carousel layout', importPath: '@/components/ui/carousel' },
    ],
    additionalImports: ['lucide-react'],
  },
  {
    blockType: 'faq',
    required: [
      { component: 'Accordion', subComponents: ['AccordionItem', 'AccordionTrigger', 'AccordionContent'], purpose: 'FAQ items', importPath: '@/components/ui/accordion' },
    ],
    optional: [
      { component: 'Tabs', subComponents: ['TabsList', 'TabsTrigger', 'TabsContent'], purpose: 'FAQ categories', importPath: '@/components/ui/tabs' },
    ],
    additionalImports: [],
  },
  {
    blockType: 'cta',
    required: [
      { component: 'Button', subComponents: [], purpose: 'CTA button', importPath: '@/components/ui/button' },
    ],
    optional: [
      { component: 'Input', subComponents: [], purpose: 'Email input', importPath: '@/components/ui/input' },
    ],
    additionalImports: ['lucide-react'],
  },
  {
    blockType: 'footer',
    required: [],
    optional: [
      { component: 'Separator', subComponents: [], purpose: 'Section dividers', importPath: '@/components/ui/separator' },
    ],
    additionalImports: ['lucide-react'],
  },
  {
    blockType: 'logo-cloud',
    required: [],
    optional: [
      { component: 'Carousel', subComponents: ['CarouselContent', 'CarouselItem'], purpose: 'Logo carousel', importPath: '@/components/ui/carousel' },
    ],
    additionalImports: [],
  },
  {
    blockType: 'stats',
    required: [
      { component: 'Card', subComponents: ['CardContent'], purpose: 'Stat cards', importPath: '@/components/ui/card' },
    ],
    optional: [],
    additionalImports: ['lucide-react'],
  },

  // Dashboard blocks
  {
    blockType: 'sidebar',
    required: [
      { component: 'Button', subComponents: [], purpose: 'Nav items', importPath: '@/components/ui/button' },
      { component: 'Separator', subComponents: [], purpose: 'Section dividers', importPath: '@/components/ui/separator' },
    ],
    optional: [
      { component: 'Tooltip', subComponents: ['TooltipTrigger', 'TooltipContent', 'TooltipProvider'], purpose: 'Collapsed labels', importPath: '@/components/ui/tooltip' },
      { component: 'Collapsible', subComponents: ['CollapsibleTrigger', 'CollapsibleContent'], purpose: 'Collapsible sections', importPath: '@/components/ui/collapsible' },
      { component: 'Avatar', subComponents: ['AvatarImage', 'AvatarFallback'], purpose: 'User info', importPath: '@/components/ui/avatar' },
      { component: 'DropdownMenu', subComponents: ['DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem'], purpose: 'User menu', importPath: '@/components/ui/dropdown-menu' },
    ],
    additionalImports: ['lucide-react'],
  },
  {
    blockType: 'header',
    required: [
      { component: 'Button', subComponents: [], purpose: 'Actions', importPath: '@/components/ui/button' },
      { component: 'Input', subComponents: [], purpose: 'Search', importPath: '@/components/ui/input' },
    ],
    optional: [
      { component: 'Avatar', subComponents: ['AvatarImage', 'AvatarFallback'], purpose: 'User avatar', importPath: '@/components/ui/avatar' },
      { component: 'DropdownMenu', subComponents: ['DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuSeparator'], purpose: 'User menu', importPath: '@/components/ui/dropdown-menu' },
      { component: 'Badge', subComponents: [], purpose: 'Notifications', importPath: '@/components/ui/badge' },
      { component: 'Breadcrumb', subComponents: ['BreadcrumbList', 'BreadcrumbItem', 'BreadcrumbLink', 'BreadcrumbSeparator'], purpose: 'Navigation', importPath: '@/components/ui/breadcrumb' },
    ],
    additionalImports: ['lucide-react'],
  },
  {
    blockType: 'data-table',
    required: [
      { component: 'Table', subComponents: ['TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell'], purpose: 'Data display', importPath: '@/components/ui/table' },
      { component: 'Button', subComponents: [], purpose: 'Actions', importPath: '@/components/ui/button' },
    ],
    optional: [
      { component: 'Checkbox', subComponents: [], purpose: 'Row selection', importPath: '@/components/ui/checkbox' },
      { component: 'DropdownMenu', subComponents: ['DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem'], purpose: 'Row actions', importPath: '@/components/ui/dropdown-menu' },
      { component: 'Pagination', subComponents: ['PaginationContent', 'PaginationItem', 'PaginationPrevious', 'PaginationNext'], purpose: 'Pagination', importPath: '@/components/ui/pagination' },
      { component: 'Input', subComponents: [], purpose: 'Filtering', importPath: '@/components/ui/input' },
      { component: 'Select', subComponents: ['SelectTrigger', 'SelectContent', 'SelectItem', 'SelectValue'], purpose: 'Column filters', importPath: '@/components/ui/select' },
      { component: 'Badge', subComponents: [], purpose: 'Status badges', importPath: '@/components/ui/badge' },
    ],
    additionalImports: ['@tanstack/react-table', 'lucide-react'],
  },
  {
    blockType: 'metric-cards',
    required: [
      { component: 'Card', subComponents: ['CardHeader', 'CardTitle', 'CardContent'], purpose: 'Metric cards', importPath: '@/components/ui/card' },
    ],
    optional: [
      { component: 'Badge', subComponents: [], purpose: 'Change indicators', importPath: '@/components/ui/badge' },
      { component: 'Progress', subComponents: [], purpose: 'Progress bars', importPath: '@/components/ui/progress' },
    ],
    additionalImports: ['lucide-react'],
  },
  {
    blockType: 'chart-section',
    required: [
      { component: 'Card', subComponents: ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent'], purpose: 'Chart container', importPath: '@/components/ui/card' },
    ],
    optional: [
      { component: 'Tabs', subComponents: ['TabsList', 'TabsTrigger', 'TabsContent'], purpose: 'Chart switching', importPath: '@/components/ui/tabs' },
      { component: 'Select', subComponents: ['SelectTrigger', 'SelectContent', 'SelectItem', 'SelectValue'], purpose: 'Time range', importPath: '@/components/ui/select' },
    ],
    additionalImports: ['recharts', 'lucide-react'],
  },
  {
    blockType: 'activity-feed',
    required: [
      { component: 'Card', subComponents: ['CardHeader', 'CardTitle', 'CardContent'], purpose: 'Feed container', importPath: '@/components/ui/card' },
      { component: 'Avatar', subComponents: ['AvatarImage', 'AvatarFallback'], purpose: 'User avatars', importPath: '@/components/ui/avatar' },
    ],
    optional: [
      { component: 'ScrollArea', subComponents: [], purpose: 'Scrollable feed', importPath: '@/components/ui/scroll-area' },
      { component: 'Badge', subComponents: [], purpose: 'Activity types', importPath: '@/components/ui/badge' },
    ],
    additionalImports: ['lucide-react'],
  },
  {
    blockType: 'settings-panel',
    required: [
      { component: 'Card', subComponents: ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'], purpose: 'Settings sections', importPath: '@/components/ui/card' },
      { component: 'Button', subComponents: [], purpose: 'Actions', importPath: '@/components/ui/button' },
      { component: 'Input', subComponents: [], purpose: 'Text inputs', importPath: '@/components/ui/input' },
      { component: 'Label', subComponents: [], purpose: 'Field labels', importPath: '@/components/ui/label' },
    ],
    optional: [
      { component: 'Switch', subComponents: [], purpose: 'Toggles', importPath: '@/components/ui/switch' },
      { component: 'Select', subComponents: ['SelectTrigger', 'SelectContent', 'SelectItem', 'SelectValue'], purpose: 'Dropdowns', importPath: '@/components/ui/select' },
      { component: 'Textarea', subComponents: [], purpose: 'Long text', importPath: '@/components/ui/textarea' },
      { component: 'Tabs', subComponents: ['TabsList', 'TabsTrigger', 'TabsContent'], purpose: 'Settings tabs', importPath: '@/components/ui/tabs' },
      { component: 'Separator', subComponents: [], purpose: 'Dividers', importPath: '@/components/ui/separator' },
      { component: 'Avatar', subComponents: ['AvatarImage', 'AvatarFallback'], purpose: 'Profile picture', importPath: '@/components/ui/avatar' },
    ],
    additionalImports: ['lucide-react'],
  },
  {
    blockType: 'command-palette',
    required: [
      { component: 'Command', subComponents: ['CommandInput', 'CommandList', 'CommandEmpty', 'CommandGroup', 'CommandItem', 'CommandSeparator'], purpose: 'Command menu', importPath: '@/components/ui/command' },
      { component: 'Dialog', subComponents: ['DialogContent'], purpose: 'Modal container', importPath: '@/components/ui/dialog' },
    ],
    optional: [
      { component: 'Badge', subComponents: [], purpose: 'Shortcuts', importPath: '@/components/ui/badge' },
    ],
    additionalImports: ['lucide-react'],
  },

  // Shared blocks
  {
    blockType: 'auth',
    required: [
      { component: 'Card', subComponents: ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'], purpose: 'Auth card', importPath: '@/components/ui/card' },
      { component: 'Button', subComponents: [], purpose: 'Submit/OAuth', importPath: '@/components/ui/button' },
      { component: 'Input', subComponents: [], purpose: 'Form fields', importPath: '@/components/ui/input' },
      { component: 'Label', subComponents: [], purpose: 'Field labels', importPath: '@/components/ui/label' },
    ],
    optional: [
      { component: 'Checkbox', subComponents: [], purpose: 'Remember me', importPath: '@/components/ui/checkbox' },
      { component: 'Separator', subComponents: [], purpose: 'Dividers', importPath: '@/components/ui/separator' },
      { component: 'Tabs', subComponents: ['TabsList', 'TabsTrigger', 'TabsContent'], purpose: 'Login/Register', importPath: '@/components/ui/tabs' },
    ],
    additionalImports: ['lucide-react'],
  },
  {
    blockType: 'empty-state',
    required: [
      { component: 'Button', subComponents: [], purpose: 'Action button', importPath: '@/components/ui/button' },
    ],
    optional: [],
    additionalImports: ['lucide-react'],
  },
  {
    blockType: 'error-page',
    required: [
      { component: 'Button', subComponents: [], purpose: 'Navigation', importPath: '@/components/ui/button' },
    ],
    optional: [],
    additionalImports: ['lucide-react'],
  },
  {
    blockType: 'loading',
    required: [
      { component: 'Skeleton', subComponents: [], purpose: 'Loading placeholder', importPath: '@/components/ui/skeleton' },
    ],
    optional: [
      { component: 'Progress', subComponents: [], purpose: 'Progress bar', importPath: '@/components/ui/progress' },
    ],
    additionalImports: [],
  },
];

// =============================================================================
// COMPONENT KNOWLEDGE CLASS
// =============================================================================

export class ShadcnComponentKnowledge {
  private config: ShadcnConfig;
  private mappings: Map<BlockType, BlockComponentMapping>;

  constructor(config: ShadcnConfig) {
    this.config = config;
    this.mappings = new Map(
      BLOCK_COMPONENT_MAPPINGS.map(m => [m.blockType, m])
    );
  }

  /**
   * Get components needed for a block type
   */
  getComponentsForBlock(blockType: BlockType): BlockComponentMapping | undefined {
    return this.mappings.get(blockType);
  }

  /**
   * Get all required components for a block
   */
  getRequiredComponents(blockType: BlockType): ShadcnComponent[] {
    const mapping = this.mappings.get(blockType);
    return mapping?.required.map(r => r.component) || [];
  }

  /**
   * Check which components are missing for a block
   */
  getMissingComponents(blockType: BlockType): ShadcnComponent[] {
    const required = this.getRequiredComponents(blockType);
    return required.filter(c => !this.config.installedComponents.includes(c));
  }

  /**
   * Get install command for missing components
   */
  getInstallCommand(blockType: BlockType): string | null {
    const missing = this.getMissingComponents(blockType);
    if (missing.length === 0) return null;

    const names = missing.map(c => this.componentToCliName(c));
    return `npx shadcn@latest add ${names.join(' ')}`;
  }

  /**
   * Generate import statements for a block
   */
  generateImports(blockType: BlockType, includeOptional: boolean = false): string[] {
    const mapping = this.mappings.get(blockType);
    if (!mapping) return [];

    const components = includeOptional
      ? [...mapping.required, ...mapping.optional]
      : mapping.required;

    const imports: string[] = [];
    const componentAlias = this.config.componentAlias || '@/components';

    for (const usage of components) {
      if (this.config.installedComponents.includes(usage.component)) {
        const allImports = [usage.component, ...usage.subComponents];
        const importPath = usage.importPath.replace('@/components', componentAlias);
        imports.push(`import { ${allImports.join(', ')} } from "${importPath}";`);
      }
    }

    // Add additional imports
    for (const pkg of mapping.additionalImports) {
      if (pkg === 'lucide-react') {
        imports.push(`import { /* icons */ } from "lucide-react";`);
      } else if (pkg === 'recharts') {
        imports.push(`import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";`);
      } else if (pkg === '@tanstack/react-table') {
        imports.push(`import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";`);
      }
    }

    return imports;
  }

  /**
   * Get npm packages needed for a block
   */
  getNpmDependencies(blockType: BlockType): string[] {
    const mapping = this.mappings.get(blockType);
    if (!mapping) return [];

    const deps: string[] = [];

    // Check for recharts
    if (mapping.additionalImports.includes('recharts')) {
      deps.push('recharts');
    }

    // Check for tanstack table
    if (mapping.additionalImports.includes('@tanstack/react-table')) {
      deps.push('@tanstack/react-table');
    }

    // Check for embla carousel (used by Carousel component)
    if (mapping.required.some(r => r.component === 'Carousel') ||
        mapping.optional.some(o => o.component === 'Carousel')) {
      deps.push('embla-carousel-react');
    }

    // Check for cmdk (used by Command component)
    if (mapping.required.some(r => r.component === 'Command') ||
        mapping.optional.some(o => o.component === 'Command')) {
      deps.push('cmdk');
    }

    return deps;
  }

  /**
   * Convert component name to CLI name
   */
  private componentToCliName(component: ShadcnComponent): string {
    // Convert PascalCase to kebab-case
    return component
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }
}

// =============================================================================
// COMPONENT CODE TEMPLATES
// =============================================================================

/**
 * Get basic code template for a component
 */
export function getComponentTemplate(component: ShadcnComponent): string {
  const templates: Partial<Record<ShadcnComponent, string>> = {
    Button: `<Button variant="default" size="default">Click me</Button>`,
    Card: `<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`,
    Input: `<Input type="text" placeholder="Enter text..." />`,
    Avatar: `<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>UN</AvatarFallback>
</Avatar>`,
    Badge: `<Badge variant="default">Badge</Badge>`,
    Table: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Cell</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
    Accordion: `<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
    Dialog: `<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>`,
    Tabs: `<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>`,
    Select: `<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>`,
  };

  return templates[component] || `<${component} />`;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create component knowledge from config
 */
export function createComponentKnowledge(config: ShadcnConfig): ShadcnComponentKnowledge {
  return new ShadcnComponentKnowledge(config);
}

/**
 * Get all blocks that can be generated with current components
 */
export function getAvailableBlocks(config: ShadcnConfig): BlockType[] {
  const knowledge = new ShadcnComponentKnowledge(config);
  const available: BlockType[] = [];

  for (const mapping of BLOCK_COMPONENT_MAPPINGS) {
    const missing = knowledge.getMissingComponents(mapping.blockType);
    if (missing.length === 0) {
      available.push(mapping.blockType);
    }
  }

  return available;
}

/**
 * Get blocks grouped by installation status
 */
export function getBlocksByInstallStatus(config: ShadcnConfig): {
  ready: BlockType[];
  partial: { block: BlockType; missing: ShadcnComponent[] }[];
  notAvailable: BlockType[];
} {
  const knowledge = new ShadcnComponentKnowledge(config);
  const ready: BlockType[] = [];
  const partial: { block: BlockType; missing: ShadcnComponent[] }[] = [];
  const notAvailable: BlockType[] = [];

  for (const mapping of BLOCK_COMPONENT_MAPPINGS) {
    const missing = knowledge.getMissingComponents(mapping.blockType);

    if (missing.length === 0) {
      ready.push(mapping.blockType);
    } else if (missing.length < mapping.required.length) {
      partial.push({ block: mapping.blockType, missing });
    } else {
      notAvailable.push(mapping.blockType);
    }
  }

  return { ready, partial, notAvailable };
}
