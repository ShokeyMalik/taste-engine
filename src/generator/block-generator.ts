/**
 * Block Generator Core
 *
 * Main generator that produces React/TSX code for any block type.
 * Integrates templates, inspiration profiles, tuners, and component libraries.
 */

import type {
  BlockType,
  BlockGenerationInput,
  BlockGenerationOutput,
  AppliedTuners,
  ComponentLibrary,
  SlotInfo,
} from '../blocks/types';
import type { InspirationProfile } from '../inspiration/inspiration-profile';
import type { ShadcnConfig } from '../integrations/shadcn/types';

import { getBlockRegistry } from '../blocks/registry';
import {
  generateHeroTemplate,
  generateFeaturesTemplate,
  generateNavigationTemplate,
  generateLogoCloudTemplate,
  generatePricingTemplate
} from '../blocks/templates/landing';
import { generateSidebarTemplate, generateMetricCardsTemplate, generateDataTableTemplate } from '../blocks/templates/dashboard';
import { generateAuthTemplate, generateEmptyStateTemplate, generateErrorPageTemplate, generateLoadingTemplate } from '../blocks/templates/shared';
import { ShadcnComponentKnowledge } from '../integrations/shadcn/components';
import { ShadcnTokenMapper } from '../integrations/shadcn/mapper';
import { DEFAULT_TUNERS } from '../blocks/types';

// =============================================================================
// TYPES
// =============================================================================

export interface BlockGeneratorConfig {
  /** Default component library to use */
  defaultLibrary: ComponentLibrary;
  /** shadcn configuration (if detected) */
  shadcnConfig?: ShadcnConfig;
  /** Default inspiration profile */
  defaultProfile?: InspirationProfile;
  /** Default tuner values */
  defaultTuners?: AppliedTuners;
}

/** Internal input type with full InspirationProfile */
interface InternalGenerationInput {
  blockType: BlockType;
  variant: string;
  context: 'marketing' | 'product';
  inspirationProfile?: InspirationProfile;
  tuners: AppliedTuners;
  content?: any;
  componentLibrary?: ComponentLibrary;
}

/** Template output before adding required fields */
interface TemplateOutput {
  code: string;
  componentName: string;
  fileName: string;
  dependencies: string[];
  explanation: string;
}

export interface GenerationResult extends BlockGenerationOutput {
  /** Whether all dependencies are installed */
  dependenciesInstalled: boolean;
  /** Commands to install missing dependencies */
  installCommands: string[];
}

// =============================================================================
// BLOCK GENERATOR CLASS
// =============================================================================

export class BlockGenerator {
  private config: BlockGeneratorConfig;
  private shadcnKnowledge?: ShadcnComponentKnowledge;
  private shadcnMapper?: ShadcnTokenMapper;

  constructor(config: Partial<BlockGeneratorConfig> = {}) {
    this.config = {
      defaultLibrary: config.defaultLibrary || 'shadcn',
      shadcnConfig: config.shadcnConfig,
      defaultProfile: config.defaultProfile,
      defaultTuners: config.defaultTuners || DEFAULT_TUNERS,
    };

    if (config.shadcnConfig) {
      this.shadcnKnowledge = new ShadcnComponentKnowledge(config.shadcnConfig);
      this.shadcnMapper = new ShadcnTokenMapper(config.shadcnConfig);
    }
  }

