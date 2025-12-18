/**
 * Placeholder Generator
 *
 * Context-aware placeholder image generation using free APIs
 *
 * Sources:
 * - Lorem Picsum: Random photos (free, unlimited)
 * - UI Avatars: Text-based avatars (free)
 * - DiceBear: Illustrated avatars (free)
 * - Generated patterns: Local SVG generation
 */

import type {
  PlaceholderOptions,
  PlaceholderResult,
  PlaceholderType,
  PlaceholderStyle,
  Industry,
} from './types';

// ============================================================================
// Industry-specific Keywords for Photo Selection
// ============================================================================

const INDUSTRY_KEYWORDS: Record<Industry, Record<PlaceholderType, string[]>> = {
  hospitality: {
    hero: ['hotel', 'resort', 'luxury', 'hospitality', 'vacation', 'travel'],
    avatar: ['person', 'professional', 'portrait'],
    product: ['room', 'suite', 'bed', 'interior'],
    testimonial: ['happy', 'guest', 'customer', 'smile'],
    thumbnail: ['hotel', 'room', 'amenity'],
    logo: ['building', 'architecture'],
    icon: ['service', 'amenity'],
    background: ['lobby', 'interior', 'architecture'],
    card: ['hotel', 'room', 'destination'],
    gallery: ['resort', 'pool', 'spa', 'restaurant'],
  },
  ecommerce: {
    hero: ['shopping', 'retail', 'store', 'fashion'],
    avatar: ['shopper', 'customer', 'person'],
    product: ['product', 'package', 'box', 'item'],
    testimonial: ['happy', 'customer', 'review'],
    thumbnail: ['product', 'item', 'goods'],
    logo: ['brand', 'store'],
    icon: ['shopping', 'cart', 'bag'],
    background: ['store', 'retail', 'minimal'],
    card: ['product', 'fashion', 'lifestyle'],
    gallery: ['product', 'collection', 'style'],
  },
  saas: {
    hero: ['technology', 'abstract', 'digital', 'software'],
    avatar: ['professional', 'developer', 'team'],
    product: ['dashboard', 'interface', 'app'],
    testimonial: ['professional', 'business', 'success'],
    thumbnail: ['tech', 'digital', 'interface'],
    logo: ['tech', 'abstract'],
    icon: ['tech', 'digital'],
    background: ['abstract', 'gradient', 'geometric'],
    card: ['software', 'tech', 'digital'],
    gallery: ['team', 'office', 'workspace'],
  },
  healthcare: {
    hero: ['health', 'medical', 'care', 'wellness'],
    avatar: ['doctor', 'nurse', 'medical'],
    product: ['medical', 'health', 'equipment'],
    testimonial: ['patient', 'health', 'happy'],
    thumbnail: ['medical', 'health', 'care'],
    logo: ['medical', 'health'],
    icon: ['medical', 'health', 'care'],
    background: ['clean', 'minimal', 'health'],
    card: ['health', 'wellness', 'care'],
    gallery: ['clinic', 'hospital', 'care'],
  },
  fintech: {
    hero: ['finance', 'money', 'banking', 'investment'],
    avatar: ['professional', 'business', 'finance'],
    product: ['card', 'banking', 'money'],
    testimonial: ['business', 'professional', 'success'],
    thumbnail: ['finance', 'money', 'chart'],
    logo: ['finance', 'abstract'],
    icon: ['money', 'finance', 'chart'],
    background: ['abstract', 'geometric', 'dark'],
    card: ['finance', 'investment', 'growth'],
    gallery: ['office', 'business', 'professional'],
  },
  education: {
    hero: ['education', 'learning', 'school', 'study'],
    avatar: ['student', 'teacher', 'professor'],
    product: ['book', 'course', 'learning'],
    testimonial: ['student', 'happy', 'success'],
    thumbnail: ['education', 'book', 'learning'],
    logo: ['education', 'book'],
    icon: ['education', 'learning'],
    background: ['library', 'classroom', 'minimal'],
    card: ['course', 'education', 'learning'],
    gallery: ['campus', 'classroom', 'students'],
  },
  social: {
    hero: ['social', 'community', 'people', 'connection'],
    avatar: ['person', 'profile', 'portrait'],
    product: ['social', 'app', 'community'],
    testimonial: ['happy', 'people', 'friends'],
    thumbnail: ['social', 'community', 'people'],
    logo: ['social', 'community'],
    icon: ['social', 'chat', 'community'],
    background: ['colorful', 'vibrant', 'social'],
    card: ['people', 'community', 'social'],
    gallery: ['people', 'friends', 'events'],
  },
  productivity: {
    hero: ['productivity', 'work', 'office', 'organization'],
    avatar: ['professional', 'worker', 'business'],
    product: ['tool', 'app', 'productivity'],
    testimonial: ['professional', 'success', 'happy'],
    thumbnail: ['productivity', 'work', 'tool'],
    logo: ['productivity', 'abstract'],
    icon: ['productivity', 'task', 'check'],
    background: ['minimal', 'clean', 'workspace'],
    card: ['productivity', 'work', 'organization'],
    gallery: ['workspace', 'office', 'desk'],
  },
  'developer-tools': {
    hero: ['code', 'developer', 'programming', 'tech'],
    avatar: ['developer', 'programmer', 'tech'],
    product: ['code', 'terminal', 'interface'],
    testimonial: ['developer', 'tech', 'professional'],
    thumbnail: ['code', 'tech', 'programming'],
    logo: ['tech', 'code', 'abstract'],
    icon: ['code', 'terminal', 'git'],
    background: ['dark', 'code', 'abstract'],
    card: ['developer', 'code', 'tech'],
    gallery: ['office', 'tech', 'developer'],
  },
  marketing: {
    hero: ['marketing', 'growth', 'business', 'success'],
    avatar: ['marketer', 'professional', 'business'],
    product: ['marketing', 'analytics', 'growth'],
    testimonial: ['success', 'business', 'happy'],
    thumbnail: ['marketing', 'growth', 'chart'],
    logo: ['marketing', 'brand'],
    icon: ['marketing', 'chart', 'growth'],
    background: ['colorful', 'dynamic', 'abstract'],
    card: ['marketing', 'campaign', 'growth'],
    gallery: ['team', 'meeting', 'presentation'],
  },
  crm: {
    hero: ['business', 'customer', 'relationship', 'sales'],
    avatar: ['sales', 'professional', 'business'],
    product: ['crm', 'dashboard', 'contacts'],
    testimonial: ['business', 'success', 'happy'],
    thumbnail: ['business', 'contacts', 'sales'],
    logo: ['business', 'crm'],
    icon: ['contact', 'customer', 'handshake'],
    background: ['business', 'professional', 'minimal'],
    card: ['customer', 'business', 'relationship'],
    gallery: ['meeting', 'team', 'business'],
  },
  generic: {
    hero: ['abstract', 'minimal', 'modern'],
    avatar: ['person', 'professional', 'portrait'],
    product: ['product', 'item', 'object'],
    testimonial: ['happy', 'person', 'smile'],
    thumbnail: ['minimal', 'abstract', 'modern'],
    logo: ['abstract', 'minimal'],
    icon: ['minimal', 'abstract'],
    background: ['abstract', 'gradient', 'minimal'],
    card: ['modern', 'minimal', 'abstract'],
    gallery: ['modern', 'minimal', 'abstract'],
  },
};

