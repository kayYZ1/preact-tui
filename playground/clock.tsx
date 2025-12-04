import { Box, Text, Terminal, render, signal } from "../index";

const time = signal(new Date().toLocaleTimeString());

function Clock() {
	return (
		<Box flex flexDirection="column" alignItems="center" gap={1}>
			<Text color="magenta" bold>
				⏰ Terminal Clock
			</Text>
			<Box flexDirection="row" gap={1}>
				<Text color="white">[</Text>
				<Text color="green" bold>
					{time.value}
				</Text>
				<Text color="white">]</Text>
			</Box>
		</Box>
	);
}

const term = new Terminal();
const { unmount } = render(() => <Clock />, term);

setInterval(() => {
	time.value = new Date().toLocaleTimeString();
}, 1000);

process.on("SIGINT", () => {
	unmount();
	process.exit();
});
process.stdin.resume();
