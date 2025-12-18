/**
 * Inspiration Knowledge Base
 *
 * Persistent storage for learned design languages.
 * As users provide new inspirations, the system:
 * 1. Analyzes the source (URL, brand, description)
 * 2. Stores the extracted design language
 * 3. Retrieves instantly on future requests
 *
 * Storage backends:
 * - Memory (default, session-only)
 * - File system (JSON file, persists across sessions)
 * - Supabase (cloud, shared across users)
 */

import type { ExtractedDesignLanguage, InspirationSource } from './index';
import type { URLAnalysisResult } from './url-analyzer';

// =============================================================================
// TYPES
// =============================================================================

export interface KnowledgeEntry {
  id: string;
  source: InspirationSource;
  domain?: string;
  designLanguage: ExtractedDesignLanguage;
  urlAnalysis?: URLAnalysisResult;
  createdAt: string;
  updatedAt: string;
  accessCount: number;
  confidence: number; // 0-1, how reliable is this extraction
  tags: string[];
  notes?: string;
}

export interface KnowledgeBaseStats {
  totalEntries: number;
  byType: {
    brand: number;
    url: number;
    screenshot: number;
    description: number;
  };
  topAccessed: string[];
  lastUpdated: string;
}

export interface KnowledgeBaseConfig {
  backend: 'memory' | 'file' | 'supabase';
  filePath?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
  autoSave?: boolean;
  maxEntries?: number;
}

// =============================================================================
// KNOWLEDGE BASE
// =============================================================================

export class InspirationKnowledgeBase {
  private entries: Map<string, KnowledgeEntry> = new Map();
  private config: KnowledgeBaseConfig;
  private dirty: boolean = false;

  constructor(config: Partial<KnowledgeBaseConfig> = {}) {
    this.config = {
      backend: 'memory',
      autoSave: true,
      maxEntries: 1000,
      ...config,
    };
  }

  // ---------------------------------------------------------------------------
  // CORE CRUD
  // ---------------------------------------------------------------------------

  /**
   * Get a knowledge entry by ID or domain
   */
  get(idOrDomain: string): KnowledgeEntry | null {
    // Try direct ID lookup
    const direct = this.entries.get(idOrDomain);
    if (direct) {
      direct.accessCount++;
      this.dirty = true;
      return direct;
    }

    // Try domain lookup
    const normalized = this.normalizeDomain(idOrDomain);
    for (const entry of this.entries.values()) {
      if (entry.domain === normalized) {
        entry.accessCount++;
        this.dirty = true;
        return entry;
      }
    }

    return null;
  }

  /**
   * Check if we have knowledge about a domain/brand
   */
  has(idOrDomain: string): boolean {
    return this.get(idOrDomain) !== null;
  }

  /**
   * Store a new knowledge entry
   */
  set(entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt' | 'accessCount'>): KnowledgeEntry {
    const id = this.generateId(entry.source);
    const now = new Date().toISOString();

    const fullEntry: KnowledgeEntry = {
      ...entry,
      id,
      createdAt: now,
      updatedAt: now,
      accessCount: 0,
    };

    this.entries.set(id, fullEntry);
    this.dirty = true;

    // Auto-save if configured
    if (this.config.autoSave && this.config.backend !== 'memory') {
      this.save();
    }

    // Enforce max entries
    if (this.config.maxEntries && this.entries.size > this.config.maxEntries) {
      this.evictLeastUsed();
    }

    return fullEntry;
  }

  /**
   * Update an existing entry
   */
  update(id: string, updates: Partial<KnowledgeEntry>): KnowledgeEntry | null {
    const existing = this.entries.get(id);
    if (!existing) return null;

    const updated: KnowledgeEntry = {
      ...existing,
      ...updates,
      id: existing.id, // Can't change ID
      createdAt: existing.createdAt, // Can't change creation time
      updatedAt: new Date().toISOString(),
    };

    this.entries.set(id, updated);
    this.dirty = true;

    if (this.config.autoSave && this.config.backend !== 'memory') {
      this.save();
    }

    return updated;
  }

  /**
   * Delete an entry
   */
  delete(id: string): boolean {
    const deleted = this.entries.delete(id);
    if (deleted) {
      this.dirty = true;
      if (this.config.autoSave && this.config.backend !== 'memory') {
        this.save();
      }
    }
    return deleted;
  }

  // ---------------------------------------------------------------------------
  // SEARCH & QUERY
  // ---------------------------------------------------------------------------

