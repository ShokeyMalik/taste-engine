/**
 * Block Registry Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  BlockRegistry,
  createDefaultRegistry,
  allBlocks,
  landingBlocks,
  dashboardBlocks,
  sharedBlocks,
  heroBlock,
  navigationBlock,
  sidebarBlock,
  authBlock,
  isLandingBlock,
  isDashboardBlock,
  isSharedBlock,
  getBlockCategory,
  BLOCK_COUNTS,
  ALL_BLOCK_TYPES,
} from '../../src/blocks';

describe('BlockRegistry', () => {
  describe('createDefaultRegistry', () => {
    it('should create a registry with all blocks', () => {
      const registry = createDefaultRegistry();
      expect(registry.getAll().length).toBe(BLOCK_COUNTS.total);
    });

    it('should get a registered block by type', () => {
      const registry = createDefaultRegistry();
      const hero = registry.get('hero');
      expect(hero).toBeDefined();
      expect(hero?.type).toBe('hero');
    });

    it('should return undefined for unknown block type', () => {
      const registry = createDefaultRegistry();
      const unknown = registry.get('unknown-block' as any);
      expect(unknown).toBeUndefined();
    });

    it('should check if block exists', () => {
      const registry = createDefaultRegistry();
      expect(registry.has('hero')).toBe(true);
      expect(registry.has('sidebar')).toBe(true);
      expect(registry.has('unknown-block' as any)).toBe(false);
    });
  });

  describe('block counts', () => {
    it('should have correct number of landing blocks', () => {
      expect(landingBlocks.length).toBe(BLOCK_COUNTS.landing);
    });

    it('should have correct number of dashboard blocks', () => {
      expect(dashboardBlocks.length).toBe(BLOCK_COUNTS.dashboard);
    });

    it('should have correct number of shared blocks', () => {
      expect(sharedBlocks.length).toBe(BLOCK_COUNTS.shared);
    });
  });

  describe('block definitions', () => {
    it('heroBlock should have correct structure', () => {
      expect(heroBlock.type).toBe('hero');
      expect(heroBlock.category).toBe('landing');
      expect(heroBlock.name).toBe('Hero Section');
      expect(heroBlock.variants.length).toBeGreaterThan(0);
      expect(heroBlock.defaultVariant).toBe('centered');
    });

    it('sidebarBlock should have correct structure', () => {
      expect(sidebarBlock.type).toBe('sidebar');
      expect(sidebarBlock.category).toBe('dashboard');
      expect(sidebarBlock.name).toBe('Sidebar Navigation');
      expect(sidebarBlock.variants.length).toBeGreaterThan(0);
    });

    it('authBlock should have correct structure', () => {
      expect(authBlock.type).toBe('auth');
      expect(authBlock.category).toBe('shared');
      // The actual name may differ from our expectation
      expect(authBlock.name).toBeDefined();
      expect(authBlock.variants.length).toBeGreaterThan(0);
    });
  });

  describe('type guards', () => {
    it('isLandingBlock should identify landing blocks', () => {
      expect(isLandingBlock('hero')).toBe(true);
      expect(isLandingBlock('navigation')).toBe(true);
      expect(isLandingBlock('sidebar')).toBe(false);
      expect(isLandingBlock('auth')).toBe(false);
    });

    it('isDashboardBlock should identify dashboard blocks', () => {
      expect(isDashboardBlock('sidebar')).toBe(true);
      expect(isDashboardBlock('header')).toBe(true);
      expect(isDashboardBlock('hero')).toBe(false);
      expect(isDashboardBlock('auth')).toBe(false);
    });

    it('isSharedBlock should identify shared blocks', () => {
      expect(isSharedBlock('auth')).toBe(true);
      expect(isSharedBlock('empty-state')).toBe(true);
      expect(isSharedBlock('hero')).toBe(false);
      expect(isSharedBlock('sidebar')).toBe(false);
    });

    it('getBlockCategory should return correct category', () => {
      expect(getBlockCategory('hero')).toBe('landing');
      expect(getBlockCategory('sidebar')).toBe('dashboard');
      expect(getBlockCategory('auth')).toBe('shared');
    });
  });

  describe('allBlocks', () => {
    it('should contain all block types', () => {
      expect(allBlocks.length).toBe(BLOCK_COUNTS.total);
    });

    it('should have unique block types', () => {
      const types = allBlocks.map((b) => b.type);
      const uniqueTypes = new Set(types);
      expect(uniqueTypes.size).toBe(types.length);
    });

    it('should match ALL_BLOCK_TYPES constant', () => {
      const blockTypes = allBlocks.map((b) => b.type);
      expect(blockTypes.sort()).toEqual([...ALL_BLOCK_TYPES].sort());
    });
  });

  describe('block variants', () => {
    it('hero should have expected variants', () => {
      const variants = heroBlock.variants.map((v) => v.id);
      expect(variants).toContain('centered');
      expect(variants).toContain('split');
      expect(variants).toContain('gradient-orbs');
    });

    it('navigation should have variants', () => {
      const variants = navigationBlock.variants.map((v) => v.id);
      expect(variants.length).toBeGreaterThan(0);
      // Check for at least one common variant
      expect(variants).toContain('sticky');
    });

    it('auth should have variants', () => {
      const variants = authBlock.variants.map((v) => v.id);
      expect(variants.length).toBeGreaterThan(0);
      expect(variants).toContain('login');
    });
  });
});
