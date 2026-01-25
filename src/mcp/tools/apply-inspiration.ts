/**
 * Apply Inspiration MCP Tool
 *
 * Extracts design language from inspiration sources and creates a profile.
 */

import type { AppliedTuners } from '../../blocks/types';
import type { InspirationProfile, ColorPalette, TypographyConfig, SpacingConfig, MotionConfig, ComponentStyleConfig, BlockPreferenceConfig } from '../../inspiration/inspiration-profile';
import {
  InspirationProfileBuilder,
  getDefaultColorPalette,
  getDefaultTypography,
  getDefaultSpacing,
  getDefaultMotion,
  getDefaultComponentStyles,
  getDefaultBlockPreferences,
  getDefaultTuners,
} from '../../inspiration/inspiration-profile';
import { KNOWN_BRANDS } from '../../inspiration';
import { analyzeURL, type URLAnalysisResult } from '../../inspiration';
import { DEFAULT_TUNERS } from '../../blocks/types';

// =============================================================================
// TYPES
// =============================================================================

export interface ApplyInspirationInput {
  /** Inspiration sources (URLs or brand names) */
  sources: string[];
  /** Selective inspiration: which aspects to take from which source */
  selective?: Array<{
    source: string;
    aspects: Array<'colors' | 'typography' | 'spacing' | 'motion' | 'components'>;
  }>;
  /** Base tuners to start with */
  base_tuners?: Partial<AppliedTuners>;
}

export interface ApplyInspirationOutput {
  /** Generated inspiration profile */
  profile: InspirationProfile;
  /** CSS variables to add to your project */
  css_variables: Record<string, string>;
  /** Derived tuner values */
  tuners: AppliedTuners;
  /** Sources that were successfully analyzed */
  analyzed_sources: Array<{
    source: string;
    type: 'brand' | 'url';
    aspects_extracted: string[];
  }>;
  /** Summary of the design language */
  summary: string;
  /** Tailwind config extensions */
  tailwind_config: object;
}

// =============================================================================
// TOOL DEFINITION
// =============================================================================

export const APPLY_INSPIRATION_TOOL = {
  name: 'apply_inspiration',
  description: `Extracts design language from inspiration sources and creates an InspirationProfile.

Sources can be:
- Known brands: linear, stripe, vercel, notion, figma, apple, github, airbnb, raycast, chronicle
- URLs: Any website URL to analyze

Selective inspiration allows mixing:
- "colors from Stripe, spacing from Linear"
- "typography from Apple, motion from Raycast"

Returns:
- Complete InspirationProfile for use with generate_block
- CSS variables to add to your project
- Derived tuner values based on the inspiration
- Tailwind config extensions`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      sources: {
        type: 'array',
        items: { type: 'string' },
        description: 'Inspiration sources (brand names or URLs)',
      },
      selective: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            source: { type: 'string' },
            aspects: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['colors', 'typography', 'spacing', 'motion', 'components'],
              },
            },
          },
          required: ['source', 'aspects'],
        },
        description: 'Selective inspiration: which aspects from which source',
      },
      base_tuners: {
        type: 'object',
        properties: {
          abstraction: { type: 'number', minimum: 0, maximum: 1 },
          density: { type: 'number', minimum: 0, maximum: 1 },
          motion: { type: 'number', minimum: 0, maximum: 1 },
          contrast: { type: 'number', minimum: 0, maximum: 1 },
          narrative: { type: 'number', minimum: 0, maximum: 1 },
        },
        description: 'Base tuner values to start with',
      },
    },
    required: ['sources'],
  },
};

// =============================================================================
// BRAND PROFILES
// =============================================================================

interface BrandProfile {
  colors: ColorPalette;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  motion: MotionConfig;
  componentStyles: ComponentStyleConfig;
  blockPreferences: BlockPreferenceConfig;
  tuners: AppliedTuners;
}

