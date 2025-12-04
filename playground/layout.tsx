import { Box, Text, Terminal, render } from "../index";

function Header() {
	return (
		<Box flexDirection="row" justifyContent="space-between" gap={4}>
			<Text color="cyan" bold>
				prtui
			</Text>
			<Text color="gray">v0.1.0</Text>
		</Box>
	);
}

function Sidebar() {
	return (
		<Box flexDirection="column" gap={1}>
			<Text color="yellow" underline>
				Menu
			</Text>
			<Text color="white">• Home</Text>
			<Text color="white">• Settings</Text>
			<Text color="white">• About</Text>
		</Box>
	);
}

function Content() {
	return (
		<Box flexDirection="column" gap={1}>
			<Text color="green" bold>
				Welcome!
			</Text>
			<Text color="white">This is a layout example showing</Text>
			<Text color="white">how to compose components.</Text>
		</Box>
	);
}

function App() {
	return (
		<Box flex flexDirection="column" gap={2}>
			<Header />
			<Box flexDirection="row" gap={4}>
				<Sidebar />
				<Content />
			</Box>
		</Box>
	);
}

const term = new Terminal();
const { unmount } = render(() => <App />, term);

process.on("SIGINT", () => {
	unmount();
	process.exit();
});
process.stdin.resume();
