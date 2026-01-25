/**
 * Profile Converter
 *
 * Converts between the existing LearnedTasteProfile and the new InspirationProfile.
 * Provides backwards compatibility and migration path.
 */

import type { ExtractedDesignLanguage, LearnedTasteProfile } from './index';
import type {
  InspirationProfile,
  ColorPalette,
  TypographyConfig,
  SpacingConfig,
  MotionConfig,
  ComponentStyleConfig,
  BlockPreferenceConfig,
  GradientDefinition,
} from './inspiration-profile';
import {
  InspirationProfileBuilder,
  getDefaultBlockPreferences,
} from './inspiration-profile';
import type { AppliedTuners } from '../blocks/types';

// =============================================================================
// CONVERT EXTRACTED DESIGN LANGUAGE TO INSPIRATION PROFILE
// =============================================================================

/**
 * Convert an ExtractedDesignLanguage to an InspirationProfile
 */
export function fromExtractedDesignLanguage(
  extracted: ExtractedDesignLanguage,
  name: string = 'Extracted Profile'
): InspirationProfile {
  const builder = new InspirationProfileBuilder(name);

  // Add source
  builder.addSource({
    type: extracted.source.type,
    value: extracted.source.value,
    weight: extracted.source.weight ?? 1,
    aspects: ['colors', 'typography', 'spacing', 'motion', 'components'],
    extractedAt: new Date().toISOString(),
  });

  // Convert colors
  builder.colors(extractedToColorPalette(extracted));

  // Convert typography
  builder.typography(extractedToTypography(extracted));

  // Convert spacing
  builder.spacing(extractedToSpacing(extracted));

  // Convert motion
  builder.motion(extractedToMotion(extracted));

  // Convert component styles
  builder.componentStyles(extractedToComponentStyles(extracted));

  // Derive block preferences
  builder.blockPreferences(deriveBlockPreferences(extracted));

  // Derive tuners
  builder.tuners(deriveTuners(extracted));

  // Set confidence based on source type
  const confidence =
    extracted.source.type === 'url'
      ? 0.9
      : extracted.source.type === 'brand'
        ? 0.95
        : extracted.source.type === 'description'
          ? 0.5
          : 0.7;
  builder.setConfidence(confidence);

  return builder.build();
}

/**
 * Convert a LearnedTasteProfile to an InspirationProfile
 */