function getBrandProfile(brandName: string): BrandProfile | null {
  const defaultColors = getDefaultColorPalette();
  const defaultTypography = getDefaultTypography();
  const defaultSpacing = getDefaultSpacing();
  const defaultMotion = getDefaultMotion();
  const defaultComponentStyles = getDefaultComponentStyles();
  const defaultBlockPreferences = getDefaultBlockPreferences();
  const defaultTuners = getDefaultTuners();

  switch (brandName.toLowerCase()) {
    case 'linear':
      return {
        colors: {
          ...defaultColors,
          primary: '#5E6AD2',
          primaryForeground: '#FFFFFF',
          secondary: '#8B5CF6',
          secondaryForeground: '#FFFFFF',
          accent: '#F472B6',
          accentForeground: '#FFFFFF',
          background: { light: '#FFFFFF', dark: '#0A0A0B' },
          foreground: { light: '#0A0A0B', dark: '#FFFFFF' },
          surface: { light: '#F5F5F5', dark: '#1A1A1F' },
          muted: { light: '#8B8B8B', dark: '#525252' },
          mutedForeground: { light: '#525252', dark: '#8B8B8B' },
          border: { light: '#E5E5E5', dark: '#2A2A2F' },
          gradients: [
            {
              id: 'linear-primary',
              type: 'linear',
              angle: 135,
              stops: [
                { color: '#5E6AD2', position: 0 },
                { color: '#8B5CF6', position: 100 },
              ],
              cssValue: 'linear-gradient(135deg, #5E6AD2 0%, #8B5CF6 100%)',
            },
          ],
        },
        typography: { ...defaultTypography },
        spacing: { ...defaultSpacing },
        motion: { ...defaultMotion, level: 'moderate' },
        componentStyles: { ...defaultComponentStyles },
        blockPreferences: { ...defaultBlockPreferences },
        tuners: { abstraction: 0.7, density: 0.4, motion: 0.6, contrast: 0.7, narrative: 0.5 },
      };

    case 'stripe':
      return {
        colors: {
          ...defaultColors,
          primary: '#635BFF',
          primaryForeground: '#FFFFFF',
          secondary: '#00D4FF',
          secondaryForeground: '#000000',
          accent: '#FF6B6B',
          accentForeground: '#FFFFFF',
          background: { light: '#FFFFFF', dark: '#0A2540' },
          foreground: { light: '#0A2540', dark: '#FFFFFF' },
          surface: { light: '#F6F9FC', dark: '#1A3A5C' },
          muted: { light: '#A3BFDB', dark: '#6B8AAF' },
          mutedForeground: { light: '#6B8AAF', dark: '#A3BFDB' },
          border: { light: '#E3E8EE', dark: '#2A4A6C' },
          gradients: [
            {
              id: 'stripe-primary',
              type: 'linear',
              angle: 135,
              stops: [
                { color: '#635BFF', position: 0 },
                { color: '#00D4FF', position: 100 },
              ],
              cssValue: 'linear-gradient(135deg, #635BFF 0%, #00D4FF 100%)',
            },
          ],
        },
        typography: { ...defaultTypography },
        spacing: { ...defaultSpacing },
        motion: { ...defaultMotion, level: 'expressive' },
        componentStyles: { ...defaultComponentStyles },
        blockPreferences: { ...defaultBlockPreferences },
        tuners: { abstraction: 0.5, density: 0.5, motion: 0.7, contrast: 0.6, narrative: 0.7 },
      };

    case 'vercel':
      return {
        colors: {
          ...defaultColors,
          primary: '#000000',
          primaryForeground: '#FFFFFF',
          secondary: '#FFFFFF',
          secondaryForeground: '#000000',
          accent: '#0070F3',
          accentForeground: '#FFFFFF',
          background: { light: '#FFFFFF', dark: '#000000' },
          foreground: { light: '#000000', dark: '#FFFFFF' },
          surface: { light: '#FAFAFA', dark: '#111111' },
          muted: { light: '#888888', dark: '#444444' },
          mutedForeground: { light: '#666666', dark: '#666666' },
          border: { light: '#EAEAEA', dark: '#333333' },
          gradients: [],
        },
        typography: { ...defaultTypography },
        spacing: { ...defaultSpacing, density: 'spacious' },
        motion: { ...defaultMotion, level: 'subtle' },
        componentStyles: { ...defaultComponentStyles },
        blockPreferences: { ...defaultBlockPreferences },
        tuners: { abstraction: 0.8, density: 0.3, motion: 0.5, contrast: 0.8, narrative: 0.4 },
      };

    case 'notion':
      return {
        colors: {
          ...defaultColors,
          primary: '#000000',
          primaryForeground: '#FFFFFF',
          secondary: '#37352F',
          secondaryForeground: '#FFFFFF',
          accent: '#2EAADC',
          accentForeground: '#FFFFFF',
          background: { light: '#FFFFFF', dark: '#191919' },
          foreground: { light: '#37352F', dark: '#FFFFFF' },
          surface: { light: '#F7F6F3', dark: '#252525' },
          muted: { light: '#787774', dark: '#ACABA9' },
          mutedForeground: { light: '#ACABA9', dark: '#787774' },
          border: { light: '#E3E2DE', dark: '#373737' },
          gradients: [],
        },
        typography: { ...defaultTypography, headingFont: ['system-ui', 'sans-serif'], bodyFont: ['system-ui', 'sans-serif'] },
        spacing: { ...defaultSpacing },
        motion: { ...defaultMotion, level: 'subtle' },
        componentStyles: { ...defaultComponentStyles },
        blockPreferences: { ...defaultBlockPreferences },
        tuners: { abstraction: 0.3, density: 0.6, motion: 0.3, contrast: 0.5, narrative: 0.6 },
      };

    default:
      return null;
  }
}

