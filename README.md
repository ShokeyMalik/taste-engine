# Taste Engine 🎨

> Context-aware design system that transforms AI-generated UIs from generic to distinctive.

**The Problem**: AI coding tools (Claude Code, Cursor, Codex) generate functional but visually generic UIs. Every app looks the same - the default shadcn + Tailwind aesthetic.

**The Solution**: Taste Engine is a design intelligence layer that understands *context* (is this a dashboard or a marketing page?), *taste* (what should this feel like?), and applies *recipes* (how should components behave?) to produce distinctive, polished UIs.

## What's New in v0.5.0

### Visual Assets Module (NEW!)
Context-aware visual asset generation - placeholders, animations, SVG optimization:
- **Placeholder Images**: Photography, gradients, patterns with industry context
- **Animation Code**: Framer Motion, GSAP, CSS, Tailwind - copy-paste ready
- **SVG Optimizer**: Pure TypeScript, no dependencies, accessibility checks
- **Pattern Generator**: 14 SVG patterns for backgrounds

### UX Context Scanner (v0.4.0)
Automatically scan your codebase to understand WHO uses your product and WHAT they need:
- **Domain Detection**: Identifies industry (hospitality, ecommerce, saas, healthcare, fintech, etc.)
- **Audience Personas**: Detects user types (admin, operator, manager, customer, developer)
- **Workflow Extraction**: Finds critical workflows and related components
- **Content Hierarchy**: Determines what content should be primary vs secondary
- **Design Guidelines**: Generates industry-specific design recommendations

### Inspiration Module (v0.3.0)
Learn from the best - extract design patterns from top products:
- **Brand Learning**: Extract patterns from Linear, Airbnb, Stripe, Notion, etc.
- **Visual Assets**: Generate hero styles, illustration patterns, data viz themes
- **Knowledge Base**: Persistent learning that improves over time
- **URL Analysis**: Analyze any website for design inspiration

## Visual Assets Quick Start

```typescript
import {
  generatePlaceholder,
  generateAnimation,
  optimizeSVG,
  generatePattern
} from 'taste-engine';

// 1. Context-aware placeholder
const hero = await generatePlaceholder({
  type: 'hero',
  style: 'photography',
  industry: 'hospitality',
  dimensions: [1920, 1080]
});
// → { url: 'https://picsum.photos/...', alt: 'Luxury hotel experience' }

// 2. Generate animation code (copy-paste ready!)
const animation = generateAnimation('logo-grid', {
  effect: 'logo-grid',
  library: 'framer-motion',
  stagger: 0.1,
  duration: 0.5
});
console.log(animation.code); // Full React component with Framer Motion

// 3. Optimize SVG
const result = optimizeSVG(rawSvg, { minify: true });
console.log(result.savings);         // 32.5 (% saved)
console.log(result.recommendations); // Accessibility/performance tips

// 4. Generate pattern background
const pattern = generatePattern({
  type: 'dots',
  opacity: 0.3,
  colors: { foreground: '#6366f1', background: '#0f172a' }
});
element.style.cssText = pattern.css; // Instant pattern background!
```

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
npm install taste-engine
```

## Quick Start

### UX Context Scanner (NEW!)

Scan your codebase to understand context before designing:

```typescript
import { createTasteEngineContext, scanUXContext, quickScan } from 'taste-engine';

// Quick scan - just get domain and primary audience
const quick = await quickScan('/path/to/your/project');
console.log(quick.domain);          // 'hospitality'
console.log(quick.primaryAudience); // 'Operator User'
console.log(quick.confidence);      // 0.73

// Full context scan
const context = await createTasteEngineContext('/path/to/your/project');

// Now you know:
console.log(context.summary.industry);         // 'hospitality'
console.log(context.summary.primaryAudience);  // 'Operator User'
console.log(context.summary.criticalWorkflows); // ['Create Booking', 'Guest Check-in', ...]
console.log(context.summary.designApproach);   // 'Warm, professional interface...'

