/**
 * MCP Tools Tests
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  handleGenerateBlock,
  handleComposePage,
  handleApplyInspiration,
  handleSuggestBlocks,
  handleGenerateMarketingSite,
  GENERATE_BLOCK_TOOL,
  COMPOSE_PAGE_TOOL,
  APPLY_INSPIRATION_TOOL,
  SUGGEST_BLOCKS_TOOL,
  GENERATE_MARKETING_SITE_TOOL,
  NEW_TOOLS,
} from '../../src/mcp/tools';
import { registerDefaultBlocks } from '../../src/blocks';

// Initialize block registry before tests
beforeAll(() => {
  registerDefaultBlocks();
});

describe('MCP Tools', () => {
  describe('tool definitions', () => {
    it('should export all tool definitions', () => {
      expect(GENERATE_BLOCK_TOOL).toBeDefined();
      expect(COMPOSE_PAGE_TOOL).toBeDefined();
      expect(APPLY_INSPIRATION_TOOL).toBeDefined();
      expect(SUGGEST_BLOCKS_TOOL).toBeDefined();
      expect(GENERATE_MARKETING_SITE_TOOL).toBeDefined();
    });

    it('NEW_TOOLS should contain all 5 tools', () => {
      expect(NEW_TOOLS.length).toBe(5);
    });

    it('each tool should have required properties', () => {
      for (const tool of NEW_TOOLS) {
        expect(tool.name).toBeDefined();
        expect(tool.description).toBeDefined();
        expect(tool.inputSchema).toBeDefined();
        expect(tool.inputSchema.type).toBe('object');
      }
    });
  });

  describe('generate_block', () => {
    it('should generate a hero block', async () => {
      const result = await handleGenerateBlock({
        block_type: 'hero',
        variant: 'centered',
        context: 'marketing',
      });

      expect(result).toBeDefined();
      expect(result.code).toContain('export');
      expect(result.component_name).toBeDefined();
      expect(result.file_name).toBeDefined();
      expect(result.block_type).toBe('hero');
      expect(result.variant).toBe('centered');
    });

    it('should generate a sidebar block', async () => {
      const result = await handleGenerateBlock({
        block_type: 'sidebar',
        variant: 'collapsible',
        context: 'product',
      });

      expect(result).toBeDefined();
      expect(result.code).toContain('export');
      expect(result.component_name).toBeDefined();
    });

    it('should accept tuner values', async () => {
      const result = await handleGenerateBlock({
        block_type: 'hero',
        tuners: {
          abstraction: 0.8,
          density: 0.3,
          motion: 0.7,
          contrast: 0.6,
          narrative: 0.5,
        },
      });

      expect(result).toBeDefined();
      expect(result.code).toContain('export');
    });

    it('should throw on invalid block type', async () => {
      await expect(
        handleGenerateBlock({
          block_type: 'invalid-block' as any,
        })
      ).rejects.toThrow();
    });
  });

  describe('compose_page', () => {
    it('should compose a landing page', async () => {
      const result = await handleComposePage({
        name: 'LandingPage',
        route: '/',
        blocks: [
          { block_type: 'navigation' },
          { block_type: 'hero', variant: 'centered' },
          { block_type: 'features', variant: 'grid' },
          { block_type: 'footer' },
        ],
        context: 'marketing',
      });

      expect(result).toBeDefined();
      expect(result.page_code).toContain('LandingPage');
      expect(result.block_components.length).toBe(4);
      expect(result.file_structure.length).toBeGreaterThan(0);
    });

    it('should compose a dashboard page', async () => {
      const result = await handleComposePage({
        name: 'DashboardPage',
        route: '/dashboard',
        blocks: [
          { block_type: 'sidebar' },
          { block_type: 'header' },
          { block_type: 'metric-cards' },
        ],
        context: 'product',
      });

      expect(result).toBeDefined();
      expect(result.page_code).toContain('DashboardPage');
      expect(result.block_components.length).toBe(3);
    });

    it('should include layout configuration', async () => {
      const result = await handleComposePage({
        name: 'TestPage',
        blocks: [{ block_type: 'hero' }],
        layout: {
          max_width: 'xl',
          spacing: 'spacious',
        },
      });

      expect(result).toBeDefined();
      expect(result.page_code).toBeDefined();
    });
  });

  describe('apply_inspiration', () => {
    it('should apply known brand inspiration', async () => {
      const result = await handleApplyInspiration({
        sources: ['linear'],
      });

      expect(result).toBeDefined();
      expect(result.profile).toBeDefined();
      expect(result.css_variables).toBeDefined();
      expect(result.tuners).toBeDefined();
      expect(result.analyzed_sources.length).toBeGreaterThan(0);
    });

    it('should apply multiple brands', async () => {
      const result = await handleApplyInspiration({
        sources: ['linear', 'stripe'],
      });

      expect(result).toBeDefined();
      expect(result.analyzed_sources.length).toBe(2);
    });

    it('should apply base tuners when no brand matches', async () => {
      const result = await handleApplyInspiration({
        sources: ['unknown-brand-xyz'],
        base_tuners: {
          abstraction: 0.9,
          density: 0.2,
        },
      });

      expect(result).toBeDefined();
      // When no brand matches, base tuners should be applied
      expect(result.tuners.abstraction).toBe(0.9);
      expect(result.tuners.density).toBe(0.2);
    });

    it('should generate CSS variables', async () => {
      const result = await handleApplyInspiration({
        sources: ['notion'],
      });

      expect(result.css_variables).toBeDefined();
      expect(result.css_variables['--color-primary']).toBeDefined();
      expect(result.css_variables['--font-heading']).toBeDefined();
    });

    it('should generate tailwind config', async () => {
      const result = await handleApplyInspiration({
        sources: ['stripe'],
      });

      expect(result.tailwind_config).toBeDefined();
      expect((result.tailwind_config as any).theme).toBeDefined();
    });
  });

  describe('suggest_blocks', () => {
    it('should suggest blocks for landing page', async () => {
      const result = await handleSuggestBlocks({
        use_case: 'landing',
        context: 'marketing',
      });

      expect(result).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
      expect(result.page_structure.length).toBeGreaterThan(0);

      // Landing page should include hero and navigation
      const blockTypes = result.suggestions.map((s) => s.block_type);
      expect(blockTypes).toContain('hero');
      expect(blockTypes).toContain('navigation');
    });

    it('should suggest blocks for dashboard', async () => {
      const result = await handleSuggestBlocks({
        use_case: 'dashboard',
        context: 'product',
      });

      expect(result).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);

      // Dashboard should include sidebar
      const blockTypes = result.suggestions.map((s) => s.block_type);
      expect(blockTypes).toContain('sidebar');
    });

    it('should suggest blocks for auth page', async () => {
      const result = await handleSuggestBlocks({
        use_case: 'auth',
      });

      expect(result).toBeDefined();
      const blockTypes = result.suggestions.map((s) => s.block_type);
      expect(blockTypes).toContain('auth');
    });

    it('should respect must_include', async () => {
      const result = await handleSuggestBlocks({
        use_case: 'landing',
        must_include: ['faq', 'pricing'],
      });

      const blockTypes = result.suggestions.map((s) => s.block_type);
      expect(blockTypes).toContain('faq');
      expect(blockTypes).toContain('pricing');
    });

    it('should respect must_exclude', async () => {
      const result = await handleSuggestBlocks({
        use_case: 'landing',
        must_exclude: ['testimonials', 'logo-cloud'],
      });

      const blockTypes = result.suggestions.map((s) => s.block_type);
      expect(blockTypes).not.toContain('testimonials');
      expect(blockTypes).not.toContain('logo-cloud');
    });

    it('should provide alternatives', async () => {
      const result = await handleSuggestBlocks({
        use_case: 'landing',
      });

      expect(result.alternatives).toBeDefined();
      expect(result.alternatives!.length).toBeGreaterThan(0);
    });

    it('should include explanation', async () => {
      const result = await handleSuggestBlocks({
        use_case: 'landing',
      });

      expect(result.explanation).toBeDefined();
      expect(result.explanation.length).toBeGreaterThan(0);
    });
  });

  describe('generate_marketing_site', () => {
    it('should generate a complete marketing site', async () => {
      // Use this project itself as the test product
      const result = await handleGenerateMarketingSite({
        product_path: process.cwd(),
        inspiration: 'linear',
      });

      expect(result).toBeDefined();
      expect(result.pages.length).toBeGreaterThan(0);
      expect(result.product_insights.name).toBeDefined();
      expect(result.inspiration_analysis.source).toBe('linear');
      expect(result.file_structure.length).toBeGreaterThan(0);
    });

    it('should extract product insights from codebase', async () => {
      const result = await handleGenerateMarketingSite({
        product_path: process.cwd(),
        inspiration: 'stripe',
      });

      expect(result.product_insights).toBeDefined();
      expect(result.product_insights.features.length).toBeGreaterThan(0);
    });

    it('should accept custom product name and description', async () => {
      const result = await handleGenerateMarketingSite({
        product_path: process.cwd(),
        inspiration: 'vercel',
        product_name: 'My Custom Product',
        product_description: 'A tool for developers',
      });

      expect(result.product_insights.name).toBe('My Custom Product');
      expect(result.product_insights.description).toBe('A tool for developers');
    });

    it('should generate blocks for all sections', async () => {
      const result = await handleGenerateMarketingSite({
        product_path: process.cwd(),
        inspiration: 'notion',
      });

      // Should have multiple blocks in the landing page
      expect(result.pages[0].blocks.length).toBeGreaterThan(5);

      // Should include key marketing sections
      const blockTypes = result.pages[0].blocks.map(b => b.block_type);
      expect(blockTypes).toContain('hero');
      expect(blockTypes).toContain('features');
    });
  });
});
