# AGENTS.md - TUI Framework

A Preact-based terminal UI framework that uses Yoga layout engine for flexbox positioning and ANSI escape codes for rendering.

## Architecture Overview

```
tui/
├── index.ts              # Public API exports
├── core/                 # Low-level terminal handling
│   ├── terminal.ts       # Terminal buffer, rendering, cursor control
│   └── primitives/       # Drawing primitives
│       ├── draw-box.ts   # Box/border rendering with styles
│       └── format-text.ts# Text styling (bold, italic, colors)
├── preact/               # Preact integration layer
│   ├── renderer.ts       # Custom Preact renderer with Yoga layout
│   ├── components.tsx    # Box and Text components
│   ├── hooks.ts          # useSignal, useSignalEffect hooks
│   ├── elements/         # Element handlers for rendering
│   │   ├── index.ts      # Element registry
│   │   ├── box.ts        # Box element renderer
│   │   └── text.ts       # Text element renderer
│   └── src/
│       └── types.ts      # TypeScript type definitions
└── playground/           # Example apps
    ├── counter.tsx       # Simple counter with signals
    ├── clock.tsx         # Real-time clock display
    ├── layout.tsx        # Complex layout example
    └── spinner.tsx       # Loading spinner animation
```

## Key Concepts

### Rendering Pipeline

1. **VNode Creation**: Preact components return VNodes (`<Box>`, `<Text>`)
2. **Instance Tree**: `Renderer.createInstanceTree()` converts VNodes to Instance objects with Yoga nodes
3. **Layout Calculation**: Yoga calculates positions using flexbox algorithm
4. **Element Rendering**: Element handlers (`boxElement`, `textElement`) convert instances to Position arrays
5. **Terminal Output**: `Terminal.render()` writes positions to a double-buffered character grid
6. **Differential Flush**: Only changed cells are written to stdout (ANSI cursor positioning)

### Core Classes

#### `Terminal` (core/terminal.ts)
- Double-buffered rendering for flicker-free updates
- Manages character grid with styles per cell
- Handles ANSI escape sequences for cursor, colors, styles
- Methods: `render(positions)`, `clear()`

#### `Renderer` (preact/renderer.ts)
- Bridges Preact VNodes to terminal output
- Creates Yoga layout tree from component tree
- Uses `@preact/signals` effect() for reactive re-rendering
- Methods: `render(createVNode)`, `unmount()`

### Signals Integration

The framework uses `@preact/signals` for reactivity:
- `useSignal(initialValue)` - Creates a persistent signal (cached by component/hook index)
- `useSignalEffect(fn)` - Runs effect when signals change, with cleanup support
- Signals trigger automatic re-renders when `.value` changes

### Layout System (Yoga)

Supports flexbox properties on `<Box>`:
- `flex`, `flexDirection` (row/column/row-reverse/column-reverse)
- `justifyContent`, `alignItems`
- `gap`, `padding`
- `width`, `height`
- `border` (straight/dash), `borderWidth`, `borderColor`

### Styling

Text styling via `<Text>` props:
- `color` - Any color Bun.color() supports
- `bold`, `italic`, `underline`, `strikethrough`

## Public API (tui/index.ts)

```typescript
// Components
export { Box, Text } from "./preact/components";

// Rendering
export { render, run } from "./preact/renderer";
export { Terminal } from "./core/terminal";

// Signals (re-exported from @preact/signals)
export { signal, computed, effect, batch } from "@preact/signals";

// Hooks
export { useSignal, useSignalEffect } from "./preact/hooks";

// Types
export type { BoxProps, TextProps, Instance } from "./preact/src/types";
```

## Adding New Features

### New Component Property
1. Add prop to type in `preact/src/types.ts`
2. Handle in `Renderer.createInstanceTree()` (set Yoga node properties)
3. Handle in element handler (`elements/box.ts` or `elements/text.ts`)

### New Primitive
1. Create file in `core/primitives/`
2. Return `Position[]` array for terminal rendering
3. Use in element handlers

### New Element Type
1. Add type to `Instance` union in `types.ts`
2. Create element handler in `preact/elements/`
3. Register in `preact/elements/index.ts`

## Code Patterns

- Element handlers are pure functions: `(instance, context) => Position[]`
- Hooks use global index tracking (reset per render cycle)
- Use `Bun.color(colorName, "ansi")` for color conversion
- All coordinates are integer character positions
