/**
 * Shared Block Variants
 *
 * Common blocks used across landing pages and dashboards.
 */

export { authBlock, default as auth } from './auth';
export { emptyStateBlock, default as emptyState } from './empty-state';
export { errorPageBlock, default as errorPage } from './error-page';
export { loadingBlock, default as loading } from './loading';

import { authBlock } from './auth';
import { emptyStateBlock } from './empty-state';
import { errorPageBlock } from './error-page';
import { loadingBlock } from './loading';

import type { BlockDefinition } from '../../types';

/**
 * All shared block definitions
 */
export const sharedBlocks: BlockDefinition[] = [
  authBlock,
  emptyStateBlock,
  errorPageBlock,
  loadingBlock,
];

export default sharedBlocks;
