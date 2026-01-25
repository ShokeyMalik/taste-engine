/**
 * shadcn/ui Integration Types
 *
 * Type definitions for detecting and working with shadcn/ui components.
 */

// =============================================================================
// SHADCN CONFIGURATION
// =============================================================================

/**
 * shadcn/ui components.json configuration structure
 */
export interface ShadcnComponentsJson {
  $schema?: string;
  style: 'default' | 'new-york';
  rsc: boolean;
  tsx: boolean;
  tailwind: {
    config: string;
    css: string;
    baseColor: string;
    cssVariables: boolean;
    prefix?: string;
  };
  aliases: {
    components: string;
    utils: string;
    ui?: string;
    lib?: string;
    hooks?: string;
  };
  iconLibrary?: 'lucide' | 'radix-icons';
}

/**
 * Detected shadcn configuration in a codebase
 */
export interface ShadcnConfig {
  /** Whether shadcn was detected */
  detected: boolean;
  /** Path to components.json */
  configPath?: string;
  /** Path to UI components directory */
  componentsPath?: string;
  /** Path to utils (cn function) */
  utilsPath?: string;
  /** Path to lib directory */
  libPath?: string;
  /** List of installed shadcn components */
  installedComponents: string[];
  /** Style variant being used */
  style: 'default' | 'new-york';
  /** Whether using React Server Components */
  rsc: boolean;
  /** Whether using TypeScript */
  tsx: boolean;
  /** Tailwind CSS file path */
  tailwindCssPath?: string;
  /** Tailwind config path */
  tailwindConfigPath?: string;
  /** Base color theme */
  tailwindBaseColor?: string;
  /** Whether using CSS variables */
  cssVariables: boolean;
  /** CSS variable prefix */
  cssPrefix?: string;
  /** Icon library in use */
  iconLibrary: 'lucide' | 'radix-icons';
  /** Component import alias */
  componentAlias: string;
  /** Utils import alias */
  utilsAlias: string;
}

// =============================================================================
// SHADCN COMPONENTS
// =============================================================================

/**
 * All available shadcn/ui components
 */
export type ShadcnComponent =
  // Layout
  | 'Accordion'
  | 'AspectRatio'
  | 'Card'
  | 'Collapsible'
  | 'ResizablePanel'
  | 'ScrollArea'
  | 'Separator'
  | 'Sheet'
  | 'Sidebar'
  | 'Tabs'
  // Forms
  | 'Button'
  | 'Calendar'
  | 'Checkbox'
  | 'Combobox'
  | 'DatePicker'
  | 'Form'
  | 'Input'
  | 'InputOTP'
  | 'Label'
  | 'RadioGroup'
  | 'Select'
  | 'Slider'
  | 'Switch'
  | 'Textarea'
  // Data Display
  | 'Avatar'
  | 'Badge'
  | 'Table'
  | 'DataTable'
  // Feedback
  | 'Alert'
  | 'AlertDialog'
  | 'Progress'
  | 'Skeleton'
  | 'Sonner'
  | 'Toast'
  | 'Tooltip'
  // Navigation
  | 'Breadcrumb'
  | 'Command'
  | 'ContextMenu'
  | 'DropdownMenu'
  | 'Menubar'
  | 'NavigationMenu'
  | 'Pagination'
  // Overlay
  | 'Dialog'
  | 'Drawer'
  | 'HoverCard'
  | 'Popover'
  // Charts (shadcn charts)
  | 'Chart'
  | 'ChartContainer'
  | 'ChartTooltip'
  | 'ChartLegend'
  // Carousel
  | 'Carousel';

/**
 * Component metadata for a shadcn component
 */
export interface ShadcnComponentInfo {
  /** Component name */
  name: ShadcnComponent;
  /** File name (e.g., 'button.tsx') */
  fileName: string;
  /** npm dependencies required */
  dependencies: string[];
  /** Radix primitive it's built on (if any) */
  radixPrimitive?: string;
  /** Sub-components exported */
  subComponents: string[];
  /** Whether it has variants via CVA */
  hasVariants: boolean;
  /** Category for organization */
  category: 'layout' | 'forms' | 'data-display' | 'feedback' | 'navigation' | 'overlay' | 'charts';
}

/**
 * Registry of all shadcn components with their metadata
 */
