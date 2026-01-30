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

import { withBrowser } from './browser-automation';
import * as fs from 'fs';
import * as path from 'path';
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
  extractedArchetypes: {
    header?: string; // 'sticky', 'floating', 'minimal'
    hero?: string;   // 'split', 'centered', 'bento'
    features?: string; // 'grid', 'vertical-stack', 'bento'
    interactive?: string[]; // 'hover-effects', 'magnetic-buttons'
  };
  layoutDsl?: {
    sections: Array<{
      id: string;
      role: 'hero' | 'nav' | 'features' | 'testimonial' | 'pricing' | 'cta' | 'footer' | 'content' | 'unknown';
      layout: 'stack' | 'split' | 'grid' | 'bento' | 'carousel';
      hierarchy: {
        hasHeading: boolean;
        hasSubheading: boolean;
        hasCta: boolean;
        media: 'none' | 'image' | 'video' | 'illustration';
      };
      density: 'tight' | 'normal' | 'spacious';
      columns?: number;
    }>;
  };
  harvestedSVGs: Array<{
    svg: string;
    category: 'logo' | 'icon' | 'pattern' | 'illustration';
    context?: string; // class, id or parent info
  }>;
  cssVariables: Record<string, string>;
  rawCSS?: string;
  motionCSS?: string;
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
      extractedArchetypes: {},
      harvestedSVGs: [],
      layoutDsl: { sections: [] },
      cssVariables: {},
      rawCSS: '',
    };

    try {
      const webFetch = (globalThis as any).web_fetch as undefined | ((args: { prompt: string }) => Promise<{ output: string }>);
      if (webFetch) {
        const htmlResponse = await webFetch({ prompt: `Fetch HTML for ${url}` });
        const htmlContent = htmlResponse?.output || '';
        const styleSheetLinks = this.extractStylesheetLinks(htmlContent, url);
        const inlineStyles = this.extractInlineStyles(htmlContent);
        const cssParts: string[] = [inlineStyles];
        for (const link of styleSheetLinks) {
          const cssResponse = await webFetch({ prompt: `Fetch CSS ${link}` });
          if (cssResponse?.output) cssParts.push(cssResponse.output);
        }
        const combinedCss = cssParts.join('\n');
        const rawResult = await analyzeRawContent(htmlContent, combinedCss, url);
        return {
          ...rawResult,
          success: true,
          extractedArchetypes: rawResult.extractedArchetypes || {},
          harvestedSVGs: rawResult.harvestedSVGs || [],
          layoutDsl: rawResult.layoutDsl || { sections: [] },
        };
      }

      const domain = this.extractDomain(url);
      const knownPatterns = this.getKnownDomainPatterns(domain);
      if (knownPatterns) {
        return { ...result, ...knownPatterns, success: true };
      }

      const htmlResult = await withBrowser(url, async (browser) => {
        const html = await browser.getHTML();
        const archetypes = await this.identifyLayoutArchetypes(browser);
        const layoutDsl = await this.extractLayoutDsl(browser);
        const images = await this.extractImagesFromDom(browser, url);
        const svgs = await this.harvestSVGs(browser, url);
        const motionCSS = await this.extractLiteralMotion(browser);
        return {
          html,
          archetypes,
          layoutDsl,
          images,
          svgs,
          motionCSS
        }
      }, { waitUntil: 'networkidle', timeout: 90000 });
      let htmlContent = htmlResult.html;
      result.extractedArchetypes = htmlResult.archetypes;
      result.layoutDsl = htmlResult.layoutDsl;
      result.extractedImages = htmlResult.images || [];
      result.harvestedSVGs = htmlResult.svgs;
      result.motionCSS = htmlResult.motionCSS;

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
      const allCSS = [inlineStyles]; // Fallback to inline only if direct CSS fetch is skipped

      // In a full implementation, we would fetch stylesheet links here too.
      // But BrowserAutomation evaluation can already get all rules from styleSheets.

      const combinedCSS = (htmlResult.motionCSS || '') + '\n' + allCSS.join('\n');

      const rawContentResult = await analyzeRawContent(htmlContent, combinedCSS, url);

      return { ...rawContentResult, url, success: true, motionCSS: htmlResult.motionCSS };


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

  public extractInlineStyles(html: string): string {
    const styles: string[] = [];
    const styleRegex = /<style[^>]*?>([\s\S]*?)<\/style>/g;
    let match;
    while ((match = styleRegex.exec(html)) !== null) {
      styles.push(match[1]);
    }
    return styles.join('\n');
  }

  public extractImages(html: string, css: string, baseUrl: string): string[] {
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

  public harvestSVGs(browser: any, url: string): Promise<URLAnalysisResult['harvestedSVGs']> {
    return browser.evaluateWithArgs((pageUrl: string) => {
      const results: any[] = [];

      // Query ALL SVGs on the page - not just icons
      const allSvgs = Array.from(document.querySelectorAll('svg'));

      // Also find SVGs that might be in shadow DOM or special containers
      const svgContainers = document.querySelectorAll('[class*="icon"], [class*="logo"], [class*="illustration"], [class*="graphic"], [class*="pattern"], [class*="bg-"], [class*="background"], [class*="decoration"], [class*="blob"], [class*="shape"], [class*="gradient"]');
      svgContainers.forEach(container => {
        const innerSvgs = container.querySelectorAll('svg');
        innerSvgs.forEach(svg => {
          if (!allSvgs.includes(svg as SVGSVGElement)) {
            allSvgs.push(svg as SVGSVGElement);
          }
        });
      });

      allSvgs.forEach(svg => {
        const bbox = svg.getBoundingClientRect();
        const raw = svg.outerHTML;
        const style = window.getComputedStyle(svg);
        const parentStyle = svg.parentElement ? window.getComputedStyle(svg.parentElement) : null;

        // Gather context info
        const classes = (svg.className?.toString() || '') + ' ' + (svg.parentElement?.className?.toString() || '');
        const id = svg.id || svg.parentElement?.id || '';
        const position = style.position;
        const opacity = parseFloat(style.opacity);
        const zIndex = parseInt(style.zIndex) || 0;

        // Check for gradients within the SVG
        const hasGradient = raw.includes('<linearGradient') || raw.includes('<radialGradient') || raw.includes('gradient');
        const hasPattern = raw.includes('<pattern') || raw.includes('pattern');
        const hasFilter = raw.includes('<filter') || raw.includes('filter');
        const hasClipPath = raw.includes('<clipPath') || raw.includes('clip-path');
        const hasMask = raw.includes('<mask') || raw.includes('mask');

        // Determine category with more sophisticated logic
        let category: 'logo' | 'icon' | 'pattern' | 'illustration' = 'icon';

        // Logo detection
        const isInHeader = !!svg.closest('header, nav, [class*="header"], [class*="nav"]');
        const hasLogoClass = /logo|brand|mark/i.test(classes + id);
        if ((hasLogoClass || isInHeader) && bbox.width > 20 && bbox.width < 300 && bbox.height < 150) {
          category = 'logo';
        }

        // Pattern/Background detection (large, positioned absolutely, lower opacity)
        const isBackgroundSvg = (
          position === 'absolute' || position === 'fixed' ||
          (parentStyle && (parentStyle.position === 'absolute' || parentStyle.position === 'fixed'))
        );
        const isLargeSvg = bbox.width > 300 || bbox.height > 300;
        const isDecorativeSvg = /pattern|bg-|background|decoration|blob|shape|mesh|noise|texture|grid|dots|lines|wave|curve|organic/i.test(classes + id);

        if (isLargeSvg || isBackgroundSvg || isDecorativeSvg || hasPattern) {
          category = 'pattern';
        }

        // Illustration detection (medium size, colorful, detailed)
        if (bbox.width > 100 && bbox.width <= 500 && bbox.height > 80) {
          const pathCount = (raw.match(/<path/g) || []).length;
          if (pathCount > 5 || hasGradient || hasFilter) {
            category = 'illustration';
          }
        }

        // Gradient mesh/blob detection - these are high value
        if (hasGradient && (isLargeSvg || isBackgroundSvg)) {
          category = 'pattern'; // Gradient meshes are patterns
        }

        // Small icons (under 48px)
        if (bbox.width <= 48 && bbox.height <= 48) {
          category = 'icon';
        }

        // Skip very tiny or broken SVGs
        if (bbox.width < 10 || bbox.height < 10 || raw.length < 50) {
          return;
        }

        // Skip if it's just an empty wrapper
        if (!raw.includes('<path') && !raw.includes('<circle') && !raw.includes('<rect') && !raw.includes('<g') && !raw.includes('<use')) {
          return;
        }

        results.push({
          svg: raw,
          category,
          context: `id:${id}, class:${classes}, size:${Math.round(bbox.width)}x${Math.round(bbox.height)}, position:${position}`,
          metadata: {
            width: bbox.width,
            height: bbox.height,
            hasGradient,
            hasPattern,
            hasFilter,
            isBackground: isBackgroundSvg,
            opacity
          }
        });
      });

      // Also extract inline SVG symbols and defs that might be reused
      const defs = document.querySelectorAll('svg defs, svg symbol');
      defs.forEach(def => {
        const raw = def.outerHTML;
        if (raw.length > 100 && (raw.includes('<linearGradient') || raw.includes('<radialGradient') || raw.includes('<pattern'))) {
          results.push({
            svg: raw,
            category: 'pattern',
            context: 'From SVG defs/symbol',
            metadata: { isDef: true }
          });
        }
      });

      // Filter and dedupe, prioritizing patterns and illustrations
      const seen = new Set();
      const prioritized = results
        .filter(r => {
          if (seen.has(r.svg)) return false;
          seen.add(r.svg);
          return true;
        })
        .sort((a, b) => {
          // Prioritize patterns > illustrations > logos > icons
          const priority: Record<string, number> = { pattern: 4, illustration: 3, logo: 2, icon: 1 };
          return (priority[b.category as string] || 0) - (priority[a.category as string] || 0);
        });

      return prioritized.slice(0, 50); // Increased limit for richer extraction
    });
  }

  public identifyLayoutArchetypes(browser: any): Promise<URLAnalysisResult['extractedArchetypes']> {
    return browser.evaluate(() => {
      const archetypes: any = {};

      // 1. Detect Hero Strategy
      const potentialHeros = Array.from(document.querySelectorAll('section, header + section, main > div > section'));
      const hero = potentialHeros.find(s => s.getBoundingClientRect().height > 400) || potentialHeros[0];

      if (hero) {
        const textContent = hero.textContent?.length || 0;
        const grids = hero.querySelectorAll('[class*="grid"], [class*="flex"] > div').length;
        const h1 = hero.querySelector('h1');

        if (grids >= 4 || hero.innerHTML.includes('bento')) {
          archetypes.hero = 'bento';
        } else if (h1 && (hero.querySelector('img') || hero.querySelector('video') || hero.querySelector('canvas'))) {
          archetypes.hero = 'split';
        } else {
          archetypes.hero = 'centered';
        }
      }

      // 2. Detect Navigation
      const nav = document.querySelector('nav, [class*="nav"], header');
      if (nav) {
        const rect = nav.getBoundingClientRect();
        const style = window.getComputedStyle(nav);
        if (style.position === 'fixed' || style.position === 'sticky') {
          archetypes.header = 'sticky';
        } else if (rect.width < document.body.clientWidth * 0.9) {
          archetypes.header = 'floating';
        } else {
          archetypes.header = 'minimal';
        }
      }

      return archetypes;
    });
  }

  public extractLayoutDsl(browser: any): Promise<NonNullable<URLAnalysisResult['layoutDsl']>> {
    return browser.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('header, nav, main > section, section, footer'));
      const dslSections = sections.map((section, index) => {
        const tag = section.tagName.toLowerCase();
        const hasNav = tag === 'nav' || section.querySelector('nav');
        const hasHeader = tag === 'header';
        const hasFooter = tag === 'footer';
        const h1 = section.querySelector('h1');
        const h2 = section.querySelector('h2');
        const ctas = section.querySelectorAll('button, a[href*="signup"], a[href*="pricing"], a[href*="get-started"]');
        const images = section.querySelectorAll('img, picture, svg');
        const videos = section.querySelectorAll('video');
        const cards = section.querySelectorAll('[class*="card"], [class*="Card"], article');
        const grids = section.querySelectorAll('[class*="grid"], [style*="grid"]');
        const columns = section.querySelectorAll('[class*="col"], [class*="columns"]');

        const rect = section.getBoundingClientRect();
        const density =
          rect.height < 320 ? 'tight' : rect.height > 720 ? 'spacious' : 'normal';

        let role: any = 'unknown';
        if (hasNav || hasHeader) role = 'nav';
        else if (hasFooter) role = 'footer';
        else if (h1) role = 'hero';
        else if (ctas.length > 1 && images.length > 0) role = 'cta';
        else if (cards.length >= 3) role = 'features';

        let layout: any = 'stack';
        if (grids.length > 0) layout = 'grid';
        if (columns.length >= 2) layout = 'split';
        if (cards.length >= 6) layout = 'bento';

        let media: any = 'none';
        if (videos.length > 0) media = 'video';
        else if (images.length > 0) media = 'image';

        const hasSubheading = !!section.querySelector('p, h3');

        return {
          id: `${tag}-${index}`,
          role,
          layout,
          hierarchy: {
            hasHeading: !!(h1 || h2),
            hasSubheading,
            hasCta: ctas.length > 0,
            media,
          },
          density,
          columns: columns.length > 0 ? columns.length : undefined,
        };
      });

      return { sections: dslSections };
    });
  }

  public extractLiteralMotion(browser: any): Promise<string> {
    return browser.evaluate(() => {
      let motionRules = '';
      const sheets = Array.from(document.styleSheets);

      // Patterns to filter out (framework resets, utility classes, garbage)
      const garbagePatterns = [
        'unset',
        'inherit',
        'initial',
        '.w-',           // Webflow framework
        '.w-webflow',
        'box-sizing',
        '-webkit-',      // Browser prefixes only
        '-moz-',
        'border-box',
        'content-box',
        'display: none',
        'visibility: hidden',
        'opacity: 0;',   // Simple opacity resets
        'transform: none',
        'transition: none',
        'animation: none',
        '.sr-only',      // Screen reader
        '[hidden]',
        'cursor: pointer', // Generic cursor
        '* {',           // Universal selectors
        '*,',
        '*::before',
        '*::after',
      ];

      // Patterns that indicate REAL motion we want to capture
      const valuablePatterns = [
        'translateX',
        'translateY',
        'translateZ',
        'scale(',
        'scale3d',
        'rotate(',
        'skew(',
        'cubic-bezier',
        'ease-in-out',
        'ease-out',
        'ease-in',
        'spring(',
        '@keyframes',
        'animation-name',
        'animation-duration',
        'animation-delay',
        'animation-timing',
        'transform-origin',
        'perspective',
        'backface-visibility',
        'will-change',
      ];

      sheets.forEach(sheet => {
        try {
          const rules = Array.from(sheet.cssRules);
          rules.forEach(rule => {
            const cssText = rule.cssText;

            // Skip if it contains garbage patterns
            const hasGarbage = garbagePatterns.some(pattern => cssText.includes(pattern));
            if (hasGarbage) return;

            // Check if it's a keyframe (always valuable)
            if (cssText.includes('@keyframes')) {
              // Only include keyframes with actual transforms
              if (valuablePatterns.some(p => cssText.includes(p))) {
                motionRules += cssText + '\n';
              }
              return;
            }

            // For transition/animation rules, ensure they have valuable content
            if (cssText.includes('transition') || cssText.includes('animation')) {
              const hasValuableContent = valuablePatterns.some(pattern => cssText.includes(pattern));
              // Also check for duration patterns (not just 0s)
              const hasDuration = /\d+(\.\d+)?(ms|s)/.test(cssText) && !cssText.includes('0s') && !cssText.includes('0ms');

              if (hasValuableContent || hasDuration) {
                motionRules += cssText + '\n';
              }
            }
          });
        } catch (e) { /* Cross-origin stylesheet - skip */ }
      });

      // Also extract motion library indicators
      const motionLibraries: string[] = [];
      document.querySelectorAll('script[src]').forEach(script => {
        const src = (script as HTMLScriptElement).src.toLowerCase();
        if (src.includes('gsap')) motionLibraries.push('GSAP');
        if (src.includes('framer-motion')) motionLibraries.push('Framer Motion');
        if (src.includes('anime')) motionLibraries.push('Anime.js');
        if (src.includes('lottie') || src.includes('bodymovin')) motionLibraries.push('Lottie');
        if (src.includes('scrolltrigger')) motionLibraries.push('ScrollTrigger');
        if (src.includes('locomotive')) motionLibraries.push('Locomotive Scroll');
      });

      // Add library detection as a comment at the top
      if (motionLibraries.length > 0) {
        motionRules = `/* Motion Libraries Detected: ${[...new Set(motionLibraries)].join(', ')} */\n` + motionRules;
      }

      return motionRules.substring(0, 8000); // Increased cap for richer extraction
    });
  }

  public extractSVGs(html: string): string[] {
    const svgs = new Set<string>();
    const svgRegex = /<svg[^>]*?>[\s\S]*?<\/svg>/g;
    let match;
    while ((match = svgRegex.exec(html)) !== null) {
      svgs.add(match[0]);
    }
    return [...svgs];
  }

  public extractMotion(html: string, css: string): { libraries: string[], animationTypes: string[] } {
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

  public extractImagesFromDom(browser: any, baseUrl: string): Promise<string[]> {
    return browser.evaluate((origin: string) => {
      const urls = new Set<string>();
      const gradients: string[] = [];

      const toAbs = (value?: string | null) => {
        if (!value) return null;
        try {
          return new URL(value, origin).href;
        } catch {
          return null;
        }
      };

      // Extract URL from CSS background-image value
      const extractUrlFromBg = (bgValue: string): string | null => {
        const match = bgValue.match(/url\(['"]?([^'")\s]+)['"]?\)/);
        if (match && match[1] && !match[1].startsWith('data:')) {
          return toAbs(match[1]);
        }
        return null;
      };

      // 1. Extract from <img> tags
      document.querySelectorAll('img').forEach((img) => {
        const src = toAbs(img.getAttribute('src')) || toAbs(img.getAttribute('data-src')) || toAbs(img.getAttribute('data-lazy-src'));
        if (src) urls.add(src);
        const srcset = img.getAttribute('srcset') || img.getAttribute('data-srcset');
        if (srcset) {
          const first = srcset.split(',')[0]?.trim().split(' ')[0];
          const abs = toAbs(first);
          if (abs) urls.add(abs);
        }
      });

      // 2. Extract from <picture> sources
      document.querySelectorAll('source').forEach((source) => {
        const srcset = source.getAttribute('srcset');
        if (srcset) {
          srcset.split(',').forEach(src => {
            const url = src.trim().split(' ')[0];
            const abs = toAbs(url);
            if (abs) urls.add(abs);
          });
        }
      });

      // 3. Extract from <video> poster attributes
      document.querySelectorAll('video[poster]').forEach((video) => {
        const poster = toAbs(video.getAttribute('poster'));
        if (poster) urls.add(poster);
      });

      // 4. Extract background-image from computed styles (key elements only for performance)
      const importantElements = document.querySelectorAll(
        'section, header, footer, main, article, [class*="hero"], [class*="banner"], ' +
        '[class*="background"], [class*="bg-"], [class*="image"], [class*="cover"], ' +
        '[class*="header"], [class*="jumbotron"], [class*="splash"], [class*="feature"], ' +
        '[class*="card"], [class*="cta"], [class*="testimonial"], div[style*="background"]'
      );

      importantElements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const bgImage = style.backgroundImage;

        if (bgImage && bgImage !== 'none') {
          // Handle multiple backgrounds
          const backgrounds = bgImage.split(/,(?![^(]*\))/); // Split by comma not in parentheses

          backgrounds.forEach(bg => {
            bg = bg.trim();
            // Extract URLs
            if (bg.includes('url(')) {
              const url = extractUrlFromBg(bg);
              if (url) urls.add(url);
            }
            // Also capture gradient patterns for design reference
            if (bg.includes('gradient')) {
              gradients.push(bg);
            }
          });
        }
      });

      // 5. Also check inline style attributes
      document.querySelectorAll('[style*="background"]').forEach((el) => {
        const inlineStyle = el.getAttribute('style') || '';
        const bgMatch = inlineStyle.match(/background(?:-image)?:\s*([^;]+)/);
        if (bgMatch) {
          const bgValue = bgMatch[1];
          if (bgValue.includes('url(')) {
            const url = extractUrlFromBg(bgValue);
            if (url) urls.add(url);
          }
        }
      });

      // 6. Extract from CSS custom properties that might contain images
      const root = document.documentElement;
      const rootStyle = window.getComputedStyle(root);
      ['--hero-image', '--bg-image', '--background-image', '--banner-image'].forEach(prop => {
        const value = rootStyle.getPropertyValue(prop);
        if (value && value.includes('url(')) {
          const url = extractUrlFromBg(value);
          if (url) urls.add(url);
        }
      });

      // Filter out tracking pixels and tiny images by checking common patterns
      const filtered = Array.from(urls).filter(url => {
        const lower = url.toLowerCase();
        return !lower.includes('pixel') &&
               !lower.includes('tracking') &&
               !lower.includes('analytics') &&
               !lower.includes('1x1') &&
               !lower.includes('spacer') &&
               !lower.includes('.gif') || lower.includes('animation'); // Allow animated gifs
      });

      return filtered.slice(0, 40); // Increased limit
    }, baseUrl);
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
          backgrounds: ['#FFFFFF', '#FAFAFA', '#F4F4F5', '#111113', '#18181B', '#1C1C1F'],
          texts: ['#11181C', '#687076', '#889096', '#FAFAFA', '#EDEDED', '#B4B4B4'],
          accents: ['#0091FF', '#0081F1', '#006ADC', '#3E63DD', '#8B5CF6'],
          borders: ['#E6E8EB', '#DFE3E6', '#313538', '#3A3A3C'],
        },
        extractedTypography: {
          fontFamilies: ['Untitled Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
          fontSizes: ['12px', '13px', '15px', '17px', '19px', '21px', '28px', '35px'],
          fontWeights: ['400', '500', '600', '700'],
          lineHeights: ['1.2', '1.25', '1.4', '1.5', '1.7'],
        },
        extractedSpacing: {
          paddings: ['4px', '8px', '12px', '16px', '20px', '24px', '32px'],
          margins: ['8px', '12px', '16px', '24px', '32px'],
          gaps: ['4px', '8px', '12px', '16px'],
        },
        extractedComponents: {
          borderRadii: ['4px', '6px', '8px', '12px'],
          shadows: [
            '0 1px 2px rgba(0,0,0,0.05)',
            '0 2px 4px rgba(0,0,0,0.08)',
            '0 4px 8px rgba(0,0,0,0.1)',
            'inset 0 0 0 1px rgba(0,0,0,0.1)',
          ],
          transitions: [
            'all 150ms ease',
            'background-color 100ms ease',
            'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
            'opacity 200ms ease',
          ],
        },
        extractedArchetypes: {
          header: 'sticky',
          hero: 'centered',
          features: 'grid',
          interactive: ['focus-visible', 'hover-highlight', 'keyboard-nav'],
        },
        layoutDsl: {
          sections: [
            { id: 'nav-0', role: 'nav', layout: 'stack', hierarchy: { hasHeading: false, hasSubheading: false, hasCta: true, media: 'none' }, density: 'tight' },
            { id: 'hero-1', role: 'hero', layout: 'stack', hierarchy: { hasHeading: true, hasSubheading: true, hasCta: true, media: 'none' }, density: 'spacious' },
            { id: 'features-2', role: 'features', layout: 'grid', hierarchy: { hasHeading: true, hasSubheading: true, hasCta: false, media: 'illustration' }, density: 'normal', columns: 3 },
            { id: 'content-3', role: 'content', layout: 'stack', hierarchy: { hasHeading: true, hasSubheading: false, hasCta: false, media: 'none' }, density: 'normal' },
            { id: 'footer-4', role: 'footer', layout: 'grid', hierarchy: { hasHeading: false, hasSubheading: false, hasCta: false, media: 'none' }, density: 'normal', columns: 4 },
          ],
        },
        harvestedSVGs: [
          { svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>', category: 'icon', context: 'arrow-right-icon' },
          { svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>', category: 'icon', context: 'chevron-down-icon' },
          { svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>', category: 'icon', context: 'info-icon' },
          { svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>', category: 'icon', context: 'close-icon' },
          { svg: '<svg viewBox="0 0 25 25" fill="none"><path d="M12 25C7.58172 25 4 21.4183 4 17C4 12.5817 7.58172 9 12 9V25Z" fill="#0091FF"/><path d="M12 0C16.4183 0 20 3.58172 20 8C20 12.4183 16.4183 16 12 16V0Z" fill="#0091FF"/><path d="M12 9C14.2091 9 16 7.20914 16 5C16 2.79086 14.2091 1 12 1V9Z" fill="#0091FF" opacity="0.5"/></svg>', category: 'logo', context: 'radix-logo' },
          { svg: '<svg viewBox="0 0 200 100" fill="none"><defs><linearGradient id="radix-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#0091FF;stop-opacity:0.2"/><stop offset="100%" style="stop-color:#0091FF;stop-opacity:0"/></linearGradient></defs><rect width="200" height="100" fill="url(#radix-grad)"/></svg>', category: 'pattern', context: 'gradient-fade' },
        ],
        extractedImages: [],
        motionCSS: `/* Motion: Accessible and purposeful */
@keyframes slideUpAndFade {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideRightAndFade {
  from { opacity: 0; transform: translateX(-2px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slideDownAndFade {
  from { opacity: 0; transform: translateY(-2px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes contentShow {
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
.animate-slideUpAndFade { animation: slideUpAndFade 200ms cubic-bezier(0.16, 1, 0.3, 1); }
.animate-contentShow { animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1); }
[data-state="open"] { animation: slideDownAndFade 200ms ease; }
.hover\\:bg-gray-3:hover { background-color: var(--gray-3); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }`,
        cssVariables: {
          '--accent': '#0091FF',
          '--accent-a3': 'rgba(0, 145, 255, 0.1)',
          '--accent-a4': 'rgba(0, 145, 255, 0.15)',
          '--gray-1': '#FAFAFA',
          '--gray-2': '#F4F4F5',
          '--gray-3': '#E4E4E7',
          '--gray-4': '#D4D4D8',
          '--gray-5': '#A1A1AA',
          '--gray-6': '#71717A',
          '--gray-11': '#27272A',
          '--gray-12': '#11181C',
          '--radius-1': '4px',
          '--radius-2': '6px',
          '--radius-3': '8px',
        },
        rawCSS: `
/* Radix Primitives styling patterns */
.radix-focus-guard { position: fixed; top: 0; left: 0; width: 1px; height: 0; overflow: hidden; }
.DialogOverlay { background: rgba(0, 0, 0, 0.5); position: fixed; inset: 0; animation: overlayShow 150ms ease; }
.DialogContent { background: white; border-radius: var(--radius-3); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); }
.DropdownMenuItem { padding: 8px 12px; border-radius: var(--radius-1); cursor: pointer; }
.DropdownMenuItem:hover { background: var(--gray-3); }
.DropdownMenuItem:focus { background: var(--accent-a3); outline: none; }
.TooltipContent { background: var(--gray-12); color: white; padding: 6px 10px; border-radius: var(--radius-2); font-size: 13px; }
`,
      },

      'ui.shadcn.com': {
        success: true,
        extractedColors: {
          backgrounds: ['#FFFFFF', '#FAFAFA', '#F4F4F5', '#09090B', '#0A0A0A'],
          texts: ['#09090B', '#71717A', '#A1A1AA', '#FAFAFA', '#E4E4E7'],
          accents: ['#18181B', '#27272A', '#3B82F6', '#8B5CF6'],
          borders: ['#E4E4E7', '#27272A', '#3F3F46'],
        },
        extractedTypography: {
          fontFamilies: ['Inter', 'Geist', 'system-ui', 'sans-serif'],
          fontSizes: ['13px', '14px', '16px', '18px', '24px', '30px', '36px', '48px'],
          fontWeights: ['400', '500', '600', '700', '800'],
          lineHeights: ['1.4', '1.5', '1.6', '1.75'],
        },
        extractedSpacing: {
          paddings: ['8px', '12px', '16px', '20px', '24px', '32px'],
          margins: ['8px', '16px', '24px', '32px', '48px'],
          gaps: ['8px', '12px', '16px', '24px'],
        },
        extractedComponents: {
          borderRadii: ['6px', '8px', '12px', '16px', 'var(--radius)'],
          shadows: [
            '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            '0 0 0 1px rgba(0, 0, 0, 0.05)',
          ],
          transitions: [
            'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            'colors 150ms ease',
            'transform 200ms ease-out',
          ],
        },
        extractedArchetypes: {
          header: 'sticky',
          hero: 'centered',
          features: 'grid',
          interactive: ['hover-bg', 'focus-ring', 'active-scale'],
        },
        layoutDsl: {
          sections: [
            { id: 'nav-0', role: 'nav', layout: 'stack', hierarchy: { hasHeading: false, hasSubheading: false, hasCta: true, media: 'none' }, density: 'tight' },
            { id: 'hero-1', role: 'hero', layout: 'stack', hierarchy: { hasHeading: true, hasSubheading: true, hasCta: true, media: 'none' }, density: 'spacious' },
            { id: 'features-2', role: 'features', layout: 'grid', hierarchy: { hasHeading: true, hasSubheading: true, hasCta: false, media: 'none' }, density: 'normal', columns: 3 },
            { id: 'cta-3', role: 'cta', layout: 'stack', hierarchy: { hasHeading: true, hasSubheading: true, hasCta: true, media: 'none' }, density: 'spacious' },
            { id: 'footer-4', role: 'footer', layout: 'grid', hierarchy: { hasHeading: false, hasSubheading: false, hasCta: false, media: 'none' }, density: 'normal', columns: 4 },
          ],
        },
        harvestedSVGs: [
          { svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>', category: 'icon', context: 'sparkles-icon' },
          { svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>', category: 'icon', context: 'layout-icon' },
          { svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>', category: 'icon', context: 'settings-icon' },
          { svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>', category: 'icon', context: 'check-circle-icon' },
          { svg: '<svg viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#18181B"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-weight="bold" font-size="14">ui</text></svg>', category: 'logo', context: 'shadcn-logo' },
        ],
        extractedImages: [],
        motionCSS: `/* Motion: Subtle and functional */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}
.animate-fade { animation: fadeIn 200ms ease-out; }
.animate-slide-down { animation: slideDown 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.transition-colors { transition: color 150ms, background-color 150ms, border-color 150ms; }
.hover\\:bg-accent:hover { background-color: hsl(var(--accent)); }
.active\\:scale-95:active { transform: scale(0.95); }
.focus-visible\\:ring-2:focus-visible { box-shadow: 0 0 0 2px hsl(var(--ring)); }`,
        cssVariables: {
          '--background': '0 0% 100%',
          '--foreground': '240 10% 3.9%',
          '--card': '0 0% 100%',
          '--card-foreground': '240 10% 3.9%',
          '--popover': '0 0% 100%',
          '--popover-foreground': '240 10% 3.9%',
          '--primary': '240 5.9% 10%',
          '--primary-foreground': '0 0% 98%',
          '--secondary': '240 4.8% 95.9%',
          '--secondary-foreground': '240 5.9% 10%',
          '--muted': '240 4.8% 95.9%',
          '--muted-foreground': '240 3.8% 46.1%',
          '--accent': '240 4.8% 95.9%',
          '--accent-foreground': '240 5.9% 10%',
          '--destructive': '0 84.2% 60.2%',
          '--destructive-foreground': '0 0% 98%',
          '--border': '240 5.9% 90%',
          '--input': '240 5.9% 90%',
          '--ring': '240 5.9% 10%',
          '--radius': '0.5rem',
        },
        rawCSS: `
/* shadcn/ui component patterns */
.card { background: hsl(var(--card)); border: 1px solid hsl(var(--border)); border-radius: var(--radius); }
.btn-primary { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border-radius: calc(var(--radius) - 2px); }
.btn-outline { border: 1px solid hsl(var(--border)); background: transparent; }
.btn-ghost { background: transparent; }
.btn-ghost:hover { background: hsl(var(--accent)); }
.input { border: 1px solid hsl(var(--input)); border-radius: calc(var(--radius) - 2px); background: transparent; }
.input:focus { border-color: hsl(var(--ring)); box-shadow: 0 0 0 1px hsl(var(--ring)); }
`,
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

      // =====================================
      // RELUME.IO - Elite Webflow-based design
      // =====================================
      'relume.io': {
        success: true,
        extractedColors: {
          backgrounds: ['#FFFFFF', '#F8F8F8', '#0F0F0F', '#1A1A1A'],
          texts: ['#0F0F0F', '#1A1A1A', '#4A4A4A', '#FFFFFF', '#F5F5F5'],
          accents: ['#6366F1', '#4F46E5', '#7C3AED', '#EC4899'],
          borders: ['#E5E5E5', '#D4D4D4', '#333333', '#404040'],
        },
        extractedTypography: {
          fontFamilies: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
          fontSizes: ['14px', '16px', '18px', '20px', '24px', '32px', '48px', '64px', '80px'],
          fontWeights: ['400', '500', '600', '700', '800', '900'],
          lineHeights: ['1.2', '1.3', '1.4', '1.5', '1.6'],
        },
        extractedSpacing: {
          paddings: ['16px', '24px', '32px', '48px', '64px', '80px', '120px'],
          margins: ['16px', '24px', '32px', '48px', '64px'],
          gaps: ['16px', '24px', '32px', '48px'],
        },
        extractedComponents: {
          borderRadii: ['8px', '12px', '16px', '24px', '32px', '9999px'],
          shadows: [
            '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          ],
          transitions: [
            'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            'transform 0.2s ease-out',
            'opacity 0.3s ease',
          ],
        },
        extractedArchetypes: {
          header: 'floating',
          hero: 'split',
          features: 'bento',
          interactive: ['hover-scale', 'magnetic-buttons', 'scroll-reveal'],
        },
        layoutDsl: {
          sections: [
            { id: 'nav-0', role: 'nav', layout: 'stack', hierarchy: { hasHeading: false, hasSubheading: false, hasCta: true, media: 'none' }, density: 'normal' },
            { id: 'hero-1', role: 'hero', layout: 'split', hierarchy: { hasHeading: true, hasSubheading: true, hasCta: true, media: 'image' }, density: 'spacious' },
            { id: 'features-2', role: 'features', layout: 'bento', hierarchy: { hasHeading: true, hasSubheading: true, hasCta: false, media: 'illustration' }, density: 'spacious', columns: 3 },
            { id: 'testimonial-3', role: 'testimonial', layout: 'carousel', hierarchy: { hasHeading: true, hasSubheading: false, hasCta: false, media: 'image' }, density: 'normal' },
            { id: 'cta-4', role: 'cta', layout: 'stack', hierarchy: { hasHeading: true, hasSubheading: true, hasCta: true, media: 'none' }, density: 'spacious' },
            { id: 'footer-5', role: 'footer', layout: 'grid', hierarchy: { hasHeading: false, hasSubheading: false, hasCta: false, media: 'none' }, density: 'normal', columns: 4 },
          ],
        },
        harvestedSVGs: [
          { svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>', category: 'icon', context: 'time-icon' },
          { svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>', category: 'icon', context: 'lightning-icon' },
          { svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>', category: 'icon', context: 'box-icon' },
          { svg: '<svg viewBox="0 0 200 200" fill="none"><defs><linearGradient id="relume-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#6366F1"/><stop offset="100%" style="stop-color:#EC4899"/></linearGradient></defs><circle cx="100" cy="100" r="80" fill="url(#relume-grad)" opacity="0.3"/></svg>', category: 'pattern', context: 'gradient-orb' },
          { svg: '<svg viewBox="0 0 400 400" fill="none"><defs><radialGradient id="mesh-grad"><stop offset="0%" stop-color="#7C3AED" stop-opacity="0.4"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs><circle cx="200" cy="200" r="150" fill="url(#mesh-grad)"/></svg>', category: 'pattern', context: 'gradient-mesh' },
          { svg: '<svg viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#6366F1"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-weight="bold">R</text></svg>', category: 'logo', context: 'relume-logo' },
        ],
        extractedImages: [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
          'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
        ],
        motionCSS: `/* Motion Libraries Detected: GSAP, ScrollTrigger */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-fade-up { animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.animate-scale { animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.animate-float { animation: float 3s ease-in-out infinite; }
.hover-scale { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.hover-scale:hover { transform: scale(1.02); }
.magnetic-btn { transition: transform 0.2s ease-out; }`,
        cssVariables: {
          '--primary': '#6366F1',
          '--secondary': '#7C3AED',
          '--accent': '#EC4899',
          '--background': '#FFFFFF',
          '--foreground': '#0F0F0F',
          '--muted': '#F8F8F8',
          '--border': '#E5E5E5',
          '--radius': '16px',
        },
        rawCSS: `
/* Relume glass morphism */
.glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.3); }
/* Gradient borders */
.gradient-border { position: relative; }
.gradient-border::before { content: ''; position: absolute; inset: 0; padding: 1px; background: linear-gradient(135deg, #6366F1, #EC4899); border-radius: inherit; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude; }
/* Floating orbs */
.orb { position: absolute; border-radius: 50%; filter: blur(60px); animation: float 6s ease-in-out infinite; }
`,
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
    extractedArchetypes: {},
    harvestedSVGs: [],
    layoutDsl: { sections: [] },
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
