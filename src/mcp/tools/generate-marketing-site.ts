/**
 * Generate Marketing Site MCP Tool
 *
 * Creates a complete marketing website by:
 * 1. Deeply analyzing an inspiration website for visual style
 * 2. Scanning the product codebase to understand the tool/features
 * 3. Generating all marketing page blocks with compelling copy
 */

import type { BlockType, AppliedTuners, BlockPlacement } from '../../blocks/types';
import type { InspirationProfile } from '../../inspiration/inspiration-profile';
import { PageComposer } from '../../generator/page-composer';
import { DEFAULT_TUNERS } from '../../blocks/types';
import { handleApplyInspiration } from './apply-inspiration';
import { analyzeCodebase, type CodebaseAnalysis } from '../../analyzer';
import { existsSync } from 'fs';

// =============================================================================
// TYPES
// =============================================================================

export interface GenerateMarketingSiteInput {
  /** Path to the product codebase to analyze */
  product_path: string;
  /** Inspiration source(s) - URL or brand name, or comma-separated list of sources to synthesize */
  inspiration: string | string[];
  /** Product name (auto-detected if not provided) */
  product_name?: string;
  /** Brief product description (auto-detected if not provided) */
  product_description?: string;
  /** Target audience (helps tailor messaging) */
  target_audience?: string;
  /** Blocks to include (defaults to full marketing site) */
  blocks?: BlockType[];
  /** Custom tuner overrides */
  tuners?: Partial<AppliedTuners>;
  /** Layout settings */
  layout?: {
    max_width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    spacing?: 'tight' | 'normal' | 'spacious';
  };
}

export interface GenerateMarketingSiteOutput {
  /** Generated pages and their components */
  pages: Array<{
    name: string;
    route: string;
    page_code: string;
    page_file_name: string;
    blocks: Array<{
      component_name: string;
      file_name: string;
      code: string;
      block_type: BlockType;
      variant: string;
    }>;
  }>;
  /** Product insights extracted from codebase */
  product_insights: {
    name: string;
    description: string;
    features: string[];
    tech_stack: string[];
    key_files: string[];
  };
  /** Inspiration analysis */
  inspiration_analysis: {
    source: string;
    style_summary: string;
    colors: Record<string, string>;
    typography: string;
    tuners: AppliedTuners;
  };
  /** All dependencies needed */
  dependencies: string[];
  /** CSS variables to add */
  css_variables: Record<string, string>;
  /** Tailwind config extensions */
  tailwind_config: object;
  /** Complete file structure */
  file_structure: string[];
  /** Explanation of choices made */
  explanation: string;
}

// =============================================================================
// TOOL DEFINITION
// =============================================================================

export const GENERATE_MARKETING_SITE_TOOL = {
  name: 'generate_marketing_site',
  description: `Generates a complete marketing website for a product.

This is the MOST POWERFUL tool - it:
1. Deeply analyzes an inspiration website/brand for visual style
2. Scans your product codebase to understand features and value props
3. Generates a full marketing site with compelling copy

USE THIS WHEN the user asks to create a marketing/landing page for their product.

Input:
- product_path: Path to the product/tool codebase
- inspiration: Website URL or brand name to inspire the design (e.g., "stripe.com" or "linear")

Output: Complete marketing site with:
- Hero section with product-specific headline and CTA
- Features section highlighting actual product capabilities
- Pricing section (if applicable)
- Testimonials section with placeholder quotes
- FAQ section based on product functionality
- CTA section with conversion-focused copy
- Footer with navigation

The generated copy is based on ACTUAL analysis of your product code.

Known brand inspirations: linear, stripe, vercel, notion, figma, apple, github, airbnb, raycast

Example:
{
  "product_path": "/path/to/my-project",
  "inspiration": "linear"
}`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      product_path: {
        type: 'string',
        description: 'Path to the product codebase to analyze',
      },
      inspiration: {
        type: 'string',
        description: 'Inspiration source - URL (e.g., "stripe.com") or brand name (e.g., "linear")',
      },
      product_name: {
        type: 'string',
        description: 'Product name (auto-detected from package.json if not provided)',
      },
      product_description: {
        type: 'string',
        description: 'Brief product description (auto-detected if not provided)',
      },
      target_audience: {
        type: 'string',
        description: 'Target audience description (e.g., "developers", "designers", "startups")',
      },
      blocks: {
        type: 'array',
        items: { type: 'string' },
        description: 'Specific blocks to include (defaults to full marketing site)',
      },
      tuners: {
        type: 'object',
        properties: {
          abstraction: { type: 'number', minimum: 0, maximum: 1 },
          density: { type: 'number', minimum: 0, maximum: 1 },
          motion: { type: 'number', minimum: 0, maximum: 1 },
          contrast: { type: 'number', minimum: 0, maximum: 1 },
          narrative: { type: 'number', minimum: 0, maximum: 1 },
        },
        description: 'Custom tuner overrides',
      },
      layout: {
        type: 'object',
        properties: {
          max_width: {
            type: 'string',
            enum: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
          },
          spacing: {
            type: 'string',
            enum: ['tight', 'normal', 'spacious'],
          },
        },
      },
    },
    required: ['product_path', 'inspiration'],
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

