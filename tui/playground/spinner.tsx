import { run } from "@/tui/preact";
import { Box, Text } from "@/tui/preact/components";
import { useSignal, useSignalEffect } from "@/tui/preact/hooks";

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function Spinner() {
	const frameIndex = useSignal(0);
	const status = useSignal("Loading...");

	useSignalEffect(() => {
		const spinnerInterval = setInterval(() => {
			frameIndex.value = (frameIndex.value + 1) % frames.length;
		}, 80);

		const timeout1 = setTimeout(() => {
			status.value = "Fetching data...";
		}, 2000);

		const timeout2 = setTimeout(() => {
			status.value = "Almost done...";
		}, 4000);

		const timeout3 = setTimeout(() => {
			status.value = "Complete!";
		}, 6000);

		return () => {
			clearInterval(spinnerInterval);
			clearTimeout(timeout1);
			clearTimeout(timeout2);
			clearTimeout(timeout3);
		};
	});

	return (
		<Box flex flexDirection="column" gap={1}>
			<Box border="straight" borderColor="cyan" borderWidth={2} padding={1}>
				<Box flexDirection="row" gap={1}>
					<Text color="cyan">{frames[frameIndex.value]}</Text>
					<Text color="white">{status.value}</Text>
				</Box>
			</Box>
			<Box border="dash" borderColor="gray" padding={1}>
				<Text color="gray" italic>
					(simulated loading, Ctrl+C to exit)
				</Text>
			</Box>
		</Box>
	);
}

run(() => <Spinner />);