export const SHADCN_COMPONENTS: Record<ShadcnComponent, ShadcnComponentInfo> = {
  // Layout
  Accordion: {
    name: 'Accordion',
    fileName: 'accordion.tsx',
    dependencies: ['@radix-ui/react-accordion'],
    radixPrimitive: 'Accordion',
    subComponents: ['AccordionItem', 'AccordionTrigger', 'AccordionContent'],
    hasVariants: false,
    category: 'layout',
  },
  AspectRatio: {
    name: 'AspectRatio',
    fileName: 'aspect-ratio.tsx',
    dependencies: ['@radix-ui/react-aspect-ratio'],
    radixPrimitive: 'AspectRatio',
    subComponents: [],
    hasVariants: false,
    category: 'layout',
  },
  Card: {
    name: 'Card',
    fileName: 'card.tsx',
    dependencies: [],
    subComponents: ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'],
    hasVariants: false,
    category: 'layout',
  },
  Collapsible: {
    name: 'Collapsible',
    fileName: 'collapsible.tsx',
    dependencies: ['@radix-ui/react-collapsible'],
    radixPrimitive: 'Collapsible',
    subComponents: ['CollapsibleTrigger', 'CollapsibleContent'],
    hasVariants: false,
    category: 'layout',
  },
  ResizablePanel: {
    name: 'ResizablePanel',
    fileName: 'resizable.tsx',
    dependencies: ['react-resizable-panels'],
    subComponents: ['ResizablePanelGroup', 'ResizableHandle'],
    hasVariants: false,
    category: 'layout',
  },
  ScrollArea: {
    name: 'ScrollArea',
    fileName: 'scroll-area.tsx',
    dependencies: ['@radix-ui/react-scroll-area'],
    radixPrimitive: 'ScrollArea',
    subComponents: ['ScrollBar'],
    hasVariants: false,
    category: 'layout',
  },
  Separator: {
    name: 'Separator',
    fileName: 'separator.tsx',
    dependencies: ['@radix-ui/react-separator'],
    radixPrimitive: 'Separator',
    subComponents: [],
    hasVariants: false,
    category: 'layout',
  },
  Sheet: {
    name: 'Sheet',
    fileName: 'sheet.tsx',
    dependencies: ['@radix-ui/react-dialog'],
    radixPrimitive: 'Dialog',
    subComponents: ['SheetTrigger', 'SheetContent', 'SheetHeader', 'SheetTitle', 'SheetDescription', 'SheetFooter', 'SheetClose'],
    hasVariants: true,
    category: 'layout',
  },
  Sidebar: {
    name: 'Sidebar',
    fileName: 'sidebar.tsx',
    dependencies: [],
    subComponents: ['SidebarProvider', 'SidebarContent', 'SidebarGroup', 'SidebarGroupLabel', 'SidebarGroupContent', 'SidebarMenu', 'SidebarMenuItem', 'SidebarMenuButton', 'SidebarTrigger', 'SidebarInset'],
    hasVariants: true,
    category: 'layout',
  },
  Tabs: {
    name: 'Tabs',
    fileName: 'tabs.tsx',
    dependencies: ['@radix-ui/react-tabs'],
    radixPrimitive: 'Tabs',
    subComponents: ['TabsList', 'TabsTrigger', 'TabsContent'],
    hasVariants: false,
    category: 'layout',
  },

  // Forms
  Button: {
    name: 'Button',
    fileName: 'button.tsx',
    dependencies: ['@radix-ui/react-slot'],
    subComponents: [],
    hasVariants: true,
    category: 'forms',
  },
  Calendar: {
    name: 'Calendar',
    fileName: 'calendar.tsx',
    dependencies: ['react-day-picker', 'date-fns'],
    subComponents: [],
    hasVariants: false,
    category: 'forms',
  },
  Checkbox: {
    name: 'Checkbox',
    fileName: 'checkbox.tsx',
    dependencies: ['@radix-ui/react-checkbox'],
    radixPrimitive: 'Checkbox',
    subComponents: [],
    hasVariants: false,
    category: 'forms',
  },
  Combobox: {
    name: 'Combobox',
    fileName: 'combobox.tsx',
    dependencies: ['cmdk'],
    subComponents: [],
    hasVariants: false,
    category: 'forms',
  },
  DatePicker: {
    name: 'DatePicker',
    fileName: 'date-picker.tsx',
    dependencies: ['react-day-picker', 'date-fns'],
    subComponents: [],
    hasVariants: false,
    category: 'forms',
  },
  Form: {
    name: 'Form',
    fileName: 'form.tsx',
    dependencies: ['react-hook-form', '@hookform/resolvers', 'zod'],
    subComponents: ['FormField', 'FormItem', 'FormLabel', 'FormControl', 'FormDescription', 'FormMessage'],
    hasVariants: false,
    category: 'forms',
  },
  Input: {
    name: 'Input',
    fileName: 'input.tsx',
    dependencies: [],
    subComponents: [],
    hasVariants: false,
    category: 'forms',
  },
  InputOTP: {
    name: 'InputOTP',
    fileName: 'input-otp.tsx',
    dependencies: ['input-otp'],
    subComponents: ['InputOTPGroup', 'InputOTPSlot', 'InputOTPSeparator'],
    hasVariants: false,
    category: 'forms',
  },
  Label: {
    name: 'Label',
    fileName: 'label.tsx',
    dependencies: ['@radix-ui/react-label'],
    radixPrimitive: 'Label',
    subComponents: [],
    hasVariants: false,
    category: 'forms',
  },
  RadioGroup: {
    name: 'RadioGroup',
    fileName: 'radio-group.tsx',
    dependencies: ['@radix-ui/react-radio-group'],
    radixPrimitive: 'RadioGroup',
    subComponents: ['RadioGroupItem'],
    hasVariants: false,
    category: 'forms',
  },
  Select: {
    name: 'Select',
    fileName: 'select.tsx',
    dependencies: ['@radix-ui/react-select'],
    radixPrimitive: 'Select',
    subComponents: ['SelectTrigger', 'SelectContent', 'SelectItem', 'SelectValue', 'SelectGroup', 'SelectLabel', 'SelectSeparator'],
    hasVariants: false,
    category: 'forms',
  },
  Slider: {
    name: 'Slider',
    fileName: 'slider.tsx',
    dependencies: ['@radix-ui/react-slider'],
    radixPrimitive: 'Slider',
    subComponents: [],
    hasVariants: false,
    category: 'forms',
  },
  Switch: {
    name: 'Switch',
    fileName: 'switch.tsx',
    dependencies: ['@radix-ui/react-switch'],
    radixPrimitive: 'Switch',
    subComponents: [],
    hasVariants: false,
    category: 'forms',
  },
  Textarea: {
    name: 'Textarea',
    fileName: 'textarea.tsx',
    dependencies: [],
    subComponents: [],
    hasVariants: false,
    category: 'forms',
  },

  // Data Display
  Avatar: {
    name: 'Avatar',
    fileName: 'avatar.tsx',
    dependencies: ['@radix-ui/react-avatar'],
    radixPrimitive: 'Avatar',
    subComponents: ['AvatarImage', 'AvatarFallback'],
    hasVariants: false,
    category: 'data-display',
  },
  Badge: {
    name: 'Badge',
    fileName: 'badge.tsx',
    dependencies: [],
    subComponents: [],
    hasVariants: true,
    category: 'data-display',
  },
  Table: {
    name: 'Table',
    fileName: 'table.tsx',
    dependencies: [],
    subComponents: ['TableHeader', 'TableBody', 'TableFooter', 'TableHead', 'TableRow', 'TableCell', 'TableCaption'],
    hasVariants: false,
    category: 'data-display',
  },
  DataTable: {
    name: 'DataTable',
    fileName: 'data-table.tsx',
    dependencies: ['@tanstack/react-table'],
    subComponents: [],
    hasVariants: false,
    category: 'data-display',
  },

  // Feedback
  Alert: {
    name: 'Alert',
    fileName: 'alert.tsx',
    dependencies: [],
    subComponents: ['AlertTitle', 'AlertDescription'],
    hasVariants: true,
    category: 'feedback',
  },
  AlertDialog: {
    name: 'AlertDialog',
    fileName: 'alert-dialog.tsx',
    dependencies: ['@radix-ui/react-alert-dialog'],
    radixPrimitive: 'AlertDialog',
    subComponents: ['AlertDialogTrigger', 'AlertDialogContent', 'AlertDialogHeader', 'AlertDialogTitle', 'AlertDialogDescription', 'AlertDialogFooter', 'AlertDialogAction', 'AlertDialogCancel'],
    hasVariants: false,
    category: 'feedback',
  },
  Progress: {
    name: 'Progress',
    fileName: 'progress.tsx',
    dependencies: ['@radix-ui/react-progress'],
    radixPrimitive: 'Progress',
    subComponents: [],
    hasVariants: false,
    category: 'feedback',
  },
  Skeleton: {
    name: 'Skeleton',
    fileName: 'skeleton.tsx',
    dependencies: [],
    subComponents: [],
    hasVariants: false,
    category: 'feedback',
  },
  Sonner: {
    name: 'Sonner',
    fileName: 'sonner.tsx',
    dependencies: ['sonner'],
    subComponents: [],
    hasVariants: false,
    category: 'feedback',
  },
  Toast: {
    name: 'Toast',
    fileName: 'toast.tsx',
    dependencies: ['@radix-ui/react-toast'],
    radixPrimitive: 'Toast',
    subComponents: ['ToastProvider', 'ToastViewport', 'ToastAction', 'ToastClose', 'ToastTitle', 'ToastDescription'],
    hasVariants: true,
    category: 'feedback',
  },
  Tooltip: {
    name: 'Tooltip',
    fileName: 'tooltip.tsx',
    dependencies: ['@radix-ui/react-tooltip'],
    radixPrimitive: 'Tooltip',
    subComponents: ['TooltipTrigger', 'TooltipContent', 'TooltipProvider'],
    hasVariants: false,
    category: 'feedback',
  },

  // Navigation
  Breadcrumb: {
    name: 'Breadcrumb',
    fileName: 'breadcrumb.tsx',
    dependencies: [],
    subComponents: ['BreadcrumbList', 'BreadcrumbItem', 'BreadcrumbLink', 'BreadcrumbPage', 'BreadcrumbSeparator', 'BreadcrumbEllipsis'],
    hasVariants: false,
    category: 'navigation',
  },
  Command: {
    name: 'Command',
    fileName: 'command.tsx',
    dependencies: ['cmdk'],
    subComponents: ['CommandDialog', 'CommandInput', 'CommandList', 'CommandEmpty', 'CommandGroup', 'CommandItem', 'CommandShortcut', 'CommandSeparator'],
    hasVariants: false,
    category: 'navigation',
  },
  ContextMenu: {
    name: 'ContextMenu',
    fileName: 'context-menu.tsx',
    dependencies: ['@radix-ui/react-context-menu'],
    radixPrimitive: 'ContextMenu',
    subComponents: ['ContextMenuTrigger', 'ContextMenuContent', 'ContextMenuItem', 'ContextMenuCheckboxItem', 'ContextMenuRadioItem', 'ContextMenuLabel', 'ContextMenuSeparator', 'ContextMenuShortcut', 'ContextMenuGroup', 'ContextMenuSub', 'ContextMenuSubContent', 'ContextMenuSubTrigger', 'ContextMenuRadioGroup'],
    hasVariants: false,
    category: 'navigation',
  },
  DropdownMenu: {
    name: 'DropdownMenu',
    fileName: 'dropdown-menu.tsx',
    dependencies: ['@radix-ui/react-dropdown-menu'],
    radixPrimitive: 'DropdownMenu',
    subComponents: ['DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuCheckboxItem', 'DropdownMenuRadioItem', 'DropdownMenuLabel', 'DropdownMenuSeparator', 'DropdownMenuShortcut', 'DropdownMenuGroup', 'DropdownMenuSub', 'DropdownMenuSubContent', 'DropdownMenuSubTrigger', 'DropdownMenuRadioGroup'],
    hasVariants: false,
    category: 'navigation',
  },
  Menubar: {
    name: 'Menubar',
    fileName: 'menubar.tsx',
    dependencies: ['@radix-ui/react-menubar'],
    radixPrimitive: 'Menubar',
    subComponents: ['MenubarMenu', 'MenubarTrigger', 'MenubarContent', 'MenubarItem', 'MenubarSeparator', 'MenubarLabel', 'MenubarCheckboxItem', 'MenubarRadioGroup', 'MenubarRadioItem', 'MenubarSub', 'MenubarSubContent', 'MenubarSubTrigger', 'MenubarShortcut'],
    hasVariants: false,
    category: 'navigation',
  },
  NavigationMenu: {
    name: 'NavigationMenu',
    fileName: 'navigation-menu.tsx',
    dependencies: ['@radix-ui/react-navigation-menu'],
    radixPrimitive: 'NavigationMenu',
    subComponents: ['NavigationMenuList', 'NavigationMenuItem', 'NavigationMenuContent', 'NavigationMenuTrigger', 'NavigationMenuLink', 'NavigationMenuIndicator', 'NavigationMenuViewport'],
    hasVariants: false,
    category: 'navigation',
  },
  Pagination: {
    name: 'Pagination',
    fileName: 'pagination.tsx',
    dependencies: [],
    subComponents: ['PaginationContent', 'PaginationEllipsis', 'PaginationItem', 'PaginationLink', 'PaginationNext', 'PaginationPrevious'],
    hasVariants: false,
    category: 'navigation',
  },

  // Overlay
  Dialog: {
    name: 'Dialog',
    fileName: 'dialog.tsx',
    dependencies: ['@radix-ui/react-dialog'],
    radixPrimitive: 'Dialog',
    subComponents: ['DialogTrigger', 'DialogContent', 'DialogHeader', 'DialogTitle', 'DialogDescription', 'DialogFooter', 'DialogClose'],
    hasVariants: false,
    category: 'overlay',
  },
  Drawer: {
    name: 'Drawer',
    fileName: 'drawer.tsx',
    dependencies: ['vaul'],
    subComponents: ['DrawerTrigger', 'DrawerContent', 'DrawerHeader', 'DrawerTitle', 'DrawerDescription', 'DrawerFooter', 'DrawerClose'],
    hasVariants: false,
    category: 'overlay',
  },
  HoverCard: {
    name: 'HoverCard',
    fileName: 'hover-card.tsx',
    dependencies: ['@radix-ui/react-hover-card'],
    radixPrimitive: 'HoverCard',
    subComponents: ['HoverCardTrigger', 'HoverCardContent'],
    hasVariants: false,
    category: 'overlay',
  },
  Popover: {
    name: 'Popover',
    fileName: 'popover.tsx',
    dependencies: ['@radix-ui/react-popover'],
    radixPrimitive: 'Popover',
    subComponents: ['PopoverTrigger', 'PopoverContent'],
    hasVariants: false,
    category: 'overlay',
  },

  // Charts
  Chart: {
    name: 'Chart',
    fileName: 'chart.tsx',
    dependencies: ['recharts'],
    subComponents: [],
    hasVariants: false,
    category: 'charts',
  },
  ChartContainer: {
    name: 'ChartContainer',
    fileName: 'chart.tsx',
    dependencies: ['recharts'],
    subComponents: [],
    hasVariants: false,
    category: 'charts',
  },
  ChartTooltip: {
    name: 'ChartTooltip',
    fileName: 'chart.tsx',
    dependencies: ['recharts'],
    subComponents: ['ChartTooltipContent'],
    hasVariants: false,
    category: 'charts',
  },
  ChartLegend: {
    name: 'ChartLegend',
    fileName: 'chart.tsx',
    dependencies: ['recharts'],
    subComponents: ['ChartLegendContent'],
    hasVariants: false,
    category: 'charts',
  },

  // Carousel
  Carousel: {
    name: 'Carousel',
    fileName: 'carousel.tsx',
    dependencies: ['embla-carousel-react'],
    subComponents: ['CarouselContent', 'CarouselItem', 'CarouselPrevious', 'CarouselNext'],
    hasVariants: false,
    category: 'layout',
  },
};

/**
 * Get all sub-components for a given component
 */
export function getSubComponents(component: ShadcnComponent): string[] {
  return SHADCN_COMPONENTS[component]?.subComponents ?? [];
}

/**
 * Get dependencies for a set of components
 */
export function getDependencies(components: ShadcnComponent[]): string[] {
  const deps = new Set<string>();
  for (const comp of components) {
    const info = SHADCN_COMPONENTS[comp];
    if (info) {
      for (const dep of info.dependencies) {
        deps.add(dep);
      }
    }
  }
  return Array.from(deps);
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: ShadcnComponentInfo['category']): ShadcnComponent[] {
  return (Object.entries(SHADCN_COMPONENTS) as [ShadcnComponent, ShadcnComponentInfo][])
    .filter(([_, info]) => info.category === category)
    .map(([name]) => name);
}
