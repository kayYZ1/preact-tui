import type { Instance } from "../src/types";

export function renderBox(
  instance: Instance,
  renderInstance: (
    inst: Instance,
  ) => Array<{ x: number; y: number; text: string }>,
): Array<{ x: number; y: number; text: string }> {
  const positions: Array<{ x: number; y: number; text: string }> = [];
  for (const child of instance.children) {
    positions.push(...renderInstance(child));
  }
  return positions;
}
