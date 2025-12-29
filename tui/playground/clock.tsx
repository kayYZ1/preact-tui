import { Box, run, Text, useSignal, useSignalEffect } from "../index";

function Clock() {
	const time = useSignal(new Date().toLocaleTimeString());

	useSignalEffect(() => {
		const interval = setInterval(() => {
			time.value = new Date().toLocaleTimeString();
		}, 1000);
		return () => clearInterval(interval);
	});

	return (
		<Box flex flexDirection="column" alignItems="center" gap={1}>
			<Box border="straight" borderColor="magenta" borderWidth={2} padding={1}>
				<Text color="magenta" bold>
					Terminal Clock
				</Text>
			</Box>
			<Box border="dash" borderColor="green" padding={1}>
				<Text color="green" bold>
					{time.value}
				</Text>
			</Box>
		</Box>
	);
}

run(() => <Clock />);