  /**
   * Generate code for a block
   */
  async generate(input: BlockGenerationInput): Promise<GenerationResult> {
    // Validate block type
    const registry = getBlockRegistry();
    const blockDef = registry.get(input.blockType);
    if (!blockDef) {
      throw new Error(`Unknown block type: ${input.blockType}`);
    }

    // Validate variant
    const variant = input.variant || blockDef.defaultVariant;
    const variantDef = blockDef.variants.find(v => v.id === variant);
    if (!variantDef) {
      throw new Error(`Unknown variant '${variant}' for block '${input.blockType}'`);
    }

    // Create internal input with resolved values
    const internalInput: InternalGenerationInput = {
      blockType: input.blockType,
      variant,
      context: input.context,
      inspirationProfile: this.config.defaultProfile,
      tuners: input.tuners || this.config.defaultTuners || DEFAULT_TUNERS,
      content: input.content,
      componentLibrary: input.componentLibrary || this.config.defaultLibrary,
    };

    // Generate the block template
    const templateOutput = this.generateBlock(internalInput);

    // Convert to full output
    const output: BlockGenerationOutput = {
      ...templateOutput,
      slots: this.buildSlots(blockDef.slots),
      variantUsed: variant,
      cssVariables: this.config.defaultProfile && this.shadcnMapper
        ? this.shadcnMapper.profileToShadcnVariables(this.config.defaultProfile).light
        : undefined,
    };

    // Check dependencies
    const { installed, commands } = this.checkDependencies(
      input.blockType,
      output.dependencies
    );

    return {
      ...output,
      dependenciesInstalled: installed,
      installCommands: commands,
    };
  }

  /**
   * Build slot info from block definition
   */
  private buildSlots(blockSlots: { name: string; description: string; acceptedBlocks?: BlockType[]; required: boolean; multiple: boolean }[]): Record<string, SlotInfo> {
    const slots: Record<string, SlotInfo> = {};
    for (const slot of blockSlots) {
      slots[slot.name] = {
        name: slot.name,
        accepts: slot.acceptedBlocks || [],
        filled: false,
      };
    }
    return slots;
  }

  /**
   * Generate multiple blocks at once
   */
  async generateMany(inputs: BlockGenerationInput[]): Promise<GenerationResult[]> {
    return Promise.all(inputs.map(input => this.generate(input)));
  }

  /**
   * Get available variants for a block type
   */
  getVariants(blockType: BlockType): string[] {
    const registry = getBlockRegistry();
    const blockDef = registry.get(blockType);
    return blockDef?.variants.map(v => v.name) || [];
  }

