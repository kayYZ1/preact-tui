import type { Cell } from "../preact/src/types";

export class Terminal {
  stdout: typeof process.stdout;
  width: number;
  height: number;
  currentBuffer: Cell[][];
  previousBuffer: Cell[][];
  isFirstRender: boolean = true;

  constructor(stdout: typeof process.stdout = process.stdout) {
    this.stdout = stdout;
    this.width = process.stdout.columns || 80;
    this.height = process.stdout.rows || 24;
    this.currentBuffer = this.createEmptyBuffer();
    this.previousBuffer = this.createEmptyBuffer();
    this.hideCursor();
    this.clearScreen();
  }

  private createEmptyBuffer(): Cell[][] {
    return Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => ({ char: " ", style: "" }))
    );
  }

  private hideCursor() {
    this.stdout.write("\x1b[?25l");
  }

  private showCursor() {
    this.stdout.write("\x1b[?25h");
  }

  private clearScreen() {
    this.stdout.write("\x1b[2J\x1b[H");
  }

  clear() {
    this.currentBuffer = this.createEmptyBuffer();
    this.previousBuffer = this.createEmptyBuffer();
    this.isFirstRender = true;
    this.showCursor();
    this.clearScreen();
  }

  private extractStyle(str: string): { chars: string[]; styles: string[] } {
    const chars: string[] = [];
    const styles: string[] = [];

    let currentStyle = "";
    let i = 0;

    while (i < str.length) {
      const char = str[i];
      const nextChar = str[i + 1];
      if (char === "\x1b" && nextChar === "[") {
        let j = i + 2;
        while (j < str.length && str[j] !== "m") j++;
        currentStyle += str.slice(i, j + 1);
        i = j + 1;
      } else if (char !== undefined) {
        chars.push(char);
        styles.push(currentStyle);
        i++;
      } else {
        i++;
      }
    }

    return { chars, styles };
  }

  private writeToBuffer(x: number, y: number, text: string) {
    if (y < 0 || y >= this.height) return;

    const { chars, styles } = this.extractStyle(text);
    const row = this.currentBuffer[y];
    if (!row) return;

    for (let i = 0; i < chars.length; i++) {
      const col = x + i;
      const char = chars[i];
      const style = styles[i];
      if (col >= 0 && col < this.width && char !== undefined && style !== undefined) {
        row[col] = { char, style };
      }
    }
  }

  render(positions: Array<{ x: number; y: number; text: string }>) {
    this.currentBuffer = this.createEmptyBuffer();

    for (const { x, y, text } of positions) {
      this.writeToBuffer(Math.round(x), Math.round(y), text);
    }

    this.flush();
  }

  private flush() {
    let output = "";

    for (let y = 0; y < this.height; y++) {
      const currentRow = this.currentBuffer[y];
      const previousRow = this.previousBuffer[y];
      if (!currentRow || !previousRow) continue;

      for (let x = 0; x < this.width; x++) {
        const current = currentRow[x];
        const previous = previousRow[x];
        if (!current || !previous) continue;

        if (this.isFirstRender || current.char !== previous.char || current.style !== previous.style) {
          output += `\x1b[${y + 1};${x + 1}H`;
          output += current.style + current.char + "\x1b[0m";
        }
      }
    }

    if (output) {
      this.stdout.write(output);
    }

    this.previousBuffer = this.currentBuffer.map((row) => row.map((cell) => ({ ...cell })));
    this.isFirstRender = false;
  }
}
