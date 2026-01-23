const BASIC_COLORS: Record<string, string> = {
	black: "\x1b[30m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
	gray: "\x1b[90m",
	grey: "\x1b[90m",
};

const BRIGHT_COLORS: Record<string, string> = {
	brightblack: "\x1b[90m",
	brightred: "\x1b[91m",
	brightgreen: "\x1b[92m",
	brightyellow: "\x1b[93m",
	brightblue: "\x1b[94m",
	brightmagenta: "\x1b[95m",
	brightcyan: "\x1b[96m",
	brightwhite: "\x1b[97m",
};

function hexToRgb(hex: string): [number, number, number] | null {
	const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
	if (!match) return null;
	return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
}

export function toAnsi(color: string): string | null {
	const lower = color.toLowerCase();

	if (BASIC_COLORS[lower]) {
		return BASIC_COLORS[lower];
	}

	if (BRIGHT_COLORS[lower]) {
		return BRIGHT_COLORS[lower];
	}

	if (color.startsWith("#")) {
		const rgb = hexToRgb(color);
		if (rgb) {
			return `\x1b[38;2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
		}
	}

	return null;
}
