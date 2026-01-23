# AGENTS.md - AI Agent

AI agent implementation that uses the TUI framework for its terminal interface.

## Status

🚧 **Not yet implemented** - This package is a placeholder for the future agent.

## Planned Architecture

```
agent/
├── index.ts              # Agent entry point
├── core/                 # Core agent logic
│   ├── agent.ts          # Main agent class
│   ├── context.ts        # Conversation context management
│   └── tools/            # Tool implementations
├── providers/            # LLM provider integrations
│   └── ...
└── ui/                   # TUI components for the agent
    └── ...               # Uses ../tui for rendering
```

## Integration with TUI

The agent will import from the sibling `tui/` package:

```typescript
import { Box, run, Text, useSignal } from "../tui";
```

## Getting Started

When implementing the agent:

1. Define the agent's core loop in `core/agent.ts`
2. Create UI components in `ui/` using the TUI framework
3. Add tool implementations in `core/tools/`
4. Wire up LLM providers in `providers/`