// Design guidelines based on context
console.log(context.guidelines.colorTemperature);      // 'warm'
console.log(context.guidelines.informationDensity);    // 'medium'
console.log(context.guidelines.recommendedInspiration); // ['airbnb', 'booking.com', 'linear']
```

### Inspiration Module

Learn from external brands and generate taste profiles:

```typescript
import { inspire, generateVisualAssets } from 'taste-engine';

// Learn from multiple inspirations
const result = await inspire(['linear', 'airbnb'], 'my-product');

// Get the generated taste profile
const { profile, cssVariables, tailwindConfig } = result;

// Apply CSS variables
console.log(cssVariables);
// :root {
//   --taste-bg: #FFFFFF;
//   --taste-accent: #FF385C;
//   ...
// }

// Use component recipes
console.log(profile.recipes.button.primary);
// 'inline-flex items-center justify-center font-medium rounded-xl...'

// Generate visual asset strategies
const assets = generateVisualAssets(profile);
console.log(assets.hero.style);        // 'photography-hero'
console.log(assets.illustration.style); // 'flat-illustration'
console.log(assets.motion.level);       // 'subtle'
```

### Vanilla JavaScript/TypeScript

```typescript
import { themeEngine, chronicleDark } from 'taste-engine';

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
import { TasteProvider, useTaste, useTuners } from 'taste-engine/react';

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

## UX Context Scanner Details

The UX Scanner analyzes your codebase to extract:

### Domain Detection
Automatically identifies industry from 11 categories:
- `hospitality` - Hotels, bookings, guests
- `ecommerce` - Products, carts, orders
- `saas` - Subscriptions, teams, integrations
- `healthcare` - Patients, appointments, records
- `fintech` - Transactions, payments, accounts
- `education` - Courses, students, lessons
- `social` - Posts, feeds, messages
- `productivity` - Tasks, projects, calendars
- `developer-tools` - Repos, deployments, builds
- `marketing` - Campaigns, leads, analytics
- `crm` - Contacts, deals, pipelines

### Audience Personas
Detects user types and their characteristics:
- **Admin** - High tech-savviness, system configuration
- **Operator** - Daily operations, transaction processing
- **Manager** - Reports, analytics, decision making
- **Customer** - End users, occasional usage
- **Developer** - API access, integrations

### Design Guidelines
Industry-specific recommendations:

| Industry | Color Temp | Density | Recommended Inspirations |
|----------|------------|---------|--------------------------|
| Hospitality | Warm | Medium | airbnb, booking.com, linear |
| SaaS | Cool | Medium | linear, notion, stripe, vercel |
| Fintech | Cool | High | stripe, revolut, mercury |
| E-commerce | Neutral | High | shopify, amazon, stripe |
| Healthcare | Cool | Medium | apple, stripe |

## Known Brands & Inspirations

The engine includes pre-analyzed patterns for:

| Brand | Style | Best For |
|-------|-------|----------|
| `linear` | Clean, minimal, abstract | SaaS, dev tools |
| `airbnb` | Warm, photography-driven | Hospitality, marketplace |
| `stripe` | Polished, gradient-heavy | Fintech, payments |
| `notion` | Warm, friendly, illustrations | Productivity, docs |
| `vercel` | Ultra-minimal, typography | Dev tools, deployment |
| `figma` | Playful, colorful | Design tools, collaboration |
| `apple` | Premium, photography | Consumer, premium |
| `github` | Functional, content-focused | Dev tools, collaboration |
| `discord` | Dark, vibrant | Social, gaming |
| `spotify` | Dark, expressive | Entertainment, music |

## Themes

### Chronicle Dark (Default)
Premium dark theme with purple accent. Inspired by Linear, Raycast, and modern developer tools.

### Ops Calm
Light theme with calm blue-green tones. Designed for operational dashboards with extended use.

### Hospitality Warm
Light theme with warm amber accents. Designed for hospitality industry with a welcoming feel.

### Creating Custom Themes