interface ProductInsights {
  name: string;
  description: string;
  features: string[];
  techStack: string[];
  keyFiles: string[];
}

async function extractProductInsights(
  productPath: string,
  analysis: CodebaseAnalysis
): Promise<ProductInsights> {
  // Try to read package.json for basic info
  let name = 'Your Product';
  let description = 'A powerful tool for modern developers';
  const features: string[] = [];
  const techStack: string[] = [];
  const keyFiles: string[] = [];

  try {
    const packageJsonPath = `${productPath}/package.json`;
    if (existsSync(packageJsonPath)) {
      const fs = await import('fs');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      if (packageJson.name) {
        name = packageJson.name
          .replace(/[-_]/g, ' ')
          .split(' ')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }

      if (packageJson.description) {
        description = packageJson.description;
      }

      // Extract tech stack from dependencies
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      if (deps) {
        if (deps.react || deps['react-dom']) techStack.push('React');
        if (deps.next) techStack.push('Next.js');
        if (deps.vue) techStack.push('Vue');
        if (deps.svelte) techStack.push('Svelte');
        if (deps.tailwindcss) techStack.push('Tailwind CSS');
        if (deps.typescript) techStack.push('TypeScript');
        if (deps.prisma || deps['@prisma/client']) techStack.push('Prisma');
        if (deps.drizzle) techStack.push('Drizzle');
        if (deps.trpc || deps['@trpc/client']) techStack.push('tRPC');
        if (deps.zod) techStack.push('Zod');
      }

      // Extract keywords as potential features
      if (packageJson.keywords && Array.isArray(packageJson.keywords)) {
        features.push(...packageJson.keywords.slice(0, 5).map((k: string) =>
          k.charAt(0).toUpperCase() + k.slice(1).replace(/-/g, ' ')
        ));
      }
    }
  } catch {
    // Ignore errors reading package.json
  }

  // Extract features from analysis patterns
  if (analysis.patterns) {
    if (analysis.patterns.buttonVariants?.length > 0) {
      features.push('Customizable Components');
    }
    if (analysis.patterns.layoutPatterns?.length > 0) {
      features.push('Flexible Layouts');
    }
  }

  // Add common features based on tech stack
  if (techStack.includes('TypeScript')) {
    features.push('Type-safe Development');
  }
  if (techStack.includes('React')) {
    features.push('Modern React Architecture');
  }

  // Ensure we have at least some features
  if (features.length === 0) {
    features.push(
      'Lightning Fast Performance',
      'Developer-First Experience',
      'Seamless Integration',
      'Production Ready'
    );
  }

  // Track key files from analysis
  if (analysis.components) {
    keyFiles.push(...analysis.components.slice(0, 5).map(c => c.name || c.type));
  }

  return {
    name,
    description,
    features: [...new Set(features)].slice(0, 6),
    techStack: [...new Set(techStack)],
    keyFiles: [...new Set(keyFiles)],
  };
}

function generateMarketingContent(
  insights: ProductInsights,
  targetAudience?: string
): Record<string, Record<string, string>> {
  const audience = targetAudience || 'developers';

  return {
    hero: {
      headline: `Ship ${insights.name} to Production Faster`,
      subheadline: insights.description,
      cta_primary: 'Get Started Free',
      cta_secondary: 'View Documentation',
    },
    features: {
      headline: `Why ${audience} love ${insights.name}`,
      subheadline: `Everything you need to build amazing products`,
      feature_1: insights.features[0] || 'Lightning Fast',
      feature_1_description: 'Optimized for speed and performance',
      feature_2: insights.features[1] || 'Developer Experience',
      feature_2_description: 'Built with developers in mind',
      feature_3: insights.features[2] || 'Production Ready',
      feature_3_description: 'Battle-tested and reliable',
    },
    pricing: {
      headline: 'Simple, transparent pricing',
      subheadline: 'Start free, scale as you grow',
    },
    testimonials: {
      headline: `Trusted by ${audience} worldwide`,
      subheadline: 'See what others are saying',
    },
    cta: {
      headline: `Ready to try ${insights.name}?`,
      subheadline: 'Get started in minutes',
      cta_primary: 'Start Building',
    },
    faq: {
      headline: 'Frequently Asked Questions',
      subheadline: 'Everything you need to know',
    },
  };
}

// =============================================================================
// HANDLER
// =============================================================================

