# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2024-12-18

### Added

- **UX Context Scanner** - NEW module for codebase analysis
  - `UXContextScanner` class for scanning codebases
  - `scanUXContext()` - Full UX context extraction
  - `quickScan()` - Fast domain/audience detection
  - Domain detection for 11 industries (hospitality, ecommerce, saas, healthcare, fintech, education, social, productivity, developer-tools, marketing, crm)
  - Audience persona extraction (admin, operator, manager, customer, developer)
  - Workflow extraction based on industry patterns
  - Content hierarchy building (primary/secondary/tertiary)
  - Existing pattern detection (layouts, components, navigation)

- **Design Guidelines Generation**
  - `getDesignGuidelines()` - Industry-specific recommendations
  - Color temperature recommendations per industry
  - Information density recommendations
  - Recommended/avoid inspiration lists per industry
  - Component prioritization based on detected patterns
  - Layout recommendations (power-user, guided, standard)

- **Context Integration**
  - `createTasteEngineContext()` - Complete context package
  - `TasteEngineContext` type for full context + guidelines
  - Design approach generation based on industry
  - Primary interaction mode detection (read, input, mixed)

### Changed

- Updated README with comprehensive UX Scanner documentation
- Added industry comparison tables
- Added context-aware design workflow examples

## [0.3.0] - 2024-12-17

### Added

- **Inspiration Module** - Learn from external brands
  - `inspire()` - Main function to learn from brands and generate profiles
  - `learnFromInspirations()` - Extract patterns from multiple sources
  - `createTransformer()` - Create transformation engine from profile
  - `InspirationScanner` - Scan and extract design language
  - `PatternLearner` - Learn patterns from multiple sources
  - `TransformationEngine` - Apply learned patterns

- **Visual Asset Generation**
  - `generateVisualAssets()` - Generate asset strategies from profile
  - `VisualAssetGenerator` class
  - Hero styles (photography, abstract, gradient, illustration)
  - Illustration styles (flat, 3d, hand-drawn, isometric)
  - Data visualization themes
  - Motion/animation recipes
  - Photography guidelines

- **URL Analysis**
  - `analyzeURL()` - Analyze any website for design patterns
  - `URLAnalyzer` class
  - Extract colors, typography, spacing from live sites

- **Selective Inspirations**
  - `mergeSelectiveInspirations()` - Cherry-pick specific aspects
  - `SelectiveInspirationMerger` class
  - Pick colors from one brand, typography from another

- **Knowledge Base** - Persistent learning
  - `InspirationKnowledgeBase` - Store learned inspirations
  - `SmartInspirationResolver` - Resolve from cache or learn
  - `learnInspiration()` / `getLearnedInspiration()` - Convenience functions
  - `getKnowledgeStats()` - View learning statistics
  - Filesystem-based persistence

- **Known Brands**
  - `KNOWN_BRANDS` constant with pre-analyzed patterns
  - linear, stripe, vercel, notion, figma, apple, github, airbnb, discord, spotify

## [0.2.0] - 2024-12-16

### Added

- **MCP Server** - Model Context Protocol integration
  - `analyze_repo_ui` tool
  - `derive_taste_from_inspirations` tool
  - `propose_page_plan` tool
  - `generate_patch` tool
  - `verify_ui` tool

- **Visual MCP Contract Types**
  - Complete TypeScript types for AI integration
  - Input/output interfaces
  - Type guards and validators

## [0.1.0] - 2024-12-15

### Added

- Initial release of Taste Engine
- **Core Theme System**
  - `ThemeEngine` class for managing themes
  - Theme tokens (colors, typography, density, shadows, radii)
  - Context-aware recipes (product vs marketing)
  - `normalizeThemePack()` for legacy theme support

- **5-Tuner System**
  - `abstraction` - Motif intensity, signal complexity
  - `density` - Gaps, spacing, table density
  - `motion` - Animations, transitions, hover effects
  - `contrast` - Border opacity, text muted levels
  - `narrative` - Section spacing, hero prominence
  - URL parameter sync support
  - CSS override generation

- **Built-in Themes**
  - Chronicle Dark - Premium dark theme with purple accent
  - Ops Calm - Light theme with calm blue-green tones
  - Hospitality Warm - Light theme with warm amber accents

- **React Bindings**
  - `TasteProvider` - Context provider with theme management
  - `useTaste()` - Access current theme and recipes
  - `useRecipes()` - Access context-specific recipes
  - `useTokens()` - Access current theme tokens
  - `useTuners()` - Manage tuner state with URL sync
  - `useIsDarkMode()` - Check current theme mode

### Documentation

- Comprehensive README with usage examples
- MCP server integration guide
- Claude Desktop configuration
- Custom theme creation guide