```typescript
import { themeEngine } from 'taste-engine';
import type { ThemePack } from 'taste-engine';

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
node node_modules/taste-engine/dist/server/index.js
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
| `scan_ux_context` | NEW! Scans codebase for domain, audiences, workflows |
| `derive_taste_from_inspirations` | Extracts taste profile from references |
| `propose_page_plan` | Generates visual plan with archetype, sections, motifs |
| `generate_patch` | Creates file modification instructions from a plan |
| `verify_ui` | Runs visual regression and component guardrails |

### Context-Aware Design Workflow

```typescript
// 1. Scan codebase for UX context
const context = await callTool('scan_ux_context', { repoPath: '/path/to/project' });
// Returns: { domain: 'hospitality', audiences: [...], workflows: [...] }

// 2. Get design guidelines based on context
const guidelines = getDesignGuidelines(context.manifest);
// Returns: { colorTemperature: 'warm', recommendedInspiration: ['airbnb', 'linear'] }

// 3. Generate taste from recommended inspirations
const taste = await callTool('derive_taste_from_inspirations', {
  inspirations: guidelines.recommendedInspiration.map(name => ({
    type: 'reference-name',
    value: name,
    weight: 1.0
  }))
});

// 4. Generate page plan informed by context
const plan = await callTool('propose_page_plan', {
  repoMetadata: repo,
  tasteProfile: taste,
  uxContext: context, // NEW! Pass UX context for smarter decisions
  targetRoute: { path: '/dashboard', intent: 'product' }
});

// 5. Generate patches
const patches = await callTool('generate_patch', { plan, repoMetadata: repo });
```

## API Reference

### UX Scanner

- `UXContextScanner` - Class for scanning codebases
- `scanUXContext(repoPath)` - Full UX context scan
- `quickScan(repoPath)` - Fast domain/audience detection
- `getDesignGuidelines(manifest)` - Get industry-specific recommendations
- `createTasteEngineContext(repoPath)` - Complete context package

### Inspiration

- `inspire(brands[], name)` - Learn from brands and generate profile
- `learnFromInspirations(sources[])` - Extract patterns from sources
- `generateVisualAssets(profile)` - Generate asset strategies
- `analyzeURL(url)` - Analyze any website
- `getKnowledgeBase()` - Access persistent learning

### Core

- `ThemeEngine` - Class for managing themes
- `themeEngine` - Default singleton instance
- `normalizeThemePack()` - Transform legacy theme packs

### Types

- `ThemePack` - Complete theme definition
- `ThemeTokens` - Color, typography, density tokens
- `ProductRecipes` - Recipes for product context
- `MarketingRecipes` - Recipes for marketing context
- `UXContextManifest` - Full UX context from scanner
- `TasteEngineContext` - Context + guidelines package

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

### Two Modes of Operation

1. **Interactive Mode**: User provides inputs through UI (brand inspirations, industry, audience)
2. **MCP Mode**: Automatically scans codebase to understand context

Both modes produce the same output: a taste profile that guides design decisions.

## Changelog

### v0.5.0 (2024-12-18)
- **NEW**: Visual Assets Module
  - `generatePlaceholder()` - Context-aware placeholder images
  - `generateAnimation()` - Animation code for Framer Motion, GSAP, CSS, Tailwind
  - `optimizeSVG()` - Pure TypeScript SVG optimizer
  - `generatePattern()` - 14 SVG pattern types

### v0.4.0 (2024-12-18)
- **NEW**: UX Context Scanner for codebase analysis
- **NEW**: Domain/industry detection (11 industries)
- **NEW**: Audience persona extraction
- **NEW**: Workflow and content hierarchy extraction
- **NEW**: Design guidelines based on industry context
- **NEW**: `createTasteEngineContext()` for complete context package

### v0.3.0 (2024-12-17)
- **NEW**: Inspiration module with brand learning
- **NEW**: Visual asset generation
- **NEW**: URL analysis for any website
- **NEW**: Persistent knowledge base
- **NEW**: Selective inspiration merging

### v0.2.0 (2024-12-16)
- Visual MCP Contract types
- MCP Server implementation
- Built-in themes

### v0.1.0 (2024-12-15)
- Initial release
- Theme engine core
- 5-tuner system
- React hooks

## License

MIT © 2024 Shokey Malik