  /**
   * Search entries by tags
   */
  searchByTags(tags: string[]): KnowledgeEntry[] {
    return Array.from(this.entries.values()).filter(entry =>
      tags.some(tag => entry.tags.includes(tag.toLowerCase()))
    );
  }

  /**
   * Search entries by color (find similar palettes)
   */
  searchByColor(color: string): KnowledgeEntry[] {
    const normalizedColor = color.toLowerCase();
    return Array.from(this.entries.values()).filter(entry => {
      const allColors = [
        ...entry.designLanguage.colors.primary,
        ...entry.designLanguage.colors.accent,
        ...entry.designLanguage.colors.background,
      ];
      return allColors.some(c => c.toLowerCase().includes(normalizedColor));
    });
  }

  /**
   * Get entries similar to a given style
   */
  findSimilar(style: {
    mood?: 'playful' | 'balanced' | 'professional';
    density?: 'sparse' | 'balanced' | 'dense';
    contrast?: 'low' | 'medium' | 'high';
  }): KnowledgeEntry[] {
    return Array.from(this.entries.values()).filter(entry => {
      const mood = entry.designLanguage.mood;
      let matches = 0;
      let total = 0;

      if (style.mood) {
        total++;
        if (mood.formality === style.mood) matches++;
      }
      if (style.density) {
        total++;
        if (mood.density === style.density) matches++;
      }
      if (style.contrast) {
        total++;
        if (mood.contrast === style.contrast) matches++;
      }

      return total > 0 && matches / total >= 0.5;
    });
  }

  /**
   * Get all entries
   */
  getAll(): KnowledgeEntry[] {
    return Array.from(this.entries.values());
  }

  /**
   * Get statistics
   */
  getStats(): KnowledgeBaseStats {
    const entries = this.getAll();
    const byType = { brand: 0, url: 0, screenshot: 0, description: 0 };

    for (const entry of entries) {
      byType[entry.source.type]++;
    }

    const topAccessed = entries
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 10)
      .map(e => e.domain || e.source.value);

