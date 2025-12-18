/**
 * React Bindings for Taste Engine
 *
 * Provides React hooks and components for theme management.
 */

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ThemePack, PageContext, ProductRecipes, MarketingRecipes, ThemeTokens, ThemeMode } from '../core/types';
import { themeEngine, ThemeEngine } from '../core/engine';
import type { TunerValues, AppliedTuners } from '../mcp/contract';
import {
  normalizeTuners,
  applyTuners,
  applyCSSOverridesToDocument,
  removeCSSOverridesFromDocument,
  parseTunersFromURL,
  DEFAULT_TUNERS,
  type TunerOutput,
} from '../tuners';

// =============================================================================
// THEME CONTEXT
// =============================================================================

interface ThemeContextValue {
  /** Current theme pack */
  theme: ThemePack | null;
  /** Current theme name */
  themeName: string;
  /** Current page context */
  context: PageContext;
  /** Theme mode (dark/light) */
  mode: ThemeMode;
  /** Is dark mode */
  isDarkMode: boolean;
  /** Set theme by name */
  setTheme: (name: string) => void;
  /** Set page context */
  setContext: (context: PageContext) => void;
  /** Available theme names */
  availableThemes: string[];
  /** Current recipes for context */
  recipes: ProductRecipes | MarketingRecipes;
  /** Current theme tokens */
  tokens: ThemeTokens | null;
  /** Theme engine instance */
  engine: ThemeEngine;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// =============================================================================
// THEME PROVIDER
// =============================================================================

interface TasteProviderProps {
  /** Child components */
  children: ReactNode;
  /** Default theme name */
  defaultTheme?: string;
  /** Default page context */
  defaultContext?: PageContext;
  /** Use URL params for theme/context persistence */
  useUrlParam?: boolean;
  /** Custom theme engine instance */
  engine?: ThemeEngine;
}

/**
 * TasteProvider - React context provider for Taste Engine
 *
 * @example
 * ```tsx
 * import { TasteProvider } from '@taste-engine/core/react';
 *
 * function App() {
 *   return (
 *     <TasteProvider defaultTheme="chronicle-dark">
 *       <MyApp />
 *     </TasteProvider>
 *   );
 * }
 * ```
 */
export function TasteProvider({
  children,
  defaultTheme = 'chronicle-dark',
  defaultContext = 'product',
  useUrlParam = false,
  engine = themeEngine,
}: TasteProviderProps) {
  const [themeName, setThemeName] = useState<string>(defaultTheme);
  const [context, setContextState] = useState<PageContext>(defaultContext);

  // Initialize from URL on mount
  useEffect(() => {
    if (useUrlParam && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get('theme');
      const urlContext = params.get('context') as PageContext;

      if (urlTheme && engine.loadTheme(urlTheme)) {
        setThemeName(urlTheme);
      }
      if (urlContext === 'product' || urlContext === 'marketing') {
        setContextState(urlContext);
      }
    }
  }, [useUrlParam, engine]);

  // Apply theme when name or context changes
  useEffect(() => {
    const theme = engine.loadTheme(themeName);
    if (theme) {
      engine.applyTheme(theme, context);

      // Update URL if enabled
      if (useUrlParam && typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('theme', themeName);
        url.searchParams.set('context', context);
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [themeName, context, useUrlParam, engine]);

  const theme = engine.loadTheme(themeName);

  const value: ThemeContextValue = useMemo(() => ({
    theme,
    themeName,
    context,
    mode: theme?.mode || 'dark',
    isDarkMode: theme?.mode === 'dark',
    setTheme: setThemeName,
    setContext: setContextState,
    availableThemes: engine.getAvailableThemes(),
    recipes: theme ? engine.getRecipesForContext(theme, context) : ({} as ProductRecipes),
    tokens: theme?.tokens || null,
    engine,
  }), [theme, themeName, context, engine]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// =============================================================================
// THEME HOOKS
// =============================================================================

/**
 * Hook to access theme context
 */
export function useTaste(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTaste must be used within a TasteProvider');
  }
  return ctx;
}

/**
 * Hook to access current recipes
 */
export function useRecipes(): ProductRecipes | MarketingRecipes {
  const { recipes } = useTaste();
  return recipes;
}

/**
 * Hook to access current tokens
 */
export function useTokens(): ThemeTokens | null {
  const { tokens } = useTaste();
  return tokens;
}

/**
 * Hook to check if dark mode is active
 */
export function useIsDarkMode(): boolean {
  const { isDarkMode } = useTaste();
  return isDarkMode;
}

/**
 * Hook to access page context
 */
export function usePageContext(): { context: PageContext; setContext: (ctx: PageContext) => void } {
  const { context, setContext } = useTaste();
  return { context, setContext };
}

// =============================================================================
// TUNER HOOKS
// =============================================================================

interface UseTunersReturn {
  /** Current tuner values */
  tuners: AppliedTuners;
  /** Complete tuner output with CSS overrides */
  output: TunerOutput;
  /** Set a single tuner value */
  setTuner: (key: keyof AppliedTuners, value: number) => void;
  /** Set multiple tuner values */
  setTuners: (newTuners: Partial<TunerValues>) => void;
  /** Reset tuners to defaults */
  resetTuners: () => void;
  /** Sync current tuners to URL */
  syncToURL: () => void;
}

/**
 * Hook for managing tuner state with URL sync
 */
export function useTuners(initialTuners?: Partial<TunerValues>): UseTunersReturn {
  // Parse initial values from URL or props
  const [tuners, setTunersState] = useState<AppliedTuners>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTuners = parseTunersFromURL(urlParams);
      return normalizeTuners({ ...DEFAULT_TUNERS, ...initialTuners, ...urlTuners });
    }
    return normalizeTuners({ ...DEFAULT_TUNERS, ...initialTuners });
  });

  // Compute output
  const output = useMemo(() => applyTuners(tuners), [tuners]);

  // Apply CSS overrides when tuners change
  useEffect(() => {
    applyCSSOverridesToDocument(output.cssOverrides);
    return () => removeCSSOverridesFromDocument(output.cssOverrides);
  }, [output.cssOverrides]);

  // Set individual tuner
  const setTuner = useCallback((key: keyof AppliedTuners, value: number) => {
    setTunersState(prev => ({
      ...prev,
      [key]: Math.max(0, Math.min(1, value)),
    }));
  }, []);

  // Set all tuners
  const setTuners = useCallback((newTuners: Partial<TunerValues>) => {
    setTunersState(prev => normalizeTuners({ ...prev, ...newTuners }));
  }, []);

  // Reset to defaults
  const resetTuners = useCallback(() => {
    setTunersState(DEFAULT_TUNERS);
  }, []);

  // Sync to URL
  const syncToURL = useCallback(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    Object.entries(tuners).forEach(([key, value]) => {
      url.searchParams.set(key, value.toFixed(1));
    });
    window.history.replaceState({}, '', url.toString());
  }, [tuners]);

  return {
    tuners,
    output,
    setTuner,
    setTuners,
    resetTuners,
    syncToURL,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export { ThemeContext };
