/**
 * Visual MCP Module
 *
 * The Model Context Protocol for visual design intelligence.
 * Provides types and utilities for AI-assisted UI generation.
 */

export * from './contract';

// MCP Tools (v1.0)
export {
  // Tool definitions
  GENERATE_BLOCK_TOOL,
  COMPOSE_PAGE_TOOL,
  APPLY_INSPIRATION_TOOL,
  SUGGEST_BLOCKS_TOOL,
  EXTRACT_DESIGN_TOKENS_TOOL,
  EXTRACT_ASSETS_TOOL,
  INSPECT_ELEMENT_TOOL,
  CHECK_ACCESSIBILITY_TOOL,
  GENERATE_BEAUTIFUL_DESIGN_REPORT_TOOL,
  NEW_TOOLS,

  // Handlers
  handleGenerateBlock,
  handleComposePage,
  handleApplyInspiration,
  handleSuggestBlocks,
  handleExtractDesignTokens,
  handleExtractAssets,
  handleInspectElement,
  handleCheckAccessibility,
  handleGenerateBeautifulDesignReport,

  // Types
  type GenerateBlockInput,
  type GenerateBlockOutput,
  type ComposePageInput,
  type ComposePageOutput,
  type ApplyInspirationInput,
  type ApplyInspirationOutput,
  type SuggestBlocksInput,
  type SuggestBlocksOutput,
  type BlockSuggestion,
  type ExtractDesignTokensInput,
  type ExtractDesignTokensOutput,
  type ExtractAssetsInput,
  type ExtractAssetsOutput,
  type InspectElementInput,
  type InspectElementOutput,
  type CheckAccessibilityInput,
  type CheckAccessibilityOutput,
  type GenerateBeautifulDesignReportInput,
  type GenerateBeautifulDesignReportOutput,
} from './tools';
