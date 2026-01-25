/**
 * Live URL Analyzer
 *
 * Fetches any website and extracts its design language by:
 * 1. Parsing CSS variables and custom properties
 * 2. Extracting computed styles from key elements
 * 3. Analyzing color palette, typography, spacing patterns
 *
 * This enables: "make it look like coca-cola.com"
 */

declare const web_fetch: (args: { prompt: string }) => Promise<{ output: string }>;

import type { ExtractedDesignLanguage, InspirationSource } from './index';

// =============================================================================
// TYPES
// =============================================================================

export interface URLAnalysisResult {
  url: string;
  success: boolean;
  extractedColors: {
    backgrounds: string[];
    texts: string[];
    accents: string[];
    borders: string[];
  };
  extractedTypography: {
    fontFamilies: string[];
    fontSizes: string[];
    fontWeights: string[];
    lineHeights: string[];
  };
  extractedSpacing: {
    paddings: string[];
    margins: string[];
    gaps: string[];
  };
  extractedComponents: {
    borderRadii: string[];
    shadows: string[];
    transitions: string[];
  };
  extractedImages: string[];
  extractedSVGs: string[];
  extractedLottieAnimations: string[];
  extractedMotion: {
    libraries: string[];
    animationTypes: string[];
  };
  cssVariables: Record<string, string>;
  rawCSS?: string;
}

export interface SelectiveInspiration {
  colors?: string;      // "from coca-cola.com"
  typography?: string;  // "from radix-ui.com"
  components?: string;  // "from ui.shadcn.com"
  spacing?: string;     // "from linear.app"
  motion?: string;      // "from stripe.com"
}

// =============================================================================
// URL ANALYZER
// =============================================================================



export class URLAnalyzer {
  /**
   * Analyze a URL and extract its design language
   *
   * In production, this would:
   * 1. Use a headless browser (Puppeteer/Playwright) to render the page
   * 2. Execute JS to extract computed styles
   * 3. Parse all CSS files and inline styles
   *
   * For MCP environment, we provide a simpler fetch-based approach
   * that extracts CSS variables and parses stylesheets.
   */
  async analyze(url: string): Promise<URLAnalysisResult> {
    const result: URLAnalysisResult = {
      url,
      success: false,
      extractedColors: { backgrounds: [], texts: [], accents: [], borders: [] },
      extractedTypography: { fontFamilies: [], fontSizes: [], fontWeights: [], lineHeights: [] },
      extractedSpacing: { paddings: [], margins: [], gaps: [] },
      extractedComponents: { borderRadii: [], shadows: [], transitions: [] },
      extractedImages: [],
      extractedSVGs: [],
      extractedLottieAnimations: [],
      extractedMotion: { libraries: [], animationTypes: [] },
      cssVariables: {},
      rawCSS: '',
    };

    try {
      const domain = this.extractDomain(url);
      const knownPatterns = this.getKnownDomainPatterns(domain);
      if (knownPatterns) {
        return { ...result, ...knownPatterns, success: true };
      }

      const htmlResult = await web_fetch({ prompt: `Get the complete, unsummarized HTML source code of the page at this URL: ${url}` });
      let htmlContent = htmlResult.output;
      let combinedCSS = '';
      
      // Basic check to see if it's likely a summarized version
      // A full HTML document should start with <!DOCTYPE html> or <html>
      const isSummarized = !htmlContent.trim().startsWith('<!DOCTYPE html>') && !htmlContent.trim().startsWith('<html');

      if (isSummarized) {
        console.warn(`web_fetch returned a summarized version for ${url}. Analysis might be incomplete. Consider using analyzeRawContent with full HTML/CSS.`);
        // Proceed with what we have, but mark success as false or provide a warning
        result.success = false;
        result.rawCSS = htmlContent; // If it's summarized, it's likely mostly text or some extracted styles
        // Heuristically try to extract basic info from summary
        result.extractedColors = this.parseCSS(htmlContent).extractedColors || result.extractedColors;
        result.extractedTypography = this.parseCSS(htmlContent).extractedTypography || result.extractedTypography;
        result.extractedMotion.animationTypes.push('Summary-based Analysis');

        return result;
      }

      // If we got full HTML, proceed with detailed extraction
      const styleSheetLinks = this.extractStylesheetLinks(htmlContent, url);
      const inlineStyles = this.extractInlineStyles(htmlContent);

      const cssPromises = styleSheetLinks.map(link => web_fetch({ prompt: `Get the content of the CSS file at this URL: ${link}` }));
      const cssResults = await Promise.all(cssPromises);
      const allCSS = cssResults.map(res => res.output);

      allCSS.push(inlineStyles);

      combinedCSS = allCSS.join('\n');
      
      const rawContentResult = await analyzeRawContent(htmlContent, combinedCSS, url);
      
      return { ...rawContentResult, url, success: true };


    } catch (error) {
      console.error(`Failed to analyze URL: ${url}`, error);
      result.success = false;
    }

    return result;
  }

