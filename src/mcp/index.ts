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
  NEW_TOOLS,

  // Handlers
  handleGenerateBlock,
  handleComposePage,
  handleApplyInspiration,
  handleSuggestBlocks,

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
} from './tools';
