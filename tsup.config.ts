import { defineConfig } from 'tsup';

export default defineConfig([
  // Library build
  {
    entry: {
      index: 'src/index.ts',
      'mcp/index': 'src/mcp/index.ts',
      'react/index': 'src/react/index.tsx',
    },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    external: ['react', 'react-dom'],
    esbuildOptions(options) {
      options.banner = {
        js: '/* @taste-engine/core - Context-aware design system */',
      };
    },
  },
  // MCP Server build (standalone executable)
  {
    entry: {
      'server/index': 'src/server/index.ts',
    },
    format: ['esm'],
    dts: false,
    splitting: false,
    sourcemap: true,
    treeshake: true,
    platform: 'node',
    target: 'node18',
    external: ['@modelcontextprotocol/sdk'],
    esbuildOptions(options) {
      options.banner = {
        js: '#!/usr/bin/env node\n/* Taste Engine MCP Server */',
      };
    },
  },
]);
