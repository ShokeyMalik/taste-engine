/**
 * shadcn/ui Detector
 *
 * Detects shadcn/ui presence and configuration in a codebase.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ShadcnConfig, ShadcnComponentsJson, ShadcnComponent } from './types';

// =============================================================================
// DETECTION FUNCTIONS
// =============================================================================

/**
 * Detect shadcn/ui configuration in a codebase
 */
export async function detectShadcn(repoPath: string): Promise<ShadcnConfig> {
  const defaultConfig: ShadcnConfig = {
    detected: false,
    installedComponents: [],
    style: 'default',
    rsc: false,
    tsx: true,
    cssVariables: true,
    iconLibrary: 'lucide',
    componentAlias: '@/components',
    utilsAlias: '@/lib/utils',
  };

  try {
    // Check for components.json
    const componentsJsonPath = path.join(repoPath, 'components.json');
    if (fs.existsSync(componentsJsonPath)) {
      const componentsJson = JSON.parse(
        fs.readFileSync(componentsJsonPath, 'utf-8')
      ) as ShadcnComponentsJson;

      // Parse the configuration
      const config: ShadcnConfig = {
        detected: true,
        configPath: componentsJsonPath,
        style: componentsJson.style || 'default',
        rsc: componentsJson.rsc ?? false,
        tsx: componentsJson.tsx ?? true,
        cssVariables: componentsJson.tailwind?.cssVariables ?? true,
        cssPrefix: componentsJson.tailwind?.prefix,
        tailwindCssPath: componentsJson.tailwind?.css
          ? path.join(repoPath, componentsJson.tailwind.css)
          : undefined,
        tailwindConfigPath: componentsJson.tailwind?.config
          ? path.join(repoPath, componentsJson.tailwind.config)
          : undefined,
        tailwindBaseColor: componentsJson.tailwind?.baseColor,
        iconLibrary: componentsJson.iconLibrary || 'lucide',
        componentAlias: componentsJson.aliases?.components || '@/components',
        utilsAlias: componentsJson.aliases?.utils || '@/lib/utils',
        installedComponents: [],
      };

      // Resolve component and utils paths
      config.componentsPath = resolveAlias(
        config.componentAlias,
        repoPath
      );
      config.utilsPath = resolveAlias(config.utilsAlias, repoPath);
      config.libPath = componentsJson.aliases?.lib
        ? resolveAlias(componentsJson.aliases.lib, repoPath)
        : undefined;

      // Detect installed components
      const uiPath = path.join(
        config.componentsPath || path.join(repoPath, 'src/components'),
        'ui'
      );
      if (fs.existsSync(uiPath)) {
        config.installedComponents = detectInstalledComponents(uiPath);
      }

      return config;
    }

    // Fallback: Check for common shadcn patterns without components.json
    const fallbackConfig = await detectShadcnFallback(repoPath);
    if (fallbackConfig.detected) {
      return fallbackConfig;
    }

    return defaultConfig;
  } catch (error) {
    console.warn('Error detecting shadcn:', error);
    return defaultConfig;
  }
}

/**
 * Fallback detection when components.json is not present
 */
async function detectShadcnFallback(repoPath: string): Promise<ShadcnConfig> {
  const defaultConfig: ShadcnConfig = {
    detected: false,
    installedComponents: [],
    style: 'default',
    rsc: false,
    tsx: true,
    cssVariables: true,
    iconLibrary: 'lucide',
    componentAlias: '@/components',
    utilsAlias: '@/lib/utils',
  };

  // Common UI component paths
  const possibleUiPaths = [
    path.join(repoPath, 'src/components/ui'),
    path.join(repoPath, 'components/ui'),
    path.join(repoPath, 'app/components/ui'),
  ];

  for (const uiPath of possibleUiPaths) {
    if (fs.existsSync(uiPath)) {
      const components = detectInstalledComponents(uiPath);
      if (components.length > 0) {
        // Check if it looks like shadcn (has cn utility, uses CVA patterns)
        const isShadcn = await verifyShadcnPatterns(uiPath);
        if (isShadcn) {
          return {
            ...defaultConfig,
            detected: true,
            componentsPath: path.dirname(uiPath),
            installedComponents: components,
          };
        }
      }
    }
  }

  return defaultConfig;
}

/**
 * Verify that detected components follow shadcn patterns
 */
