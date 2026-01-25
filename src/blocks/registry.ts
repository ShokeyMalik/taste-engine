/**
 * Block Registry - Central registry for all block definitions
 *
 * The registry manages block definitions, provides lookup methods,
 * and offers recommendations based on context.
 */

import {
  BlockType,
  BlockCategory,
  BlockDefinition,
  BlockVariant,
  BlockContextHints,
  AppliedTuners,
  ALL_BLOCK_TYPES,
  BLOCK_CATEGORIES,
  getBlockCategory,
} from './types';

// =============================================================================
// REGISTRY TYPES
// =============================================================================

export interface BlockRecommendation {
  block: BlockDefinition;
  variant: BlockVariant;
  score: number;
  reason: string;
}

export interface RecommendationContext {
  /** Target page type */
  pageType?: 'marketing' | 'product' | 'docs' | 'auth' | 'admin';
  /** Target industry */
  industry?: string;
  /** Target audience */
  audience?: string;
  /** Current tuner values */
  tuners?: AppliedTuners;
  /** Blocks already on the page */
  existingBlocks?: BlockType[];
  /** Natural language description */
  useCase?: string;
}

export interface BlockSearchOptions {
  /** Filter by category */
  category?: BlockCategory;
  /** Filter by tags */
  tags?: string[];
  /** Filter by keywords */
  keywords?: string[];
  /** Filter by shadcn component usage */
  usesShadcn?: string[];
  /** Filter by complexity */
  complexity?: 'simple' | 'moderate' | 'complex';
  /** Filter by page type */
  pageType?: 'marketing' | 'product' | 'docs' | 'auth' | 'admin';
}

// =============================================================================
// BLOCK REGISTRY CLASS
// =============================================================================

export class BlockRegistry {
  private blocks: Map<BlockType, BlockDefinition> = new Map();
  private initialized: boolean = false;

  constructor() {
    // Registry starts empty, call initialize() or registerDefaults()
  }

  // ===========================================================================
  // REGISTRATION METHODS
  // ===========================================================================

  /**
   * Register a single block definition
   */
  register<V extends string>(definition: BlockDefinition<V>): void {
    this.blocks.set(definition.type, definition as BlockDefinition);
  }

  /**
   * Register multiple block definitions
   */
  registerAll(definitions: BlockDefinition[]): void {
    for (const def of definitions) {
      this.register(def);
    }
  }

  /**
   * Unregister a block
   */
  unregister(type: BlockType): boolean {
    return this.blocks.delete(type);
  }

  /**
   * Clear all registrations
   */
  clear(): void {
    this.blocks.clear();
    this.initialized = false;
  }

  // ===========================================================================
  // LOOKUP METHODS
  // ===========================================================================

  /**
   * Get a block definition by type
   */
  get(type: BlockType): BlockDefinition | undefined {
    return this.blocks.get(type);
  }

  /**
   * Get a block definition, throwing if not found
   */
  getOrThrow(type: BlockType): BlockDefinition {
    const block = this.blocks.get(type);
    if (!block) {
      throw new Error(`Block type "${type}" not found in registry`);
    }
    return block;
  }

  /**
   * Check if a block type is registered
   */
  has(type: BlockType): boolean {
    return this.blocks.has(type);
  }

  /**
   * Get all registered block types
   */
  getTypes(): BlockType[] {
    return Array.from(this.blocks.keys());
  }

  /**
   * Get all registered block definitions
   */
  getAll(): BlockDefinition[] {
    return Array.from(this.blocks.values());
  }

  /**
   * Get the count of registered blocks
   */
  get size(): number {
    return this.blocks.size;
  }

  // ===========================================================================
  // VARIANT METHODS
  // ===========================================================================

  /**
   * Get a specific variant for a block
   */
  getVariant(type: BlockType, variantId: string): BlockVariant | undefined {
    const block = this.blocks.get(type);
    if (!block) return undefined;
    return block.variants.find((v) => v.id === variantId);
  }

  /**
   * Get all variants for a block
   */
  getVariants(type: BlockType): BlockVariant[] {
    const block = this.blocks.get(type);
    return block?.variants ?? [];
  }

