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
        const desktopPath = path.join(process.env.HOME || '', 'Desktop');
        const mainPagePath = path.join(desktopPath, 'taste-engine-premium-landing.tsx');
        fs.writeFileSync(mainPagePath, result.pages[0].page_code);

        console.log(`✅ Main page shell saved to: ${mainPagePath}`);

        // Save all individual block components
        console.log(`📦 Saving high-fidelity block components...`);
        const componentsDir = path.join(desktopPath, 'taste-engine-blocks');
        if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir);

        result.pages[0].blocks.forEach(block => {
            const blockPath = path.join(componentsDir, block.file_name);
            fs.writeFileSync(blockPath, block.code);
            console.log(`   - ${block.component_name} saved`);
        });

        console.log(`\n🎉 DONE! You can now inspect the full "super solid" code on your Desktop in the 'taste-engine-blocks' folder.`);
        console.log(`📝 Explanation: ${result.explanation}`);

    } catch (error) {
        console.error(`❌ Generation failed:`, error);
        process.exit(1);
    }
}

main();
