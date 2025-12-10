# AGENTS.md

## Build/Lint/Test Commands

- Install dependencies: `bun install`
- Run the project: `bun run index.ts`
- No lint or test scripts defined yet; add them to package.json as needed.
- For a single test (if added): Use a test runner like Jest or Vitest, e.g., `bun test <test-file>`.

## Code Style Guidelines

- **Language**: TypeScript with strict mode enabled.
- **Imports**: Use ES modules; prefer relative imports for local files.
- **Formatting**: Follow Prettier defaults if added; otherwise, use consistent indentation (2 spaces).
- **Types**: Explicit types required; use interfaces for objects, enums for constants.
- **Naming Conventions**: camelCase for variables/functions; PascalCase for classes/types; UPPER_CASE for constants.
- **Error Handling**: Use try-catch for async operations; throw custom errors with meaningful messages.
- **JSX**: Use React JSX syntax for components.
- **Best Practices**: No unused variables; strict null checks; prefer const over let.

This is a minimal Bun-based project; expand as features grow.
