# AGENTS.md - Root (Monorepo)

Repo for [..Insert name] coding agent with custom tui

## Repository Structure

```
├── tui/          # Preact-based TUI framework (see tui/AGENTS.md)
├── agent/        # AI Agent implementation (see agent/AGENTS.md)
├── package.json  # Root package.json with shared dependencies
└── tsconfig.json # Shared TypeScript configuration
```

## Build/Run Commands

- **Install dependencies**: `bun install`
- **Format code**: `bun run biome:write`

### TUI Commands
- `bun run tui:playground:counter` - Run counter example
- `bun run tui:playground:clock` - Run clock example
- `bun run tui:playground:layout` - Run layout example
- `bun run tui:playground:spinner` - Run spinner example

## Code Style Guidelines

- **Language**: TypeScript with strict mode
- **Runtime**: Bun
- **Formatting**: Biome
- **Imports**: ES modules with relative imports for local files
- **Naming**: camelCase for variables/functions, PascalCase for types/classes, UPPER_CASE for constants

## Sub-package Guidelines

Each sub-package (`tui/`, `agent/`) has its own AGENTS.md with package-specific details. Refer to those for architecture and implementation guidance.
