# Taste Engine 🎨

> Context-aware design system that transforms AI-generated UIs from generic to distinctive.

**The Problem**: AI coding tools (Claude Code, Cursor, Codex) generate functional but visually generic UIs. Every app looks the same - the default shadcn + Tailwind aesthetic.

**The Solution**: Taste Engine is a design intelligence layer that understands *context* (is this a dashboard or a marketing page?), *taste* (what should this feel like?), and applies *recipes* (how should components behave?) to produce distinctive, polished UIs.

## Features

- **Context-Aware Recipes**: Same component, different behavior based on page intent
  - `product`: Dense, operational, restrained accent
  - `marketing`: Expressive, narrative, accent can breathe

- **5-Tuner System**: Adjust visual feel without writing code
  - `abstraction`: Motif intensity, signal complexity, background layers
  - `density`: Gaps, maxWidth, table density, surface padding
  - `motion`: Path draw, card expansion, hover glow
  - `contrast`: Border opacity, text muted levels
  - `narrative`: Section spacing, hero height, ribbon prominence

- **Visual MCP Contract**: Types for AI integration (Claude Code, Cursor, etc.)

- **Built-in Themes**: Chronicle Dark, Ops Calm, Hospitality Warm

## Installation

```bash
npm install @taste-engine/core
```

## Quick Start

### Vanilla JavaScript/TypeScript

```typescript
import { themeEngine, chronicleDark } from '@taste-engine/core';

// Register and apply a theme
themeEngine.registerTheme(chronicleDark);
const theme = themeEngine.loadTheme('chronicle-dark');
if (theme) {
  themeEngine.applyTheme(theme, 'product');
}

// Access recipes for styling components
const recipes = themeEngine.getRecipesForContext(theme, 'product');
console.log(recipes.StatCard); // { style: 'minimal', accentMode: 'none', ... }
```

### React

```tsx
import { TasteProvider, useTaste, useTuners } from '@taste-engine/core/react';

function App() {
  return (
    <TasteProvider defaultTheme="chronicle-dark" useUrlParam>
      <Dashboard />
    </TasteProvider>
  );
}

function Dashboard() {
  const { recipes, isDarkMode, setTheme } = useTaste();
  const { tuners, setTuner } = useTuners();

  return (
    <div>
      {/* Use recipes for component styling */}
      <StatCard
        style={recipes.StatCard.style}
        accentElement={recipes.StatCard.accentElement}
      />

      {/* Adjust tuners for instant visual changes */}
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={tuners.density}
        onChange={(e) => setTuner('density', parseFloat(e.target.value))}
      />
    </div>
  );
}
```

## Themes

### Chronicle Dark (Default)
Premium dark theme with purple accent. Inspired by Linear, Raycast, and modern developer tools.

### Ops Calm
Light theme with calm blue-green tones. Designed for operational dashboards with extended use.

### Hospitality Warm
Light theme with warm amber accents. Designed for hospitality industry with a welcoming feel.

### Creating Custom Themes

```typescript
import { themeEngine } from '@taste-engine/core';
import type { ThemePack } from '@taste-engine/core';

const myTheme: Partial<ThemePack> & { name: string; mode: 'dark'; tokens: ThemePack['tokens'] } = {
  name: 'My Custom Theme',
  mode: 'dark',
  tokens: {
    bg: '222 47% 5%',
    surface: '220 35% 8%',
    // ... other tokens
  },
  recipes: {
    StatCard: {
      style: 'accent',
      accentMode: 'perCard',
      // ... other recipe options
    },
    // ... other recipes
  },
};

themeEngine.registerTheme(myTheme);
```

## MCP Server

Taste Engine includes a Model Context Protocol (MCP) server that integrates with Claude Code, Cursor, and other AI coding tools.

### Running the MCP Server

```bash
# After installing the package
npx taste-engine-mcp

# Or run directly
node node_modules/@taste-engine/core/dist/server/index.js
```