// ============================================================================
// Color Palettes by Theme
// ============================================================================

const COLOR_PALETTES = {
  light: {
    primary: '#6366f1', // Indigo
    secondary: '#8b5cf6', // Violet
    background: '#f8fafc',
    foreground: '#1e293b',
    muted: '#94a3b8',
  },
  dark: {
    primary: '#818cf8', // Lighter indigo
    secondary: '#a78bfa', // Lighter violet
    background: '#0f172a',
    foreground: '#f1f5f9',
    muted: '#64748b',
  },
};

// ============================================================================
// Placeholder Generation Functions
// ============================================================================

/**
 * Generate Lorem Picsum URL for photography style
 */
function generatePicsumUrl(
  width: number,
  height: number,
  keyword?: string,
  seed?: string
): string {
  const baseUrl = 'https://picsum.photos';

  if (seed) {
    return `${baseUrl}/seed/${seed}/${width}/${height}`;
  }

  // Use random image
  return `${baseUrl}/${width}/${height}`;
}

/**
 * Generate UI Avatars URL for text-based avatars
 */
function generateUIAvatarUrl(
  text: string,
  size: number,
  theme: 'light' | 'dark',
  colors?: string[]
): string {
  const palette = COLOR_PALETTES[theme];
  const bg = colors?.[0] || palette.primary;
  const fg = colors?.[1] || palette.foreground;

  const params = new URLSearchParams({
    name: text,
    size: size.toString(),
    background: bg.replace('#', ''),
    color: fg.replace('#', ''),
    bold: 'true',
    format: 'svg',
  });

  return `https://ui-avatars.com/api/?${params.toString()}`;
}

