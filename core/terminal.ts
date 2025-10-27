export class Terminal {
	stdout: Bun.BunFile;
	width: number;
	height: number;
	buffer: string[][] = [];
	lines: string[] = [];

	constructor(stdout: Bun.BunFile = Bun.stdout) {
		this.stdout = stdout;
		this.width = process.stdout.columns || 80;
		this.height = process.stdout.rows || 24;
		this.clear();
	}

	clear() {
		this.buffer = Array.from({ length: this.height }, () =>
			Array.from({ length: this.width }, () => " "),
		);
		this.lines = this.buffer.map((row) => row.join(""));
		this.stdout.write("\x1b[2J\x1b[H");
	}

	render(positions: Array<{ x: number; y: number; text: string }>) {
		// Reset buffer
		this.buffer = Array.from({ length: this.height }, () =>
			Array.from({ length: this.width }, () => " "),
		);
		for (const { x, y, text } of positions) {
			for (let i = 0; i < text.length && x + i < this.width && y < this.height; i++) {
				this.buffer[y][x + i] = text.charAt(i);
			}
		}
		const newLines = this.buffer.map((row) => row.join(""));
		let delta = "";
		const maxHeight = Math.max(newLines.length, this.lines.length);
		for (let i = 0; i < maxHeight; i++) {
			const newLine = (newLines[i] || "").padEnd(this.width, " ");
			const oldLine = (this.lines[i] || "").padEnd(this.width, " ");
			if (newLine !== oldLine) {
				delta += `\x1b[${i + 1};1H${newLine}`; // Move to row, write
				if (!newLines[i]) delta += "\x1b[K"; // Clear to EOL if line empty
			}
		}
		if (delta) this.stdout.write(delta);
		this.lines = newLines.map((line) => line.padEnd(this.width, " "));
	}
}