export function fromLearnedTasteProfile(
  learned: LearnedTasteProfile
): InspirationProfile {
  const builder = new InspirationProfileBuilder(learned.name);

  // Add sources
  for (const source of learned.sources) {
    builder.addSource({
      type: source.type,
      value: source.value,
      weight: source.weight ?? 1,
      aspects: ['colors', 'typography', 'spacing', 'motion', 'components'],
      extractedAt: learned.extractedAt,
    });
  }

  // Convert design language to color palette
  const colors: ColorPalette = {
    primary: learned.designLanguage.colors['--taste-accent'],
    primaryForeground: '#FFFFFF',
    secondary: learned.designLanguage.colors['--taste-text-muted'],
    secondaryForeground: '#FFFFFF',
    accent: learned.designLanguage.colors['--taste-accent'],
    accentForeground: '#FFFFFF',
    background: {
      light: learned.designLanguage.colors['--taste-bg'],
      dark: learned.designLanguage.colors['--taste-bg'],
    },
    foreground: {
      light: learned.designLanguage.colors['--taste-text'],
      dark: learned.designLanguage.colors['--taste-text'],
    },
    surface: {
      light: learned.designLanguage.colors['--taste-surface'],
      dark: learned.designLanguage.colors['--taste-surface'],
    },
    muted: {
      light: learned.designLanguage.colors['--taste-bg-secondary'],
      dark: learned.designLanguage.colors['--taste-bg-secondary'],
    },
    mutedForeground: {
      light: learned.designLanguage.colors['--taste-text-muted'],
      dark: learned.designLanguage.colors['--taste-text-muted'],
    },
    border: {
      light: learned.designLanguage.colors['--taste-border'],
      dark: learned.designLanguage.colors['--taste-border'],
    },
    gradients: [],
  };
  builder.colors(colors);

  // Convert typography
  const typography: TypographyConfig = {
    headingFont: learned.designLanguage.typography['--taste-font-heading']
      .split(',')
      .map((s) => s.trim()),
    bodyFont: learned.designLanguage.typography['--taste-font-body']
      .split(',')
      .map((s) => s.trim()),
    monoFont: ['JetBrains Mono', 'monospace'],
    scale: 'normal',
    headingWeight: 'semibold',
    bodyWeight: 'normal',
    letterSpacing:
      learned.designLanguage.typography['--taste-tracking'] === '-0.025em'
        ? 'tight'
        : 'normal',
    lineHeight:
      learned.designLanguage.typography['--taste-leading'] === '1.5'
        ? 'normal'
        : 'relaxed',
  };
  builder.typography(typography);

  // Convert spacing
  const baseUnit = parseInt(
    learned.designLanguage.spacing['--taste-space-xs'].replace('px', '')
  );
  const spacing: SpacingConfig = {
    density: 'comfortable',
    baseUnit: baseUnit || 4,
    sectionGap: 'py-16 md:py-24',
    componentGap: 'gap-6',
    containerPadding: 'px-4 md:px-6 lg:px-8',
    cardPadding: 'p-6',
  };
  builder.spacing(spacing);

  // Convert motion
  const transitionMatch =
    learned.designLanguage.components['--taste-transition'].match(
      /(\d+)ms\s+([\w-]+)/
    );
  const motion: MotionConfig = {
    level: 'subtle',
    duration: {
      fast: 150,
      normal: transitionMatch ? parseInt(transitionMatch[1]) : 200,
      slow: 300,
    },
    easing: transitionMatch ? transitionMatch[2] : 'ease-out',
    entranceStyle: 'fade',
    hoverEffects: true,
    scrollAnimations: false,
  };
  builder.motion(motion);

  // Convert component styles
  const componentStyles: ComponentStyleConfig = {
    borderRadius: 'md',
    shadow: 'subtle',
    border: 'subtle',
    buttonStyle: 'solid',
    cardStyle: 'bordered',
    inputStyle: 'bordered',
    avatarStyle: 'circle',
  };
  builder.componentStyles(componentStyles);

  // Set tuners
  builder.tuners(learned.tuners);

  // Add CSS variables
  builder.addCssVariables({
    ...learned.designLanguage.colors,
    ...learned.designLanguage.spacing,
    ...learned.designLanguage.typography,
    ...learned.designLanguage.components,
  });

  // Set high confidence for learned profiles
  builder.setConfidence(0.9);

  return builder.build();
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function extractedToColorPalette(extracted: ExtractedDesignLanguage): ColorPalette {
  const primary = extracted.colors.primary[0] || '#3B82F6';
  const secondary = extracted.colors.secondary[0] || '#6B7280';
  const accent = extracted.colors.accent[0] || primary;

  const bgLight = extracted.colors.background.find(isLightColor) || '#FFFFFF';
  const bgDark = extracted.colors.background.find(isDarkColor) || '#0A0A0A';

  const textLight = extracted.colors.text.find(isDarkColor) || '#0A0A0A';
  const textDark = extracted.colors.text.find(isLightColor) || '#FAFAFA';

  // Parse gradients
  const gradients: GradientDefinition[] = extracted.colors.gradients.map(
    (g, i) => ({
      id: `gradient-${i}`,
      type: 'linear' as const,
      angle: 135,
      stops: [],
      cssValue: g,
    })
  );

  return {
    primary,
    primaryForeground: '#FFFFFF',
    secondary,
    secondaryForeground: '#FFFFFF',
    accent,
    accentForeground: '#FFFFFF',
    background: { light: bgLight, dark: bgDark },
    foreground: { light: textLight, dark: textDark },
    surface: {
      light: lighten(bgLight, 0.02),
      dark: lighten(bgDark, 0.05),
    },
    muted: {
      light: '#F4F4F5',
      dark: '#27272A',
    },
    mutedForeground: {
      light: '#71717A',
      dark: '#A1A1AA',
    },
    border: {
      light: '#E4E4E7',
      dark: '#27272A',
    },
    gradients,
  };
}

function extractedToTypography(
  extracted: ExtractedDesignLanguage
): TypographyConfig {
  return {
    headingFont: extracted.typography.fontStack,
    bodyFont: extracted.typography.fontStack,
    monoFont: ['JetBrains Mono', 'Menlo', 'monospace'],
    scale:
      extracted.typography.bodySize === 'sm'
        ? 'tight'
        : extracted.typography.bodySize === 'lg'
          ? 'loose'
          : 'normal',
    headingWeight:
      extracted.typography.headingStyle === 'bold'
        ? 'bold'
        : extracted.typography.headingStyle === 'light'
          ? 'normal'
          : 'semibold',
    bodyWeight: 'normal',
    letterSpacing:
      extracted.typography.tracking === 'tight'
        ? 'tight'
        : extracted.typography.tracking === 'wide'
          ? 'wide'
          : 'normal',
    lineHeight: 'normal',
  };
}

function extractedToSpacing(extracted: ExtractedDesignLanguage): SpacingConfig {
  return {
    density: extracted.spacing.scale,
    baseUnit: extracted.spacing.baseUnit,
    sectionGap:
      extracted.spacing.scale === 'spacious'
        ? 'py-20 md:py-32'
        : extracted.spacing.scale === 'tight'
          ? 'py-12 md:py-16'
          : 'py-16 md:py-24',
    componentGap:
      extracted.spacing.scale === 'spacious'
        ? 'gap-8'
        : extracted.spacing.scale === 'tight'
          ? 'gap-4'
          : 'gap-6',
    containerPadding: 'px-4 md:px-6 lg:px-8',
    cardPadding:
      extracted.spacing.scale === 'spacious'
        ? 'p-8'
        : extracted.spacing.scale === 'tight'
          ? 'p-4'
          : 'p-6',
  };
}

function extractedToMotion(extracted: ExtractedDesignLanguage): MotionConfig {
  return {
    level: extracted.motion.level === 'minimal' ? 'subtle' : extracted.motion.level,
    duration: {
      fast: Math.round(extracted.motion.duration * 0.75),
      normal: extracted.motion.duration,
      slow: Math.round(extracted.motion.duration * 1.5),
    },
    easing: extracted.motion.easing,
    entranceStyle:
      extracted.motion.level === 'expressive'
        ? 'slide'
        : extracted.motion.level === 'minimal'
          ? 'none'
          : 'fade',
    hoverEffects: extracted.motion.level !== 'minimal',
    scrollAnimations: extracted.motion.level === 'expressive',
  };
}

function extractedToComponentStyles(
  extracted: ExtractedDesignLanguage
): ComponentStyleConfig {
  return {
    borderRadius: extracted.components.borderRadius,
    shadow: extracted.components.shadows === 'none' ? 'none' : extracted.components.shadows,
    border:
      extracted.components.cardStyle === 'bordered'
        ? 'visible'
        : extracted.components.cardStyle === 'glass'
          ? 'subtle'
          : 'none',
    buttonStyle: extracted.components.buttonStyle,
    cardStyle: extracted.components.cardStyle,
    inputStyle:
      extracted.components.cardStyle === 'flat' ? 'minimal' : 'bordered',
    avatarStyle: 'circle',
  };
}

function deriveBlockPreferences(
  extracted: ExtractedDesignLanguage
): BlockPreferenceConfig {
  const defaults = getDefaultBlockPreferences();

  return {
    hero: {
      ...defaults.hero,
      hasGradientOverlay: extracted.colors.gradients.length > 0,
      hasBackgroundPattern: extracted.components.cardStyle === 'glass',
      preferredVariant:
        extracted.motion.level === 'expressive'
          ? 'gradient-orbs'
          : extracted.mood.formality === 'professional'
            ? 'minimal'
            : 'centered',
    },
    features: {
      ...defaults.features,
      iconStyle:
        extracted.components.cardStyle === 'elevated'
          ? 'boxed'
          : extracted.components.cardStyle === 'glass'
            ? 'gradient'
            : 'minimal',
      cardStyle:
        extracted.components.cardStyle === 'flat'
          ? 'none'
          : extracted.components.cardStyle === 'bordered'
            ? 'bordered'
            : 'elevated',
    },
    pricing: {
      ...defaults.pricing,
      highlightStyle:
        extracted.components.shadows === 'dramatic'
          ? 'scale'
          : extracted.components.cardStyle === 'bordered'
            ? 'border'
            : 'background',
    },
    testimonials: {
      ...defaults.testimonials,
      avatarStyle:
        extracted.components.borderRadius === 'full' ? 'circle' : 'square',
    },
    cta: {
      ...defaults.cta,
      hasBackgroundPattern: extracted.colors.gradients.length > 0,
      backgroundStyle:
        extracted.colors.gradients.length > 0 ? 'gradient' : 'accent',
    },
    sidebar: {
      ...defaults.sidebar,
    },
    dataTable: {
      ...defaults.dataTable,
      rowDensity:
        extracted.spacing.scale === 'tight'
          ? 'compact'
          : extracted.spacing.scale === 'spacious'
            ? 'spacious'
            : 'comfortable',
    },
  };
}

function deriveTuners(extracted: ExtractedDesignLanguage): AppliedTuners {
  // Map extracted characteristics to tuner values
  const abstraction =
    extracted.components.buttonStyle === 'ghost'
      ? 0.8
      : extracted.components.buttonStyle === 'outline'
        ? 0.6
        : extracted.components.buttonStyle === 'gradient'
          ? 0.4
          : 0.5;

  const density =
    extracted.mood.density === 'dense'
      ? 0.7
      : extracted.mood.density === 'sparse'
        ? 0.3
        : 0.5;

  const motion =
    extracted.motion.level === 'expressive'
      ? 0.8
      : extracted.motion.level === 'minimal'
        ? 0.2
        : 0.5;

  const contrast =
    extracted.mood.contrast === 'high'
      ? 0.8
      : extracted.mood.contrast === 'low'
        ? 0.3
        : 0.5;

  const narrative =
    extracted.mood.formality === 'playful'
      ? 0.7
      : extracted.mood.formality === 'professional'
        ? 0.4
        : 0.5;

  return { abstraction, density, motion, contrast, narrative };
}

// =============================================================================
// COLOR UTILITIES
// =============================================================================

function isLightColor(color: string): boolean {
  // Simple check - if it starts with #F or has high values
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.7;
  }
  return false;
}

function isDarkColor(color: string): boolean {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.3;
  }
  return false;
}

function lighten(color: string, amount: number): string {
  if (!color.startsWith('#')) return color;

  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const newR = Math.min(255, Math.round(r + (255 - r) * amount));
  const newG = Math.min(255, Math.round(g + (255 - g) * amount));
  const newB = Math.min(255, Math.round(b + (255 - b) * amount));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}