  /**
   * Get the default variant for a block
   */
  getDefaultVariant(type: BlockType): BlockVariant | undefined {
    const block = this.blocks.get(type);
    if (!block) return undefined;
    return block.variants.find((v) => v.id === block.defaultVariant);
  }

  /**
   * Get all variant IDs for a block
   */
  getVariantIds(type: BlockType): string[] {
    const block = this.blocks.get(type);
    return block?.variants.map((v) => v.id) ?? [];
  }

  // ===========================================================================
  // FILTER METHODS
  // ===========================================================================

  /**
   * Get blocks by category
   */
  getByCategory(category: BlockCategory): BlockDefinition[] {
    return this.getAll().filter((block) => block.category === category);
  }

  /**
   * Get blocks for landing pages
   */
  getLandingBlocks(): BlockDefinition[] {
    return this.getByCategory('landing');
  }

  /**
   * Get blocks for dashboards
   */
  getDashboardBlocks(): BlockDefinition[] {
    return this.getByCategory('dashboard');
  }

  /**
   * Get shared/common blocks
   */
  getSharedBlocks(): BlockDefinition[] {
    return this.getByCategory('shared');
  }

  /**
   * Search blocks with multiple criteria
   */
  search(options: BlockSearchOptions): BlockDefinition[] {
    let results = this.getAll();

    if (options.category) {
      results = results.filter((b) => b.category === options.category);
    }

    if (options.tags && options.tags.length > 0) {
      results = results.filter((b) =>
        b.variants.some((v) => options.tags!.some((tag) => v.tags.includes(tag)))
      );
    }

    if (options.keywords && options.keywords.length > 0) {
      const keywords = options.keywords.map((k) => k.toLowerCase());
      results = results.filter((b) =>
        keywords.some(
          (kw) =>
            b.name.toLowerCase().includes(kw) ||
            b.description.toLowerCase().includes(kw) ||
            b.keywords.some((bkw) => bkw.toLowerCase().includes(kw))
        )
      );
    }

    if (options.usesShadcn && options.usesShadcn.length > 0) {
      results = results.filter((b) =>
        options.usesShadcn!.some(
          (comp) =>
            b.baseShadcnComponents.includes(comp) ||
            b.variants.some((v) => v.shadcnComponents.includes(comp))
        )
      );
    }

    if (options.complexity) {
      results = results.filter((b) =>
        b.variants.some((v) => v.complexity === options.complexity)
      );
    }

    if (options.pageType) {
      results = results.filter(
        (b) =>
          !b.contextHints.pageType ||
          b.contextHints.pageType.includes(options.pageType!)
      );
    }

    return results;
  }

  // ===========================================================================
  // RECOMMENDATION METHODS
  // ===========================================================================

  /**
   * Get recommended blocks for a given context
   */
  recommend(context: RecommendationContext): BlockRecommendation[] {
    const recommendations: BlockRecommendation[] = [];

    for (const block of this.getAll()) {
      const scores = this.scoreBlock(block, context);

      if (scores.total > 0) {
        // Find best variant for this context
        const variantScore = this.scoreBestVariant(block, context);

        recommendations.push({
          block,
          variant: variantScore.variant,
          score: scores.total + variantScore.score,
          reason: this.buildRecommendationReason(scores, variantScore),
        });
      }
    }

    // Sort by score descending
    return recommendations.sort((a, b) => b.score - a.score);
  }

