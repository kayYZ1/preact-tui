import { Box, Text, Terminal, render, signal } from "../index";

const count = signal(0);

function Counter() {
	return (
		<Box flex flexDirection="column" gap={1}>
			<Text color="cyan" bold>
				Counter Example
			</Text>
			<Box flexDirection="row" gap={2}>
				<Text color="white">Count:</Text>
				<Text color="yellow" bold>
					{count.value}
				</Text>
			</Box>
			<Text color="gray">(updates every second, Ctrl+C to exit)</Text>
		</Box>
	);
}

const term = new Terminal();
const { unmount } = render(() => <Counter />, term);

setInterval(() => {
	count.value++;
}, 1000);

process.on("SIGINT", () => {
	unmount();
	process.exit();
});
process.stdin.resume();
