import { Box, Text, run } from "../index";

function Header() {
	return (
		<Box border="straight" borderColor="cyan" padding={1}>
			<Box flexDirection="row" justifyContent="space-between" gap={4}>
				<Text color="cyan" bold>
					prtui
				</Text>
				<Text color="gray">v0.1.0</Text>
			</Box>
		</Box>
	);
}

function Sidebar() {
	return (
		<Box flexDirection="column" gap={1} padding={1} border="dash" borderColor="yellow">
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
		<Box flexDirection="column" gap={1} padding={1} border="straight" borderColor="green" borderWidth={2}>
			<Text color="green" bold>
				Welcome!
			</Text>
			<Text color="white">This is a layout example showing</Text>
			<Text color="white">how to compose components.</Text>
		</Box>
	);
}

function Footer() {
	return (
		<Box border="dash" borderColor="magenta" borderWidth={1} padding={1}>
			<Text color="magenta" italic>
				Press Ctrl+C to exit
			</Text>
		</Box>
	);
}

function App() {
	return (
		<Box flex flexDirection="column" gap={1}>
			<Header />
			<Box flexDirection="row" gap={2}>
				<Sidebar />
				<Content />
			</Box>
			<Footer />
		</Box>
	);
}

run(() => <App />);