async function verifyShadcnPatterns(uiPath: string): Promise<boolean> {
  try {
    const files = fs.readdirSync(uiPath);

    // Check a few files for shadcn patterns
    for (const file of files.slice(0, 3)) {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(path.join(uiPath, file), 'utf-8');

        // Look for shadcn patterns
        const hasCn = content.includes('import { cn }') || content.includes('from "@/lib/utils"');
        const hasCva = content.includes('class-variance-authority') || content.includes('cva(');
        const hasRadix = content.includes('@radix-ui');

        if (hasCn || hasCva || hasRadix) {
          return true;
        }
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Detect which shadcn components are installed
 */
function detectInstalledComponents(uiPath: string): ShadcnComponent[] {
  const components: ShadcnComponent[] = [];

  try {
    const files = fs.readdirSync(uiPath);

    // Map file names to component names
    const fileToComponent: Record<string, ShadcnComponent> = {
      'accordion.tsx': 'Accordion',
      'alert.tsx': 'Alert',
      'alert-dialog.tsx': 'AlertDialog',
      'aspect-ratio.tsx': 'AspectRatio',
      'avatar.tsx': 'Avatar',
      'badge.tsx': 'Badge',
      'breadcrumb.tsx': 'Breadcrumb',
      'button.tsx': 'Button',
      'calendar.tsx': 'Calendar',
      'card.tsx': 'Card',
      'carousel.tsx': 'Carousel',
      'chart.tsx': 'Chart',
      'checkbox.tsx': 'Checkbox',
      'collapsible.tsx': 'Collapsible',
      'command.tsx': 'Command',
      'context-menu.tsx': 'ContextMenu',
      'data-table.tsx': 'DataTable',
      'date-picker.tsx': 'DatePicker',
      'dialog.tsx': 'Dialog',
      'drawer.tsx': 'Drawer',
      'dropdown-menu.tsx': 'DropdownMenu',
      'form.tsx': 'Form',
      'hover-card.tsx': 'HoverCard',
      'input.tsx': 'Input',
      'input-otp.tsx': 'InputOTP',
      'label.tsx': 'Label',
      'menubar.tsx': 'Menubar',
      'navigation-menu.tsx': 'NavigationMenu',
      'pagination.tsx': 'Pagination',
      'popover.tsx': 'Popover',
      'progress.tsx': 'Progress',
      'radio-group.tsx': 'RadioGroup',
      'resizable.tsx': 'ResizablePanel',
      'scroll-area.tsx': 'ScrollArea',
      'select.tsx': 'Select',
      'separator.tsx': 'Separator',
      'sheet.tsx': 'Sheet',
      'sidebar.tsx': 'Sidebar',
      'skeleton.tsx': 'Skeleton',
      'slider.tsx': 'Slider',
      'sonner.tsx': 'Sonner',
      'switch.tsx': 'Switch',
      'table.tsx': 'Table',
      'tabs.tsx': 'Tabs',
      'textarea.tsx': 'Textarea',
      'toast.tsx': 'Toast',
      'tooltip.tsx': 'Tooltip',
    };

    for (const file of files) {
      const component = fileToComponent[file];
      if (component) {
        components.push(component);
      }
    }
  } catch {
    // Ignore errors
  }

  return components;
}

/**
 * Resolve an alias path to an absolute path
 */
function resolveAlias(alias: string, repoPath: string): string {
  // Handle @/ prefix
  if (alias.startsWith('@/')) {
    const relativePath = alias.slice(2);

    // Check common source directories
    const possiblePaths = [
      path.join(repoPath, 'src', relativePath),
      path.join(repoPath, relativePath),
      path.join(repoPath, 'app', relativePath),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }

    // Default to src
    return path.join(repoPath, 'src', relativePath);
  }

  // Handle ~/ prefix
  if (alias.startsWith('~/')) {
    return path.join(repoPath, alias.slice(2));
  }

  // Assume relative to repo
  return path.join(repoPath, alias);
}

// =============================================================================
// UTILITY DETECTION
// =============================================================================

/**
 * Check if the cn utility function exists
 */
export async function detectCnUtility(config: ShadcnConfig, repoPath: string): Promise<{
  exists: boolean;
  path?: string;
  importStatement?: string;
}> {
  if (!config.detected) {
    return { exists: false };
  }

  // Check utils path
  const possiblePaths = [
    config.utilsPath,
    path.join(repoPath, 'src/lib/utils.ts'),
    path.join(repoPath, 'lib/utils.ts'),
    path.join(repoPath, 'src/lib/utils.tsx'),
    path.join(repoPath, 'src/utils.ts'),
  ].filter(Boolean) as string[];

  for (const utilsPath of possiblePaths) {
    if (fs.existsSync(utilsPath)) {
      const content = fs.readFileSync(utilsPath, 'utf-8');
      if (content.includes('export function cn') || content.includes('export const cn')) {
        return {
          exists: true,
          path: utilsPath,
          importStatement: `import { cn } from "${config.utilsAlias}"`,
        };
      }
    }
  }

  return { exists: false };
}

/**
 * Get the import statement for a shadcn component
 */
export function getComponentImport(
  component: ShadcnComponent,
  subComponents: string[],
  config: ShadcnConfig
): string {
  const allComponents = [component, ...subComponents];
  const uiAlias = config.componentAlias.endsWith('/ui')
    ? config.componentAlias
    : `${config.componentAlias}/ui`;

  const fileName = component.toLowerCase().replace(/([A-Z])/g, (m, p1, offset) =>
    offset > 0 ? `-${p1.toLowerCase()}` : p1.toLowerCase()
  );

  return `import { ${allComponents.join(', ')} } from "${uiAlias}/${fileName}"`;
}

// =============================================================================
// EXPORT DETECTOR CLASS
// =============================================================================

export class ShadcnDetector {
  private config: ShadcnConfig | null = null;
  private repoPath: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;
  }

  async detect(): Promise<ShadcnConfig> {
    if (!this.config) {
      this.config = await detectShadcn(this.repoPath);
    }
    return this.config;
  }

  async isInstalled(component: ShadcnComponent): Promise<boolean> {
    const config = await this.detect();
    return config.installedComponents.includes(component);
  }

  async getMissingComponents(required: ShadcnComponent[]): Promise<ShadcnComponent[]> {
    const config = await this.detect();
    return required.filter((c) => !config.installedComponents.includes(c));
  }

  async getInstallCommand(components: ShadcnComponent[]): Promise<string> {
    const missing = await this.getMissingComponents(components);
    if (missing.length === 0) return '';

    const componentNames = missing.map((c) =>
      c.toLowerCase().replace(/([A-Z])/g, (m, p1, offset) =>
        offset > 0 ? `-${p1.toLowerCase()}` : p1.toLowerCase()
      )
    );

    return `npx shadcn@latest add ${componentNames.join(' ')}`;
  }

  getConfig(): ShadcnConfig | null {
    return this.config;
  }
}
