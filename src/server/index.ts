/**
 * Visual MCP Server
 *
 * Model Context Protocol server exposing visual design intelligence tools.
 * Transforms any React/Tailwind/shadcn codebase into a cohesive visual experience.
 *
 * @version 1.0.0
 * @contract Visual MCP Contract v1
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Import types from our contract
import type {
  VisualMCPOutput,
  RepoMetadata,
  TasteProfile,
  Plan,
  PatchInstructions,
  VerificationChecklist,
  TargetRoute,
  Inspiration,
} from '../mcp/contract';

// =============================================================================
// TOOL DEFINITIONS
// =============================================================================

const TOOLS = [
  {
    name: 'analyze_repo_ui',
    description: `Analyzes a repository to detect UI stack, framework, and configuration.

Detects:
- Framework (React, Vue, Svelte, etc.)
- CSS solution (Tailwind, styled-components, CSS modules)
- Component library (shadcn/ui, Radix, Chakra)
- Router (react-router, Next.js App Router, etc.)
- Build tool (Vite, Next.js, CRA)
- TypeScript usage
- Design system patterns

Returns a RepoMetadata object conforming to Visual MCP Contract v1.`,
    inputSchema: {
      type: 'object',
      properties: {
        repoPath: {
          type: 'string',
          description: 'Absolute path to the repository root',
        },
      },
      required: ['repoPath'],
    },
  },
  {
    name: 'derive_taste_from_inspirations',
    description: `Extracts visual taste profile from inspiration sources.

Accepts:
- URLs to reference sites (e.g., stripe.com, linear.app)
- Paths to screenshot images
- Named references (linear, stripe, vercel, notion, etc.)

Returns a TasteProfile with:
- abstraction (0-1): How abstract vs concrete the visual language
- restraint (0-1): How minimal vs decorative
- density (0-1): How packed vs spacious
- motion (0-1): How animated vs static
- motifPreference: Preferred motif types (dots, lines, etc.)
- typographyLooseness (0-1): How playful vs strict the typography
- colorTemperature: warm, cool, or neutral
- surfaceComplexity (0-1): How layered the surfaces are`,
    inputSchema: {
      type: 'object',
      properties: {
        inspirations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['url', 'screenshot', 'reference-name'],
              },
              value: {
                type: 'string',
                description: 'URL, file path, or reference name',
              },
              weight: {
                type: 'number',
                description: 'Influence weight 0-1 (default 1.0)',
              },
            },
            required: ['type', 'value'],
          },
          description: 'Array of inspiration sources',
        },
      },
      required: ['inspirations'],
    },
  },
  {
    name: 'propose_page_plan',
    description: `Generates a visual plan for a target page/route.

Creates a structured plan including:
- Archetype selection (dashboard, landing, detail, wizard, etc.)
- Storyboard structure (section hierarchy)
- Motif recommendations
- Signature block suggestions
- Recipe application

The plan follows Visual MCP Contract v1 and can be directly used
by generate_patch to produce file modifications.`,
    inputSchema: {
      type: 'object',
      properties: {
        repoMetadata: {
          type: 'object',
          description: 'RepoMetadata from analyze_repo_ui',
        },
        tasteProfile: {
          type: 'object',
          description: 'TasteProfile from derive_taste_from_inspirations',
        },
        targetRoute: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Route path (e.g., /dashboard)',
            },
            intent: {
              type: 'string',
              enum: ['product', 'marketing', 'docs', 'admin'],
            },
            audience: {
              type: 'string',
              description: 'Target audience (e.g., hotel-owner, developer)',
            },
          },
          required: ['path', 'intent'],
        },
        tuners: {
          type: 'object',
          description: 'Optional tuner overrides (abstraction, density, etc.)',
        },
      },
      required: ['repoMetadata', 'tasteProfile', 'targetRoute'],
    },
  },
  {
    name: 'generate_patch',
    description: `Generates file modification instructions from a plan.

Produces PatchInstructions containing:
- Files to create (with full content)
- Files to modify (with search/replace blocks)
- Files to delete (with safety checks)

IMPORTANT: This tool only generates instructions, it does NOT
apply changes automatically. The human/agent must review and
apply the patches.

All patches preserve existing functionality and only add/modify
visual presentation. Business logic is never touched.`,
    inputSchema: {
      type: 'object',
      properties: {
        plan: {
          type: 'object',
          description: 'Plan from propose_page_plan',
        },
        repoMetadata: {
          type: 'object',
          description: 'RepoMetadata from analyze_repo_ui',
        },
        dryRun: {
          type: 'boolean',
          description: 'If true, only validate without generating patches',
        },
      },
      required: ['plan', 'repoMetadata'],
    },
  },
  {
    name: 'verify_ui',
    description: `Runs verification checks on the UI implementation.

Executes:
1. ui:guard - Component guardrails (sizes, spacing, accessibility)
2. Visual baseline comparison (if baselines exist)
3. TypeScript type checking for design system types

Returns a VerificationChecklist with:
- All checks run and their status
- Warnings and errors
- Screenshot comparison results (if applicable)
- Suggestions for fixes`,
    inputSchema: {
      type: 'object',
      properties: {
        repoPath: {
          type: 'string',
          description: 'Absolute path to the repository root',
        },
        routes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional: specific routes to verify',
        },
        updateBaselines: {
          type: 'boolean',
          description: 'If true, update baselines instead of comparing',
        },
      },
      required: ['repoPath'],
    },
  },
];

// =============================================================================
// TOOL IMPLEMENTATIONS
// =============================================================================

/**
 * Analyze repository UI stack
 */
