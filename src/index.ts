/**
 * Taste Engine - Context-Aware Design System
 *
 * Transform AI-generated UIs from generic to distinctive.
 *
 * Core Features:
 * - Context-aware recipes (product vs marketing)
 * - 5-tuner system for instant visual adjustment
 * - Visual MCP contract for AI integration
 * - Built-in themes (Chronicle Dark, Ops Calm, Hospitality Warm)
 *
 * @example
 * ```tsx
 * import { themeEngine, chronicleDark } from '@taste-engine/core';
 *
 * // Register and apply a theme
 * themeEngine.registerTheme(chronicleDark);
 * themeEngine.applyTheme(chronicleDark, 'product');
 * ```
 *
 * @example With React
 * ```tsx
 * import { TasteProvider, useTaste } from '@taste-engine/core/react';
 *
 * function App() {
 *   return (
 *     <TasteProvider defaultTheme="chronicle-dark">
 *       <Dashboard />
 *     </TasteProvider>
 *   );
 * }
 *
 * function Dashboard() {
 *   const { recipes, isDarkMode } = useTaste();
 *   // Use recipes.StatCard, recipes.DataTable, etc.
 * }
 * ```
 *
 * @version 0.1.0
 * @license MIT
 */

// Core
export * from './core';

// Tuners
export * from './tuners';

// Themes
export * from './themes';

// MCP Contract
export type {
  // Input types
  VisualMCPInput,
  RepoMetadata,
  TargetRoute,
  PageContextConfig,
  Inspiration,
  Constraints,
  TunerValues,

  // Output types
  VisualMCPOutput,
  ContextManifest,
  TasteProfile,
  Plan,
  PatchInstructions,
  VerificationChecklist,

  // Error types
  VisualMCPError,
  VisualMCPErrorCode,

  // Utility types
  PageContext as MCPPageContext,
  AppliedTuners,
} from './mcp/contract';

export {
  isPageContext,
  isValidTunerValues,
  DEFAULT_TUNERS as MCP_DEFAULT_TUNERS,
  CURRENT_CONTRACT_VERSION,
} from './mcp/contract';
