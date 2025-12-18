# Contributing to Taste Engine

Thank you for your interest in contributing to Taste Engine! This document provides guidelines for contributing.

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/ShokeyMalik/taste-engine.git
cd taste-engine
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run in watch mode during development:
```bash
npm run dev
```

## Project Structure

```
taste-engine/
├── src/
│   ├── core/           # Theme engine and types
│   ├── mcp/            # MCP contract types
│   ├── react/          # React bindings
│   ├── server/         # MCP server
│   ├── themes/         # Built-in themes
│   └── tuners/         # Tuner system
├── dist/               # Built output
└── package.json
```

## Making Changes

### Adding a New Theme

1. Create a new file in `src/themes/`:
```typescript
// src/themes/my-theme.ts
import type { ThemeDefinition } from '../core/types';

export const myTheme: ThemeDefinition = {
  name: 'My Theme',
  mode: 'dark', // or 'light'
  tokens: {
    // Define your tokens
  },
  recipes: {
    // Define your recipes
  },
};
```

2. Export it from `src/themes/index.ts`

3. Add it to the main exports in `src/index.ts`

### Adding a New Reference Profile

Edit `src/server/index.ts` and add to the `KNOWN_REFERENCES` object:

```typescript
const KNOWN_REFERENCES: Record<string, TasteProfile> = {
  // ... existing references
  myapp: {
    abstraction: 0.5,
    restraint: 0.6,
    density: 0.5,
    motion: 0.4,
    contrast: 0.5,
    narrative: 0.5,
    motifPreference: ['lines', 'dots'],
    typographyLooseness: 0.4,
    colorTemperature: 'warm',
    surfaceComplexity: 0.5,
  },
};
```

### Adding a New MCP Tool

1. Add the tool definition to the `TOOLS` array in `src/server/index.ts`
2. Implement the tool function
3. Add the case to the request handler switch statement
4. Update the README with documentation

## Code Style

- Use TypeScript for all code
- Follow existing patterns in the codebase
- Add JSDoc comments for public APIs
- Keep functions focused and small

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type check
npm run typecheck
```

## Commit Messages

Use clear, descriptive commit messages:
- `feat: Add new theme "Ocean Blue"`
- `fix: Correct tuner URL parsing`
- `docs: Update MCP server documentation`
- `refactor: Simplify theme engine normalization`

## Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests and type checking
5. Commit your changes
6. Push to your fork
7. Open a pull request

## Questions?

Open an issue on GitHub or reach out to the maintainers.