  /**
   * Suggest a complete page structure for a use case
   */
  suggestPageStructure(
    useCase: string,
    context: RecommendationContext = {}
  ): BlockRecommendation[] {
    const useCaseLower = useCase.toLowerCase();
    const suggestions: BlockRecommendation[] = [];

    // Determine page type from use case
    const isLanding =
      useCaseLower.includes('landing') ||
      useCaseLower.includes('marketing') ||
      useCaseLower.includes('homepage');
    const isDashboard =
      useCaseLower.includes('dashboard') ||
      useCaseLower.includes('admin') ||
      useCaseLower.includes('app');

    if (isLanding) {
      // Typical landing page structure
      const landingOrder: BlockType[] = [
        'navigation',
        'hero',
        'logo-cloud',
        'features',
        'stats',
        'testimonials',
        'pricing',
        'faq',
        'cta',
        'footer',
      ];

      for (const type of landingOrder) {
        const block = this.get(type);
        if (block) {
          const variantScore = this.scoreBestVariant(block, context);
          suggestions.push({
            block,
            variant: variantScore.variant,
            score: 1, // Equal priority for structure
            reason: `Essential landing page section`,
          });
        }
      }
    } else if (isDashboard) {
      // Typical dashboard structure
      const dashboardOrder: BlockType[] = [
        'sidebar',
        'header',
        'metric-cards',
        'chart-section',
        'data-table',
        'activity-feed',
      ];

      for (const type of dashboardOrder) {
        const block = this.get(type);
        if (block) {
          const variantScore = this.scoreBestVariant(block, context);
          suggestions.push({
            block,
            variant: variantScore.variant,
            score: 1,
            reason: `Essential dashboard component`,
          });
        }
      }
    } else {
      // General recommendations based on context
      return this.recommend({ ...context, useCase });
    }

    return suggestions;
  }

  // ===========================================================================
  // SCORING HELPERS
  // ===========================================================================

  private scoreBlock(
    block: BlockDefinition,
    context: RecommendationContext
  ): { total: number; reasons: Record<string, number> } {
    const reasons: Record<string, number> = {};
    let total = 0;

    // Score by page type match
    if (context.pageType && block.contextHints.pageType) {
      if (block.contextHints.pageType.includes(context.pageType)) {
        reasons.pageType = 20;
        total += 20;
      }
    }

    // Score by industry match
    if (context.industry && block.contextHints.industry) {
      if (
        block.contextHints.industry.some(
          (i) => i.toLowerCase() === context.industry!.toLowerCase()
        )
      ) {
        reasons.industry = 15;
        total += 15;
      }
    }

    // Score by audience match
    if (context.audience && block.contextHints.audience) {
      if (
        block.contextHints.audience.some(
          (a) => a.toLowerCase() === context.audience!.toLowerCase()
        )
      ) {
        reasons.audience = 10;
        total += 10;
      }
    }

    // Score by use case keyword match
    if (context.useCase) {
      const useCaseLower = context.useCase.toLowerCase();
      const keywordMatches = block.keywords.filter((kw) =>
        useCaseLower.includes(kw.toLowerCase())
      ).length;
      if (keywordMatches > 0) {
        reasons.keywords = keywordMatches * 5;
        total += keywordMatches * 5;
      }
    }

    // Avoid duplicates if block already exists
    if (context.existingBlocks?.includes(block.type)) {
      reasons.duplicate = -50;
      total -= 50;
    }

    // Base score for category match
    const category = getBlockCategory(block.type);
    if (context.pageType === 'marketing' && category === 'landing') {
      reasons.categoryMatch = 5;
      total += 5;
    } else if (
      (context.pageType === 'product' || context.pageType === 'admin') &&
      category === 'dashboard'
    ) {
      reasons.categoryMatch = 5;
      total += 5;
    }

    return { total, reasons };
  }

  private scoreBestVariant(
    block: BlockDefinition,
    context: RecommendationContext
  ): { variant: BlockVariant; score: number } {
    let bestVariant = block.variants[0];
    let bestScore = 0;

    for (const variant of block.variants) {
      let score = 0;

      // Prefer simpler variants for product context
      if (context.pageType === 'product') {
        if (variant.complexity === 'simple') score += 10;
        else if (variant.complexity === 'moderate') score += 5;
      }

      // Prefer more complex variants for marketing
      if (context.pageType === 'marketing') {
        if (variant.complexity === 'complex') score += 10;
        else if (variant.complexity === 'moderate') score += 5;
      }

      // Consider tuner hints
      if (context.tuners && block.contextHints.tunerHints) {
        const hints = block.contextHints.tunerHints;
        let tunerMatch = 0;

        if (hints.abstraction) {
          if (
            context.tuners.abstraction >= hints.abstraction.min &&
            context.tuners.abstraction <= hints.abstraction.max
          ) {
            tunerMatch += 2;
          }
        }
        if (hints.density) {
          if (
            context.tuners.density >= hints.density.min &&
            context.tuners.density <= hints.density.max
          ) {
            tunerMatch += 2;
          }
        }
        if (hints.motion) {
          if (
            context.tuners.motion >= hints.motion.min &&
            context.tuners.motion <= hints.motion.max
          ) {
            tunerMatch += 2;
          }
        }

        score += tunerMatch;
      }

      if (score > bestScore) {
        bestScore = score;
        bestVariant = variant;
      }
    }

    // If no variant scored, use default
    if (bestScore === 0) {
      const defaultVariant = block.variants.find(
        (v) => v.id === block.defaultVariant
      );
      if (defaultVariant) {
        bestVariant = defaultVariant;
      }
    }

    return { variant: bestVariant, score: bestScore };
  }

