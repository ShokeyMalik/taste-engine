/**
 * Taste Engine MCP Server
 *
 * Model Context Protocol server for AI coding platforms.
 * Provides design intelligence tools that understand your codebase
 * and generate contextually appropriate UI code.
 *
 * @version 0.2.0
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { existsSync } from 'fs';

import { analyzeCodebase, type CodebaseAnalysis } from '../analyzer';
import { generateCode, type TasteConfig, type GeneratedCode } from '../generator';

// =============================================================================
// TOOL DEFINITIONS
// =============================================================================

const TOOLS = [
  {
    name: 'analyze_codebase',
    description: `Analyzes a codebase to extract:
- Component patterns (buttons, cards, surfaces, layouts)
- Design tokens (colors, spacing, typography, shadows)
- Tailwind class usage and conventions
- Existing variants and props

Use this FIRST before generating any code to understand the project's visual language.

Input:
- repo_path: Path to the repository root

Output:
- Full analysis including components, tokens, and patterns`,
    inputSchema: {
      type: 'object',
      properties: {
        repo_path: {
          type: 'string',
          description: 'Absolute path to the repository',
        },
      },
      required: ['repo_path'],
    },
  },
  {
    name: 'generate_component',
    description: `Generates a React component based on:
1. Codebase analysis (must run analyze_codebase first)
2. Taste configuration (abstraction, density, motion, contrast, narrative)

Taste parameters (all 0-1):
- abstraction: Low = concrete/literal, High = minimal/geometric
- density: Low = spacious, High = compact
- motion: Low = static, High = animated
- contrast: Low = subtle, High = bold
- narrative: Low = minimal, High = storytelling (for marketing pages)

Component types: button, card, layout, hero, features, cta

The generated code will:
- Match patterns found in your codebase
- Use your existing Tailwind classes
- Follow your component conventions`,
    inputSchema: {
      type: 'object',
      properties: {
        analysis: {
          type: 'object',
          description: 'Output from analyze_codebase tool',
        },
        taste: {
          type: 'object',
          properties: {
            abstraction: { type: 'number', minimum: 0, maximum: 1 },
            density: { type: 'number', minimum: 0, maximum: 1 },
            motion: { type: 'number', minimum: 0, maximum: 1 },
            contrast: { type: 'number', minimum: 0, maximum: 1 },
            narrative: { type: 'number', minimum: 0, maximum: 1 },
          },
          required: ['abstraction', 'density', 'motion', 'contrast', 'narrative'],
        },
        component_type: {
          type: 'string',
          enum: ['button', 'card', 'layout', 'hero', 'features', 'cta'],
          description: 'Type of component to generate',
        },
        name: {
          type: 'string',
          description: 'Name for the generated component',
        },
      },
      required: ['analysis', 'taste', 'component_type'],
    },
  },
  {
    name: 'get_taste_from_reference',
    description: `Get a taste configuration based on a reference brand/site.

Known references:
- linear: Clean, minimal, geometric (abstraction: 0.7, motion: 0.6)
- stripe: Polished, gradient-heavy (abstraction: 0.5, motion: 0.7)
- vercel: Ultra-minimal, stark contrast (abstraction: 0.8, contrast: 0.8)
- notion: Friendly, content-focused (abstraction: 0.3, narrative: 0.6)
- apple: Premium, spacious (abstraction: 0.6, narrative: 0.8)
- github: Developer-focused, dense (density: 0.6, contrast: 0.6)
- airbnb: Warm, photo-forward (narrative: 0.7, contrast: 0.5)

Returns a TasteConfig that can be passed to generate_component.`,
    inputSchema: {
      type: 'object',
      properties: {
        reference: {
          type: 'string',
          description: 'Reference brand name (linear, stripe, vercel, etc.)',
        },
      },
      required: ['reference'],
    },
  },
  {
    name: 'explain_taste',
    description: `Explains what each taste parameter does and provides examples.

Use this to understand how taste settings affect generated code:
- abstraction: How literal vs abstract the visual language is
- density: How spacious vs compact the layout is
- motion: How static vs animated interactions are
- contrast: How subtle vs bold visual hierarchy is
- narrative: How minimal vs storytelling the content presentation is`,
    inputSchema: {
      type: 'object',
      properties: {
        parameter: {
          type: 'string',
          enum: ['abstraction', 'density', 'motion', 'contrast', 'narrative', 'all'],
          description: 'Which parameter to explain',
        },
      },
      required: ['parameter'],
    },
  },
];

// =============================================================================
// TASTE REFERENCES
// =============================================================================

const TASTE_REFERENCES: Record<string, TasteConfig> = {
  linear: {
    abstraction: 0.7,
    density: 0.4,
    motion: 0.6,
    contrast: 0.7,
    narrative: 0.5,
  },
  stripe: {
    abstraction: 0.5,
    density: 0.5,
    motion: 0.7,
    contrast: 0.6,
    narrative: 0.7,
  },
  vercel: {
    abstraction: 0.8,
    density: 0.3,
    motion: 0.5,
    contrast: 0.8,
    narrative: 0.4,
  },
  notion: {
    abstraction: 0.3,
    density: 0.6,
    motion: 0.3,
    contrast: 0.5,
    narrative: 0.6,
  },
  figma: {
    abstraction: 0.4,
    density: 0.5,
    motion: 0.6,
    contrast: 0.5,
    narrative: 0.5,
  },
  apple: {
    abstraction: 0.6,
    density: 0.3,
    motion: 0.7,
    contrast: 0.7,
    narrative: 0.8,
  },
  github: {
    abstraction: 0.4,
    density: 0.6,
    motion: 0.3,
    contrast: 0.6,
    narrative: 0.4,
  },
  airbnb: {
    abstraction: 0.4,
    density: 0.4,
    motion: 0.5,
    contrast: 0.5,
    narrative: 0.7,
  },
  chronicle: {
    abstraction: 0.6,
    density: 0.4,
    motion: 0.5,
    contrast: 0.6,
    narrative: 0.6,
  },
  raycast: {
    abstraction: 0.6,
    density: 0.5,
    motion: 0.7,
    contrast: 0.7,
    narrative: 0.4,
  },
};

// =============================================================================
// TASTE EXPLANATIONS
// =============================================================================

const TASTE_EXPLANATIONS = {
  abstraction: {
    name: 'Abstraction',
    description: 'How literal vs geometric the visual language is',
    low: {
      value: '0.0 - 0.3',
      meaning: 'Concrete, literal, recognizable',
      examples: [
        'Solid buttons with clear borders',
        'Standard icons (✓ ✗ →)',
        'Explicit labels and text',
        'Familiar UI patterns',
      ],
      tailwind: 'bg-primary text-white rounded-md shadow-md',
    },
    medium: {
      value: '0.3 - 0.7',
      meaning: 'Balanced, refined',
      examples: [
        'Soft shadows, subtle gradients',
        'Mixed iconography',
        'Some visual interest',
      ],
      tailwind: 'bg-primary/90 rounded-lg shadow-sm',
    },
    high: {
      value: '0.7 - 1.0',
      meaning: 'Minimal, geometric, artistic',
      examples: [
        'Ghost buttons, wire outlines',
        'Abstract shapes (○ □ △)',
        'Relies on whitespace and composition',
        'Almost invisible borders',
      ],
      tailwind: 'border border-primary/30 text-primary rounded-full',
    },
  },
  density: {
    name: 'Density',
    description: 'How spacious vs compact the layout is',
    low: {
      value: '0.0 - 0.3',
      meaning: 'Spacious, breathing room',
      examples: [
        'Large padding (p-8 to p-12)',
        'Wide gaps between elements',
        'Generous line height',
        'Marketing pages, hero sections',
      ],
      tailwind: 'p-8 md:p-12 space-y-12 gap-8 leading-relaxed',
    },
    medium: {
      value: '0.3 - 0.7',
      meaning: 'Balanced spacing',
      examples: [
        'Standard padding (p-6)',
        'Comfortable gaps',
        'Normal line height',
      ],
      tailwind: 'p-6 space-y-8 gap-6 leading-normal',
    },
    high: {
      value: '0.7 - 1.0',
      meaning: 'Compact, information-dense',
      examples: [
        'Tight padding (p-4)',
        'Small gaps',
        'Tight line height',
        'Dashboards, data tables',
      ],
      tailwind: 'p-4 space-y-4 gap-3 leading-tight',
    },
  },
  motion: {
    name: 'Motion',
    description: 'How static vs animated interactions are',
    low: {
      value: '0.0 - 0.3',
      meaning: 'Nearly static, instant',
      examples: [
        'No hover effects',
        'Instant state changes',
        'No entrance animations',
        'Accessibility-friendly',
      ],
      tailwind: 'duration-0',
    },
    medium: {
      value: '0.3 - 0.7',
      meaning: 'Subtle animations',
      examples: [
        'Quick transitions (200ms)',
        'Gentle hover scale',
        'Fade-in entrance',
      ],
      tailwind: 'transition-all duration-200 hover:scale-[1.02]',
    },
    high: {
      value: '0.7 - 1.0',
      meaning: 'Rich, expressive motion',
      examples: [
        'Longer transitions (300ms+)',
        'Bouncy easing',
        'Staggered entrances',
        'Micro-interactions',
      ],
      tailwind: 'transition-all duration-300 hover:scale-105 hover:-translate-y-0.5',
    },
  },
  contrast: {
    name: 'Contrast',
    description: 'How subtle vs bold the visual hierarchy is',
    low: {
      value: '0.0 - 0.3',
      meaning: 'Subtle, soft',
      examples: [
        'Gray-600 text',
        'Light borders',
        'Small shadows',
        'Gentle dividers',
      ],
      tailwind: 'text-gray-600 border-gray-100 shadow-sm',
    },
    medium: {
      value: '0.3 - 0.7',
      meaning: 'Balanced hierarchy',
      examples: [
        'Gray-800 text',
        'Visible borders',
        'Medium shadows',
      ],
      tailwind: 'text-gray-800 border-gray-200 shadow-md',
    },
    high: {
      value: '0.7 - 1.0',
      meaning: 'Bold, stark',
      examples: [
        'Near-black text',
        'Strong borders',
        'Prominent shadows',
        'High-contrast dark mode',
      ],
      tailwind: 'text-gray-950 border-gray-300 shadow-lg',
    },
  },
  narrative: {
    name: 'Narrative',
    description: 'How minimal vs storytelling the content presentation is',
    low: {
      value: '0.0 - 0.3',
      meaning: 'Minimal, functional',
      examples: [
        'Small hero sections',
        'Direct CTAs',
        'No decorative elements',
        'Product-focused',
      ],
      tailwind: 'min-h-[40vh] text-left',
    },
    medium: {
      value: '0.3 - 0.7',
      meaning: 'Balanced presentation',
      examples: [
        'Medium hero',
        'Some storytelling',
        'Feature highlights',
      ],
      tailwind: 'min-h-[60vh] text-center',
    },
    high: {
      value: '0.7 - 1.0',
      meaning: 'Storytelling, immersive',
      examples: [
        'Full-screen hero',
        'Emotional imagery',
        'Brand story sections',
        'Marketing landing pages',
      ],
      tailwind: 'min-h-[80vh] text-center py-20',
    },
  },
};

// =============================================================================
// SERVER IMPLEMENTATION
// =============================================================================

class TasteEngineServer {
  private server: Server;
  private analysisCache: Map<string, CodebaseAnalysis> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: 'taste-engine',
        version: '0.2.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOLS,
    }));

    // Call tools
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'analyze_codebase':
            return await this.handleAnalyzeCodebase(args as { repo_path: string });

          case 'generate_component':
            return await this.handleGenerateComponent(args as {
              analysis: CodebaseAnalysis;
              taste: TasteConfig;
              component_type: 'button' | 'card' | 'layout' | 'hero' | 'features' | 'cta';
              name?: string;
            });

          case 'get_taste_from_reference':
            return this.handleGetTasteFromReference(args as { reference: string });

          case 'explain_taste':
            return this.handleExplainTaste(args as { parameter: string });

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
  }

  private async handleAnalyzeCodebase(args: { repo_path: string }) {
    const { repo_path } = args;

    if (!existsSync(repo_path)) {
      throw new McpError(ErrorCode.InvalidRequest, `Path not found: ${repo_path}`);
    }

    // Check cache
    if (this.analysisCache.has(repo_path)) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(this.analysisCache.get(repo_path), null, 2),
          },
        ],
      };
    }

    // Run analysis
    const analysis = await analyzeCodebase(repo_path);

    // Cache result
    this.analysisCache.set(repo_path, analysis);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(analysis, null, 2),
        },
      ],
    };
  }

  private async handleGenerateComponent(args: {
    analysis: CodebaseAnalysis;
    taste: TasteConfig;
    component_type: 'button' | 'card' | 'layout' | 'hero' | 'features' | 'cta';
    name?: string;
  }) {
    const { analysis, taste, component_type, name } = args;

    // Validate taste values
    for (const [key, value] of Object.entries(taste)) {
      if (typeof value !== 'number' || value < 0 || value > 1) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Invalid taste.${key}: must be a number between 0 and 1`
        );
      }
    }

    // Generate code
    const result: GeneratedCode = generateCode(analysis, taste, component_type, name);

    return {
      content: [
        {
          type: 'text',
          text: `## Generated ${component_type} Component${name ? ` (${name})` : ''}

### Explanation
${result.explanation}

### Code
\`\`\`tsx
${result.code}
\`\`\`

### Dependencies
${result.dependencies.length > 0 ? result.dependencies.join(', ') : 'None'}

### Required Imports
${result.imports.join('\n')}`,
        },
      ],
    };
  }

  private handleGetTasteFromReference(args: { reference: string }) {
    const { reference } = args;
    const refLower = reference.toLowerCase();

    const taste = TASTE_REFERENCES[refLower];

    if (!taste) {
      const available = Object.keys(TASTE_REFERENCES).join(', ');
      return {
        content: [
          {
            type: 'text',
            text: `Unknown reference: "${reference}"

Available references: ${available}

You can also create a custom taste config with values 0-1 for:
- abstraction
- density
- motion
- contrast
- narrative`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `## ${reference.charAt(0).toUpperCase() + reference.slice(1)} Taste Profile

\`\`\`json
${JSON.stringify(taste, null, 2)}
\`\`\`

### Characteristics
- **Abstraction (${taste.abstraction})**: ${taste.abstraction > 0.5 ? 'Minimal, geometric' : 'Concrete, recognizable'}
- **Density (${taste.density})**: ${taste.density > 0.5 ? 'Compact' : 'Spacious'}
- **Motion (${taste.motion})**: ${taste.motion > 0.5 ? 'Animated' : 'Subtle/static'}
- **Contrast (${taste.contrast})**: ${taste.contrast > 0.5 ? 'Bold hierarchy' : 'Soft, subtle'}
- **Narrative (${taste.narrative})**: ${taste.narrative > 0.5 ? 'Storytelling' : 'Functional'}

Use this with \`generate_component\` to create ${reference}-inspired components.`,
          },
        ],
      };
  }

  private handleExplainTaste(args: { parameter: string }) {
    const { parameter } = args;

    if (parameter === 'all') {
      const allExplanations = Object.entries(TASTE_EXPLANATIONS)
        .map(([key, exp]) => this.formatExplanation(key, exp))
        .join('\n\n---\n\n');

      return {
        content: [
          {
            type: 'text',
            text: `# Taste Parameters Guide\n\n${allExplanations}`,
          },
        ],
      };
    }

    const explanation = TASTE_EXPLANATIONS[parameter as keyof typeof TASTE_EXPLANATIONS];

    if (!explanation) {
      return {
        content: [
          {
            type: 'text',
            text: `Unknown parameter: "${parameter}"

Available parameters: abstraction, density, motion, contrast, narrative, all`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: this.formatExplanation(parameter, explanation),
        },
      ],
    };
  }

  private formatExplanation(key: string, exp: typeof TASTE_EXPLANATIONS.abstraction): string {
    return `## ${exp.name}

${exp.description}

### Low (${exp.low.value}) - ${exp.low.meaning}
${exp.low.examples.map(e => `- ${e}`).join('\n')}
\`\`\`tailwind
${exp.low.tailwind}
\`\`\`

### Medium (${exp.medium.value}) - ${exp.medium.meaning}
${exp.medium.examples.map(e => `- ${e}`).join('\n')}
\`\`\`tailwind
${exp.medium.tailwind}
\`\`\`

### High (${exp.high.value}) - ${exp.high.meaning}
${exp.high.examples.map(e => `- ${e}`).join('\n')}
\`\`\`tailwind
${exp.high.tailwind}
\`\`\``;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Taste Engine MCP server running on stdio');
  }
}

// =============================================================================
// MAIN
// =============================================================================

const server = new TasteEngineServer();
server.run().catch(console.error);
