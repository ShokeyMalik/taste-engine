/**
 * Component Library Integrations
 *
 * Auto-detect and adapt to component libraries in a codebase.
 * Currently supports:
 * - shadcn/ui (primary)
 * - Radix UI (detection only)
 * - Vanilla Tailwind (fallback)
 */

// shadcn/ui integration (full support)
export * from './shadcn';

// =============================================================================
// LIBRARY DETECTION TYPES
// =============================================================================

export type ComponentLibrary = 'shadcn' | 'radix' | 'tailwind' | 'unknown';

export interface LibraryDetectionResult {
  library: ComponentLibrary;
  confidence: number;
  details: {
    shadcn?: {
      detected: boolean;
      componentCount: number;
      style: string;
    };
    radix?: {
      detected: boolean;
      packages: string[];
    };
    tailwind?: {
      detected: boolean;
      configPath?: string;
    };
  };
}

// =============================================================================
// LIBRARY DETECTION
// =============================================================================

import * as fs from 'fs';
import * as path from 'path';
import { detectShadcn } from './shadcn';

/**
 * Detect which component library is used in a codebase
 */
export async function detectComponentLibrary(
  repoPath: string
): Promise<LibraryDetectionResult> {
  const result: LibraryDetectionResult = {
    library: 'unknown',
    confidence: 0,
    details: {},
  };

  // Check for shadcn
  const shadcnConfig = await detectShadcn(repoPath);
  if (shadcnConfig.detected) {
    result.details.shadcn = {
      detected: true,
      componentCount: shadcnConfig.installedComponents.length,
      style: shadcnConfig.style,
    };
    result.library = 'shadcn';
    result.confidence = 0.95;
    return result;
  }

  // Check for Radix UI
  const radixPackages = await detectRadixPackages(repoPath);
  if (radixPackages.length > 0) {
    result.details.radix = {
      detected: true,
      packages: radixPackages,
    };
    result.library = 'radix';
    result.confidence = 0.85;
    return result;
  }

  // Check for Tailwind
  const tailwindConfig = await detectTailwind(repoPath);
  if (tailwindConfig.detected) {
    result.details.tailwind = tailwindConfig;
    result.library = 'tailwind';
    result.confidence = 0.7;
    return result;
  }

  return result;
}

/**
 * Detect Radix UI packages in package.json
 */
async function detectRadixPackages(repoPath: string): Promise<string[]> {
  try {
    const packageJsonPath = path.join(repoPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) return [];

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const radixPackages: string[] = [];
    for (const dep of Object.keys(allDeps)) {
      if (dep.startsWith('@radix-ui/')) {
        radixPackages.push(dep);
      }
    }

    return radixPackages;
  } catch {
    return [];
  }
}

/**
 * Detect Tailwind CSS configuration
 */
async function detectTailwind(
  repoPath: string
): Promise<{ detected: boolean; configPath?: string }> {
  const configNames = [
    'tailwind.config.js',
    'tailwind.config.ts',
    'tailwind.config.mjs',
    'tailwind.config.cjs',
  ];

  for (const configName of configNames) {
    const configPath = path.join(repoPath, configName);
    if (fs.existsSync(configPath)) {
      return { detected: true, configPath };
    }
  }

  // Check package.json for tailwindcss
  try {
    const packageJsonPath = path.join(repoPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      if (allDeps['tailwindcss']) {
        return { detected: true };
      }
    }
  } catch {
    // Ignore errors
  }

  return { detected: false };
}

// =============================================================================
// LIBRARY-AGNOSTIC HELPERS
// =============================================================================

/**
 * Get the appropriate CSS variable prefix for a library
 */
export function getCssVariablePrefix(library: ComponentLibrary): string {
  switch (library) {
    case 'shadcn':
      return '--';
    case 'radix':
      return '--radix-';
    case 'tailwind':
      return '--tw-';
    default:
      return '--';
  }
}

/**
 * Get Tailwind class conventions for a library
 */
export function getTailwindConventions(library: ComponentLibrary): {
  colorFormat: 'hsl' | 'rgb' | 'hex';
  useCssVariables: boolean;
  darkModeStrategy: 'class' | 'media';
} {
  switch (library) {
    case 'shadcn':
      return {
        colorFormat: 'hsl',
        useCssVariables: true,
        darkModeStrategy: 'class',
      };
    case 'radix':
      return {
        colorFormat: 'hsl',
        useCssVariables: true,
        darkModeStrategy: 'class',
      };
    case 'tailwind':
    default:
      return {
        colorFormat: 'hex',
        useCssVariables: false,
        darkModeStrategy: 'media',
      };
  }
}
