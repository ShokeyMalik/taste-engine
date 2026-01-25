/**
 * PDF Service
 * Converts HTML design reports to professional PDF documents
 */

import { BrowserAutomation } from './browser-automation';
import * as fs from 'fs';
import * as path from 'path';

export class PDFService {
    /**
     * Convert HTML content to a PDF file
     */
    async generatePDF(html: string, outputPath: string): Promise<string> {
        const browser = new BrowserAutomation();

        try {
            await browser.launch({ headless: true });
            const page = browser.getPage();
            if (!page) throw new Error('Failed to open browser page');

            // Create a temporary HTML file
            const tempPath = path.join(process.cwd(), `temp-report-${Date.now()}.html`);
            fs.writeFileSync(tempPath, html);

            try {
                // Navigate to the local file
                await page.goto(`file://${tempPath}`, { waitUntil: 'networkidle' });

                // Ensure directory exists
                const dir = path.dirname(outputPath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                // Generate PDF
                await page.pdf({
                    path: outputPath,
                    format: 'A4',
                    printBackground: true,
                    margin: {
                        top: '20mm',
                        right: '20mm',
                        bottom: '20mm',
                        left: '20mm',
                    },
                });

                return path.resolve(outputPath);
            } finally {
                // Cleanup temp file
                if (fs.existsSync(tempPath)) {
                    fs.unlinkSync(tempPath);
                }
            }
        } finally {
            await browser.close();
        }
    }
}

/**
 * Convenience function to generate a design PDF
 */
export async function createDesignPDF(html: string, outputPath: string): Promise<string> {
    const service = new PDFService();
    return await service.generatePDF(html, outputPath);
}
