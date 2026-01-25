/**
 * Page Composer
 *
 * Combines multiple blocks into cohesive pages.
 * Handles layout, spacing, shared tokens, and dependencies.
 */

import type {
  BlockType,
  PageCompositionInput,
  PageCompositionOutput,
  BlockPlacement,
  AppliedTuners,
  BlockComponentOutput,
  TailwindConfigExtension,
  ComponentLibrary,
} from '../blocks/types';
import type { InspirationProfile } from '../inspiration/inspiration-profile';

import { BlockGenerator } from './block-generator';
import { DEFAULT_TUNERS } from '../blocks/types';

// =============================================================================
// TYPES
// =============================================================================

export interface PageComposerConfig {
  /** Default component library */
  defaultLibrary: ComponentLibrary;
  /** Default inspiration profile */
  defaultProfile?: InspirationProfile;
  /** Default tuner values */
  defaultTuners?: AppliedTuners;
}

export interface ComposedBlock {
  /** Block type */
  blockType: BlockType;
  /** Variant used */
  variant: string;
  /** Generated code */
  code: string;
  /** Component name */
  componentName: string;
  /** File name */
  fileName: string;
}

// =============================================================================
// PAGE COMPOSER CLASS
// =============================================================================

export class PageComposer {
  private config: PageComposerConfig;
  private blockGenerator: BlockGenerator;

  constructor(config: Partial<PageComposerConfig> = {}) {
    this.config = {
      defaultLibrary: config.defaultLibrary || 'shadcn',
      defaultProfile: config.defaultProfile,
      defaultTuners: config.defaultTuners || DEFAULT_TUNERS,
    };

    this.blockGenerator = new BlockGenerator({
      defaultLibrary: this.config.defaultLibrary,
      defaultProfile: this.config.defaultProfile,
      defaultTuners: this.config.defaultTuners,
    });
  }

  /**
   * Compose a full page from block placements
   */
  async compose(input: PageCompositionInput): Promise<PageCompositionOutput> {
    const tuners = input.tuners || this.config.defaultTuners || DEFAULT_TUNERS;
    const blockComponents: BlockComponentOutput[] = [];
    const allDependencies: Set<string> = new Set();
    const allCssVariables: Record<string, string> = {};

    // Sort blocks by order
    const sortedBlocks = [...input.blocks].sort((a, b) => a.order - b.order);

    // Generate each block
    for (const placement of sortedBlocks) {
      const result = await this.blockGenerator.generate({
        blockType: placement.blockType,
        variant: placement.variant || '',
        context: input.context,
        tuners,
        componentLibrary: this.config.defaultLibrary,
        content: placement.content,
      });

      blockComponents.push({
        componentName: result.componentName,
        fileName: result.fileName,
        code: result.code,
        blockType: placement.blockType,
        variant: result.variantUsed,
      });

      // Collect dependencies
      for (const dep of result.dependencies) {
        allDependencies.add(dep);
      }

      // Collect CSS variables
      if (result.cssVariables) {
        Object.assign(allCssVariables, result.cssVariables);
      }
    }

    // Generate page component
    const pageCode = this.generatePageComponent(input, blockComponents, tuners);

    // Create tailwind config extension
    const tailwindConfig: TailwindConfigExtension = {
      theme: {
        extend: {},
      },
    };

    return {
      pageCode,
      fileName: this.generatePageFileName(input.name),
      blockComponents,
      dependencies: Array.from(allDependencies),
      tailwindConfig,
      cssVariables: allCssVariables,
      explanation: `Page composed with ${blockComponents.length} blocks for ${input.context} context.`,
    };
  }

  /**
   * Generate the main page component code
   */
  private generatePageComponent(
    input: PageCompositionInput,
    blocks: BlockComponentOutput[],
    tuners: AppliedTuners
  ): string {
    const imports = blocks.map(
      (block) => `import { ${block.componentName} } from "./components/${block.fileName.replace('.tsx', '')}";`
    ).join('\n');

    const blockRenders = blocks.map((block) => {
      return `      <${block.componentName} />`;
    }).join('\n');

    const spacing = this.getPageSpacing(input.layout.spacing);
    const maxWidth = this.getMaxWidthClass(input.layout.maxWidth);

    return `"use client";

${imports}

export default function ${input.name}() {
  return (
    <main className="min-h-screen bg-background">
      <div className="${maxWidth} mx-auto ${spacing}">
${blockRenders}
      </div>
    </main>
  );
}
`;
  }

  /**
   * Generate page file name
   */
  private generatePageFileName(name: string): string {
    return name
      .replace(/([A-Z])/g, (m, p1, offset) =>
        offset > 0 ? `-${p1.toLowerCase()}` : p1.toLowerCase()
      ) + '.tsx';
  }