    return {
      totalEntries: entries.length,
      byType,
      topAccessed,
      lastUpdated: entries.length > 0
        ? entries.reduce((latest, e) =>
            e.updatedAt > latest ? e.updatedAt : latest, entries[0].updatedAt)
        : new Date().toISOString(),
    };
  }

  // ---------------------------------------------------------------------------
  // PERSISTENCE
  // ---------------------------------------------------------------------------

  /**
   * Save to configured backend
   */
  async save(): Promise<void> {
    if (!this.dirty) return;

    switch (this.config.backend) {
      case 'file':
        await this.saveToFile();
        break;
      case 'supabase':
        await this.saveToSupabase();
        break;
      // Memory backend doesn't persist
    }

    this.dirty = false;
  }

  /**
   * Load from configured backend
   */
  async load(): Promise<void> {
    switch (this.config.backend) {
      case 'file':
        await this.loadFromFile();
        break;
      case 'supabase':
        await this.loadFromSupabase();
        break;
      // Memory backend starts empty
    }
  }

  private async saveToFile(): Promise<void> {
    if (!this.config.filePath) return;

    const data = {
      version: 1,
      entries: Array.from(this.entries.entries()),
      savedAt: new Date().toISOString(),
    };

    // In Node.js environment
    if (typeof process !== 'undefined' && process.versions?.node) {
      const fs = await import('fs/promises');
      await fs.writeFile(this.config.filePath, JSON.stringify(data, null, 2));
    }
  }

  private async loadFromFile(): Promise<void> {
    if (!this.config.filePath) return;

    try {
      if (typeof process !== 'undefined' && process.versions?.node) {
        const fs = await import('fs/promises');
        const content = await fs.readFile(this.config.filePath, 'utf-8');
        const data = JSON.parse(content);

        this.entries = new Map(data.entries);
      }
    } catch (error) {
      // File doesn't exist yet, start fresh
      console.log('Knowledge base file not found, starting fresh');
    }
  }

  private async saveToSupabase(): Promise<void> {
    if (!this.config.supabaseUrl || !this.config.supabaseKey) return;

    // Would use Supabase client to save entries
    console.log('Supabase save not yet implemented');
  }

  private async loadFromSupabase(): Promise<void> {
    if (!this.config.supabaseUrl || !this.config.supabaseKey) return;

    // Would use Supabase client to load entries
    console.log('Supabase load not yet implemented');
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  private generateId(source: InspirationSource): string {
    const base = source.type === 'url' || source.type === 'brand'
      ? this.normalizeDomain(source.value)
      : source.value.slice(0, 50).replace(/\s+/g, '-').toLowerCase();

    return `${source.type}-${base}-${Date.now().toString(36)}`;
  }

  private normalizeDomain(input: string): string {
    try {
      const url = input.startsWith('http') ? input : `https://${input}`;
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch {
      return input.toLowerCase().replace(/\s+/g, '-');
    }
  }

  private evictLeastUsed(): void {
    // Find entry with lowest access count
    let leastUsed: KnowledgeEntry | null = null;
    for (const entry of this.entries.values()) {
      if (!leastUsed || entry.accessCount < leastUsed.accessCount) {
        leastUsed = entry;
      }
    }

    if (leastUsed) {
      this.entries.delete(leastUsed.id);
    }
  }

  // ---------------------------------------------------------------------------
  // EXPORT / IMPORT
  // ---------------------------------------------------------------------------

  /**
   * Export all knowledge as JSON
   */
  export(): string {
    return JSON.stringify({
      version: 1,
      exportedAt: new Date().toISOString(),
      entries: Array.from(this.entries.values()),
    }, null, 2);
  }

  /**
   * Import knowledge from JSON
   */
  import(json: string, merge: boolean = true): number {
    const data = JSON.parse(json);
    let imported = 0;

    if (!merge) {
      this.entries.clear();
    }

    for (const entry of data.entries) {
      if (!merge || !this.entries.has(entry.id)) {
        this.entries.set(entry.id, entry);
        imported++;
      }
    }

    this.dirty = true;
    return imported;
  }
}

// =============================================================================
// SMART INSPIRATION RESOLVER
// =============================================================================

/**
 * Resolves inspiration requests using the knowledge base.
 * Falls back to live analysis for unknown sources.
 */
export class SmartInspirationResolver {
  private knowledgeBase: InspirationKnowledgeBase;
  private urlAnalyzer: any; // URLAnalyzer type

  constructor(knowledgeBase: InspirationKnowledgeBase) {
    this.knowledgeBase = knowledgeBase;
  }

  /**
   * Resolve an inspiration source, using cache or live analysis
   */
  async resolve(source: InspirationSource): Promise<{
    entry: KnowledgeEntry;
    fromCache: boolean;
  }> {
    // Check knowledge base first
    const cached = this.knowledgeBase.get(source.value);
    if (cached) {
      return { entry: cached, fromCache: true };
    }

    // Not in cache, need to analyze
    console.log(`Learning new inspiration: ${source.value}`);

    // Import URLAnalyzer dynamically to avoid circular deps
    const { URLAnalyzer } = await import('./url-analyzer');
    const analyzer = new URLAnalyzer();

    let designLanguage: ExtractedDesignLanguage;
    let urlAnalysis: URLAnalysisResult | undefined;

    if (source.type === 'url' || source.type === 'brand') {
      const url = source.type === 'url' ? source.value : `https://${source.value}.com`;
      urlAnalysis = await analyzer.analyze(url);

      if (urlAnalysis.success) {
        // Convert URLAnalysisResult to ExtractedDesignLanguage
        designLanguage = this.urlAnalysisToDesignLanguage(source, urlAnalysis);
      } else {
        // Fallback to description-based analysis
        designLanguage = this.createFallbackDesignLanguage(source);
      }
    } else {
      designLanguage = this.createFallbackDesignLanguage(source);
    }

    // Store in knowledge base
    const entry = this.knowledgeBase.set({
      source,
      domain: this.extractDomain(source.value),
      designLanguage,
      urlAnalysis,
      confidence: urlAnalysis?.success ? 0.9 : 0.5,
      tags: this.generateTags(designLanguage),
    });

    return { entry, fromCache: false };
  }

  /**
   * Resolve multiple inspirations
   */
  async resolveMany(sources: InspirationSource[]): Promise<{
    entries: KnowledgeEntry[];
    cacheHits: number;
    newLearned: number;
  }> {
    const results = await Promise.all(sources.map(s => this.resolve(s)));

    return {
      entries: results.map(r => r.entry),
      cacheHits: results.filter(r => r.fromCache).length,
      newLearned: results.filter(r => !r.fromCache).length,
    };
  }

  private urlAnalysisToDesignLanguage(
    source: InspirationSource,
    analysis: URLAnalysisResult
  ): ExtractedDesignLanguage {
    return {
      source,
      colors: {
        primary: analysis.extractedColors.accents.slice(0, 1),
        secondary: analysis.extractedColors.accents.slice(1, 2),
        accent: analysis.extractedColors.accents,
        background: analysis.extractedColors.backgrounds,
        text: analysis.extractedColors.texts,
        gradients: [],
      },
      spacing: {
        scale: this.inferSpacingScale(analysis.extractedSpacing),
        baseUnit: 8,
        patterns: analysis.extractedSpacing.paddings.slice(0, 3).map(p => `p-[${p}]`),
      },
      typography: {
        headingStyle: analysis.extractedTypography.fontWeights.includes('700') ? 'bold' : 'medium',
        bodySize: 'base',
        tracking: 'normal',
        fontStack: analysis.extractedTypography.fontFamilies,
      },
      components: {
        buttonStyle: 'solid',
        cardStyle: analysis.extractedComponents.shadows.length > 0 ? 'elevated' : 'bordered',
        borderRadius: this.inferBorderRadius(analysis.extractedComponents.borderRadii),
        shadows: analysis.extractedComponents.shadows.length > 0 ? 'subtle' : 'none',
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
  }

  private createFallbackDesignLanguage(source: InspirationSource): ExtractedDesignLanguage {
    // Create a generic design language based on source name/description
    return {
      source,
      colors: {
        primary: ['#3B82F6'],
        secondary: ['#8B5CF6'],
        accent: ['#3B82F6'],
        background: ['#FFFFFF', '#F9FAFB'],
        text: ['#111827', '#6B7280'],
        gradients: [],
      },
      spacing: {
        scale: 'comfortable',
        baseUnit: 8,
        patterns: ['p-4', 'p-6', 'gap-4'],
      },
      typography: {
        headingStyle: 'bold',
        bodySize: 'base',
        tracking: 'normal',
        fontStack: ['Inter', 'system-ui', 'sans-serif'],
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
  }

  private extractDomain(input: string): string {
    try {
      const url = input.startsWith('http') ? input : `https://${input}`;
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return input.toLowerCase();
    }
  }

  private inferSpacingScale(spacing: URLAnalysisResult['extractedSpacing']): 'tight' | 'comfortable' | 'spacious' {
    const maxPadding = Math.max(...spacing.paddings.map(p => parseInt(p) || 0));
    if (maxPadding >= 48) return 'spacious';
    if (maxPadding <= 16) return 'tight';
    return 'comfortable';
  }

  private inferBorderRadius(radii: string[]): 'none' | 'sm' | 'md' | 'lg' | 'full' {
    const maxRadius = Math.max(...radii.map(r => parseInt(r) || 0));
    if (maxRadius === 0) return 'none';
    if (maxRadius >= 9999) return 'full';
    if (maxRadius >= 12) return 'lg';
    if (maxRadius >= 6) return 'md';
    return 'sm';
  }

  private generateTags(dl: ExtractedDesignLanguage): string[] {
    const tags: string[] = [];

    // Add mood tags
    tags.push(dl.mood.formality);
    tags.push(`${dl.mood.density}-density`);
    tags.push(`${dl.mood.contrast}-contrast`);

    // Add component style tags
    tags.push(`${dl.components.buttonStyle}-buttons`);
    tags.push(`${dl.components.cardStyle}-cards`);

    // Add color mood (dark/light)
    const bg = dl.colors.background[0] || '#FFFFFF';
    if (this.isDarkColor(bg)) {
      tags.push('dark-mode');
    } else {
      tags.push('light-mode');
    }

    return tags;
  }

  private isDarkColor(hex: string): boolean {
    if (!hex.startsWith('#')) return false;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

// Global knowledge base instance
let globalKnowledgeBase: InspirationKnowledgeBase | null = null;

export function getKnowledgeBase(config?: Partial<KnowledgeBaseConfig>): InspirationKnowledgeBase {
  if (!globalKnowledgeBase) {
    globalKnowledgeBase = new InspirationKnowledgeBase(config);
  }
  return globalKnowledgeBase;
}

export function getSmartResolver(): SmartInspirationResolver {
  return new SmartInspirationResolver(getKnowledgeBase());
}

// =============================================================================
// EXPORTS
// =============================================================================

export async function learnInspiration(source: string | InspirationSource): Promise<KnowledgeEntry> {
  const resolver = getSmartResolver();
  const normalizedSource: InspirationSource = typeof source === 'string'
    ? { type: 'url', value: source }
    : source;

  const result = await resolver.resolve(normalizedSource);
  return result.entry;
}

export function getLearnedInspiration(idOrDomain: string): KnowledgeEntry | null {
  return getKnowledgeBase().get(idOrDomain);
}

export function hasLearnedInspiration(idOrDomain: string): boolean {
  return getKnowledgeBase().has(idOrDomain);
}

export function getKnowledgeStats(): KnowledgeBaseStats {
  return getKnowledgeBase().getStats();
}
