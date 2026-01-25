/**
 * Multi-Source Design Synthesis Generator
 * 
 * This script demonstrates the "Ultimate Synthesis" use case: 
 * blending up to 5 inspiration URLs into a single premium UI.
 */

import { handleApplyInspiration } from '../src/mcp/tools/apply-inspiration';
import { handleGenerateMarketingSite } from '../src/mcp/tools/generate-marketing-site';
import { registerDefaultBlocks } from '../src/blocks';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const projectRoot = process.cwd();
    const desktopPath = path.join(process.env.HOME || '', 'Desktop');

    // 1. The Multi-Source Trigger (Up to 5 URLs)
    const inspirationSources = [
        'https://stripe.com',      // For those clean shadows and grays
        'https://linear.app',      // For the dark-mode orbital vibe
        'https://vercel.com',      // For the typography and spaciousness
        'linear',                  // Brand keyword mix-in
        'stripe'                   // Brand keyword mix-in
    ];

    console.log(`🧠 STARTING ULTIMATE DESIGN SYNTHESIS...`);
    console.log(`🔗 Mixing features from: ${inspirationSources.join(', ')}`);

    try {
        // 2. Generate the Marketing Site using the Multi-Source Inspiration
        console.log(`🚀 Generating marketing site based on Synthesized Vibe...`);
        console.log(`🔧 This will blend: ${inspirationSources.join(', ')}`);
        registerDefaultBlocks();

        const result = await handleGenerateMarketingSite({
            product_path: projectRoot,
            product_name: 'Taste Engine Synthesized',
            product_description: 'The Unified Design Intelligence Platform powering the world with Blended Visuals. High-fidelity motion meet industrial precision.',
            target_audience: 'Premium UI Engineers',
            inspiration: inspirationSources, // Pass the array directly!
            layout: {
                max_width: 'xl',
                spacing: 'spacious'
            }
        });

        // 4. Save results to Desktop
        const mainPagePath = path.join(desktopPath, 'synthesized-premium-landing.tsx');
        fs.writeFileSync(mainPagePath, result.pages[0].page_code);

        console.log(`✅ Main page shell saved to: ${mainPagePath}`);

        const componentsDir = path.join(desktopPath, 'synthesized-blocks');
        if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir);

        result.pages[0].blocks.forEach(block => {
            const blockPath = path.join(componentsDir, block.file_name);
            fs.writeFileSync(blockPath, block.code);
            console.log(`   - ${block.component_name} saved`);
        });

        console.log(`\n🎉 DONE! You have successfully mixed 5 elite websites into 1 cohesive design system.`);

    } catch (error) {
        console.error(`❌ Synthesis failed:`, error);
        process.exit(1);
    }
}

main();
