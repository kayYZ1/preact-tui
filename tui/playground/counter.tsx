import { Box, Text, run, useSignal, useSignalEffect } from "../index";

function Counter() {
  const count = useSignal(0);

  useSignalEffect(() => {
    const interval = setInterval(() => {
      count.value++;
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <Box flex flexDirection="column" gap={1}>
      <Box border="straight" borderColor="cyan" padding={1}>
        <Text color="cyan" bold>
          Counter Example
        </Text>
      </Box>
      <Box border="dash" borderColor="yellow" padding={1}>
        <Box flexDirection="row" gap={2}>
          <Text color="white">Count:</Text>
          <Text color="yellow" bold>
            {count.value}
          </Text>
        </Box>
      </Box>
      <Text color="gray">(updates every second, Ctrl+C to exit)</Text>
    </Box>
  );
}

run(() => <Counter />);
