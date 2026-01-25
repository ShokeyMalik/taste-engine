declare const run_shell_command: any;

import { analyzeRawContent, URLAnalysisResult } from '../../inspiration/url-analyzer';

export interface GenerateDesignReportInput {
  url: string;
  output_pdf_path: string;
}

export interface GenerateDesignReportOutput {
  analysis_result: URLAnalysisResult;
  pdf_path: string | null;
  message: string;
}

export const GENERATE_DESIGN_REPORT_TOOL = {
  name: 'generate_design_report',
  description: 'Generates a detailed design report (including HTML, CSS, images, SVGs, motion, and a PDF) for a given URL using a headless browser.',
  inputSchema: {
    type: 'object',
    properties: {
      url: { type: 'string', description: 'The URL of the website to analyze.' },
      output_pdf_path: { type: 'string', description: 'The path where the generated PDF report will be saved.' },
    },
    required: ['url', 'output_pdf_path'],
  },
};

export async function handleGenerateDesignReport(
  input: GenerateDesignReportInput
): Promise<GenerateDesignReportOutput> {
  const { url, output_pdf_path } = input;

  try {
    // 1. Install Playwright dependencies (if not already done)
    // This part would ideally be handled by the environment setup, but for robustness
    // we can add a check or instruction. For now, assume it's installed.

    // 2. Call the Python scraper script
    const scriptPath = 'scripts/playwright_scraper.py'; // Path relative to project root
    const command = `python3 ${scriptPath} "${url}" "${output_pdf_path}"`;
    
    console.log(`Executing scraper command: ${command}`);
    // Assuming run_shell_command is globally available
    const shellResult = await run_shell_command({ command: command });
    console.log(`Scraper Stdout: ${shellResult.stdout}`);
    console.log(`Scraper Stderr: ${shellResult.stderr}`);

    if (shellResult.exitCode !== 0) {
      return {
        analysis_result: {
          url, success: false,
          extractedColors: { backgrounds: [], texts: [], accents: [], borders: [] },
          extractedTypography: { fontFamilies: [], fontSizes: [], fontWeights: [], lineHeights: [] },
          extractedSpacing: { paddings: [], margins: [], gaps: [] },
          extractedComponents: { borderRadii: [], shadows: [], transitions: [] },
          extractedImages: [], extractedSVGs: [], extractedLottieAnimations: [],
          extractedMotion: { libraries: [], animationTypes: [] }, cssVariables: {}, rawCSS: ''
        },
        pdf_path: null,
        message: `Scraping failed with exit code ${shellResult.exitCode}: ${shellResult.stderr}`
      };
    }

    const scraperOutput = JSON.parse(shellResult.stdout);

    if (!scraperOutput.success) {
      return {
        analysis_result: {
          url, success: false,
          extractedColors: { backgrounds: [], texts: [], accents: [], borders: [] },
          extractedTypography: { fontFamilies: [], fontSizes: [], fontWeights: [], lineHeights: [] },
          extractedSpacing: { paddings: [], margins: [], gaps: [] },
          extractedComponents: { borderRadii: [], shadows: [], transitions: [] },
          extractedImages: [], extractedSVGs: [], extractedLottieAnimations: [],
          extractedMotion: { libraries: [], animationTypes: [] }, cssVariables: {}, rawCSS: ''
        },
        pdf_path: null,
        message: `Scraper reported failure: ${scraperOutput.message || 'Unknown error'}`
      };
    }

    // 3. Analyze raw content using our existing logic
    const analysisResult = await analyzeRawContent(
      scraperOutput.html_content,
      scraperOutput.css_content,
      scraperOutput.url
    );

    return {
      analysis_result: analysisResult,
      pdf_path: scraperOutput.pdf_path,
      message: 'Design report generated successfully.'
    };

  } catch (error) {
    console.error('Error in handleGenerateDesignReport:', error);
    return {
      analysis_result: {
        url, success: false,
        extractedColors: { backgrounds: [], texts: [], accents: [], borders: [] },
        extractedTypography: { fontFamilies: [], fontSizes: [], fontWeights: [], lineHeights: [] },
        extractedSpacing: { paddings: [], margins: [], gaps: [] },
        extractedComponents: { borderRadii: [], shadows: [], transitions: [] },
        extractedImages: [], extractedSVGs: [], extractedLottieAnimations: [],
        extractedMotion: { libraries: [], animationTypes: [] }, cssVariables: {}, rawCSS: ''
      },
      pdf_path: null,
      message: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}