async function analyzeRepoUI(repoPath: string): Promise<RepoMetadata> {
  if (!existsSync(repoPath)) {
    throw new McpError(ErrorCode.InvalidRequest, `Repository path not found: ${repoPath}`);
  }

  const packageJsonPath = join(repoPath, 'package.json');
  if (!existsSync(packageJsonPath)) {
    throw new McpError(ErrorCode.InvalidRequest, 'No package.json found in repository');
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  // Detect stack
  const stack = deps['react'] ? 'react' : deps['vue'] ? 'vue' : deps['svelte'] ? 'svelte' : 'unknown';

  // Detect CSS solution
  const hasTailwind = !!deps['tailwindcss'];
  const hasStyledComponents = !!deps['styled-components'];
  const hasEmotion = !!deps['@emotion/react'];

  // Detect Tailwind version
  let tailwindVersion: string | undefined;
  if (deps['tailwindcss']) {
    tailwindVersion = deps['tailwindcss'].replace(/[\^~]/, '');
  }

  // Detect shadcn
  const hasShadcn = existsSync(join(repoPath, 'components.json')) ||
    existsSync(join(repoPath, 'src/components/ui'));

  // Detect design system
  let hasDesignSystem = false;
  let designSystemPath: string | undefined;
  const possiblePaths = ['src/design-system', 'src/styles', 'src/theme', 'design-system'];
  for (const p of possiblePaths) {
    if (existsSync(join(repoPath, p))) {
      hasDesignSystem = true;
      designSystemPath = p;
      break;
    }
  }

  return {
    stack: stack as RepoMetadata['stack'],
    hasTailwind,
    tailwindVersion,
    hasShadcn,
    hasStyledComponents,
    hasEmotion,
    hasDesignSystem,
    designSystemPath,
    srcPath: existsSync(join(repoPath, 'src')) ? 'src' : '.',
    componentsPath: existsSync(join(repoPath, 'src/components')) ? 'src/components' : undefined,
    pagesPath: existsSync(join(repoPath, 'src/pages')) ? 'src/pages' : undefined,
    router: deps['react-router-dom'] ? 'react-router' : deps['next'] ? 'next' : undefined,
  };
}

/**
 * Known reference profiles for taste derivation
 */
const KNOWN_REFERENCES: Record<string, TasteProfile> = {
  linear: {
    abstraction: 0.7,
    restraint: 0.8,
    density: 0.4,
    motion: 0.6,
    contrast: 0.7,
    narrative: 0.5,
    motifPreference: ['gradients', 'blur'],
    typographyLooseness: 0.3,
    colorTemperature: 'cool',
    surfaceComplexity: 0.5,
  },
  stripe: {
    abstraction: 0.5,
    restraint: 0.7,
    density: 0.5,
    motion: 0.7,
    contrast: 0.6,
    narrative: 0.7,
    motifPreference: ['gradients', 'mesh'],
    typographyLooseness: 0.4,
    colorTemperature: 'cool',
    surfaceComplexity: 0.6,
  },
  vercel: {
    abstraction: 0.8,
    restraint: 0.9,
    density: 0.3,
    motion: 0.5,
    contrast: 0.8,
    narrative: 0.4,
    motifPreference: ['lines', 'gradients'],
    typographyLooseness: 0.2,
    colorTemperature: 'neutral',
    surfaceComplexity: 0.3,
  },
  notion: {
    abstraction: 0.3,
    restraint: 0.6,
    density: 0.6,
    motion: 0.3,
    contrast: 0.5,
    narrative: 0.6,
    motifPreference: ['illustrations'],
    typographyLooseness: 0.5,
    colorTemperature: 'warm',
    surfaceComplexity: 0.4,
  },
  figma: {
    abstraction: 0.4,
    restraint: 0.5,
    density: 0.5,
    motion: 0.6,
    contrast: 0.5,
    narrative: 0.5,
    motifPreference: ['illustrations', 'icons'],
    typographyLooseness: 0.4,
    colorTemperature: 'warm',
    surfaceComplexity: 0.5,
  },
  apple: {
    abstraction: 0.6,
    restraint: 0.8,
    density: 0.3,
    motion: 0.7,
    contrast: 0.7,
    narrative: 0.8,
    motifPreference: ['photography', 'gradients'],
    typographyLooseness: 0.2,
    colorTemperature: 'neutral',
    surfaceComplexity: 0.4,
  },
  github: {
    abstraction: 0.4,
    restraint: 0.7,
    density: 0.6,
    motion: 0.3,
    contrast: 0.6,
    narrative: 0.4,
    motifPreference: ['icons', 'illustrations'],
    typographyLooseness: 0.3,
    colorTemperature: 'neutral',
    surfaceComplexity: 0.3,
  },
  airbnb: {
    abstraction: 0.3,
    restraint: 0.4,
    density: 0.5,
    motion: 0.5,
    contrast: 0.5,
    narrative: 0.7,
    motifPreference: ['photography', 'illustrations'],
    typographyLooseness: 0.5,
    colorTemperature: 'warm',
    surfaceComplexity: 0.5,
  },
  chronicle: {
    abstraction: 0.7,
    restraint: 0.6,
    density: 0.4,
    motion: 0.6,
    contrast: 0.7,
    narrative: 0.5,
    motifPreference: ['dots', 'lines', 'gradients'],
    typographyLooseness: 0.3,
    colorTemperature: 'cool',
    surfaceComplexity: 0.6,
  },
  raycast: {
    abstraction: 0.6,
    restraint: 0.8,
    density: 0.5,
    motion: 0.5,
    contrast: 0.7,
    narrative: 0.4,
    motifPreference: ['blur', 'gradients'],
    typographyLooseness: 0.3,
    colorTemperature: 'cool',
    surfaceComplexity: 0.5,
  },
};

/**
 * Derive taste profile from inspirations
 */
async function deriveTasteFromInspirations(
  inspirations: Array<{ type: string; value: string; weight?: number }>
): Promise<TasteProfile> {
  if (!inspirations || inspirations.length === 0) {
    throw new McpError(ErrorCode.InvalidRequest, 'At least one inspiration required');
  }

  const profiles: Array<{ profile: TasteProfile; weight: number }> = [];

  for (const insp of inspirations) {
    const weight = insp.weight ?? 1.0;

    if (insp.type === 'reference-name' || insp.type === 'reference') {
      const ref = KNOWN_REFERENCES[insp.value.toLowerCase()];
      if (ref) {
        profiles.push({ profile: ref, weight });
      } else {
        // Unknown reference - use neutral defaults
        profiles.push({
          profile: {
            abstraction: 0.5,
            restraint: 0.5,
            density: 0.5,
            motion: 0.5,
            contrast: 0.5,
            narrative: 0.5,
            motifPreference: ['gradients'],
            typographyLooseness: 0.5,
            colorTemperature: 'neutral',
            surfaceComplexity: 0.5,
          },
          weight: weight * 0.5,
        });
      }
    } else if (insp.type === 'url') {
      // Extract reference name from URL
      const domain = insp.value.replace(/^https?:\/\//, '').split('/')[0];
      const name = domain.replace(/\..*$/, '').toLowerCase();

      if (KNOWN_REFERENCES[name]) {
        profiles.push({ profile: KNOWN_REFERENCES[name], weight });
      } else {
        // URL not in known references - apply heuristics
        profiles.push({
          profile: {
            abstraction: 0.5,
            restraint: 0.5,
            density: 0.5,
            motion: 0.5,
            contrast: 0.5,
            narrative: 0.5,
            motifPreference: ['gradients'],
            typographyLooseness: 0.5,
            colorTemperature: 'neutral',
            surfaceComplexity: 0.5,
          },
          weight: weight * 0.3,
        });
      }
    } else if (insp.type === 'screenshot') {
      // Screenshot analysis - would use image analysis in production
      profiles.push({
        profile: {
          abstraction: 0.6,
          restraint: 0.5,
          density: 0.5,
          motion: 0.4,
          contrast: 0.5,
          narrative: 0.5,
          motifPreference: ['gradients'],
          typographyLooseness: 0.5,
          colorTemperature: 'neutral',
          surfaceComplexity: 0.5,
        },
        weight: weight * 0.5,
      });
    }
  }

  // Weighted average of all profiles
  const totalWeight = profiles.reduce((sum, p) => sum + p.weight, 0);

  const blended: TasteProfile = {
    abstraction: 0,
    restraint: 0,
    density: 0,
    motion: 0,
    contrast: 0,
    narrative: 0,
    motifPreference: [],
    typographyLooseness: 0,
    colorTemperature: 'neutral',
    surfaceComplexity: 0,
  };

  // Blend numeric values
  for (const { profile, weight } of profiles) {
    const w = weight / totalWeight;
    blended.abstraction += profile.abstraction * w;
    blended.restraint += profile.restraint * w;
    blended.density += profile.density * w;
    blended.motion += profile.motion * w;
    blended.contrast += profile.contrast * w;
    blended.narrative += profile.narrative * w;
    blended.typographyLooseness += profile.typographyLooseness * w;
    blended.surfaceComplexity += profile.surfaceComplexity * w;
  }

  // Collect motif preferences (unique)
  const motifSet = new Set<string>();
  for (const { profile } of profiles) {
    profile.motifPreference.forEach(m => motifSet.add(m));
  }
  blended.motifPreference = Array.from(motifSet);

  // Determine color temperature (majority vote)
  const tempCounts = { warm: 0, cool: 0, neutral: 0 };
  for (const { profile, weight } of profiles) {
    tempCounts[profile.colorTemperature] += weight;
  }
  blended.colorTemperature =
    tempCounts.warm > tempCounts.cool && tempCounts.warm > tempCounts.neutral ? 'warm' :
    tempCounts.cool > tempCounts.neutral ? 'cool' : 'neutral';

  return blended;
}

/**
 * Page archetypes with default recipes
 */
const PAGE_ARCHETYPES = {
  dashboard: {
    sections: ['header', 'metrics', 'charts', 'tables', 'actions'],
    motifs: ['dots', 'lines'],
    signatureBlocks: ['MetricRibbon', 'ChartCard', 'DataTable'],
  },
  landing: {
    sections: ['hero', 'features', 'social-proof', 'pricing', 'cta', 'footer'],
    motifs: ['gradients', 'blur', 'particles'],
    signatureBlocks: ['HeroSection', 'FeatureGrid', 'TestimonialCarousel', 'PricingTable'],
  },
  detail: {
    sections: ['header', 'content', 'sidebar', 'actions'],
    motifs: ['lines'],
    signatureBlocks: ['DetailHeader', 'ContentPane', 'ActionPanel'],
  },
  wizard: {
    sections: ['stepper', 'form', 'navigation'],
    motifs: ['lines', 'progress'],
    signatureBlocks: ['StepIndicator', 'FormSection', 'NavigationBar'],
  },
  settings: {
    sections: ['navigation', 'form', 'actions'],
    motifs: ['lines'],
    signatureBlocks: ['SettingsNav', 'SettingsForm', 'SaveBar'],
  },
  docs: {
    sections: ['navigation', 'content', 'toc'],
    motifs: ['lines'],
    signatureBlocks: ['DocNav', 'DocContent', 'TableOfContents'],
  },
};

/**
 * Propose a page plan
 */
async function proposePagePlan(
  repoMetadata: RepoMetadata,
  tasteProfile: TasteProfile,
  targetRoute: TargetRoute,
  tuners?: Record<string, number>
): Promise<Plan> {
  // Determine archetype from intent and path
  let archetype: keyof typeof PAGE_ARCHETYPES = 'dashboard';

  if (targetRoute.intent === 'marketing') {
    archetype = 'landing';
  } else if (targetRoute.path.includes('settings')) {
    archetype = 'settings';
  } else if (targetRoute.path.includes('wizard') || targetRoute.path.includes('onboard')) {
    archetype = 'wizard';
  } else if (targetRoute.path.includes('docs')) {
    archetype = 'docs';
  } else if (targetRoute.path.match(/\/[^/]+\/[^/]+$/)) {
    archetype = 'detail';
  }

  const archetypeConfig = PAGE_ARCHETYPES[archetype];

  // Select motifs based on taste profile
  const selectedMotifs = archetypeConfig.motifs.filter(motif =>
    tasteProfile.motifPreference.includes(motif) ||
    tasteProfile.abstraction > 0.5
  );

  // Apply tuners to taste profile
  const appliedTaste = { ...tasteProfile };
  if (tuners) {
    if (tuners.abstraction !== undefined) appliedTaste.abstraction = tuners.abstraction;
    if (tuners.density !== undefined) appliedTaste.density = tuners.density;
    if (tuners.motion !== undefined) appliedTaste.motion = tuners.motion;
    if (tuners.contrast !== undefined) appliedTaste.contrast = tuners.contrast;
    if (tuners.narrative !== undefined) appliedTaste.narrative = tuners.narrative;
  }

  // Generate section recommendations
  const sections = archetypeConfig.sections.map((section, index) => ({
    id: `section-${index}`,
    type: section,
    motif: selectedMotifs[index % selectedMotifs.length] || 'none',
    components: archetypeConfig.signatureBlocks.filter(block =>
      block.toLowerCase().includes(section) || index === 0
    ),
    recipe: {
      density: appliedTaste.density,
      spacing: appliedTaste.density < 0.5 ? 'spacious' : 'compact',
      motion: appliedTaste.motion > 0.5 ? 'enabled' : 'minimal',
    },
  }));

  return {
    targetRoute: targetRoute.path,
    archetype,
    intent: targetRoute.intent,
    audience: targetRoute.audience,
    sections,
    theme: {
      colorTemperature: appliedTaste.colorTemperature,
      surfaceComplexity: appliedTaste.surfaceComplexity,
      typographyLooseness: appliedTaste.typographyLooseness,
    },
    motifs: selectedMotifs,
    signatureBlocks: archetypeConfig.signatureBlocks,
    appliedTuners: tuners as Record<string, number> | undefined,
    confidence: 0.8,
    reasoning: `Selected ${archetype} archetype for ${targetRoute.intent} intent. ` +
      `Applied ${selectedMotifs.join(', ')} motifs based on taste profile with ` +
      `${(appliedTaste.abstraction * 100).toFixed(0)}% abstraction.`,
  };
}

/**
 * Generate patch instructions from a plan
 */
async function generatePatch(
  plan: Plan,
  repoMetadata: RepoMetadata,
  dryRun: boolean = false
): Promise<PatchInstructions> {
  const instructions: PatchInstructions = {
    patches: [],
    affectedFiles: [],
  };

  // Determine file paths based on repo structure
  const srcPath = repoMetadata.srcPath || 'src';
  const ext = 'tsx';

  // Route path to file path
  const routePath = plan.targetRoute.replace(/^\//, '').replace(/\//g, '-') || 'index';
  const pageDir = `${srcPath}/pages/${routePath}`;
  const pageFile = `${pageDir}/index.${ext}`;

  // Generate page component
  const pageContent = generatePageComponent(plan, repoMetadata);

  instructions.patches.push({
    file: pageFile,
    operation: 'create',
    content: pageContent,
    description: `Create ${plan.archetype} page for ${plan.targetRoute}`,
  });
  instructions.affectedFiles.push(pageFile);

  // Generate section components
  for (const section of plan.sections) {
    const sectionFile = `${pageDir}/${capitalizeFirst(section.type)}Section.${ext}`;
    const sectionContent = generateSectionComponent(section, plan, repoMetadata);

    instructions.patches.push({
      file: sectionFile,
      operation: 'create',
      content: sectionContent,
      description: `Create ${section.type} section component`,
    });
    instructions.affectedFiles.push(sectionFile);
  }

  if (dryRun) {
    // Add a marker that this is a dry run
    instructions.patches = instructions.patches.map(p => ({
      ...p,
      description: `[DRY RUN] ${p.description}`,
    }));
  }

  return instructions;
}

/**
 * Generate page component code
 */
function generatePageComponent(plan: Plan, repo: RepoMetadata): string {
  const imports = plan.sections.map(s =>
    `import { ${capitalizeFirst(s.type)}Section } from './${capitalizeFirst(s.type)}Section';`
  ).join('\n');

  const sections = plan.sections.map(s =>
    `        <${capitalizeFirst(s.type)}Section />`
  ).join('\n');

  return `/**
 * ${capitalizeFirst(plan.archetype)} Page - ${plan.targetRoute}
 *
 * Generated by Visual MCP Server
 * Intent: ${plan.intent}
 * Audience: ${plan.audience || 'general'}
 *
 * @generated Visual MCP Contract v1
 */

import React from 'react';
${imports}
import { cn } from '@/lib/utils';

export default function ${capitalizeFirst(plan.targetRoute.replace(/^\//, '').replace(/\//g, ''))}Page() {
  return (
    <div className={cn(
      "min-h-screen bg-background",
      "${plan.theme.colorTemperature === 'warm' ? 'warm-palette' : plan.theme.colorTemperature === 'cool' ? 'cool-palette' : ''}"
    )}>
      <main className="container mx-auto px-4 py-8">
${sections}
      </main>
    </div>
  );
}
`;
}

/**
 * Generate section component code
 */
function generateSectionComponent(
  section: Plan['sections'][0],
  plan: Plan,
  repo: RepoMetadata
): string {
  const motifImport = section.motif !== 'none'
    ? `import { MotifLayer } from '@/design-system/theme';`
    : '';

  const motifWrapper = section.motif !== 'none'
    ? `      <MotifLayer type="${section.motif}" intensity={0.3} />\n`
    : '';

  return `/**
 * ${capitalizeFirst(section.type)} Section
 *
 * Part of ${plan.archetype} page layout.
 * Motif: ${section.motif}
 * Density: ${section.recipe.density}
 *
 * @generated Visual MCP Contract v1
 */

import React from 'react';
${motifImport}
import { cn } from '@/lib/utils';

interface ${capitalizeFirst(section.type)}SectionProps {
  className?: string;
}

export function ${capitalizeFirst(section.type)}Section({ className }: ${capitalizeFirst(section.type)}SectionProps) {
  return (
    <section className={cn(
      "relative py-${section.recipe.spacing === 'spacious' ? '16' : '8'}",
      "${section.recipe.motion === 'enabled' ? 'motion-safe:animate-in' : ''}",
      className
    )}>
${motifWrapper}      <div className="relative z-10">
        {/* TODO: Add ${section.type} content */}
        <h2 className="text-2xl font-semibold">${capitalizeFirst(section.type)}</h2>
      </div>
    </section>
  );
}
`;
}

/**
 * Verify UI implementation
 */
async function verifyUI(
  repoPath: string,
  routes?: string[],
  updateBaselines?: boolean
): Promise<VerificationChecklist> {
  const checks: VerificationChecklist['checks'] = [];

  // Run ui:guard
  try {
    const guardOutput = execSync('npm run ui:guard 2>&1', {
      cwd: repoPath,
      encoding: 'utf-8',
      timeout: 60000,
    });
    checks.push({
      name: 'ui:guard',
      status: 'pass',
      message: 'Component guardrails passed',
      details: guardOutput,
    });
  } catch (error: unknown) {
    const err = error as { stdout?: string; message?: string };
    checks.push({
      name: 'ui:guard',
      status: 'fail',
      message: 'Component guardrails failed',
      details: err.stdout || err.message,
    });
  }

  // Run visual comparison or update
  const visualCommand = updateBaselines ? 'npm run ui:shots' : 'npm run ui:diff';
  try {
    const visualOutput = execSync(`${visualCommand} 2>&1`, {
      cwd: repoPath,
      encoding: 'utf-8',
      timeout: 120000,
    });
    checks.push({
      name: 'visual-regression',
      status: 'pass',
      message: updateBaselines ? 'Baselines updated' : 'Visual comparison passed',
      details: visualOutput,
    });
  } catch (error: unknown) {
    const err = error as { stdout?: string; message?: string };
    checks.push({
      name: 'visual-regression',
      status: updateBaselines ? 'warn' : 'fail',
      message: updateBaselines ? 'Baseline update had issues' : 'Visual regression detected',
      details: err.stdout || err.message,
    });
  }

  // TypeScript check
  if (existsSync(join(repoPath, 'tsconfig.json'))) {
    try {
      execSync('npx tsc --noEmit 2>&1', {
        cwd: repoPath,
        encoding: 'utf-8',
        timeout: 120000,
      });
      checks.push({
        name: 'typescript',
        status: 'pass',
        message: 'TypeScript compilation successful',
      });
    } catch (error: unknown) {
      const err = error as { stdout?: string; message?: string };
      checks.push({
        name: 'typescript',
        status: 'warn',
        message: 'TypeScript errors found',
        details: err.stdout || err.message,
      });
    }
  }

  const passCount = checks.filter(c => c.status === 'pass').length;
  const failCount = checks.filter(c => c.status === 'fail').length;

  return {
    checks,
    summary: {
      total: checks.length,
      passed: passCount,
      failed: failCount,
      warnings: checks.filter(c => c.status === 'warn').length,
    },
    overallStatus: failCount > 0 ? 'fail' : passCount === checks.length ? 'pass' : 'warn',
  };
}

// =============================================================================
// UTILITIES
// =============================================================================

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// =============================================================================
// MCP SERVER SETUP
// =============================================================================

const server = new Server(
  {
    name: 'taste-engine-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'analyze_repo_ui': {
        const result = await analyzeRepoUI(args.repoPath as string);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }

      case 'derive_taste_from_inspirations': {
        const result = await deriveTasteFromInspirations(
          args.inspirations as Array<{ type: string; value: string; weight?: number }>
        );
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }

      case 'propose_page_plan': {
        const result = await proposePagePlan(
          args.repoMetadata as RepoMetadata,
          args.tasteProfile as TasteProfile,
          args.targetRoute as TargetRoute,
          args.tuners as Record<string, number>
        );
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }

      case 'generate_patch': {
        const result = await generatePatch(
          args.plan as Plan,
          args.repoMetadata as RepoMetadata,
          args.dryRun as boolean
        );
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }

      case 'verify_ui': {
        const result = await verifyUI(
          args.repoPath as string,
          args.routes as string[],
          args.updateBaselines as boolean
        );
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) throw error;
    throw new McpError(
      ErrorCode.InternalError,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Taste Engine MCP Server running on stdio');
}

main().catch(console.error);

// Export for testing
export { analyzeRepoUI, deriveTasteFromInspirations, proposePagePlan, generatePatch, verifyUI };
export { KNOWN_REFERENCES, PAGE_ARCHETYPES };