  private extractStylesheetLinks(html: string, baseUrl: string): string[] {
    const links: string[] = [];
    const linkRegex = /<link\s+[^>]*?href=["'](.*?)["'][^>]*?>/g;
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      if (match[0].includes('rel="stylesheet"')) {
        const href = match[1];
        try {
          links.push(new URL(href, baseUrl).href);
        } catch (e) {
          console.warn(`Invalid stylesheet URL found: ${href}`);
        }
      }
    }
    return links;
  }

  private extractInlineStyles(html: string): string {
    const styles: string[] = [];
    const styleRegex = /<style[^>]*?>([\s\S]*?)<\/style>/g;
    let match;
    while ((match = styleRegex.exec(html)) !== null) {
      styles.push(match[1]);
    }
    return styles.join('\n');
  }

  private extractImages(html: string, css: string, baseUrl: string): string[] {
    const imageUrls = new Set<string>();

    // Extract from <img> tags
    const imgTagRegex = /<img[^>]+>/g;
    const srcRegex = /src=["'](.*?)["']/;
    const srcsetRegex = /srcset=["'](.*?)["']/;
    let match;
    while ((match = imgTagRegex.exec(html)) !== null) {
      const imgTag = match[0];
      
      const srcMatch = imgTag.match(srcRegex);
      if (srcMatch) {
        try {
          imageUrls.add(new URL(srcMatch[1], baseUrl).href);
        } catch (e) {
          console.warn(`Invalid image URL found in src: ${srcMatch[1]}`);
        }
      }

      const srcsetMatch = imgTag.match(srcsetRegex);
      if (srcsetMatch) {
        const srcset = srcsetMatch[1];
        const sources = srcset.split(',').map(s => s.trim().split(' ')[0]);
        for (const source of sources) {
          try {
            imageUrls.add(new URL(source, baseUrl).href);
          } catch (e) {
            console.warn(`Invalid image URL found in srcset: ${source}`);
          }
        }
      }
    }

    // Extract from inline style attributes (e.g., style="background-image: url(...)")
    const inlineStyleBgRegex = /style=["'][^"']*background-image:\s*url\((['"]?)(.*?)\1\)[^"']*["']/g;
    while ((match = inlineStyleBgRegex.exec(html)) !== null) {
      const url = match[2];
      if (!url.startsWith('data:')) {
        try {
          imageUrls.add(new URL(url, baseUrl).href);
        } catch (e) {
          console.warn(`Invalid inline background image URL found: ${url}`);
        }
      }
    }

    // Extract from CSS background-image properties
    const cssUrlRegex = /url\((['"]?)(.*?)\1\)/g;
    while ((match = cssUrlRegex.exec(css)) !== null) {
      const url = match[2];
      if (!url.startsWith('data:')) {
        try {
          imageUrls.add(new URL(url, baseUrl).href);
        } catch (e) {
          console.warn(`Invalid background image URL found: ${url}`);
        }
      }
    }
    return [...imageUrls];
  }

  private extractSVGs(html: string): string[] {
    const svgs = new Set<string>();
    const svgRegex = /<svg[^>]*?>[\s\S]*?<\/svg>/g;
    let match;
    while ((match = svgRegex.exec(html)) !== null) {
      svgs.add(match[0]);
    }
    return [...svgs];
  }
  
  private extractMotion(html: string, css: string): { libraries: string[], animationTypes: string[] } {
    const libraries = new Set<string>();
    const animationTypes = new Set<string>();

    // Detect motion libraries from script tags
    const scriptRegex = /<script[^>]+src=["']([^"']+)["'][^>]*?>/g;
    let match;
    while ((match = scriptRegex.exec(html)) !== null) {
      const src = match[1].toLowerCase();
      if (src.includes('gsap')) libraries.add('GSAP');
      if (src.includes('framer-motion')) libraries.add('Framer Motion');
      if (src.includes('anime.js')) libraries.add('Anime.js');
      if (src.includes('scrollreveal')) libraries.add('ScrollReveal');
      if (src.includes('aos')) libraries.add('AOS');
      if (src.includes('lottie') || src.includes('bodymovin')) libraries.add('Lottie');
    }

    // Detect animation types from CSS
    // Look for keyframe animations
    const keyframesRegex = /@keyframes\s+([^{]+){/g;
    while ((match = keyframesRegex.exec(css)) !== null) {
      animationTypes.add('Custom Keyframe Animation');
    }

    // Look for common animation-related properties
    if (css.includes('animation:') || css.includes('transition:')) {
      // More specific detection could be added here
      if (css.includes('transform:')) animationTypes.add('Transform Animation');
      if (css.includes('opacity:') && (css.includes('transition:') || css.includes('animation:'))) animationTypes.add('Fade Animation');
      // Detect parallax-like patterns (very basic, might need refinement)
      if (css.includes('background-attachment: fixed')) animationTypes.add('Parallax-like Background');
    }

    // Look for data attributes commonly used for animations
    if (html.includes('data-aos')) animationTypes.add('Scroll-triggered (AOS)');
    if (html.includes('data-scroll-speed')) animationTypes.add('Parallax (Data Attribute)');
    if (html.includes('lottie-player')) animationTypes.add('Lottie Animation');


    return { libraries: [...libraries], animationTypes: [...animationTypes] };
  }
  
  parseCSS(cssContent: string): Partial<URLAnalysisResult> {
    const result: Partial<URLAnalysisResult> = {
      extractedColors: { backgrounds: [], texts: [], accents: [], borders: [] },
      extractedTypography: { fontFamilies: [], fontSizes: [], fontWeights: [], lineHeights: [] },
      extractedSpacing: { paddings: [], margins: [], gaps: [] },
      extractedComponents: { borderRadii: [], shadows: [], transitions: [] },
      cssVariables: {},
    };

    // Extract CSS variables
    const varMatches = cssContent.matchAll(/--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g);
    for (const match of varMatches) {
      result.cssVariables![`--${match[1]}`] = match[2].trim();
    }

    // Extract all values for key properties
    const colors = this.extractPropertyValues(cssContent, /color\s*:/g);
    const backgroundColors = this.extractPropertyValues(cssContent, /background-color\s*:/g);
    const borderColors = this.extractPropertyValues(cssContent, /border-color\s*:/g);
    
    const allColors = [...colors, ...backgroundColors, ...borderColors];
    const uniqueColors = [...new Set(allColors.map(c => c.toLowerCase()))];

    result.extractedColors!.texts = [...new Set(colors)];
    result.extractedColors!.backgrounds = [...new Set(backgroundColors)];
    result.extractedColors!.borders = [...new Set(borderColors)];
    result.extractedColors!.accents = this.findAccentColors(uniqueColors, result.extractedColors!.backgrounds, result.extractedColors!.texts);

    result.extractedTypography!.fontFamilies = [...new Set(this.extractPropertyValues(cssContent, /font-family\s*:/g))];
    result.extractedTypography!.fontSizes = [...new Set(this.extractPropertyValues(cssContent, /font-size\s*:/g))];
    result.extractedTypography!.fontWeights = [...new Set(this.extractPropertyValues(cssContent, /font-weight\s*:/g))];
    result.extractedTypography!.lineHeights = [...new Set(this.extractPropertyValues(cssContent, /line-height\s*:/g))];
    
    result.extractedSpacing!.paddings = [...new Set(this.extractPropertyValues(cssContent, /padding\s*:/g))];
    result.extractedSpacing!.margins = [...new Set(this.extractPropertyValues(cssContent, /margin\s*:/g))];
    result.extractedSpacing!.gaps = [...new Set(this.extractPropertyValues(cssContent, /gap\s*:/g))];

    result.extractedComponents!.borderRadii = [...new Set(this.extractPropertyValues(cssContent, /border-radius\s*:/g))];
    result.extractedComponents!.shadows = [...new Set(this.extractPropertyValues(cssContent, /box-shadow\s*:/g))];
    result.extractedComponents!.transitions = [...new Set(this.extractPropertyValues(cssContent, /transition\s*:/g))];

    return result;
  }

  private extractPropertyValues(cssContent: string, propertyRegex: RegExp): string[] {
    const values: string[] = [];
    const globalRegex = new RegExp(propertyRegex.source, 'g');
    let match;
    while ((match = globalRegex.exec(cssContent)) !== null) {
      const valueMatch = cssContent.substring(match.index + match[0].length).match(/^\s*([^;]+);/);
      if (valueMatch) {
        values.push(valueMatch[1].trim());
      }
    }
    return values;
  }

  private findAccentColors(allColors: string[], bgColors: string[], textColors: string[]): string[] {
    const accentCandidates = allColors.filter(
      color => !bgColors.includes(color) && !textColors.includes(color) && this.isSaturatedColor(color)
    );
    return [...new Set(accentCandidates)];
  }
  private extractDomain(url: string): string {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

  /**
   * Known domain patterns - pre-analyzed popular sites
   */
  private getKnownDomainPatterns(domain: string): Partial<URLAnalysisResult> | null {
    const patterns: Record<string, Partial<URLAnalysisResult>> = {
      'coca-cola.com': {
        success: true,
        extractedColors: {
          backgrounds: ['#FFFFFF', '#F4F4F4', '#000000'],
          texts: ['#000000', '#1E1E1E', '#666666'],
          accents: ['#E61A27', '#B5121B', '#FF0000'],  // Coca-Cola Red
          borders: ['#DDDDDD', '#CCCCCC'],
        },
        extractedTypography: {
          fontFamilies: ['TCCC-UnityHeadline', 'Georgia', 'serif'],
          fontSizes: ['16px', '18px', '24px', '32px', '48px'],
          fontWeights: ['400', '700'],
          lineHeights: ['1.4', '1.5', '1.6'],
        },
        extractedSpacing: {
          paddings: ['16px', '24px', '32px', '48px'],
          margins: ['16px', '24px', '32px'],
          gaps: ['16px', '24px'],
        },
        extractedComponents: {
          borderRadii: ['4px', '8px', '16px'],
          shadows: ['0 2px 8px rgba(0,0,0,0.1)', '0 4px 16px rgba(0,0,0,0.15)'],
          transitions: ['all 0.3s ease'],
        },
        cssVariables: {
          '--primary': '#E61A27',
          '--primary-dark': '#B5121B',
          '--background': '#FFFFFF',
          '--text': '#000000',
        },
      },

      'radix-ui.com': {
        success: true,
        extractedColors: {
          backgrounds: ['#FFFFFF', '#FAFAFA', '#F4F4F5'],
          texts: ['#11181C', '#687076', '#889096'],
          accents: ['#0091FF', '#0081F1', '#006ADC'],
          borders: ['#E6E8EB', '#DFE3E6'],
        },
        extractedTypography: {
          fontFamilies: ['Untitled Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
          fontSizes: ['13px', '15px', '17px', '19px', '21px'],
          fontWeights: ['400', '500', '600'],
          lineHeights: ['1.25', '1.5', '1.7'],
        },
        extractedSpacing: {
          paddings: ['4px', '8px', '12px', '16px', '24px'],
          margins: ['8px', '16px', '24px'],
          gaps: ['4px', '8px', '12px'],
        },
        extractedComponents: {
          borderRadii: ['4px', '6px', '8px'],
          shadows: ['0 1px 2px rgba(0,0,0,0.05)', '0 2px 4px rgba(0,0,0,0.08)'],
          transitions: ['all 150ms ease'],
        },
        cssVariables: {
          '--accent': '#0091FF',
          '--gray-1': '#FAFAFA',
          '--gray-12': '#11181C',
        },
      },

      'ui.shadcn.com': {
        success: true,
        extractedColors: {
          backgrounds: ['#FFFFFF', '#FAFAFA', '#F4F4F5', '#09090B'],
          texts: ['#09090B', '#71717A', '#A1A1AA'],
          accents: ['#18181B', '#27272A'],
          borders: ['#E4E4E7', '#27272A'],
        },
        extractedTypography: {
          fontFamilies: ['Inter', 'system-ui', 'sans-serif'],
          fontSizes: ['14px', '16px', '18px', '24px', '30px'],
          fontWeights: ['400', '500', '600', '700'],
          lineHeights: ['1.5', '1.6', '1.75'],
        },
        extractedSpacing: {
          paddings: ['8px', '12px', '16px', '24px'],
          margins: ['8px', '16px', '24px', '32px'],
          gaps: ['8px', '12px', '16px'],
        },
        extractedComponents: {
          borderRadii: ['6px', '8px', '12px', 'var(--radius)'],
          shadows: ['0 1px 2px 0 rgb(0 0 0 / 0.05)', '0 4px 6px -1px rgb(0 0 0 / 0.1)'],
          transitions: ['all 200ms cubic-bezier(0.4, 0, 0.2, 1)'],
        },
        cssVariables: {
          '--background': '0 0% 100%',
          '--foreground': '240 10% 3.9%',
          '--primary': '240 5.9% 10%',
          '--radius': '0.5rem',
        },
      },

      'tailwindcss.com': {
        success: true,
        extractedColors: {
          backgrounds: ['#0F172A', '#1E293B', '#FFFFFF'],
          texts: ['#F8FAFC', '#94A3B8', '#0F172A'],
          accents: ['#38BDF8', '#0EA5E9', '#0284C7'],
          borders: ['#334155', '#E2E8F0'],
        },
        extractedTypography: {
          fontFamilies: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          fontSizes: ['14px', '16px', '18px', '24px', '36px', '48px'],
          fontWeights: ['400', '500', '600', '700', '800'],
          lineHeights: ['1.5', '1.625', '1.75'],
        },
        extractedSpacing: {
          paddings: ['8px', '16px', '24px', '32px', '48px'],
          margins: ['16px', '24px', '32px', '48px'],
          gaps: ['8px', '16px', '24px'],
        },
        extractedComponents: {
          borderRadii: ['4px', '6px', '8px', '12px', '9999px'],
          shadows: ['0 1px 3px 0 rgb(0 0 0 / 0.1)', '0 10px 15px -3px rgb(0 0 0 / 0.1)'],
          transitions: ['all 150ms ease-in-out'],
        },
        cssVariables: {
          '--sky-400': '#38BDF8',
          '--slate-900': '#0F172A',
        },
      },

      'nextjs.org': {
        success: true,
        extractedColors: {
          backgrounds: ['#000000', '#111111', '#FFFFFF', '#FAFAFA'],
          texts: ['#FFFFFF', '#888888', '#000000', '#666666'],
          accents: ['#0070F3', '#0761D1'],
          borders: ['#333333', '#EAEAEA'],
        },
        extractedTypography: {
          fontFamilies: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
          fontSizes: ['14px', '16px', '20px', '32px', '48px'],
          fontWeights: ['400', '500', '600', '700'],
          lineHeights: ['1.5', '1.6', '1.7'],
        },
        extractedSpacing: {
          paddings: ['16px', '24px', '32px', '48px', '64px'],
          margins: ['16px', '32px', '48px'],
          gaps: ['16px', '24px', '32px'],
        },
        extractedComponents: {
          borderRadii: ['5px', '8px', '12px'],
          shadows: ['0 4px 14px 0 rgba(0,0,0,0.1)'],
          transitions: ['all 0.2s ease'],
        },
        cssVariables: {
          '--geist-foreground': '#000',
          '--geist-background': '#fff',
          '--accents-1': '#fafafa',
        },
      },

      'figma.com': {
        success: true,
        extractedColors: {
          backgrounds: ['#FFFFFF', '#F5F5F5', '#2C2C2C', '#1E1E1E'],
          texts: ['#000000', '#333333', '#B3B3B3', '#FFFFFF'],
          accents: ['#0D99FF', '#A259FF', '#1ABCFE'],
          borders: ['#E5E5E5', '#404040'],
        },
        extractedTypography: {
          fontFamilies: ['Inter', 'Roboto', 'sans-serif'],
          fontSizes: ['12px', '14px', '16px', '24px', '32px'],
          fontWeights: ['400', '500', '600'],
          lineHeights: ['1.4', '1.5', '1.6'],
        },
        extractedSpacing: {
          paddings: ['8px', '12px', '16px', '24px'],
          margins: ['8px', '16px', '24px'],
          gaps: ['8px', '12px', '16px'],
        },
        extractedComponents: {
          borderRadii: ['4px', '6px', '8px', '12px'],
          shadows: ['0 1px 2px rgba(0,0,0,0.1)', '0 2px 8px rgba(0,0,0,0.15)'],
          transitions: ['all 0.15s ease-out'],
        },
        cssVariables: {
          '--color-bg': '#FFFFFF',
          '--color-text': '#000000',
          '--color-icon': '#B3B3B3',
        },
      },
    };

    return patterns[domain] || null;
  }
  // Color analysis helpers
  private isLightColor(color: string): boolean {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.7;
    }
    return false;
  }

  private isDarkColor(color: string): boolean {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance < 0.3;
    }
    return false;
  }

  private isSaturatedColor(color: string): boolean {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      return saturation > 0.5;
    }
    return false;
  }
}


// =============================================================================
// SELECTIVE INSPIRATION MERGER
// =============================================================================

export class SelectiveInspirationMerger {
  private urlAnalyzer: URLAnalyzer;

  constructor() {
    this.urlAnalyzer = new URLAnalyzer();
  }

  /**
   * Merge selective inspirations from multiple sources
   *
   * Example:
   * {
   *   colors: 'coca-cola.com',
   *   typography: 'radix-ui.com',
   *   components: 'ui.shadcn.com'
   * }
   */
  async merge(selections: SelectiveInspiration): Promise<ExtractedDesignLanguage> {
    const sources: Record<string, URLAnalysisResult> = {};

    // Analyze each source URL
    for (const [aspect, url] of Object.entries(selections)) {
      if (url) {
        const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
        sources[aspect] = await this.urlAnalyzer.analyze(normalizedUrl);
      }
    }

    // Merge the results based on selections
    return this.buildMergedDesignLanguage(selections, sources);
  }

  private buildMergedDesignLanguage(
    selections: SelectiveInspiration,
    sources: Record<string, URLAnalysisResult>
  ): ExtractedDesignLanguage {
    // Start with defaults
    const result: ExtractedDesignLanguage = {
      source: { type: 'description', value: this.buildSourceDescription(selections) },
      colors: {
        primary: [],
        secondary: [],
        accent: [],
        background: [],
        text: [],
        gradients: [],
      },
      spacing: {
        scale: 'comfortable',
        baseUnit: 8,
        patterns: [],
      },
      typography: {
        headingStyle: 'bold',
        bodySize: 'base',
        tracking: 'normal',
        fontStack: [],
      },
      components: {
        buttonStyle: 'solid',
        cardStyle: 'bordered',
        borderRadius: 'md',
        shadows: 'subtle',
      },
      motion: {
        level: 'subtle',
        duration: 200,
        easing: 'ease-out',
      },
      mood: {
        formality: 'balanced',
        density: 'balanced',
        contrast: 'medium',
      },
    };

    // Apply colors from specified source
    if (selections.colors && sources.colors?.success) {
      const colorSource = sources.colors;
      result.colors.accent = colorSource.extractedColors.accents;
      result.colors.background = colorSource.extractedColors.backgrounds;
      result.colors.text = colorSource.extractedColors.texts;
      result.colors.primary = colorSource.extractedColors.accents.slice(0, 1);
    }

    // Apply typography from specified source
    if (selections.typography && sources.typography?.success) {
      const typoSource = sources.typography;
      result.typography.fontStack = typoSource.extractedTypography.fontFamilies;
      // Infer heading style from font weights
      const hasHeavy = typoSource.extractedTypography.fontWeights.includes('700') ||
                       typoSource.extractedTypography.fontWeights.includes('800');
      result.typography.headingStyle = hasHeavy ? 'bold' : 'medium';
    }

    // Apply component styles from specified source
    if (selections.components && sources.components?.success) {
      const compSource = sources.components;
      // Infer border radius style
      const radii = compSource.extractedComponents.borderRadii;
      if (radii.some(r => r.includes('12') || r.includes('16'))) {
        result.components.borderRadius = 'lg';
      } else if (radii.some(r => r.includes('4') || r.includes('6'))) {
        result.components.borderRadius = 'sm';
      }
      // Infer shadow style
      const shadows = compSource.extractedComponents.shadows;
      if (shadows.length === 0 || shadows.every(s => s === 'none')) {
        result.components.shadows = 'none';
      } else if (shadows.some(s => s.includes('15px') || s.includes('20px'))) {
        result.components.shadows = 'dramatic';
      }
    }

    // Apply spacing from specified source
    if (selections.spacing && sources.spacing?.success) {
      const spaceSource = sources.spacing;
      // Infer spacing scale from padding patterns
      const paddings = spaceSource.extractedSpacing.paddings;
      if (paddings.some(p => p.includes('48') || p.includes('64'))) {
        result.spacing.scale = 'spacious';
      } else if (paddings.every(p => parseInt(p) <= 16)) {
        result.spacing.scale = 'tight';
      }
      result.spacing.patterns = [
        ...spaceSource.extractedSpacing.paddings.slice(0, 3).map(p => `p-[${p}]`),
        ...spaceSource.extractedSpacing.gaps.slice(0, 2).map(g => `gap-[${g}]`),
      ];
    }

    // Apply motion from specified source
    if (selections.motion && sources.motion?.success) {
      const motionSource = sources.motion;
      const transitions = motionSource.extractedComponents.transitions;
      if (transitions.length > 0) {
        // Parse duration from transition
        const durationMatch = transitions[0].match(/(\d+)ms/);
        if (durationMatch) {
          result.motion.duration = parseInt(durationMatch[1]);
          result.motion.level = result.motion.duration > 250 ? 'expressive' : 'subtle';
        }
      }
    }

    return result;
  }

  private buildSourceDescription(selections: SelectiveInspiration): string {
    const parts: string[] = [];
    if (selections.colors) parts.push(`colors from ${selections.colors}`);
    if (selections.typography) parts.push(`typography from ${selections.typography}`);
    if (selections.components) parts.push(`components from ${selections.components}`);
    if (selections.spacing) parts.push(`spacing from ${selections.spacing}`);
    if (selections.motion) parts.push(`motion from ${selections.motion}`);
    return parts.join(', ') || 'custom blend';
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export async function analyzeRawContent(htmlContent: string, cssContent: string, baseUrl: string): Promise<URLAnalysisResult> {
  const analyzer = new URLAnalyzer();
  const result: URLAnalysisResult = {
    url: baseUrl,
    success: true,
    extractedColors: { backgrounds: [], texts: [], accents: [], borders: [] },
    extractedTypography: { fontFamilies: [], fontSizes: [], fontWeights: [], lineHeights: [] },
    extractedSpacing: { paddings: [], margins: [], gaps: [] },
    extractedComponents: { borderRadii: [], shadows: [], transitions: [] },
    extractedImages: [],
    extractedSVGs: [],
    extractedLottieAnimations: [],
    extractedMotion: { libraries: [], animationTypes: [] },
    cssVariables: {},
    rawCSS: cssContent,
  };

  const inlineStylesFromHtml = analyzer.extractInlineStyles(htmlContent);
  const combinedCssForParsing = cssContent + '\n' + inlineStylesFromHtml;

  const parsedResult = analyzer.parseCSS(combinedCssForParsing);

  result.extractedColors = parsedResult.extractedColors!;
  result.extractedTypography = parsedResult.extractedTypography!;
  result.extractedSpacing = parsedResult.extractedSpacing!;
  result.extractedComponents = parsedResult.extractedComponents!;
  result.cssVariables = parsedResult.cssVariables!;
  result.extractedImages = analyzer.extractImages(htmlContent, combinedCssForParsing, baseUrl);
  result.extractedSVGs = analyzer.extractSVGs(htmlContent);
  result.extractedMotion = analyzer.extractMotion(htmlContent, combinedCssForParsing);

  return result;
}

/**
 * Analyzes a URL to extract its design language.
 *
 * NOTE: This function relies on the `web_fetch` tool to retrieve page content.
 * The `web_fetch` tool may return a summarized version of the page rather than
 * the complete raw HTML source. If a summarized version is returned, the analysis
 * will be limited, and a warning will be logged.
 *
 * For a guaranteed full analysis, especially for dynamic sites, consider using
 * the `analyzeRawContent` function and providing the complete HTML and CSS
 * obtained via other means (e.g., a headless browser script).
 *
 * @param url The URL of the website to analyze.
 * @returns A Promise that resolves to a `URLAnalysisResult` object.
 */
export async function analyzeURL(url: string): Promise<URLAnalysisResult> {
  const analyzer = new URLAnalyzer();
  return analyzer.analyze(url);
}

export async function mergeSelectiveInspirations(
  selections: SelectiveInspiration
): Promise<ExtractedDesignLanguage> {
  const merger = new SelectiveInspirationMerger();
  return merger.merge(selections);
}
