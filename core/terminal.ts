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
		this.buffer = Array.from({ length: this.height }, () => Array.from({ length: this.width }, () => " "));
		this.lines = this.buffer.map((row) => row.join(""));
		this.stdout.write("\x1b[2J\x1b[H");
	}

	render(positions: Array<{ x: number; y: number; text: string }>) {
		this.stdout.write("\x1b[2J\x1b[H"); // Clear screen and move to top-left
		for (const { x, y, text } of positions) {
			this.stdout.write(`\x1b[${y + 1};${x + 1}H${text}`);
		}
	}
}