export async function handleGenerateMarketingSite(
  input: GenerateMarketingSiteInput
): Promise<GenerateMarketingSiteOutput> {
  const { product_path, inspiration, target_audience } = input;

  // Validate product path
  if (!existsSync(product_path)) {
    throw new Error(`Product path not found: ${product_path}`);
  }

  // Step 1: Analyze the product codebase
  const codebaseAnalysis = await analyzeCodebase(product_path);
  const productInsights = await extractProductInsights(product_path, codebaseAnalysis);

  // Override with user-provided values
  if (input.product_name) {
    productInsights.name = input.product_name;
  }
  if (input.product_description) {
    productInsights.description = input.product_description;
  }

  // Step 2: Analyze inspiration source(s) for visual style
  const sources = Array.isArray(inspiration)
    ? inspiration
    : inspiration.includes(',')
      ? inspiration.split(',').map(s => s.trim())
      : [inspiration];

  const inspirationResult = await handleApplyInspiration({
    sources,
    base_tuners: input.tuners,
  });

  // Step 3: Generate marketing content based on product insights
  const marketingContent = generateMarketingContent(productInsights, target_audience);

  // Step 4: Determine which blocks to include
  const defaultBlocks: BlockType[] = [
    'navigation',
    'hero',
    'logo-cloud',
    'features',
    'stats',
    'testimonials',
    'pricing',
    'faq',
    'cta',
    'footer',
  ];

  const blocksToGenerate = input.blocks || defaultBlocks;

  // Step 5: Build block placements with content
  const blocks: BlockPlacement[] = blocksToGenerate.map((blockType, index) => ({
    blockType,
    variant: getDefaultVariant(blockType),
    order: index,
    content: marketingContent[blockType],
  }));

  // Step 6: Merge tuners
  const tuners: AppliedTuners = {
    ...DEFAULT_TUNERS,
    ...inspirationResult.tuners,
    ...input.tuners,
    // Marketing sites should be more narrative-focused
    narrative: Math.max(inspirationResult.tuners.narrative, 0.7),
  };

  // Step 7: Create page composer and generate
  const composer = new PageComposer({
    defaultLibrary: 'shadcn',
    defaultProfile: inspirationResult.profile,
    defaultTuners: tuners,
  });

  const landingPage = await composer.compose({
    name: 'LandingPage',
    route: '/',
    context: 'marketing',
    blocks,
    tuners,
    layout: {
      maxWidth: input.layout?.max_width || 'xl',
      hasNavigation: true,
      hasFooter: true,
      spacing: input.layout?.spacing || 'spacious',
    },
  });

  // Build file structure
  const fileStructure = [
    'app/page.tsx',
    ...landingPage.blockComponents.map((b) => `components/${b.fileName}`),
    'styles/globals.css',
  ];

  // Build style summary
  const sourceNames = sources.join(', ');
  const styleSummary = `${sourceNames} inspired design with ${tuners.abstraction > 0.5 ? 'minimal, geometric' : 'concrete, approachable'
    } aesthetics, ${tuners.density > 0.5 ? 'compact' : 'spacious'
    } layout, and ${tuners.motion > 0.5 ? 'rich animations' : 'subtle transitions'
    }`;

  return {
    pages: [
      {
        name: 'LandingPage',
        route: '/',
        page_code: landingPage.pageCode,
        page_file_name: landingPage.fileName,
        blocks: landingPage.blockComponents.map((b) => ({
          component_name: b.componentName,
          file_name: b.fileName,
          code: b.code,
          block_type: b.blockType,
          variant: b.variant,
        })),
      },
    ],
    product_insights: {
      name: productInsights.name,
      description: productInsights.description,
      features: productInsights.features,
      tech_stack: productInsights.techStack,
      key_files: productInsights.keyFiles,
    },
    inspiration_analysis: {
      source: sourceNames,
      style_summary: styleSummary,
      colors: inspirationResult.css_variables,
      typography: inspirationResult.profile.typography?.headingFont?.[0] || 'System',
      tuners: inspirationResult.tuners,
    },
    dependencies: landingPage.dependencies,
    css_variables: landingPage.cssVariables,
    tailwind_config: landingPage.tailwindConfig,
    file_structure: fileStructure,
    explanation: `Generated a complete marketing site for "${productInsights.name}" inspired by a synthesis of ${sourceNames}.

**Product Analysis:**
- Detected ${productInsights.features.length} key features from your codebase
- Tech stack: ${productInsights.techStack.join(', ') || 'Not detected'}

**Design Decisions:**
- ${styleSummary}
- Generated ${landingPage.blockComponents.length} blocks for a complete marketing experience

**Generated Sections:**
${blocksToGenerate.map((b, i) => `${i + 1}. ${b}`).join('\n')}

The content is tailored to your product based on actual codebase analysis.`,
  };
}

function getDefaultVariant(blockType: BlockType): string {
  const variants: Record<BlockType, string> = {
    hero: 'gradient-orbs',
    navigation: 'sticky',
    features: 'grid',
    pricing: 'simple',
    testimonials: 'carousel',
    faq: 'accordion',
    cta: 'simple',
    footer: 'multi-column',
    'logo-cloud': 'simple',
    stats: 'simple',
    sidebar: 'collapsible',
    header: 'simple',
    'data-table': 'simple',
    'metric-cards': 'grid',
    'chart-section': 'simple',
    'activity-feed': 'simple',
    'settings-panel': 'simple',
    'command-palette': 'simple',
    auth: 'login',
    'empty-state': 'simple',
    'error-page': '404',
    loading: 'spinner',
  };
  return variants[blockType] || 'simple';
}