  /**
   * Check if a block can be generated with current setup
   */
  canGenerate(blockType: BlockType): {
    canGenerate: boolean;
    missingComponents: string[];
    installCommand?: string;
  } {
    if (!this.shadcnKnowledge || !this.config.shadcnConfig) {
      return { canGenerate: true, missingComponents: [] };
    }

    const missing = this.shadcnKnowledge.getMissingComponents(blockType);
    const command = missing.length > 0
      ? this.shadcnKnowledge.getInstallCommand(blockType)
      : undefined;

    return {
      canGenerate: missing.length === 0,
      missingComponents: missing,
      installCommand: command || undefined,
    };
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  private generateBlock(input: InternalGenerationInput): TemplateOutput {
    const { blockType } = input;

    // Create BlockGenerationInput for templates (they expect the original type)
    const templateInput: BlockGenerationInput = {
      blockType: input.blockType,
      variant: input.variant,
      context: input.context,
      tuners: input.tuners,
      content: input.content,
      componentLibrary: input.componentLibrary,
    };

    // Route to appropriate template generator
    switch (blockType) {
      // Landing blocks
      case 'hero':
        return this.extractTemplateOutput(generateHeroTemplate(templateInput));
      case 'features':
        return this.extractTemplateOutput(generateFeaturesTemplate(templateInput));
      case 'navigation':
        return this.extractTemplateOutput(generateNavigationTemplate(templateInput));
      case 'logo-cloud':
        return this.extractTemplateOutput(generateLogoCloudTemplate(templateInput));
      case 'pricing':
        return this.extractTemplateOutput(generatePricingTemplate(templateInput));
      case 'testimonials':
      case 'faq':
      case 'cta':
      case 'footer':
      case 'stats':
        return this.generatePlaceholder(input);

      // Dashboard blocks
      case 'sidebar':
        return this.extractTemplateOutput(generateSidebarTemplate(templateInput));
      case 'metric-cards':
        return this.extractTemplateOutput(generateMetricCardsTemplate(templateInput));
      case 'data-table':
        return this.extractTemplateOutput(generateDataTableTemplate(templateInput));
      case 'header':
      case 'chart-section':
      case 'activity-feed':
      case 'settings-panel':
      case 'command-palette':
        return this.generatePlaceholder(input);

      // Shared blocks
      case 'auth':
        return this.extractTemplateOutput(generateAuthTemplate(templateInput));
      case 'empty-state':
        return this.extractTemplateOutput(generateEmptyStateTemplate(templateInput));
      case 'error-page':
        return this.extractTemplateOutput(generateErrorPageTemplate(templateInput));
      case 'loading':
        return this.extractTemplateOutput(generateLoadingTemplate(templateInput));

      default:
        return this.generatePlaceholder(input);
    }
  }

  private extractTemplateOutput(output: BlockGenerationOutput): TemplateOutput {
    return {
      code: output.code,
      componentName: output.componentName,
      fileName: output.fileName,
      dependencies: output.dependencies,
      explanation: output.explanation,
    };
  }

  private generatePlaceholder(input: InternalGenerationInput): TemplateOutput {
    const componentName = this.toComponentName(input.blockType, input.variant);

    return {
      code: `// Placeholder for ${input.blockType} (${input.variant})
// Full template coming soon

interface ${componentName}Props {
  // Add props here
}

export function ${componentName}(props: ${componentName}Props) {
  return (
    <div className="p-8 border rounded-lg bg-muted/50 text-center">
      <p className="text-muted-foreground">
        ${input.blockType} - ${input.variant} variant
      </p>
    </div>
  );
}
`,
      componentName,
      fileName: `${this.toFileName(componentName)}.tsx`,
      dependencies: [],
      explanation: `Placeholder for ${input.blockType} block with ${input.variant} variant.`,
    };
  }

  private checkDependencies(
    blockType: BlockType,
    dependencies: string[]
  ): { installed: boolean; commands: string[] } {
    const commands: string[] = [];

    // Check shadcn components
    if (this.shadcnKnowledge) {
      const missing = this.shadcnKnowledge.getMissingComponents(blockType);
      if (missing.length > 0) {
        const cmd = this.shadcnKnowledge.getInstallCommand(blockType);
        if (cmd) commands.push(cmd);
      }

      // Check npm packages
      const npmDeps = this.shadcnKnowledge.getNpmDependencies(blockType);
      if (npmDeps.length > 0) {
        commands.push(`npm install ${npmDeps.join(' ')}`);
      }
    }

    return {
      installed: commands.length === 0,
      commands,
    };
  }

  private toComponentName(blockType: string, variant: string): string {
    const type = blockType
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');

    const variantName = variant
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');

    return `${type}${variantName}`;
  }

  private toFileName(componentName: string): string {
    return componentName
      .replace(/([A-Z])/g, (m, p1, offset) =>
        offset > 0 ? `-${p1.toLowerCase()}` : p1.toLowerCase()
      );
  }
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Create a block generator with default configuration
 */
export function createBlockGenerator(config?: Partial<BlockGeneratorConfig>): BlockGenerator {
  return new BlockGenerator(config);
}

/**
 * Generate a single block (convenience function)
 */
export async function generateBlock(input: BlockGenerationInput): Promise<GenerationResult> {
  const generator = new BlockGenerator();
  return generator.generate(input);
}

/**
 * Generate multiple blocks (convenience function)
 */
export async function generateBlocks(inputs: BlockGenerationInput[]): Promise<GenerationResult[]> {
  const generator = new BlockGenerator();
  return generator.generateMany(inputs);
}

/**
 * Quick generate with minimal input
 */
export async function quickGenerate(
  blockType: BlockType,
  variant?: string,
  options?: {
    tuners?: AppliedTuners;
    library?: ComponentLibrary;
  }
): Promise<GenerationResult> {
  const generator = new BlockGenerator({
    defaultLibrary: options?.library,
    defaultTuners: options?.tuners,
  });

  return generator.generate({
    blockType,
    variant: variant || '',
    context: 'marketing',
    tuners: options?.tuners || DEFAULT_TUNERS,
    componentLibrary: options?.library,
  });
}
