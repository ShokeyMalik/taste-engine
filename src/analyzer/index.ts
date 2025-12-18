/**
 * Codebase Analyzer
 *
 * Real AST parsing and pattern detection for React/Tailwind codebases.
 * Extracts component patterns, design tokens, and visual characteristics.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname, relative } from 'path';

// =============================================================================
// TYPES
// =============================================================================

export interface ComponentPattern {
  name: string;
  type: 'button' | 'card' | 'surface' | 'input' | 'layout' | 'navigation' | 'modal' | 'list' | 'other';
  filePath: string;
  variants: string[];
  props: PropInfo[];
  tailwindClasses: TailwindClassAnalysis;
  usage: {
    importedBy: string[];
    usageCount: number;
  };
}

export interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
}

export interface TailwindClassAnalysis {
  colors: ColorUsage[];
  spacing: SpacingUsage[];
  typography: TypographyUsage[];
  borders: BorderUsage[];
  shadows: string[];
  animations: string[];
  responsive: string[];
  variants: string[];
}

export interface ColorUsage {
  class: string;
  type: 'bg' | 'text' | 'border' | 'ring' | 'fill' | 'stroke';
  value: string;
  occurrences: number;
}

export interface SpacingUsage {
  class: string;
  type: 'padding' | 'margin' | 'gap' | 'space';
  value: string;
  occurrences: number;
}

export interface TypographyUsage {
  class: string;
  type: 'size' | 'weight' | 'family' | 'leading' | 'tracking';
  value: string;
  occurrences: number;
}

export interface BorderUsage {
  class: string;
  type: 'width' | 'radius' | 'style';
  value: string;
  occurrences: number;
}

export interface DesignTokens {
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
    background: string[];
    text: string[];
    border: string[];
  };
  spacing: {
    base: number;
    scale: number[];
  };
  typography: {
    fontFamilies: string[];
    fontSizes: string[];
    fontWeights: string[];
    lineHeights: string[];
    letterSpacings: string[];
  };
  borders: {
    radii: string[];
    widths: string[];
  };
  shadows: string[];
  animations: {
    durations: string[];
    easings: string[];
    types: string[];
  };
}

export interface CodebaseAnalysis {
  components: ComponentPattern[];
  tokens: DesignTokens;
  patterns: {
    buttonVariants: ButtonPattern[];
    cardVariants: CardPattern[];
    surfaceVariants: SurfacePattern[];
    layoutPatterns: LayoutPattern[];
  };
  stats: {
    totalFiles: number;
    totalComponents: number;
    totalLines: number;
    tailwindUsage: number;
    cssModulesUsage: number;
    styledComponentsUsage: number;
  };
}

export interface ButtonPattern {
  name: string;
  filePath: string;
  variants: string[];
  sizes: string[];
  baseClasses: string[];
  hoverClasses: string[];
  activeClasses: string[];
  disabledClasses: string[];
}

export interface CardPattern {
  name: string;
  filePath: string;
  hasHeader: boolean;
  hasFooter: boolean;
  hasBorder: boolean;
  hasShadow: boolean;
  baseClasses: string[];
}

export interface SurfacePattern {
  name: string;
  filePath: string;
  type: 'solid' | 'glass' | 'gradient' | 'transparent';
  baseClasses: string[];
}

export interface LayoutPattern {
  name: string;
  filePath: string;
  type: 'flex' | 'grid' | 'stack' | 'sidebar';
  responsive: boolean;
}

// =============================================================================
// TAILWIND CLASS PATTERNS
// =============================================================================

const TAILWIND_PATTERNS = {
  // Colors
  bg: /\bbg-(\[.+?\]|[a-z]+-\d+|[a-z]+(?:\/\d+)?)\b/g,
  text: /\btext-(\[.+?\]|[a-z]+-\d+|[a-z]+(?:\/\d+)?)\b/g,
  border: /\bborder-(\[.+?\]|[a-z]+-\d+|[a-z]+(?:\/\d+)?)\b/g,
  ring: /\bring-(\[.+?\]|[a-z]+-\d+|[a-z]+(?:\/\d+)?)\b/g,

  // Spacing
  padding: /\bp[xytblr]?-(\[.+?\]|\d+(?:\.\d+)?)\b/g,
  margin: /\bm[xytblr]?-(\[.+?\]|\d+(?:\.\d+)?)\b/g,
  gap: /\bgap-(\[.+?\]|\d+(?:\.\d+)?)\b/g,
  space: /\bspace-[xy]-(\[.+?\]|\d+(?:\.\d+)?)\b/g,

  // Typography
  fontSize: /\btext-(xs|sm|base|lg|xl|[2-9]xl|\[.+?\])\b/g,
  fontWeight: /\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g,
  lineHeight: /\bleading-(\d+|none|tight|snug|normal|relaxed|loose|\[.+?\])\b/g,
  tracking: /\btracking-(tighter|tight|normal|wide|wider|widest|\[.+?\])\b/g,

  // Borders
  borderRadius: /\brounded(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?(?:-[tblr]{1,2})?\b/g,
  borderWidth: /\bborder(-[0248])?\b/g,

  // Shadows
  shadow: /\bshadow(-sm|-md|-lg|-xl|-2xl|-inner|-none)?\b/g,

  // Animations
  transition: /\btransition(-none|-all|-colors|-opacity|-shadow|-transform)?\b/g,
  duration: /\bduration-(\d+|\[.+?\])\b/g,
  ease: /\bease-(linear|in|out|in-out)\b/g,
  animate: /\banimate-(\w+)\b/g,

  // Responsive
  responsive: /\b(sm|md|lg|xl|2xl):/g,

  // State variants
  hover: /\bhover:/g,
  focus: /\bfocus:/g,
  active: /\bactive:/g,
  disabled: /\bdisabled:/g,
  dark: /\bdark:/g,
};

// =============================================================================
// ANALYZER CLASS
// =============================================================================

export class CodebaseAnalyzer {
  private repoPath: string;
  private fileCache: Map<string, string> = new Map();

  constructor(repoPath: string) {
    this.repoPath = repoPath;
  }

  /**
   * Analyze the entire codebase
   */
  async analyze(): Promise<CodebaseAnalysis> {
    const files = this.findSourceFiles();
    const components: ComponentPattern[] = [];
    const allClasses: string[] = [];

    let totalLines = 0;
    let tailwindUsage = 0;
    let cssModulesUsage = 0;
    let styledComponentsUsage = 0;

    for (const file of files) {
      const content = this.readFile(file);
      totalLines += content.split('\n').length;

      // Detect CSS approach
      if (content.includes('className=')) tailwindUsage++;
      if (content.includes('.module.css') || content.includes('.module.scss')) cssModulesUsage++;
      if (content.includes('styled.') || content.includes('styled(')) styledComponentsUsage++;

      // Extract component info
      const component = this.analyzeComponent(file, content);
      if (component) {
        components.push(component);
      }

      // Collect all Tailwind classes
      const classes = this.extractTailwindClasses(content);
      allClasses.push(...classes);
    }

    // Extract design tokens from collected classes
    const tokens = this.extractDesignTokens(allClasses);

    // Detect patterns
    const patterns = this.detectPatterns(components);

    return {
      components,
      tokens,
      patterns,
      stats: {
        totalFiles: files.length,
        totalComponents: components.length,
        totalLines,
        tailwindUsage,
        cssModulesUsage,
        styledComponentsUsage,
      },
    };
  }

  /**
   * Find all source files in the repository
   */
  private findSourceFiles(): string[] {
    const files: string[] = [];
    const extensions = ['.tsx', '.jsx', '.ts', '.js'];
    const ignoreDirs = ['node_modules', 'dist', 'build', '.next', '.git', 'coverage'];

    const walk = (dir: string) => {
      if (!existsSync(dir)) return;

      const entries = readdirSync(dir);
      for (const entry of entries) {
        const fullPath = join(dir, entry);

        if (ignoreDirs.some(d => fullPath.includes(d))) continue;

        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (extensions.includes(extname(entry))) {
          files.push(fullPath);
        }
      }
    };

    // Try common source directories
    const srcDirs = ['src', 'app', 'pages', 'components', 'lib'];
    for (const dir of srcDirs) {
      const fullPath = join(this.repoPath, dir);
      if (existsSync(fullPath)) {
        walk(fullPath);
      }
    }

    // If no files found, try root
    if (files.length === 0) {
      walk(this.repoPath);
    }

    return files;
  }

  /**
   * Read file with caching
   */
  private readFile(filePath: string): string {
    if (this.fileCache.has(filePath)) {
      return this.fileCache.get(filePath)!;
    }

    try {
      const content = readFileSync(filePath, 'utf-8');
      this.fileCache.set(filePath, content);
      return content;
    } catch {
      return '';
    }
  }

  /**
   * Analyze a single component file
   */
  private analyzeComponent(filePath: string, content: string): ComponentPattern | null {
    // Extract component name
    const exportMatch = content.match(/export\s+(?:default\s+)?(?:function|const)\s+(\w+)/);
    const componentName = exportMatch?.[1];

    if (!componentName) return null;

    // Determine component type
    const type = this.detectComponentType(componentName, content);

    // Extract props
    const props = this.extractProps(content);

    // Extract variants (look for variant prop or CVA)
    const variants = this.extractVariants(content);

    // Analyze Tailwind classes
    const tailwindClasses = this.analyzeTailwindClasses(content);

    return {
      name: componentName,
      type,
      filePath: relative(this.repoPath, filePath),
      variants,
      props,
      tailwindClasses,
      usage: {
        importedBy: [],
        usageCount: 0,
      },
    };
  }

  /**
   * Detect component type from name and content
   */
  private detectComponentType(name: string, content: string): ComponentPattern['type'] {
    const nameLower = name.toLowerCase();

    if (nameLower.includes('button') || nameLower.includes('btn')) return 'button';
    if (nameLower.includes('card')) return 'card';
    if (nameLower.includes('surface') || nameLower.includes('panel') || nameLower.includes('container')) return 'surface';
    if (nameLower.includes('input') || nameLower.includes('field') || nameLower.includes('textarea')) return 'input';
    if (nameLower.includes('layout') || nameLower.includes('shell') || nameLower.includes('page')) return 'layout';
    if (nameLower.includes('nav') || nameLower.includes('menu') || nameLower.includes('sidebar')) return 'navigation';
    if (nameLower.includes('modal') || nameLower.includes('dialog') || nameLower.includes('drawer')) return 'modal';
    if (nameLower.includes('list') || nameLower.includes('table') || nameLower.includes('grid')) return 'list';

    // Check content for hints
    if (content.includes('<button') || content.includes('onClick')) return 'button';
    if (content.includes('CardHeader') || content.includes('CardContent')) return 'card';
    if (content.includes('<input') || content.includes('<Input')) return 'input';

    return 'other';
  }

  /**
   * Extract props from component
   */
  private extractProps(content: string): PropInfo[] {
    const props: PropInfo[] = [];

    // Match interface/type Props = { ... }
    const propsMatch = content.match(/(?:interface|type)\s+\w*Props\w*\s*(?:=\s*)?{([^}]+)}/s);
    if (propsMatch) {
      const propsBody = propsMatch[1];
      const propLines = propsBody.split('\n');

      for (const line of propLines) {
        const propMatch = line.match(/^\s*(\w+)(\?)?:\s*(.+?);?\s*$/);
        if (propMatch) {
          props.push({
            name: propMatch[1],
            type: propMatch[3].trim(),
            required: !propMatch[2],
          });
        }
      }
    }

    return props;
  }

  /**
   * Extract variants (CVA or variant props)
   */
  private extractVariants(content: string): string[] {
    const variants: string[] = [];

    // CVA variants
    const cvaMatch = content.match(/variants:\s*{([^}]+)}/s);
    if (cvaMatch) {
      const variantMatches = cvaMatch[1].matchAll(/(\w+):\s*{/g);
      for (const match of variantMatches) {
        variants.push(match[1]);
      }
    }

    // Variant prop type
    const variantPropMatch = content.match(/variant\??:\s*['"]([^'"]+)['"]\s*\|/);
    if (variantPropMatch) {
      const variantValues = content.match(/variant\??:\s*(['"]\w+['"](?:\s*\|\s*['"]\w+['"])*)/);
      if (variantValues) {
        const values = variantValues[1].match(/['"](\w+)['"]/g);
        if (values) {
          for (const v of values) {
            variants.push(v.replace(/['"]/g, ''));
          }
        }
      }
    }

    return [...new Set(variants)];
  }

  /**
   * Extract all Tailwind classes from content
   */
  private extractTailwindClasses(content: string): string[] {
    const classes: string[] = [];

    // Match className="..." or className={`...`} or cn("...")
    const classPatterns = [
      /className="([^"]+)"/g,
      /className=\{`([^`]+)`\}/g,
      /className=\{cn\(([^)]+)\)\}/g,
      /cn\("([^"]+)"/g,
      /cn\('([^']+)'/g,
      /clsx\("([^"]+)"/g,
      /clsx\('([^']+)'/g,
    ];

    for (const pattern of classPatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        const classString = match[1];
        const classList = classString.split(/\s+/).filter(c => c.length > 0);
        classes.push(...classList);
      }
    }

    return classes;
  }

  /**
   * Analyze Tailwind classes in content
   */
  private analyzeTailwindClasses(content: string): TailwindClassAnalysis {
    const classes = this.extractTailwindClasses(content);
    const classString = classes.join(' ');

    return {
      colors: this.extractColorUsage(classString),
      spacing: this.extractSpacingUsage(classString),
      typography: this.extractTypographyUsage(classString),
      borders: this.extractBorderUsage(classString),
      shadows: this.extractShadows(classString),
      animations: this.extractAnimations(classString),
      responsive: this.extractResponsive(classString),
      variants: this.extractStateVariants(classString),
    };
  }

  /**
   * Extract color usage from classes
   */
  private extractColorUsage(classString: string): ColorUsage[] {
    const colors: ColorUsage[] = [];
    const colorTypes: Array<{ pattern: RegExp; type: ColorUsage['type'] }> = [
      { pattern: TAILWIND_PATTERNS.bg, type: 'bg' },
      { pattern: TAILWIND_PATTERNS.text, type: 'text' },
      { pattern: TAILWIND_PATTERNS.border, type: 'border' },
      { pattern: TAILWIND_PATTERNS.ring, type: 'ring' },
    ];

    for (const { pattern, type } of colorTypes) {
      const matches = classString.matchAll(new RegExp(pattern.source, 'g'));
      for (const match of matches) {
        const value = match[1];
        const existing = colors.find(c => c.class === match[0]);
        if (existing) {
          existing.occurrences++;
        } else {
          colors.push({
            class: match[0],
            type,
            value,
            occurrences: 1,
          });
        }
      }
    }

    return colors;
  }

  /**
   * Extract spacing usage
   */
  private extractSpacingUsage(classString: string): SpacingUsage[] {
    const spacing: SpacingUsage[] = [];
    const spacingTypes: Array<{ pattern: RegExp; type: SpacingUsage['type'] }> = [
      { pattern: TAILWIND_PATTERNS.padding, type: 'padding' },
      { pattern: TAILWIND_PATTERNS.margin, type: 'margin' },
      { pattern: TAILWIND_PATTERNS.gap, type: 'gap' },
      { pattern: TAILWIND_PATTERNS.space, type: 'space' },
    ];

    for (const { pattern, type } of spacingTypes) {
      const matches = classString.matchAll(new RegExp(pattern.source, 'g'));
      for (const match of matches) {
        spacing.push({
          class: match[0],
          type,
          value: match[1],
          occurrences: 1,
        });
      }
    }

    return spacing;
  }

  /**
   * Extract typography usage
   */
  private extractTypographyUsage(classString: string): TypographyUsage[] {
    const typography: TypographyUsage[] = [];
    const typographyTypes: Array<{ pattern: RegExp; type: TypographyUsage['type'] }> = [
      { pattern: TAILWIND_PATTERNS.fontSize, type: 'size' },
      { pattern: TAILWIND_PATTERNS.fontWeight, type: 'weight' },
      { pattern: TAILWIND_PATTERNS.lineHeight, type: 'leading' },
      { pattern: TAILWIND_PATTERNS.tracking, type: 'tracking' },
    ];

    for (const { pattern, type } of typographyTypes) {
      const matches = classString.matchAll(new RegExp(pattern.source, 'g'));
      for (const match of matches) {
        typography.push({
          class: match[0],
          type,
          value: match[1],
          occurrences: 1,
        });
      }
    }

    return typography;
  }

  /**
   * Extract border usage
   */
  private extractBorderUsage(classString: string): BorderUsage[] {
    const borders: BorderUsage[] = [];
    const borderTypes: Array<{ pattern: RegExp; type: BorderUsage['type'] }> = [
      { pattern: TAILWIND_PATTERNS.borderRadius, type: 'radius' },
      { pattern: TAILWIND_PATTERNS.borderWidth, type: 'width' },
    ];

    for (const { pattern, type } of borderTypes) {
      const matches = classString.matchAll(new RegExp(pattern.source, 'g'));
      for (const match of matches) {
        borders.push({
          class: match[0],
          type,
          value: match[1] || 'default',
          occurrences: 1,
        });
      }
    }

    return borders;
  }

  /**
   * Extract shadow classes
   */
  private extractShadows(classString: string): string[] {
    const matches = classString.matchAll(TAILWIND_PATTERNS.shadow);
    return [...new Set([...matches].map(m => m[0]))];
  }

  /**
   * Extract animation classes
   */
  private extractAnimations(classString: string): string[] {
    const animations: string[] = [];

    for (const pattern of [TAILWIND_PATTERNS.transition, TAILWIND_PATTERNS.duration, TAILWIND_PATTERNS.ease, TAILWIND_PATTERNS.animate]) {
      const matches = classString.matchAll(new RegExp(pattern.source, 'g'));
      for (const match of matches) {
        animations.push(match[0]);
      }
    }

    return [...new Set(animations)];
  }

  /**
   * Extract responsive prefixes
   */
  private extractResponsive(classString: string): string[] {
    const matches = classString.matchAll(TAILWIND_PATTERNS.responsive);
    return [...new Set([...matches].map(m => m[1]))];
  }

  /**
   * Extract state variants
   */
  private extractStateVariants(classString: string): string[] {
    const variants: string[] = [];

    if (classString.match(TAILWIND_PATTERNS.hover)) variants.push('hover');
    if (classString.match(TAILWIND_PATTERNS.focus)) variants.push('focus');
    if (classString.match(TAILWIND_PATTERNS.active)) variants.push('active');
    if (classString.match(TAILWIND_PATTERNS.disabled)) variants.push('disabled');
    if (classString.match(TAILWIND_PATTERNS.dark)) variants.push('dark');

    return variants;
  }

  /**
   * Extract design tokens from all classes
   */
  private extractDesignTokens(allClasses: string[]): DesignTokens {
    const classString = allClasses.join(' ');
    const colorUsage = this.extractColorUsage(classString);
    const spacingUsage = this.extractSpacingUsage(classString);
    const typographyUsage = this.extractTypographyUsage(classString);
    const borderUsage = this.extractBorderUsage(classString);

    // Group colors by semantic meaning
    const bgColors = colorUsage.filter(c => c.type === 'bg').map(c => c.value);
    const textColors = colorUsage.filter(c => c.type === 'text').map(c => c.value);
    const borderColors = colorUsage.filter(c => c.type === 'border').map(c => c.value);

    // Extract unique spacing values
    const spacingValues = [...new Set(spacingUsage.map(s => s.value))].filter(v => !v.startsWith('['));

    return {
      colors: {
        primary: this.findPrimaryColors(bgColors),
        secondary: this.findSecondaryColors(bgColors),
        accent: this.findAccentColors(bgColors),
        background: bgColors.filter(c => c.includes('background') || c.includes('bg') || c === 'white' || c === 'black'),
        text: textColors,
        border: borderColors,
      },
      spacing: {
        base: 4, // Tailwind default
        scale: spacingValues.map(v => parseInt(v) || 0).filter(v => v > 0).sort((a, b) => a - b),
      },
      typography: {
        fontFamilies: [], // Would need tailwind.config.js parsing
        fontSizes: [...new Set(typographyUsage.filter(t => t.type === 'size').map(t => t.value))],
        fontWeights: [...new Set(typographyUsage.filter(t => t.type === 'weight').map(t => t.value))],
        lineHeights: [...new Set(typographyUsage.filter(t => t.type === 'leading').map(t => t.value))],
        letterSpacings: [...new Set(typographyUsage.filter(t => t.type === 'tracking').map(t => t.value))],
      },
      borders: {
        radii: [...new Set(borderUsage.filter(b => b.type === 'radius').map(b => b.value))],
        widths: [...new Set(borderUsage.filter(b => b.type === 'width').map(b => b.value))],
      },
      shadows: this.extractShadows(classString),
      animations: {
        durations: [],
        easings: [],
        types: this.extractAnimations(classString),
      },
    };
  }

  /**
   * Find primary colors (most used accent-like colors)
   */
  private findPrimaryColors(colors: string[]): string[] {
    const primaryIndicators = ['primary', 'blue', 'indigo', 'violet', 'purple'];
    return colors.filter(c => primaryIndicators.some(p => c.includes(p)));
  }

  /**
   * Find secondary colors
   */
  private findSecondaryColors(colors: string[]): string[] {
    const secondaryIndicators = ['secondary', 'gray', 'slate', 'zinc', 'neutral'];
    return colors.filter(c => secondaryIndicators.some(s => c.includes(s)));
  }

  /**
   * Find accent colors
   */
  private findAccentColors(colors: string[]): string[] {
    const accentIndicators = ['accent', 'orange', 'amber', 'yellow', 'green', 'emerald', 'teal', 'cyan'];
    return colors.filter(c => accentIndicators.some(a => c.includes(a)));
  }

  /**
   * Detect component patterns
   */
  private detectPatterns(components: ComponentPattern[]): CodebaseAnalysis['patterns'] {
    const buttonComponents = components.filter(c => c.type === 'button');
    const cardComponents = components.filter(c => c.type === 'card');
    const surfaceComponents = components.filter(c => c.type === 'surface');
    const layoutComponents = components.filter(c => c.type === 'layout');

    return {
      buttonVariants: buttonComponents.map(c => this.analyzeButtonPattern(c)),
      cardVariants: cardComponents.map(c => this.analyzeCardPattern(c)),
      surfaceVariants: surfaceComponents.map(c => this.analyzeSurfacePattern(c)),
      layoutPatterns: layoutComponents.map(c => this.analyzeLayoutPattern(c)),
    };
  }

  /**
   * Analyze button pattern
   */
  private analyzeButtonPattern(component: ComponentPattern): ButtonPattern {
    const content = this.readFile(join(this.repoPath, component.filePath));

    // Extract hover classes
    const hoverMatch = content.match(/hover:([^\s"']+)/g) || [];
    const activeMatch = content.match(/active:([^\s"']+)/g) || [];
    const disabledMatch = content.match(/disabled:([^\s"']+)/g) || [];

    // Extract size variants
    const sizes = component.variants.filter(v => ['sm', 'md', 'lg', 'xl', 'icon'].includes(v.toLowerCase()));

    return {
      name: component.name,
      filePath: component.filePath,
      variants: component.variants.filter(v => !sizes.includes(v)),
      sizes,
      baseClasses: this.extractTailwindClasses(content).filter(c => !c.includes(':')),
      hoverClasses: hoverMatch.map(c => c.replace('hover:', '')),
      activeClasses: activeMatch.map(c => c.replace('active:', '')),
      disabledClasses: disabledMatch.map(c => c.replace('disabled:', '')),
    };
  }

  /**
   * Analyze card pattern
   */
  private analyzeCardPattern(component: ComponentPattern): CardPattern {
    const content = this.readFile(join(this.repoPath, component.filePath));

    return {
      name: component.name,
      filePath: component.filePath,
      hasHeader: content.includes('Header') || content.includes('header'),
      hasFooter: content.includes('Footer') || content.includes('footer'),
      hasBorder: component.tailwindClasses.borders.some(b => b.type === 'width'),
      hasShadow: component.tailwindClasses.shadows.length > 0,
      baseClasses: this.extractTailwindClasses(content).filter(c => !c.includes(':')),
    };
  }

  /**
   * Analyze surface pattern
   */
  private analyzeSurfacePattern(component: ComponentPattern): SurfacePattern {
    const classes = component.tailwindClasses;

    let type: SurfacePattern['type'] = 'solid';

    if (classes.colors.some(c => c.class.includes('backdrop-blur') || c.class.includes('bg-opacity'))) {
      type = 'glass';
    } else if (classes.colors.some(c => c.class.includes('gradient'))) {
      type = 'gradient';
    } else if (classes.colors.some(c => c.class.includes('transparent'))) {
      type = 'transparent';
    }

    return {
      name: component.name,
      filePath: component.filePath,
      type,
      baseClasses: classes.colors.map(c => c.class),
    };
  }

  /**
   * Analyze layout pattern
   */
  private analyzeLayoutPattern(component: ComponentPattern): LayoutPattern {
    const content = this.readFile(join(this.repoPath, component.filePath));
    const classes = this.extractTailwindClasses(content);

    let type: LayoutPattern['type'] = 'flex';

    if (classes.some(c => c.includes('grid'))) type = 'grid';
    if (classes.some(c => c.includes('flex-col') && c.includes('gap'))) type = 'stack';
    if (content.includes('Sidebar') || content.includes('sidebar')) type = 'sidebar';

    return {
      name: component.name,
      filePath: component.filePath,
      type,
      responsive: component.tailwindClasses.responsive.length > 0,
    };
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export async function analyzeCodebase(repoPath: string): Promise<CodebaseAnalysis> {
  const analyzer = new CodebaseAnalyzer(repoPath);
  return analyzer.analyze();
}
