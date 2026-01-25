/**
 * MCP Tools Index
 *
 * Exports all MCP tools for the taste-engine server.
 */

import { GENERATE_BLOCK_TOOL } from './generate-block';
import { COMPOSE_PAGE_TOOL } from './compose-page';
import { APPLY_INSPIRATION_TOOL } from './apply-inspiration';
import { SUGGEST_BLOCKS_TOOL } from './suggest-blocks';
import { GENERATE_MARKETING_SITE_TOOL } from './generate-marketing-site';
import { GENERATE_DESIGN_REPORT_TOOL } from './generate-design-report';

// Generate Block
export {
  GENERATE_BLOCK_TOOL,
  handleGenerateBlock,
  type GenerateBlockInput,
  type GenerateBlockOutput,
} from './generate-block';

// Compose Page
export {
  COMPOSE_PAGE_TOOL,
  handleComposePage,
  type ComposePageInput,
  type ComposePageOutput,
} from './compose-page';

// Apply Inspiration
export {
  APPLY_INSPIRATION_TOOL,
  handleApplyInspiration,
  type ApplyInspirationInput,
  type ApplyInspirationOutput,
} from './apply-inspiration';

// Suggest Blocks
export {
  SUGGEST_BLOCKS_TOOL,
  handleSuggestBlocks,
  type SuggestBlocksInput,
  type SuggestBlocksOutput,
  type BlockSuggestion,
} from './suggest-blocks';

// Generate Marketing Site
export {
  GENERATE_MARKETING_SITE_TOOL,
  handleGenerateMarketingSite,
  type GenerateMarketingSiteInput,
  type GenerateMarketingSiteOutput,
} from './generate-marketing-site';

// Generate Design Report
export {
  GENERATE_DESIGN_REPORT_TOOL,
  handleGenerateDesignReport,
  type GenerateDesignReportInput,
  type GenerateDesignReportOutput,
} from './generate-design-report';

// All tools array
export const NEW_TOOLS = [
  GENERATE_BLOCK_TOOL,
  COMPOSE_PAGE_TOOL,
  APPLY_INSPIRATION_TOOL,
  SUGGEST_BLOCKS_TOOL,
  GENERATE_MARKETING_SITE_TOOL,
  GENERATE_DESIGN_REPORT_TOOL,
];
