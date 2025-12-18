/**
 * Ops Calm Theme
 *
 * Light theme with calm blue-green tones.
 * Designed for operational dashboards with extended use.
 */

import type { ThemeDefinition } from '../core/types';

export const opsCalm: ThemeDefinition = {
  name: 'Ops Calm',
  mode: 'light',
  tokens: {
    bg: '210 20% 98%',
    surface: '0 0% 100%',
    surface2: '210 15% 96%',
    surfaceInset: '210 20% 94%',
    border: '210 15% 85%',
    borderSubtle: '210 15% 90%',
    text: '210 30% 15%',
    textMuted: '210 15% 45%',
    accent: '180 60% 40%',
    accentFg: '0 0% 100%',
    accentMuted: '180 40% 90%',
    accentSecondary: '200 70% 50%',
    ring: '180 60% 45%',
    success: '142 55% 40%',
    successMuted: '142 40% 92%',
    warning: '38 70% 45%',
    warningMuted: '38 60% 92%',
    danger: '0 55% 50%',
    dangerMuted: '0 50% 94%',
    shadowSurface: '0 2px 8px rgba(0, 0, 0, 0.08)',
    shadowPopover: '0 8px 24px rgba(0, 0, 0, 0.12)',
    shadowGlow: '0 0 40px rgba(0, 150, 136, 0.08)',
    radiusSurface: '10px',
    radiusControl: '6px',
    typeScale: {
      h1: {
        fontSize: '1.875rem',
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
        fontSize: '0.875rem',
        fontWeight: '600',
        letterSpacing: '0',
        lineHeight: '1.4',
      },
      body: {
        fontSize: '0.875rem',
        fontWeight: '400',
        letterSpacing: '0',
        lineHeight: '1.5',
      },
      kpi: {
        fontSize: '1.75rem',
        fontWeight: '600',
        letterSpacing: '-0.02em',
        lineHeight: '1',
      },
      kpiCompact: {
        fontSize: '1.25rem',
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
      tableRowHeight: '44px',
      tableRowHeightCompact: '36px',
      controlHeight: '34px',
      controlHeightSm: '30px',
      pageGutter: '20px',
      sectionGap: '28px',
      cardPadding: '18px',
      cardPaddingCompact: '14px',
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
        borderOpacity: '0.4',
        shadow: true,
        gradient: false,
      },
      inset: {
        border: true,
        borderOpacity: '0.3',
        shadow: false,
        background: 'surfaceInset',
      },
      floating: {
        border: true,
        borderOpacity: '0.5',
        shadow: true,
        shadowStrength: 'normal',
      },
    },
    StatCard: {
      style: 'clean',
      accentMode: 'none',
      accentElement: 'none',
      primaryHighlight: false,
      valueFontStyle: 'kpi',
      labelFontStyle: 'label',
    },
    SectionHeader: {
      style: 'clean',
      titleWeight: '600',
      subtitleOpacity: '0.7',
      subtitleMaxWidth: '480px',
      spacing: {
        top: '0',
        bottom: '16px',
      },
    },
    DataTable: {
      density: 'comfortable',
      headerStyle: 'muted',
      rowHover: 'subtle',
      separatorStyle: 'faint',
      separatorOpacity: '0.3',
    },
    HeroHeader: {
      style: 'clean',
      titleSize: 'h1',
      subtitleMuted: true,
      actionsGrouped: true,
      spacing: {
        paddingY: '24px',
      },
    },
    ActivityTable: {
      density: 'comfortable',
      headerStyle: 'muted',
      headerTracking: '0.08em',
      headerOpacity: '0.6',
      rowHover: 'subtle',
      rowHoverBg: 'surface2/50',
      separatorOpacity: '0.2',
      iconBg: 'surface2/80',
      iconOpacity: '0.6',
      amountWeight: '500',
      timeOpacity: '0.5',
      containerBg: 'surface2/40',
      containerBorder: true,
      containerBorderOpacity: '0.3',
    },
    Toolbar: {
      variant: 'surface',
      height: '38px',
      itemHeight: '30px',
      itemPadding: '8px',
      gap: '4px',
      separatorColor: 'border',
      separatorOpacity: '0.4',
      separatorHeight: '14px',
    },
  },
};

export default opsCalm;
