/**
 * Hospitality Warm Theme
 *
 * Light theme with warm amber accents.
 * Designed for hospitality industry with a welcoming feel.
 */

import type { ThemeDefinition } from '../core/types';

export const hospitalityWarm: ThemeDefinition = {
  name: 'Hospitality Warm',
  mode: 'light',
  tokens: {
    bg: '35 20% 97%',
    surface: '0 0% 100%',
    surface2: '35 15% 95%',
    surfaceInset: '35 20% 93%',
    border: '35 15% 82%',
    borderSubtle: '35 15% 88%',
    text: '25 30% 12%',
    textMuted: '25 15% 40%',
    accent: '38 80% 50%',
    accentFg: '0 0% 100%',
    accentMuted: '38 60% 92%',
    accentSecondary: '28 90% 55%',
    ring: '38 80% 55%',
    success: '142 55% 40%',
    successMuted: '142 40% 92%',
    warning: '25 85% 55%',
    warningMuted: '25 70% 92%',
    danger: '0 55% 50%',
    dangerMuted: '0 50% 94%',
    shadowSurface: '0 2px 8px rgba(139, 90, 43, 0.06)',
    shadowPopover: '0 8px 24px rgba(139, 90, 43, 0.1)',
    shadowGlow: '0 0 40px rgba(245, 158, 11, 0.08)',
    radiusSurface: '12px',
    radiusControl: '8px',
    typeScale: {
      h1: {
        fontSize: '2rem',
        fontWeight: '600',
        letterSpacing: '-0.02em',
        lineHeight: '1.2',
      },
      h2: {
        fontSize: '1.25rem',
        fontWeight: '600',
        letterSpacing: '-0.01em',
        lineHeight: '1.3',
      },
      h3: {
        fontSize: '0.9375rem',
        fontWeight: '600',
        letterSpacing: '0',
        lineHeight: '1.4',
      },
      body: {
        fontSize: '0.9375rem',
        fontWeight: '400',
        letterSpacing: '0',
        lineHeight: '1.55',
      },
      kpi: {
        fontSize: '1.875rem',
        fontWeight: '600',
        letterSpacing: '-0.02em',
        lineHeight: '1',
      },
      kpiCompact: {
        fontSize: '1.375rem',
        fontWeight: '600',
        letterSpacing: '-0.02em',
        lineHeight: '1',
      },
      label: {
        fontSize: '0.6875rem',
        fontWeight: '500',
        letterSpacing: '0.04em',
        lineHeight: '1.4',
        textTransform: 'uppercase',
      },
    },
    density: {
      tableRowHeight: '48px',
      tableRowHeightCompact: '40px',
      controlHeight: '38px',
      controlHeightSm: '32px',
      pageGutter: '24px',
      sectionGap: '32px',
      cardPadding: '20px',
      cardPaddingCompact: '16px',
    },
  },
  recipes: {
    AppShell: {
      backgroundTreatment: 'none',
      glowColor: 'accent',
      glowOpacity: '0',
      vignetteOpacity: '0',
    },
    Surface: {
      default: {
        border: true,
        borderOpacity: '0.35',
        shadow: true,
        gradient: false,
      },
      inset: {
        border: true,
        borderOpacity: '0.25',
        shadow: false,
        background: 'surfaceInset',
      },
      floating: {
        border: true,
        borderOpacity: '0.45',
        shadow: true,
        shadowStrength: 'normal',
      },
    },
    StatCard: {
      style: 'clean',
      accentMode: 'single',
      accentElement: 'topBorder',
      accentWidth: '3px',
      primaryHighlight: true,
      valueFontStyle: 'kpi',
      labelFontStyle: 'label',
    },
    SectionHeader: {
      style: 'clean',
      titleWeight: '600',
      subtitleOpacity: '0.65',
      subtitleMaxWidth: '500px',
      spacing: {
        top: '0',
        bottom: '20px',
      },
    },
    DataTable: {
      density: 'comfortable',
      headerStyle: 'muted',
      rowHover: 'subtle',
      separatorStyle: 'faint',
      separatorOpacity: '0.25',
    },
    HeroHeader: {
      style: 'clean',
      titleSize: 'h1',
      subtitleMuted: true,
      actionsGrouped: true,
      spacing: {
        paddingY: '28px',
      },
    },
    ActivityTable: {
      density: 'comfortable',
      headerStyle: 'muted',
      headerTracking: '0.08em',
      headerOpacity: '0.55',
      rowHover: 'subtle',
      rowHoverBg: 'surface2/50',
      separatorOpacity: '0.2',
      iconBg: 'accentMuted/60',
      iconOpacity: '0.7',
      amountWeight: '500',
      timeOpacity: '0.5',
      containerBg: 'surface2/50',
      containerBorder: true,
      containerBorderOpacity: '0.25',
    },
    Toolbar: {
      variant: 'surface',
      height: '40px',
      itemHeight: '32px',
      itemPadding: '10px',
      gap: '6px',
      separatorColor: 'border',
      separatorOpacity: '0.35',
      separatorHeight: '16px',
    },
  },
};

export default hospitalityWarm;
