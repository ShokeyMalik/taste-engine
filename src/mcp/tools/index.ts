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
import { EXTRACT_DESIGN_TOKENS_TOOL } from './extract-design-tokens';
import { EXTRACT_ASSETS_TOOL } from './extract-assets';
import { INSPECT_ELEMENT_TOOL } from './inspect-element';
import { CHECK_ACCESSIBILITY_TOOL } from './check-accessibility';
import { GENERATE_BEAUTIFUL_DESIGN_REPORT_TOOL } from './generate-beautiful-design-report';

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

// MiroMiro Design Token Extraction
export {
  EXTRACT_DESIGN_TOKENS_TOOL,
  handleExtractDesignTokens,
  type ExtractDesignTokensInput,
  type ExtractDesignTokensOutput,
} from './extract-design-tokens';

// MiroMiro Asset Extraction
export {
  EXTRACT_ASSETS_TOOL,
  handleExtractAssets,
  type ExtractAssetsInput,
  type ExtractAssetsOutput,
} from './extract-assets';

// MiroMiro Element Inspection
export {
  INSPECT_ELEMENT_TOOL,
  handleInspectElement,
  type InspectElementInput,
  type InspectElementOutput,
} from './inspect-element';

// MiroMiro Accessibility Check
export {
  CHECK_ACCESSIBILITY_TOOL,
  handleCheckAccessibility,
  type CheckAccessibilityInput,
  type CheckAccessibilityOutput,
} from './check-accessibility';

// MiroMiro Beautiful Design Report
export {
  GENERATE_BEAUTIFUL_DESIGN_REPORT_TOOL,
  handleGenerateBeautifulDesignReport,
  type GenerateBeautifulDesignReportInput,
  type GenerateBeautifulDesignReportOutput,
} from './generate-beautiful-design-report';

// All tools array
export const NEW_TOOLS = [
  GENERATE_BLOCK_TOOL,
  COMPOSE_PAGE_TOOL,
  APPLY_INSPIRATION_TOOL,
  SUGGEST_BLOCKS_TOOL,
  GENERATE_MARKETING_SITE_TOOL,
  GENERATE_DESIGN_REPORT_TOOL,
  EXTRACT_DESIGN_TOKENS_TOOL,
  EXTRACT_ASSETS_TOOL,
  INSPECT_ELEMENT_TOOL,
  CHECK_ACCESSIBILITY_TOOL,
  GENERATE_BEAUTIFUL_DESIGN_REPORT_TOOL,
];
