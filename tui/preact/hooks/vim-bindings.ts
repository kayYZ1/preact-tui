import type { Signal } from "@preact/signals-core";
import type { KeyEvent } from "../../core/input";
import { deleteForward, moveCursor, setCursor, type TextState } from "./text-utils";

export type VimMode = "NORMAL" | "INSERT";

export interface VimContext {
  state: TextState;
  mode: Signal<VimMode>;
  onChange?: (value: string) => void;
  onModeChange?: (mode: VimMode) => void;
}

export function handleNormalMode(event: KeyEvent, ctx: VimContext): boolean {
  const { state, mode, onChange, onModeChange } = ctx;
  const value = state.value.value;
  const cursor = state.cursorPosition.value;

  const enterInsert = (cursorDelta = 0) => {
    mode.value = "INSERT";
    onModeChange?.("INSERT");
    if (cursorDelta) moveCursor(state, cursorDelta);
  };

  switch (event.key) {
    case "i":
      enterInsert();
      return true;
    case "a":
      enterInsert(cursor < value.length ? 1 : 0);
      return true;
    case "A":
      mode.value = "INSERT";
      onModeChange?.("INSERT");
      setCursor(state, value.length);
      return true;
    case "I":
      mode.value = "INSERT";
      onModeChange?.("INSERT");
      setCursor(state, 0);
      return true;
    case "h":
      moveCursor(state, -1);
      return true;
    case "l":
      if (cursor < value.length - 1) moveCursor(state, 1);
      return true;
    case "0":
      setCursor(state, 0);
      return true;
    case "$":
      setCursor(state, Math.max(0, value.length - 1));
      return true;
    case "w": {
      const rest = value.slice(cursor);
      const match = rest.match(/^\s*\S*\s*/);
      if (match?.[0]) {
        setCursor(state, Math.min(cursor + match[0].length, value.length - 1));
      }
      return true;
    }
    case "b": {
      const before = value.slice(0, cursor);
      const match = before.match(/\S+\s*$/);
      setCursor(state, match ? cursor - match[0].length : 0);
      return true;
    }
    case "x": {
      const newValue = deleteForward(state);
      if (newValue !== null) {
        onChange?.(newValue);
        if (cursor >= newValue.length && cursor > 0) {
          moveCursor(state, -1);
        }
      }
      return true;
    }
    default:
      return false;
  }
}

export function handleEscape(ctx: VimContext): boolean {
  const { state, mode, onModeChange } = ctx;
  mode.value = "NORMAL";
  onModeChange?.("NORMAL");
  moveCursor(state, -1);
  return true;
}
