/**
 * Test script for Beautiful Design Profile generation
 */

import { generateUltimateHTML } from '../src/inspiration/miromiro';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
    const url = process.argv[2] || 'https://vercel.com';
    const outputPath = path.join(process.cwd(), 'ultimate-design-profile.html');

    console.log(`🚀 Generating ultimate design profile for: ${url}`);
    console.log(`📂 Output path: ${outputPath}`);

    try {
        const html = await generateUltimateHTML(url);
        fs.writeFileSync(outputPath, html);
        console.log(`✅ Success! Interactive HTML profile generated at: ${outputPath}`);
    } catch (error) {
        console.error('❌ Error generating profile:', error);
        process.exit(1);
    }
}

main();
