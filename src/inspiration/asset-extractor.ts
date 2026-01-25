/**
 * Asset Extractor
 * Extract visual assets (images, SVGs, videos, Lottie) from websites
 */

import { BrowserAutomation, withBrowser } from './browser-automation';
import { optimizeSVG } from '../visual-assets';
import type {
    ExtractedAssets,
    ImageAsset,
    SVGAsset,
    VideoAsset,
    LottieAsset,
    IconAsset,
    Asset,
} from './miromiro-types';

/**
 * Categorize image based on context
 */
function categorizeImage(
    src: string,
    alt: string,
    width: number,
    height: number
): ImageAsset['category'] {
    const srcLower = src.toLowerCase();
    const altLower = alt.toLowerCase();

    // Logo detection
    if (srcLower.includes('logo') || altLower.includes('logo')) return 'logo';

    // Icon detection (small images)
    if (width < 100 && height < 100) return 'icon';

    // Hero detection (large images)
    if (width > 1200 || height > 600) return 'hero';

    // Background detection
    if (srcLower.includes('background') || srcLower.includes('bg')) return 'background';

    // Product detection
    if (srcLower.includes('product') || altLower.includes('product')) return 'product';

    // Illustration detection
    if (srcLower.includes('illustration') || altLower.includes('illustration')) return 'illustration';

    return 'other';
}

/**
 * Categorize SVG based on context
 */
function categorizeSVG(content: string, width: number, height: number): SVGAsset['category'] {
    const contentLower = content.toLowerCase();

    // Logo detection
    if (contentLower.includes('logo')) return 'logo';

    // Icon detection (small SVGs)
    if (width < 100 && height < 100) return 'icon';

    // Pattern detection
    if (contentLower.includes('pattern') || contentLower.includes('defs')) return 'pattern';

    // Illustration detection
    if (width > 200 || height > 200) return 'illustration';

    return 'other';
}

/**
 * Extract all images from page (including background images)
 */
export async function extractImages(browser: BrowserAutomation): Promise<ImageAsset[]> {
    const imageData = await browser.evaluate(() => {
        const images: any[] = [];

        // Regular <img> tags
        document.querySelectorAll('img').forEach((img) => {
            if (img.src) {
                images.push({
                    src: img.src,
                    alt: img.alt || '',
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    source: 'img-tag'
                });
            }
        });

        // Background images
        document.querySelectorAll('*').forEach((el) => {
            const style = window.getComputedStyle(el);
            const bg = style.backgroundImage;
            if (bg && bg !== 'none' && bg.includes('url(')) {
                const url = bg.match(/url\(["']?([^"']+)["']?\)/)?.[1];
                if (url && !url.startsWith('data:')) {
                    const fullUrl = new URL(url, window.location.href).href;
                    images.push({
                        src: fullUrl,
                        alt: 'Background Image',
                        width: el.clientWidth,
                        height: el.clientHeight,
                        source: 'background'
                    });
                }
            }
        });

        return images;
    });

    return imageData.map((img) => {
        const format = img.src.match(/\.(png|jpg|jpeg|webp|avif|gif)(\?|$)/i)?.[1]?.toLowerCase() as
            | ImageAsset['format']
            | undefined;

        return {
            type: 'image' as const,
            format: format || 'jpg',
            url: img.src,
            width: img.width,
            height: img.height,
            alt: img.alt,
            category: categorizeImage(img.src, img.alt, img.width, img.height),
        };
    });
}

/**
 * Extract all SVGs from page (inline and linked)
 */
