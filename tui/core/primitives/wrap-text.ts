/**
 * Wraps text to a specified width, splitting by words and preserving spaces.
 * Returns an array of lines, each not exceeding the specified width.
 */
export function wrapText(text: string, width: number): string[] {
	if (width <= 0) return [];

	// Ensure text is a string
	const str = String(text || "");

	const lines: string[] = [];
	const words = str.split(" ");
	let currentLine = "";

	for (const word of words) {
		// If word itself is longer than width, we need to break it
		if (word.length > width) {
			// Add current line if it has content
			if (currentLine) {
				lines.push(currentLine);
				currentLine = "";
			}
			// Split the word into chunks of `width`
			for (let i = 0; i < word.length; i += width) {
				lines.push(word.slice(i, i + width));
			}
			continue;
		}

		// Try to add word to current line
		const testLine = currentLine ? `${currentLine} ${word}` : word;

		if (testLine.length <= width) {
			currentLine = testLine;
		} else {
			// Word doesn't fit, save current line and start new one
			if (currentLine) {
				lines.push(currentLine);
			}
			currentLine = word;
		}
	}

	// Add any remaining text
	if (currentLine) {
		lines.push(currentLine);
	}

	return lines.length > 0 ? lines : [""];
}

/**
 * Splits text into lines of specified width without word wrapping.
 * Simply breaks text every `width` characters.
 */
export function splitText(text: string, width: number): string[] {
	if (width <= 0) return [];

	// Ensure text is a string
	const str = String(text || "");

	const lines: string[] = [];
	for (let i = 0; i < str.length; i += width) {
		lines.push(str.slice(i, i + width));
	}

	return lines.length > 0 ? lines : [""];
}