/**
 * Generate DiceBear avatar URL
 */
function generateDiceBearUrl(
  style: 'avataaars' | 'bottts' | 'initials' | 'shapes' | 'thumbs',
  seed: string,
  size: number
): string {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=${size}`;
}

/**
 * Generate SVG gradient background
 */
function generateGradientSVG(
  width: number,
  height: number,
  theme: 'light' | 'dark',
  colors?: string[]
): string {
  const palette = COLOR_PALETTES[theme];
  const color1 = colors?.[0] || palette.primary;
  const color2 = colors?.[1] || palette.secondary;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" />
</svg>`;
}

/**
 * Generate SVG pattern background
 */
function generatePatternSVG(
  width: number,
  height: number,
  patternType: 'dots' | 'lines' | 'grid',
  theme: 'light' | 'dark'
): string {
  const palette = COLOR_PALETTES[theme];
  const bg = palette.background;
  const fg = palette.muted;

  const patterns: Record<string, string> = {
    dots: `
      <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="2" fill="${fg}" opacity="0.3" />
      </pattern>`,
    lines: `
      <pattern id="lines" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="20" y2="0" stroke="${fg}" stroke-width="1" opacity="0.2" />
      </pattern>`,
    grid: `
      <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${fg}" stroke-width="0.5" opacity="0.2" />
      </pattern>`,
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>${patterns[patternType]}</defs>
  <rect width="100%" height="100%" fill="${bg}" />
  <rect width="100%" height="100%" fill="url(#${patternType})" />
</svg>`;
}

/**
 * Generate solid color SVG
 */
function generateSolidSVG(width: number, height: number, color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${color}" />
</svg>`;
}

/**
 * Convert SVG to data URI
 */
function svgToDataUri(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Get alt text based on placeholder type and industry
 */
function getAltText(type: PlaceholderType, industry: Industry): string {
  const altTexts: Record<PlaceholderType, Record<Industry, string>> = {
    hero: {
      hospitality: 'Luxury hotel and resort experience',
      ecommerce: 'Shopping and retail experience',
      saas: 'Software platform overview',
      healthcare: 'Healthcare and wellness services',
      fintech: 'Financial technology solutions',
      education: 'Educational learning platform',
      social: 'Community and social connections',
      productivity: 'Productivity and organization tools',
      'developer-tools': 'Developer tools and coding environment',
      marketing: 'Marketing and growth solutions',
      crm: 'Customer relationship management',
      generic: 'Platform overview',
    },
    avatar: {
      hospitality: 'Guest profile',
      ecommerce: 'Customer profile',
      saas: 'User profile',
      healthcare: 'Patient profile',
      fintech: 'Account holder',
      education: 'Student profile',
      social: 'User profile',
      productivity: 'Team member',
      'developer-tools': 'Developer profile',
      marketing: 'Team member',
      crm: 'Contact profile',
      generic: 'User profile',
    },
    product: {
      hospitality: 'Room or accommodation',
      ecommerce: 'Product image',
      saas: 'Feature showcase',
      healthcare: 'Service offering',
      fintech: 'Financial product',
      education: 'Course content',
      social: 'Post content',
      productivity: 'Tool feature',
      'developer-tools': 'Tool interface',
      marketing: 'Campaign asset',
      crm: 'Service feature',
      generic: 'Product image',
    },
    testimonial: {
      hospitality: 'Happy guest testimonial',
      ecommerce: 'Customer review',
      saas: 'Client testimonial',
      healthcare: 'Patient testimonial',
      fintech: 'Client success story',
      education: 'Student success',
      social: 'User testimonial',
      productivity: 'User feedback',
      'developer-tools': 'Developer testimonial',
      marketing: 'Client success',
      crm: 'Customer testimonial',
      generic: 'User testimonial',
    },
    thumbnail: {
      hospitality: 'Accommodation preview',
      ecommerce: 'Product preview',
      saas: 'Feature preview',
      healthcare: 'Service preview',
      fintech: 'Feature preview',
      education: 'Course preview',
      social: 'Content preview',
      productivity: 'Feature preview',
      'developer-tools': 'Tool preview',
      marketing: 'Asset preview',
      crm: 'Feature preview',
      generic: 'Content preview',
    },
    logo: {
      hospitality: 'Partner logo',
      ecommerce: 'Brand logo',
      saas: 'Integration logo',
      healthcare: 'Partner logo',
      fintech: 'Partner logo',
      education: 'Institution logo',
      social: 'Partner logo',
      productivity: 'Integration logo',
      'developer-tools': 'Technology logo',
      marketing: 'Client logo',
      crm: 'Integration logo',
      generic: 'Company logo',
    },
    icon: {
      hospitality: 'Amenity icon',
      ecommerce: 'Feature icon',
      saas: 'Feature icon',
      healthcare: 'Service icon',
      fintech: 'Feature icon',
      education: 'Course icon',
      social: 'Feature icon',
      productivity: 'Feature icon',
      'developer-tools': 'Tool icon',
      marketing: 'Feature icon',
      crm: 'Feature icon',
      generic: 'Feature icon',
    },
    background: {
      hospitality: 'Decorative background',
      ecommerce: 'Decorative background',
      saas: 'Abstract background',
      healthcare: 'Clean background',
      fintech: 'Professional background',
      education: 'Learning environment',
      social: 'Colorful background',
      productivity: 'Minimal background',
      'developer-tools': 'Tech background',
      marketing: 'Dynamic background',
      crm: 'Professional background',
      generic: 'Decorative background',
    },
    card: {
      hospitality: 'Accommodation card',
      ecommerce: 'Product card',
      saas: 'Feature card',
      healthcare: 'Service card',
      fintech: 'Feature card',
      education: 'Course card',
      social: 'Content card',
      productivity: 'Feature card',
      'developer-tools': 'Tool card',
      marketing: 'Campaign card',
      crm: 'Feature card',
      generic: 'Content card',
    },
    gallery: {
      hospitality: 'Property gallery image',
      ecommerce: 'Product gallery image',
      saas: 'Feature gallery',
      healthcare: 'Facility gallery',
      fintech: 'Office gallery',
      education: 'Campus gallery',
      social: 'User content',
      productivity: 'Workspace gallery',
      'developer-tools': 'Office gallery',
      marketing: 'Portfolio item',
      crm: 'Team gallery',
      generic: 'Gallery image',
    },
  };

  return altTexts[type]?.[industry] || 'Placeholder image';
}

// ============================================================================
// Main Generator Class
// ============================================================================

export class PlaceholderGenerator {
  /**
   * Generate a context-aware placeholder image
   */
  async generate(options: PlaceholderOptions): Promise<PlaceholderResult> {
    const {
      type,
      style = 'photography',
      industry = 'generic',
      dimensions = this.getDefaultDimensions(type),
      theme = 'light',
      seed,
      text,
      colors,
    } = options;

    const [width, height] = dimensions;

    switch (style) {
      case 'photography':
        return this.generatePhotography(type, industry, width, height, seed);

      case 'gradient':
        return this.generateGradient(type, industry, width, height, theme, colors);

      case 'pattern':
        return this.generatePattern(type, industry, width, height, theme);

      case 'solid':
        return this.generateSolid(type, industry, width, height, theme, colors);

      case 'abstract':
        // Use gradient for abstract
        return this.generateGradient(type, industry, width, height, theme, colors);

      case 'illustration':
        // Use DiceBear for illustrated placeholders
        if (type === 'avatar') {
          return this.generateIllustrationAvatar(industry, width, seed || text || 'user');
        }
        // Fall back to pattern for non-avatar illustrations
        return this.generatePattern(type, industry, width, height, theme);

      default:
        return this.generatePhotography(type, industry, width, height, seed);
    }
  }

  /**
   * Get default dimensions for placeholder type
   */
  private getDefaultDimensions(type: PlaceholderType): [number, number] {
    const defaults: Record<PlaceholderType, [number, number]> = {
      hero: [1920, 1080],
      avatar: [200, 200],
      product: [600, 600],
      testimonial: [400, 400],
      thumbnail: [300, 200],
      logo: [200, 100],
      icon: [64, 64],
      background: [1920, 1080],
      card: [400, 300],
      gallery: [800, 600],
    };
    return defaults[type] || [400, 300];
  }

  /**
   * Generate photography placeholder using Lorem Picsum
   */
  private async generatePhotography(
    type: PlaceholderType,
    industry: Industry,
    width: number,
    height: number,
    seed?: string
  ): Promise<PlaceholderResult> {
    const url = generatePicsumUrl(width, height, undefined, seed);

    return {
      url,
      alt: getAltText(type, industry),
      attribution: {
        source: 'Lorem Picsum',
        license: 'Free to use',
        url: 'https://picsum.photos/',
      },
      dimensions: { width, height },
      metadata: {
        type,
        style: 'photography',
        generated: false,
      },
    };
  }

  /**
   * Generate gradient placeholder
   */
  private async generateGradient(
    type: PlaceholderType,
    industry: Industry,
    width: number,
    height: number,
    theme: 'light' | 'dark',
    colors?: string[]
  ): Promise<PlaceholderResult> {
    const svg = generateGradientSVG(width, height, theme, colors);
    const dataUri = svgToDataUri(svg);

    return {
      url: dataUri,
      dataUri,
      svg,
      alt: getAltText(type, industry),
      dimensions: { width, height },
      metadata: {
        type,
        style: 'gradient',
        generated: true,
      },
    };
  }

  /**
   * Generate pattern placeholder
   */
  private async generatePattern(
    type: PlaceholderType,
    industry: Industry,
    width: number,
    height: number,
    theme: 'light' | 'dark'
  ): Promise<PlaceholderResult> {
    // Choose pattern based on type
    const patternType = type === 'background' ? 'dots' : type === 'card' ? 'lines' : 'grid';
    const svg = generatePatternSVG(width, height, patternType, theme);
    const dataUri = svgToDataUri(svg);

    return {
      url: dataUri,
      dataUri,
      svg,
      alt: getAltText(type, industry),
      dimensions: { width, height },
      metadata: {
        type,
        style: 'pattern',
        generated: true,
      },
    };
  }

  /**
   * Generate solid color placeholder
   */
  private async generateSolid(
    type: PlaceholderType,
    industry: Industry,
    width: number,
    height: number,
    theme: 'light' | 'dark',
    colors?: string[]
  ): Promise<PlaceholderResult> {
    const palette = COLOR_PALETTES[theme];
    const color = colors?.[0] || palette.background;
    const svg = generateSolidSVG(width, height, color);
    const dataUri = svgToDataUri(svg);

    return {
      url: dataUri,
      dataUri,
      svg,
      alt: getAltText(type, industry),
      dimensions: { width, height },
      metadata: {
        type,
        style: 'solid',
        generated: true,
      },
    };
  }

  /**
   * Generate illustrated avatar using DiceBear
   */
  private async generateIllustrationAvatar(
    industry: Industry,
    size: number,
    seed: string
  ): Promise<PlaceholderResult> {
    // Choose avatar style based on industry
    const styleMap: Record<Industry, 'avataaars' | 'bottts' | 'shapes'> = {
      hospitality: 'avataaars',
      ecommerce: 'avataaars',
      saas: 'shapes',
      healthcare: 'avataaars',
      fintech: 'shapes',
      education: 'avataaars',
      social: 'avataaars',
      productivity: 'shapes',
      'developer-tools': 'bottts',
      marketing: 'avataaars',
      crm: 'avataaars',
      generic: 'avataaars',
    };

    const style = styleMap[industry];
    const url = generateDiceBearUrl(style, seed, size);

    return {
      url,
      alt: getAltText('avatar', industry),
      attribution: {
        source: 'DiceBear',
        license: 'CC0 1.0',
        url: 'https://www.dicebear.com/',
      },
      dimensions: { width: size, height: size },
      metadata: {
        type: 'avatar',
        style: 'illustration',
        generated: false,
      },
    };
  }

  /**
   * Generate text-based avatar
   */
  async generateTextAvatar(
    text: string,
    size: number = 200,
    theme: 'light' | 'dark' = 'light',
    colors?: string[]
  ): Promise<PlaceholderResult> {
    const url = generateUIAvatarUrl(text, size, theme, colors);

    return {
      url,
      alt: `Avatar for ${text}`,
      attribution: {
        source: 'UI Avatars',
        license: 'Free to use',
        url: 'https://ui-avatars.com/',
      },
      dimensions: { width: size, height: size },
      metadata: {
        type: 'avatar',
        style: 'solid',
        generated: false,
      },
    };
  }

  /**
   * Get industry keywords for a specific placeholder type
   * Useful for searching stock photo APIs
   */
  getKeywords(type: PlaceholderType, industry: Industry): string[] {
    return INDUSTRY_KEYWORDS[industry]?.[type] || INDUSTRY_KEYWORDS.generic[type];
  }
}

// ============================================================================
// Convenience Function
// ============================================================================

const generator = new PlaceholderGenerator();

/**
 * Generate a context-aware placeholder image
 *
 * @example
 * ```typescript
 * // Photography hero for hospitality
 * const hero = await generatePlaceholder({
 *   type: 'hero',
 *   style: 'photography',
 *   industry: 'hospitality',
 *   dimensions: [1920, 1080]
 * });
 *
 * // Gradient background for SaaS
 * const bg = await generatePlaceholder({
 *   type: 'background',
 *   style: 'gradient',
 *   industry: 'saas',
 *   theme: 'dark'
 * });
 *
 * // Text avatar
 * const avatar = await generatePlaceholder({
 *   type: 'avatar',
 *   style: 'solid',
 *   text: 'John Doe',
 *   dimensions: [100, 100]
 * });
 * ```
 */
export async function generatePlaceholder(
  options: PlaceholderOptions
): Promise<PlaceholderResult> {
  return generator.generate(options);
}

export { PlaceholderGenerator as default };