export async function extractSVGs(browser: BrowserAutomation): Promise<SVGAsset[]> {
    const svgData = await browser.evaluate(async () => {
        const results: any[] = [];

        // Inline SVGs
        document.querySelectorAll('svg').forEach((svg) => {
            const bbox = svg.getBBox ? svg.getBBox() : { width: 0, height: 0 };
            results.push({
                content: svg.outerHTML,
                url: '',
                width: svg.width?.baseVal?.value || bbox.width || 0,
                height: svg.height?.baseVal?.value || bbox.height || 0,
            });
        });

        // SVGs in <img> tags
        const imgSvgs = Array.from(document.querySelectorAll('img[src$=".svg"], img[src*=".svg?"]'));
        for (const img of imgSvgs) {
            const imgSrc = (img as HTMLImageElement).src;
            try {
                // Try to fetch the SVG content to make it "visible" in the report
                const res = await fetch(imgSrc);
                const content = await res.text();
                if (content.includes('<svg')) {
                    results.push({
                        content: content,
                        url: imgSrc,
                        width: (img as HTMLImageElement).naturalWidth,
                        height: (img as HTMLImageElement).naturalHeight,
                    });
                }
            } catch (e) {
                // Fallback to just URL if fetch fails
                results.push({
                    content: '',
                    url: imgSrc,
                    width: (img as HTMLImageElement).naturalWidth,
                    height: (img as HTMLImageElement).naturalHeight,
                });
            }
        }

        return results;
    });

    return svgData.map((svg) => {
        const category = categorizeSVG(svg.content || '', svg.width, svg.height);

        // Optimize SVG if content exists
        let optimized: string | undefined;
        if (svg.content) {
            try {
                const result = optimizeSVG(svg.content, { minify: true });
                optimized = result.svg;
            } catch (e) { }
        }

        return {
            type: 'svg' as const,
            url: svg.url,
            content: svg.content,
            width: svg.width,
            height: svg.height,
            category,
            optimized,
        };
    });
}

/**
 * Extract graphs and charts (Canvas elements)
 */
export async function extractGraphs(browser: BrowserAutomation): Promise<any[]> {
    return await browser.evaluate(() => {
        const canvases = Array.from(document.querySelectorAll('canvas'));
        return canvases.map((canvas, i) => {
            try {
                return {
                    id: canvas.id || `canvas-${i}`,
                    type: 'graph',
                    dataUrl: canvas.toDataURL('image/png'),
                    width: canvas.width,
                    height: canvas.height,
                    category: 'graph'
                };
            } catch (e) {
                return null;
            }
        }).filter(Boolean);
    });
}

/**
 * Extract all videos from page
 */
export async function extractVideos(browser: BrowserAutomation): Promise<VideoAsset[]> {
    const videoData = await browser.evaluate(() => {
        const videos = Array.from(document.querySelectorAll('video'));
        return videos.map((video) => {
            const source = video.querySelector('source');
            return {
                src: source?.src || video.src || '',
                width: video.videoWidth,
                height: video.videoHeight,
                className: video.className,
            };
        });
    });

    return videoData
        .filter((v) => v.src)
        .map((video) => {
            const format = video.src.match(/\.(mp4|webm|ogg)(\?|$)/i)?.[1]?.toLowerCase() as
                | VideoAsset['format']
                | undefined;

            let category: VideoAsset['category'] = 'other';
            if (video.className.includes('hero') || video.className.includes('banner')) category = 'hero';
            else if (video.className.includes('background') || video.className.includes('bg'))
                category = 'background';
            else if (video.className.includes('demo')) category = 'demo';

            return {
                type: 'video' as const,
                format: format || 'mp4',
                url: video.src,
                width: video.width,
                height: video.height,
                category,
            };
        });
}

/**
 * Extract Lottie animations from page
 */
