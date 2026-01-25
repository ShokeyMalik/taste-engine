/**
 * Taste Engine Block Registry
 *
 * Central registry for all UI block definitions.
 * Provides block lookup, recommendations, and page composition support.
 */

// Core types
export * from './types';

// Registry
export { BlockRegistry, getBlockRegistry, resetBlockRegistry } from './registry';
export type { BlockRecommendation, RecommendationContext, BlockSearchOptions } from './registry';

// Block variants by category
export { landingBlocks } from './variants/landing';
export { dashboardBlocks } from './variants/dashboard';
export { sharedBlocks } from './variants/shared';

// Individual landing blocks
export {
  heroBlock,
  navigationBlock,
  featuresBlock,
  pricingBlock,
  testimonialsBlock,
  faqBlock,
  ctaBlock,
  footerBlock,
  logoCloudBlock,
  statsBlock,
} from './variants/landing';

// Individual dashboard blocks
export {
  sidebarBlock,
  headerBlock,
  dataTableBlock,
  metricCardsBlock,
  chartSectionBlock,
  activityFeedBlock,
  settingsPanelBlock,
  commandPaletteBlock,
} from './variants/dashboard';

// Individual shared blocks
export {
  authBlock,
  emptyStateBlock,
  errorPageBlock,
  loadingBlock,
} from './variants/shared';

// Import for registration
import { getBlockRegistry } from './registry';
import { landingBlocks } from './variants/landing';
import { dashboardBlocks } from './variants/dashboard';
import { sharedBlocks } from './variants/shared';
import type { BlockDefinition } from './types';

/**
 * All block definitions combined
 */
export const allBlocks: BlockDefinition[] = [
  ...landingBlocks,
  ...dashboardBlocks,
  ...sharedBlocks,
];

/**
 * Register all default block definitions to the registry
 */
export function registerDefaultBlocks(): void {
  const registry = getBlockRegistry();
  registry.registerAll(allBlocks);
}

/**
 * Get a fully initialized registry with all default blocks
 */
export function createDefaultRegistry() {
  const registry = getBlockRegistry();
  if (registry.size === 0) {
    registerDefaultBlocks();
  }
  return registry;
}

/**
 * Block count summary
 */
export const BLOCK_COUNTS = {
  landing: landingBlocks.length,
  dashboard: dashboardBlocks.length,
  shared: sharedBlocks.length,
  total: allBlocks.length,
} as const;

/**
 * Quick lookup for block existence
 */
export function hasBlock(type: string): boolean {
  return allBlocks.some((b) => b.type === type);
}

/**
 * Get block definition without registry
 */
export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return allBlocks.find((b) => b.type === type);
}
