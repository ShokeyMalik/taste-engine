import { describe, it, expect, vi } from 'vitest';
import { analyzeURL, analyzeRawContent } from '../../src/inspiration/url-analyzer';

// Define global.web_fetch as a mock function
global.web_fetch = vi.fn();

describe('URL Analyzer', () => {
  // Common mock data for HTML and CSS
  const mockHtmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Mock Page</title>
      <link rel="stylesheet" href="https://mock.com/static/css/main.css">
      <style>
        body { font-family: sans-serif; background-color: #f0f0f0; }
        .hero { background-image: url("/static/images/hero.jpg"); }
      </style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
    </head>
    <body>
      <h1>Welcome to Mock Page</h1>
      <img src="/static/images/logo.png" alt="Mock Logo">
      <img srcset="/static/images/responsive-1x.png 1x, /static/images/responsive-2x.png 2x" alt="Responsive Image">
      <svg width="100" height="100">
        <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
      </svg>
      <div class="hero"></div>
      <div data-aos="fade-up">Animated Element</div>
    </body>
    </html>
  `;
  const mockCssContent = `
    body {
      color: #333;
      font-family: 'Arial', sans-serif;
      padding: 10px;
      margin: 0;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      transition: all 0.3s ease-in-out;
      background-attachment: fixed; /* Parallax-like */
    }
    h1 {
      font-size: 2em;
      font-weight: bold;
      line-height: 1.2;
    }
    .accent-color {
      color: #007bff;
      background-color: #e9ecef;
    }
    @keyframes slideIn {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
    .text-animation {
      animation: slideIn 1s ease-out;
    }
  `;

  it('should be able to analyze a URL and extract design tokens, images, SVGs, and motion from mocked web_fetch', async () => {
    const url = 'https://www.wikipedia.org/';
    
    // Mock web_fetch for analyzeURL
    vi.spyOn(global, 'web_fetch').mockImplementation(async ({ prompt }) => {
      if (prompt.includes(url) && prompt.includes('HTML')) {
        return { output: mockHtmlContent.replace(/mock\.com/g, 'www.wikipedia.org').replace(/Mock Page/g, 'Wikipedia') };
      } else if (prompt.includes('https://www.wikipedia.org/static/css/main.css')) {
        return { output: mockCssContent };
      }
      return { output: '' };
    });

    console.log(`Analyzing URL via web_fetch: ${url}`);
    
    const result = await analyzeURL(url);
    
    console.log('--- URL Analysis Result (Mocked web_fetch) ---');
    console.log(JSON.stringify(result, null, 2));
    console.log('--------------------------');

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.extractedColors.backgrounds).toContain('#e9ecef');
    expect(result.extractedTypography.fontFamilies).toContain("'Arial', sans-serif");
    expect(result.extractedImages).toContain('https://www.wikipedia.org/static/images/logo.png');
    expect(result.extractedImages).toContain('https://www.wikipedia.org/static/images/responsive-1x.png');
    expect(result.extractedImages).toContain('https://www.wikipedia.org/static/images/responsive-2x.png');
    expect(result.extractedImages).toContain('https://www.wikipedia.org/static/images/hero.jpg');
    expect(result.extractedSVGs.length).toBeGreaterThan(0);
    expect(result.extractedSVGs[0]).toContain('<svg');
    expect(result.extractedSVGs[0]).toContain('</svg>');
    expect(result.extractedMotion.libraries).toContain('GSAP');
    expect(result.extractedMotion.animationTypes).toContain('Scroll-triggered (AOS)');
    expect(result.extractedMotion.animationTypes).toContain('Parallax-like Background');
    expect(result.extractedMotion.animationTypes).toContain('Custom Keyframe Animation');

    console.log('--- Extracted Motion Libraries ---');
    console.log(result.extractedMotion.libraries);
    console.log('--------------------------------');

    console.log('--- Extracted Animation Types ---');
    console.log(result.extractedMotion.animationTypes);
    console.log('---------------------------------');
    
  }, 30000); // 30 second timeout for network requests

  it('should be able to analyze raw HTML and CSS content directly', async () => {
    const baseUrl = 'https://example.com/';
    
    console.log(`Analyzing raw content for: ${baseUrl}`);
    
    const result = await analyzeRawContent(mockHtmlContent, mockCssContent, baseUrl);
    
    console.log('--- Raw Content Analysis Result ---');
    console.log(JSON.stringify(result, null, 2));
    console.log('--------------------------');

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.extractedColors.backgrounds).toContain('#e9ecef');
    expect(result.extractedTypography.fontFamilies).toContain("'Arial', sans-serif");
    expect(result.extractedImages).toContain('https://example.com/static/images/logo.png');
    expect(result.extractedImages).toContain('https://example.com/static/images/responsive-1x.png');
    expect(result.extractedImages).toContain('https://example.com/static/images/responsive-2x.png');
    expect(result.extractedImages).toContain('https://example.com/static/images/hero.jpg');
    expect(result.extractedSVGs.length).toBeGreaterThan(0);
    expect(result.extractedSVGs[0]).toContain('<svg');
    expect(result.extractedSVGs[0]).toContain('</svg>');
    expect(result.extractedMotion.libraries).toContain('GSAP');
    expect(result.extractedMotion.animationTypes).toContain('Scroll-triggered (AOS)');
    expect(result.extractedMotion.animationTypes).toContain('Parallax-like Background');
    expect(result.extractedMotion.animationTypes).toContain('Custom Keyframe Animation');

    console.log('--- Extracted Motion Libraries (Raw Content) ---');
    console.log(result.extractedMotion.libraries);
    console.log('--------------------------------');

    console.log('--- Extracted Animation Types (Raw Content) ---');
    console.log(result.extractedMotion.animationTypes);
    console.log('---------------------------------');
  }, 30000); // 30 second timeout for network requests
});;
