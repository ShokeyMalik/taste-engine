/**
 * shadcn/ui Integration
 *
 * Auto-detect and adapt to shadcn/ui in a codebase.
 * Provides token mapping, component knowledge, and generation helpers.
 */

// Types
export type {
  ShadcnComponentsJson,
  ShadcnConfig,
  ShadcnComponent,
  ShadcnComponentInfo,
} from './types';

export {
  SHADCN_COMPONENTS,
  getSubComponents,
  getDependencies,
  getComponentsByCategory,
} from './types';

// Detector
export {
  detectShadcn,
  detectCnUtility,
  getComponentImport,
  ShadcnDetector,
} from './detector';

// Mapper
export type {
  TokenMapping,
  MappedTokens,
  TailwindThemeExtension,
} from './mapper';

export {
  COLOR_MAPPINGS,
  SHADCN_CSS_VARIABLES,
  SHADCN_DARK_VARIABLES,
  ShadcnTokenMapper,
  createMapper,
  getTailwindClass,
  getShadcnClasses,
} from './mapper';

// Components
export type {
  ComponentUsage,
  BlockComponentMapping,
  ComponentCodeTemplate,
} from './components';

export {
  BLOCK_COMPONENT_MAPPINGS,
  ShadcnComponentKnowledge,
  getComponentTemplate,
  createComponentKnowledge,
  getAvailableBlocks,
  getBlocksByInstallStatus,
} from './components';

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

import { detectShadcn, ShadcnDetector } from './detector';
import { ShadcnTokenMapper } from './mapper';
import { ShadcnComponentKnowledge } from './components';
import type { ShadcnConfig } from './types';

/**
 * Complete shadcn integration context
 */
export interface ShadcnIntegration {
  config: ShadcnConfig;
  detector: ShadcnDetector;
  mapper: ShadcnTokenMapper;
  knowledge: ShadcnComponentKnowledge;
}

/**
 * Initialize complete shadcn integration for a codebase
 */
export async function initializeShadcnIntegration(
  repoPath: string
): Promise<ShadcnIntegration> {
  const detector = new ShadcnDetector(repoPath);
  const config = await detector.detect();
  const mapper = new ShadcnTokenMapper(config);
  const knowledge = new ShadcnComponentKnowledge(config);

  return {
    config,
    detector,
    mapper,
    knowledge,
  };
}

/**
 * Quick check if shadcn is present in a codebase
 */
export async function hasShadcn(repoPath: string): Promise<boolean> {
  const config = await detectShadcn(repoPath);
  return config.detected;
}

/**
 * Get a summary of shadcn setup for a codebase
 */
export async function getShadcnSummary(repoPath: string): Promise<{
  detected: boolean;
  componentCount: number;
  style: string;
  cssVariables: boolean;
  rsc: boolean;
  missingForBlocks: string[];
}> {
  const config = await detectShadcn(repoPath);

  if (!config.detected) {
    return {
      detected: false,
      componentCount: 0,
      style: 'none',
      cssVariables: false,
      rsc: false,
      missingForBlocks: [],
    };
  }

  const knowledge = new ShadcnComponentKnowledge(config);
  const { partial } = await import('./components').then(m =>
    m.getBlocksByInstallStatus(config)
  );

  return {
    detected: true,
    componentCount: config.installedComponents.length,
    style: config.style,
    cssVariables: config.cssVariables,
    rsc: config.rsc,
    missingForBlocks: partial.map(p =>
      `${p.block}: needs ${p.missing.join(', ')}`
    ),
  };
}