### Connecting to Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "taste-engine": {
      "command": "npx",
      "args": ["taste-engine-mcp"]
    }
  }
}
```

### Available Tools

| Tool | Description |
|------|-------------|
| `analyze_repo_ui` | Detects UI stack, framework, CSS solution, component library |
| `derive_taste_from_inspirations` | Extracts taste profile from references (linear, stripe, vercel, etc.) |
| `propose_page_plan` | Generates visual plan with archetype, sections, motifs |
| `generate_patch` | Creates file modification instructions from a plan |
| `verify_ui` | Runs visual regression and component guardrails |

### Known References

The server includes taste profiles for:
- `linear` - Clean, abstract, minimal
- `stripe` - Polished, gradient-heavy
- `vercel` - Ultra-minimal, typography-focused
- `notion` - Warm, illustration-friendly
- `figma` - Playful, colorful
- `apple` - Premium, photography-driven
- `github` - Functional, content-focused
- `airbnb` - Warm, photography-driven
- `chronicle` - Abstract, dot-pattern, cool
- `raycast` - Minimal, blur effects

### Example Workflow

```typescript
// 1. Analyze the repo
const repo = await callTool('analyze_repo_ui', { repoPath: '/path/to/project' });

// 2. Derive taste from inspirations
const taste = await callTool('derive_taste_from_inspirations', {
  inspirations: [
    { type: 'reference-name', value: 'linear', weight: 1.0 },
    { type: 'reference-name', value: 'stripe', weight: 0.5 }
  ]
});

// 3. Generate a page plan
const plan = await callTool('propose_page_plan', {
  repoMetadata: repo,
  tasteProfile: taste,
  targetRoute: { path: '/dashboard', intent: 'product' },
  tuners: { abstraction: 0.7, density: 0.4 }
});

// 4. Generate patches (review before applying!)
const patches = await callTool('generate_patch', { plan, repoMetadata: repo });
```

## Visual MCP Contract

For programmatic AI integration, Taste Engine exports TypeScript types:

```typescript
import type {
  VisualMCPInput,
  VisualMCPOutput,
  TasteProfile
} from '@taste-engine/core/mcp';

// Input to Visual MCP
const input: VisualMCPInput = {
  repo: { stack: 'react', hasTailwind: true, hasShadcn: true, ... },
  targets: [{ path: '/dashboard', operation: 'enhance', ... }],
  pageContext: { context: 'product' },
  inspirations: [{ type: 'reference-name', referenceName: 'linear' }],
  tuners: { abstraction: 0.7, density: 0.5 },
};

// Output from Visual MCP
const output: VisualMCPOutput = {
  contractVersion: '1.0.0',
  tasteProfile: { abstraction: 0.7, restraint: 0.6, ... },
  plan: { themePack: 'chronicle-dark', archetype: 'dashboard', ... },
  patchInstructions: { patches: [...], affectedFiles: [...] },
  // ...
};
```

## API Reference

### Core

- `ThemeEngine` - Class for managing themes
- `themeEngine` - Default singleton instance
- `normalizeThemePack()` - Transform legacy theme packs

### Types

- `ThemePack` - Complete theme definition
- `ThemeTokens` - Color, typography, density tokens
- `ProductRecipes` - Recipes for product context
- `MarketingRecipes` - Recipes for marketing context

### Tuners

- `applyTuners()` - Apply tuner values and get CSS overrides
- `parseTunersFromURL()` - Parse tuners from URL params
- `tunersToURLParams()` - Serialize tuners to URL params

### React

- `TasteProvider` - React context provider
- `useTaste()` - Access theme context
- `useRecipes()` - Access current recipes
- `useTokens()` - Access current tokens
- `useTuners()` - Manage tuner state with URL sync

## Philosophy

> "The difference between a good interface and a great one isn't features—it's taste."

Taste Engine emerged from a simple observation: AI coding tools are incredibly productive, but they lack aesthetic judgment. They don't know that a dashboard should feel dense and operational while a landing page should feel expansive and narrative.

We encode this knowledge as **recipes**—not rigid rules, but flexible patterns that adapt to context. The result is a system where AI can generate UIs that don't just work, but *feel right*.

## License

MIT © 2024 Shokey Malik
