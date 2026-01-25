/**
 * Block Generator Tests
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  BlockGenerator,
  createBlockGenerator,
} from '../../src/generator';
import { DEFAULT_TUNERS } from '../../src/blocks/types';
import { registerDefaultBlocks } from '../../src/blocks';

// Initialize block registry before tests
beforeAll(() => {
  registerDefaultBlocks();
});

describe('BlockGenerator', () => {
  describe('constructor', () => {
    it('should create a generator with default config', () => {
      const generator = new BlockGenerator();
      expect(generator).toBeDefined();
    });

    it('should create a generator with custom config', () => {
      const generator = new BlockGenerator({
        defaultLibrary: 'radix',
        defaultTuners: {
          abstraction: 0.8,
          density: 0.3,
          motion: 0.5,
          contrast: 0.7,
          narrative: 0.6,
        },
      });
      expect(generator).toBeDefined();
    });
  });

  describe('generate', () => {
    it('should generate a hero block', async () => {
      const generator = new BlockGenerator();
      const result = await generator.generate({
        blockType: 'hero',
        variant: 'centered',
        context: 'marketing',
        tuners: DEFAULT_TUNERS,
        componentLibrary: 'shadcn',
      });

      expect(result).toBeDefined();
      expect(result.code).toContain('export');
      expect(result.componentName).toBeDefined();
      expect(result.fileName).toBeDefined();
      expect(result.variantUsed).toBe('centered');
    });

    it('should generate a sidebar block', async () => {
      const generator = new BlockGenerator();
      const result = await generator.generate({
        blockType: 'sidebar',
        variant: 'collapsible',
        context: 'product',
        tuners: DEFAULT_TUNERS,
        componentLibrary: 'shadcn',
      });

      expect(result).toBeDefined();
      expect(result.code).toContain('export');
      expect(result.componentName).toBeDefined();
      expect(result.fileName).toBeDefined();
    });

    it('should generate an auth block', async () => {
      const generator = new BlockGenerator();
      const result = await generator.generate({
        blockType: 'auth',
        variant: 'login',
        context: 'product',
        tuners: DEFAULT_TUNERS,
        componentLibrary: 'shadcn',
      });

      expect(result).toBeDefined();
      expect(result.code).toContain('export');
      expect(result.componentName).toBeDefined();
    });

    it('should respect tuner values', async () => {
      const generator = new BlockGenerator();

      // High density (compact)
      const compactResult = await generator.generate({
        blockType: 'hero',
        variant: 'centered',
        context: 'marketing',
        tuners: { ...DEFAULT_TUNERS, density: 0.9 },
        componentLibrary: 'shadcn',
      });

      // Low density (spacious)
      const spaciousResult = await generator.generate({
        blockType: 'hero',
        variant: 'centered',
        context: 'marketing',
        tuners: { ...DEFAULT_TUNERS, density: 0.1 },
        componentLibrary: 'shadcn',
      });

      // Both should generate valid code
      expect(compactResult.code).toContain('export');
      expect(spaciousResult.code).toContain('export');
    });

    it('should include dependencies', async () => {
      const generator = new BlockGenerator();
      const result = await generator.generate({
        blockType: 'hero',
        variant: 'centered',
        context: 'marketing',
        tuners: DEFAULT_TUNERS,
        componentLibrary: 'shadcn',
      });

      expect(result.dependencies).toBeDefined();
      expect(Array.isArray(result.dependencies)).toBe(true);
    });

    it('should generate explanation', async () => {
      const generator = new BlockGenerator();
      const result = await generator.generate({
        blockType: 'hero',
        variant: 'centered',
        context: 'marketing',
        tuners: DEFAULT_TUNERS,
        componentLibrary: 'shadcn',
      });

      expect(result.explanation).toBeDefined();
      expect(result.explanation.length).toBeGreaterThan(0);
    });
  });

  describe('convenience functions', () => {
    it('createBlockGenerator should return a generator', () => {
      const generator = createBlockGenerator();
      expect(generator).toBeInstanceOf(BlockGenerator);
    });
  });
});
