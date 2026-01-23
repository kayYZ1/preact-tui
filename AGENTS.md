# AGENTS.md - Root (Monorepo)

Repo for [..Insert name] coding agent with custom tui

## Repository Structure

```
├── tui/          # Preact-based TUI framework (see tui/AGENTS.md)
├── agent/        # AI Agent implementation (see agent/AGENTS.md)
├── deno.json     # Deno configuration with tasks and import maps
```

## Build/Run Commands

- **Format code**: `deno task fmt`
- **Check formatting**: `deno task fmt:check`
- **Lint**: `deno task lint`
- **Run tests**: `deno task test`

### TUI Commands

- `deno run --allow-all tui/playground/agent.tsx` - Run agent playground

## Code Style Guidelines

- **Language**: TypeScript with strict mode
- **Runtime**: Deno
- **Formatting**: deno fmt (tabs, 120 line width, double quotes)
- **Imports**: ES modules with `.ts` extensions and `@/` path alias
- **Naming**: camelCase for variables/functions, PascalCase for types/classes, UPPER_CASE for constants

## Sub-package Guidelines

Each sub-package (`tui/`, `agent/`) has its own AGENTS.md with package-specific details. Refer to those for architecture
and implementation guidance.