  /**
   * Get page-level spacing
   */
  private getPageSpacing(spacing: 'tight' | 'normal' | 'spacious'): string {
    switch (spacing) {
      case 'tight':
        return 'space-y-8';
      case 'spacious':
        return 'space-y-24';
      case 'normal':
      default:
        return 'space-y-16';
    }
  }

  /**
   * Get max width class
   */
  private getMaxWidthClass(maxWidth: string): string {
    const widthMap: Record<string, string> = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
    };
    return widthMap[maxWidth] || 'max-w-7xl';
  }

  /**
   * Suggest a page structure based on use case
   */
  suggestPageStructure(
    useCase: 'landing' | 'pricing' | 'dashboard' | 'auth' | 'docs',
    context: 'marketing' | 'product'
  ): BlockPlacement[] {
    switch (useCase) {
      case 'landing':
        return [
          { blockType: 'navigation', variant: 'sticky', order: 0 },
          { blockType: 'hero', variant: 'gradient-orbs', order: 1 },
          { blockType: 'logo-cloud', variant: 'simple', order: 2 },
          { blockType: 'features', variant: 'grid', order: 3 },
          { blockType: 'testimonials', variant: 'carousel', order: 4 },
          { blockType: 'pricing', variant: 'toggle-annual', order: 5 },
          { blockType: 'faq', variant: 'simple', order: 6 },
          { blockType: 'cta', variant: 'simple', order: 7 },
          { blockType: 'footer', variant: 'multi-column', order: 8 },
        ];

      case 'pricing':
        return [
          { blockType: 'navigation', variant: 'sticky', order: 0 },
          { blockType: 'pricing', variant: 'comparison', order: 1 },
          { blockType: 'faq', variant: 'two-column', order: 2 },
          { blockType: 'cta', variant: 'simple', order: 3 },
          { blockType: 'footer', variant: 'multi-column', order: 4 },
        ];

      case 'dashboard':
        return [
          { blockType: 'sidebar', variant: 'collapsible', order: 0 },
          { blockType: 'header', variant: 'with-search', order: 1 },
          { blockType: 'metric-cards', variant: 'with-trend', order: 2 },
          { blockType: 'chart-section', variant: 'overview', order: 3 },
          { blockType: 'data-table', variant: 'with-pagination', order: 4 },
        ];

      case 'auth':
        return [
          { blockType: 'auth', variant: 'login', order: 0 },
        ];

      case 'docs':
        return [
          { blockType: 'navigation', variant: 'docs', order: 0 },
          { blockType: 'sidebar', variant: 'with-sections', order: 1 },
        ];

      default:
        return [];
    }
  }
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Create a page composer with default configuration
 */
export function createPageComposer(
  config?: Partial<PageComposerConfig>
): PageComposer {
  return new PageComposer(config);
}

/**
 * Compose a page (convenience function)
 */
export async function composePage(
  input: PageCompositionInput
): Promise<PageCompositionOutput> {
  const composer = new PageComposer();
  return composer.compose(input);
}

/**
 * Get suggested page structure
 */
export function suggestPageStructure(
  useCase: 'landing' | 'pricing' | 'dashboard' | 'auth' | 'docs',
  context: 'marketing' | 'product' = 'marketing'
): BlockPlacement[] {
  const composer = new PageComposer();
  return composer.suggestPageStructure(useCase, context);
}

/**
 * Quick compose a landing page
 */
export async function composeLandingPage(
  name: string = 'LandingPage',
  tuners?: AppliedTuners
): Promise<PageCompositionOutput> {
  const composer = new PageComposer();
  const blocks = composer.suggestPageStructure('landing', 'marketing');

  return composer.compose({
    name,
    route: '/',
    context: 'marketing',
    blocks,
    tuners: tuners || DEFAULT_TUNERS,
    layout: {
      maxWidth: 'xl',
      hasNavigation: true,
      hasFooter: true,
      spacing: 'normal',
    },
  });
}

/**
 * Quick compose a dashboard page
 */
export async function composeDashboardPage(
  name: string = 'DashboardPage',
  tuners?: AppliedTuners
): Promise<PageCompositionOutput> {
  const composer = new PageComposer();
  const blocks = composer.suggestPageStructure('dashboard', 'product');

  return composer.compose({
    name,
    route: '/dashboard',
    context: 'product',
    blocks,
    tuners: tuners || DEFAULT_TUNERS,
    layout: {
      maxWidth: 'full',
      hasNavigation: false,
      hasFooter: false,
      spacing: 'normal',
    },
  });
}