// =============================================================================
// HANDLER
// =============================================================================

export async function handleApplyInspiration(
  input: ApplyInspirationInput
): Promise<ApplyInspirationOutput> {
  const analyzedSources: ApplyInspirationOutput['analyzed_sources'] = [];
  const summaryParts: string[] = [];

  // Start with defaults
  let profile: BrandProfile = {
    colors: getDefaultColorPalette(),
    typography: getDefaultTypography(),
    spacing: getDefaultSpacing(),
    motion: getDefaultMotion(),
    componentStyles: getDefaultComponentStyles(),
    blockPreferences: getDefaultBlockPreferences(),
    tuners: { ...DEFAULT_TUNERS, ...input.base_tuners },
  };

  // Process each source
  for (const source of input.sources) {
    const sourceLower = source.toLowerCase();
    // KNOWN_BRANDS is a Record<string, Partial<ExtractedDesignLanguage>>
    const isKnownBrand = sourceLower in KNOWN_BRANDS;

    if (isKnownBrand) {
      // It's a known brand
      const brandProfile = getBrandProfile(sourceLower);
      if (brandProfile) {
        profile = { ...profile, ...brandProfile };
        analyzedSources.push({
          source,
          type: 'brand',
          aspects_extracted: ['colors', 'typography', 'spacing', 'motion', 'components'],
        });
        summaryParts.push(`${sourceLower} (known brand)`);
      }
    } else if (source.startsWith('http://') || source.startsWith('https://')) {
      // It's a URL - try to analyze
      try {
        const analysis = await analyzeURL(source);
        if (analysis.success) {
          // Apply extracted colors if available
          if (analysis.extractedColors.accents.length > 0) {
            profile.colors.primary = analysis.extractedColors.accents[0];
          }
          if (analysis.extractedColors.backgrounds.length > 0) {
            profile.colors.background.light = analysis.extractedColors.backgrounds[0];
          }

          analyzedSources.push({
            source,
            type: 'url',
            aspects_extracted: getExtractedAspects(analysis),
          });

          summaryParts.push(`${new URL(source).hostname} (analyzed from URL)`);
        }
      } catch {
        console.warn(`Could not analyze URL: ${source}`);
      }
    } else {
      // Try matching by prefix
      const brandProfile = getBrandProfile(sourceLower);
      if (brandProfile) {
        profile = { ...profile, ...brandProfile };
        analyzedSources.push({
          source,
          type: 'brand',
          aspects_extracted: ['colors', 'typography', 'spacing', 'motion'],
        });
        summaryParts.push(`${source} (matched as brand)`);
      }
    }
  }

  // Handle selective inspiration
  if (input.selective) {
    for (const selection of input.selective) {
      const brandProfile = getBrandProfile(selection.source);
      if (brandProfile) {
        for (const aspect of selection.aspects) {
          switch (aspect) {
            case 'colors':
              profile.colors = brandProfile.colors;
              break;
            case 'typography':
              profile.typography = brandProfile.typography;
              break;
            case 'spacing':
              profile.spacing = brandProfile.spacing;
              break;
            case 'motion':
              profile.motion = brandProfile.motion;
              break;
            case 'components':
              profile.componentStyles = brandProfile.componentStyles;
              break;
          }
        }
      }
    }
  }

  // Build the InspirationProfile
  const builder = new InspirationProfileBuilder('Applied Inspiration')
    .colors(profile.colors)
    .typography(profile.typography)
    .spacing(profile.spacing)
    .motion(profile.motion)
    .componentStyles(profile.componentStyles)
    .blockPreferences(profile.blockPreferences)
    .tuners(profile.tuners);

  const inspirationProfile = builder.build();

  // Generate CSS variables
  const cssVariables = generateCssVariables(profile);

  // Generate tailwind config
  const tailwindConfig = generateTailwindConfig(profile);

  // Build summary
  const summary = summaryParts.length > 0
    ? `Design language inspired by: ${summaryParts.join(', ')}`
    : 'Default design language applied';

  return {
    profile: inspirationProfile,
    css_variables: cssVariables,
    tuners: profile.tuners,
    analyzed_sources: analyzedSources,
    summary,
    tailwind_config: tailwindConfig,
  };
}

