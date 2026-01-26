import { handleGenerateMarketingSite } from '../src/mcp/tools/generate-marketing-site';
import { registerDefaultBlocks } from '../src/blocks';
import * as fs from 'fs';
import * as path from 'path';

const INSPIRATION_URLS = [
    'https://miromiro.app/',
    'https://www.radix-ui.com/',
    'https://chakra-ui.com/',
    'https://ui.shadcn.com/'
];

async function main() {
    console.log('🌪️  INHERITING DNA & BUILDING TASTE-ENGINE MARKETING SITE...');

    // Initialize Registry
    registerDefaultBlocks();

    try {
        // 1. EXECUTE THE FULL PRODUCTION PIPELINE
        // This analyzes the codebase, crawls the URLs, and generates BESPOKE components
        const result = await handleGenerateMarketingSite({
            product_path: '/Users/shokeymalik/Downloads/taste-engine',
            inspiration: INSPIRATION_URLS,
            product_name: 'Taste Engine',
            product_description: 'The Design Intelligence Brain for AI-First Coding. Transform generic AI code into elite, bespoke UIs via Structural DNA Synthesis.',
            target_audience: 'Engineers who code at the speed of thought (Vibe Coders) and AI agents.',
            blocks: [
                'navigation',
                'hero',
                'logo-cloud',
                'features',
                'stats',
                'testimonials',
                'pricing',
                'faq',
                'cta',
                'footer'
            ]
        });

        // 2. EXPORT TO DESKTOP
        const desktopPath = '/Users/shokeymalik/Desktop/taste-engine-official-site';
        if (fs.existsSync(desktopPath)) {
            fs.rmSync(desktopPath, { recursive: true, force: true });
        }
        fs.mkdirSync(desktopPath, { recursive: true });
        fs.mkdirSync(path.join(desktopPath, 'components'), { recursive: true });

        // Save App.tsx
        fs.writeFileSync(path.join(desktopPath, 'App.tsx'), result.pages[0].page_code);

        // Save All Bespoke Components
        for (const block of result.pages[0].blocks) {
            fs.writeFileSync(path.join(desktopPath, 'components', block.file_name), block.code);
            console.log(`   ✅ Generated Bespoke Block: ${block.component_name}`);
        }

        // Save Style Tokens
        const styles = `
:root {
${Object.entries(result.css_variables).map(([k, v]) => `  ${k}: ${v};`).join('\n')}
}
        `;
        fs.writeFileSync(path.join(desktopPath, 'globals.css'), styles);

        console.log(`\n✨ PRODUCTION COMPLETE!`);
        console.log(`📂 Destination: ${desktopPath}`);
        console.log(`🧠 Synthesis Logic: ${result.explanation.split('\n')[0]}`);

    } catch (error) {
        console.error('❌ Production Pipeline Failed:', error);
    }
}

main();
