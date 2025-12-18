# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-12-18

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

- **MCP Server**
  - `analyze_repo_ui` - Detect UI stack and framework
  - `derive_taste_from_inspirations` - Extract taste profiles
  - `propose_page_plan` - Generate page plans
  - `generate_patch` - Create file modifications
  - `verify_ui` - Run visual regression checks
  - 10 known references (linear, stripe, vercel, notion, figma, apple, github, airbnb, chronicle, raycast)

- **Visual MCP Contract Types**
  - `VisualMCPInput` / `VisualMCPOutput` interfaces
  - `TasteProfile` for inspiration blending
  - `Plan` for page structure
  - `PatchInstructions` for file modifications
  - Type guards and validation helpers

### Documentation

- Comprehensive README with usage examples
- MCP server integration guide
- Claude Desktop configuration
- Custom theme creation guide
