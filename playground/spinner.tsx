import { Box, Text, Terminal, render, signal } from "../index";

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const frameIndex = signal(0);
const status = signal("Loading...");

function Spinner() {
	return (
		<Box flex flexDirection="column" gap={1}>
			<Box flexDirection="row" gap={1}>
				<Text color="cyan">{frames[frameIndex.value]}</Text>
				<Text color="white">{status.value}</Text>
			</Box>
			<Text color="gray" italic>
				(simulated loading, Ctrl+C to exit)
			</Text>
		</Box>
	);
}

const term = new Terminal();
const { unmount } = render(() => <Spinner />, term);

setInterval(() => {
	frameIndex.value = (frameIndex.value + 1) % frames.length;
}, 80);

setTimeout(() => {
	status.value = "Fetching data...";
}, 2000);

setTimeout(() => {
	status.value = "Almost done...";
}, 4000);

setTimeout(() => {
	status.value = "Complete! ✓";
}, 6000);

process.on("SIGINT", () => {
	unmount();
	process.exit();
});
process.stdin.resume();