export async function extractLottieAnimations(browser: BrowserAutomation): Promise<LottieAsset[]> {
    const lottieData = await browser.evaluate(() => {
        const lottieElements: any[] = [];

        // Look for Lottie player elements
        const players = document.querySelectorAll('lottie-player, [data-lottie], .lottie');
        players.forEach((el) => {
            const src = el.getAttribute('src') || el.getAttribute('data-src') || '';
            if (src) {
                lottieElements.push({
                    url: src,
                    className: el.className,
                });
            }
        });

        // Look for Lottie in script tags
        const scripts = Array.from(document.querySelectorAll('script'));
        scripts.forEach((script) => {
            const content = script.textContent || '';
            const lottieMatch = content.match(/lottie\.loadAnimation\({[^}]*path:\s*['"]([^'"]+)['"]/);
            if (lottieMatch) {
                lottieElements.push({
                    url: lottieMatch[1],
                    className: '',
                });
            }
        });

        return lottieElements;
    });

    return lottieData.map((lottie) => {
        let category: LottieAsset['category'] = 'other';
        const className = lottie.className.toLowerCase();

        if (className.includes('icon')) category = 'icon';
        else if (className.includes('illustration')) category = 'illustration';
        else if (className.includes('loader') || className.includes('loading')) category = 'loader';

        return {
            type: 'lottie' as const,
            url: lottie.url,
            data: null, // Would need to fetch the JSON
            category,
        };
    });
}

/**
 * Extract icon assets (from icon fonts or sprite sheets)
 */
export async function extractIcons(browser: BrowserAutomation): Promise<IconAsset[]> {
    const iconData = await browser.evaluate(() => {
        const icons: any[] = [];

        // Font icons (Font Awesome, Material Icons, etc.)
        const fontIcons = document.querySelectorAll('i[class*="fa-"], i[class*="icon-"], i[class*="material-"]');
        fontIcons.forEach((icon) => {
            icons.push({
                format: 'font' as const,
                name: icon.className,
                className: icon.className,
            });
        });

        // SVG icons (already handled by extractSVGs, but we can categorize them here)
        const svgIcons = document.querySelectorAll('svg[class*="icon"], svg[width="16"], svg[width="24"]');
        svgIcons.forEach((svg) => {
            const svgElement = svg as SVGElement;
            icons.push({
                format: 'svg' as const,
                content: svg.outerHTML,
                className: typeof svgElement.className === 'string' ? svgElement.className : svgElement.className.baseVal || '',
            });
        });

        return icons;
    });

    return iconData.map((icon) => {
        let category: IconAsset['category'] = 'ui';
        const className = icon.className?.toLowerCase() || '';

        if (className.includes('social') || className.includes('facebook') || className.includes('twitter'))
            category = 'social';
        else if (className.includes('brand') || className.includes('logo')) category = 'brand';

        return {
            type: 'icon' as const,
            format: icon.format,
            url: '',
            content: icon.content,
            name: icon.name,
            category,
        };
    });
}

/**
 * Extract all assets from a URL
 */
export async function extractAssets(url: string): Promise<ExtractedAssets> {
    return await withBrowser(
        url,
        async (browser) => {
            // Scroll to load lazy-loaded content
            await browser.scrollToBottom();

            // Extract all asset types
            const [images, svgs, videos, lottie, icons, graphs] = await Promise.all([
                extractImages(browser),
                extractSVGs(browser),
                extractVideos(browser),
                extractLottieAnimations(browser),
                extractIcons(browser),
                extractGraphs(browser),
            ]);

            const all: Asset[] = [...images, ...svgs, ...videos, ...lottie, ...icons, ...graphs];

            return {
                images,
                svgs,
                videos,
                lottie,
                icons,
                graphs,
                all,
                metadata: {
                    url,
                    extractedAt: new Date().toISOString(),
                    totalAssets: all.length,
                },
            };
        },
        { headless: true, timeout: 60000 }
    );
}

/**
 * Download asset to file (helper function)
 */
export async function downloadAsset(url: string, outputPath: string): Promise<void> {
    // This would use fetch or axios to download the asset
    // Implementation depends on Node.js environment
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    // Write to file (would need fs module)
    // fs.writeFileSync(outputPath, Buffer.from(buffer));
}

/**
 * Categorize all assets by type
 */
export function categorizeAssets(assets: ExtractedAssets): Record<string, Asset[]> {
    const categorized: Record<string, Asset[]> = {
        hero: [],
        logo: [],
        icon: [],
        illustration: [],
        background: [],
        product: [],
        other: [],
    };

    assets.all.forEach((asset) => {
        const category = asset.category;
        if (category in categorized) {
            categorized[category].push(asset);
        } else {
            categorized.other.push(asset);
        }
    });

    return categorized;
}