  private buildRecommendationReason(
    blockScores: { reasons: Record<string, number> },
    variantScore: { variant: BlockVariant; score: number }
  ): string {
    const parts: string[] = [];

    if (blockScores.reasons.pageType) {
      parts.push('matches page type');
    }
    if (blockScores.reasons.industry) {
      parts.push('fits your industry');
    }
    if (blockScores.reasons.audience) {
      parts.push('designed for your audience');
    }
    if (blockScores.reasons.keywords) {
      parts.push('matches your description');
    }

    if (parts.length === 0) {
      parts.push('commonly used block');
    }

    return `${variantScore.variant.name} variant - ${parts.join(', ')}`;
  }

  // ===========================================================================
  // UTILITY METHODS
  // ===========================================================================

  /**
   * Get all dependencies for a set of blocks
   */
  getDependencies(blocks: { type: BlockType; variant: string }[]): string[] {
    const deps = new Set<string>();

    for (const { type, variant } of blocks) {
      const block = this.get(type);
      if (!block) continue;

      // Add base dependencies
      for (const dep of block.baseDependencies) {
        deps.add(dep);
      }

      // Add variant-specific dependencies
      const v = block.variants.find((vr) => vr.id === variant);
      if (v) {
        for (const dep of v.requiredDependencies) {
          deps.add(dep);
        }
      }
    }

    return Array.from(deps);
  }

  /**
   * Get all shadcn components used by a set of blocks
   */
  getShadcnComponents(blocks: { type: BlockType; variant: string }[]): string[] {
    const components = new Set<string>();

    for (const { type, variant } of blocks) {
      const block = this.get(type);
      if (!block) continue;

      // Add base components
      for (const comp of block.baseShadcnComponents) {
        components.add(comp);
      }

      // Add variant-specific components
      const v = block.variants.find((vr) => vr.id === variant);
      if (v) {
        for (const comp of v.shadcnComponents) {
          components.add(comp);
        }
      }
    }

    return Array.from(components);
  }

  /**
   * Export registry as JSON (for caching/sharing)
   */
  toJSON(): object {
    return {
      blocks: Object.fromEntries(this.blocks),
      version: '1.0.0',
    };
  }

  /**
   * Import registry from JSON
   */
  fromJSON(data: { blocks: Record<string, BlockDefinition> }): void {
    this.clear();
    for (const [type, definition] of Object.entries(data.blocks)) {
      this.blocks.set(type as BlockType, definition);
    }
    this.initialized = true;
  }

  // ===========================================================================
  // STATIC FACTORY
  // ===========================================================================

  /**
   * Create a registry with all default block definitions
   */
  static createDefault(): BlockRegistry {
    const registry = new BlockRegistry();
    // Block definitions will be registered via registerDefaults()
    // which imports from the variants folder
    return registry;
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

let defaultRegistry: BlockRegistry | null = null;

/**
 * Get the default registry instance
 */
export function getBlockRegistry(): BlockRegistry {
  if (!defaultRegistry) {
    defaultRegistry = new BlockRegistry();
  }
  return defaultRegistry;
}

/**
 * Reset the default registry (for testing)
 */
export function resetBlockRegistry(): void {
  defaultRegistry = null;
}
