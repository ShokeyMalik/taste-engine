import { CodebaseAnalyzer } from '../../analyzer';
import * as path from 'path';

/**
 * MCP tool to analyze the current codebase for "vibe coding" context
 */
export const analyzeCodebaseVibe = {
    name: 'analyze_codebase_vibe',
    description: 'Analyzes the local codebase to understand its design system, component patterns, and styling approach for intelligent UI transformation.',
    inputSchema: {
        type: 'object',
        properties: {
            projectRoot: {
                type: 'string',
                description: 'Absolute path to the project root directory'
            }
        },
        required: ['projectRoot']
    },
    handler: async (args: { projectRoot: string }) => {
        try {
            const analyzer = new CodebaseAnalyzer(args.projectRoot);
            const analysis = await analyzer.analyze();

            // Extract high-level vibe summary
            const vibe = {
                framework: analysis.stats.tailwindUsage > 0 ? 'Tailwind CSS' : (analysis.stats.cssModulesUsage > 0 ? 'CSS Modules' : 'Standard CSS'),
                componentArchitecture: analysis.components.length > 5 ? 'Atomic/Modular' : 'Simple',
                popularComponents: analysis.components.slice(0, 5).map(c => c.name),
                designTokensFound: {
                    colors: analysis.tokens.colors.primary.length,
                    typography: analysis.tokens.typography.fontSizes.length,
                    spacing: analysis.tokens.spacing.scale.length
                },
                stats: analysis.stats
            };

            return {
                content: [
                    {
                        type: 'text',
                        text: `Codebase analysis complete. Here is the local "vibe" profile:\n\n${JSON.stringify(vibe, null, 2)}\n\nI can now use this context to adapt inspiration from external URLs to match your project's specific coding style.`
                    }
                ]
            };
        } catch (error) {
            return {
                content: [{ type: 'text', text: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}` }],
                isError: true
            };
        }
    }
};