// =============================================================================
// HELPERS
// =============================================================================

function getExtractedAspects(analysis: URLAnalysisResult): string[] {
  const aspects: string[] = [];

  if (analysis.extractedColors.accents.length > 0 ||
      analysis.extractedColors.backgrounds.length > 0) {
    aspects.push('colors');
  }
  if (analysis.extractedTypography.fontFamilies.length > 0) {
    aspects.push('typography');
  }
  if (analysis.extractedSpacing.paddings.length > 0 ||
      analysis.extractedSpacing.margins.length > 0) {
    aspects.push('spacing');
  }
  if (analysis.extractedComponents.transitions.length > 0) {
    aspects.push('motion');
  }

  return aspects.length > 0 ? aspects : ['general'];
}

function generateCssVariables(profile: BrandProfile): Record<string, string> {
  const vars: Record<string, string> = {};

  // Colors
  vars['--color-primary'] = profile.colors.primary;
  vars['--color-secondary'] = profile.colors.secondary;
  vars['--color-accent'] = profile.colors.accent;
  vars['--color-background'] = profile.colors.background.light;
  vars['--color-background-dark'] = profile.colors.background.dark;
  vars['--color-surface'] = profile.colors.surface.light;
  vars['--color-surface-dark'] = profile.colors.surface.dark;
  vars['--color-border'] = profile.colors.border.light;
  vars['--color-border-dark'] = profile.colors.border.dark;

  // Typography
  vars['--font-heading'] = profile.typography.headingFont.join(', ');
  vars['--font-body'] = profile.typography.bodyFont.join(', ');

  // Spacing
  vars['--spacing-density'] = profile.spacing.density;
  vars['--spacing-base'] = `${profile.spacing.baseUnit}px`;

  // Motion
  vars['--motion-level'] = profile.motion.level;

  // Component styles
  vars['--radius'] = profile.componentStyles.borderRadius;

  return vars;
}

function generateTailwindConfig(profile: BrandProfile): object {
  return {
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: profile.colors.primary,
            foreground: profile.colors.primaryForeground,
          },
          secondary: {
            DEFAULT: profile.colors.secondary,
            foreground: profile.colors.secondaryForeground,
          },
          accent: {
            DEFAULT: profile.colors.accent,
            foreground: profile.colors.accentForeground,
          },
        },
        fontFamily: {
          heading: profile.typography.headingFont,
          body: profile.typography.bodyFont,
        },
        borderRadius: {
          DEFAULT: profile.componentStyles.borderRadius,
        },
      },
    },
  };
}
