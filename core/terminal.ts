export class Terminal {
  stdout: Bun.BunFile;
  width: number;
  height: number;
  lines: string[] = [];

  constructor(stdout: Bun.BunFile = Bun.stdout) {
    this.stdout = stdout;
    this.width = process.stdout.columns || 80;
    this.height = process.stdout.rows || 24;
    this.clear();
  }

  clear() {
    this.lines = Array(this.height).fill("".repeat(this.width));
    this.stdout.write("\x1b[2J\x1b[H");
  }

  render(lines: string[]) {
    let delta = "";
    const maxHeight = Math.max(lines.length, this.lines.length);
    for (let i = 0; i < maxHeight; i++) {
      const newLine = (lines[i] || "").padEnd(this.width, " ");
      if (newLine !== this.lines[i]) {
        delta += `\x1b[${i + 1};1H${newLine}`; // Move to row, write
        if (!lines[i]) delta += "\x1b[K"; // Clear to EOL if line empty
      }
    }
    if (delta) this.stdout.write(delta);
    this.lines = lines.map((line) => line.padEnd(this.width, " "));
  }
}
