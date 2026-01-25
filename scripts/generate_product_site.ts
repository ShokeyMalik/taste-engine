import { handleGenerateMarketingSite } from '../src/mcp/tools/generate-marketing-site';
import { registerDefaultBlocks } from '../src/blocks';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const projectRoot = process.cwd();
    console.log(`🚀 Generating premium product landing page for Taste Engine...`);

    // Register blocks so the engine can find templates
    registerDefaultBlocks();

    console.log(`📂 Analyzing codebase at: ${projectRoot}`);

    try {
        const result = await handleGenerateMarketingSite({
            product_path: projectRoot,
            inspiration: 'linear.app', // Using Linear for that premium developer aesthetic
            product_name: 'Taste Engine',
            product_description: 'The Unified Design Intelligence Platform for High-Productivity Vibe Coding. Extract design tokens, high-fidelity assets, and global motion codes from any URL. Powering your IDE with real-world design context via MCP.',
            target_audience: 'High-fidelity UI Engineers and Vibe Coders',
            layout: {
                max_width: 'xl',
                spacing: 'spacious'
            }
        });

        // The tool returns React code for pages and blocks. 
        // For a simple verification, we'll concatenate the blocks into a "preview" HTML-like structure 
        // or just save the primary page code as a .tsx file and also generate a readable summary.

        const outputPath = path.join(projectRoot, 'taste-engine-product-preview.tsx');
        fs.writeFileSync(outputPath, result.pages[0].page_code);

        console.log(`✅ Success! Product landing page logic generated at: ${outputPath}`);
        console.log(`📝 Explanation: ${result.explanation}`);

        // Also generate a simple static HTML version for immediate viewing if possible
        // Since we can't easily compile React here without a build step, 
        // we'll just provide the TSX for now and a detailed success message.

    } catch (error) {
        console.error(`❌ Generation failed:`, error);
        process.exit(1);
    }
}

main();
