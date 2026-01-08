import { run } from "@/tui/preact";
import { Box, Text, TextInput } from "@/tui/preact/components";
import { useSignal, useVimInput, type VimMode } from "@/tui/preact/hooks";

function TextInputDemo() {
  const value = useSignal("");
  const cursorPosition = useSignal(0);
  const mode = useSignal<VimMode>("NORMAL");

  useVimInput({
    value,
    cursorPosition,
    mode,
    focused: true,
  });

  return (
    <Box flex flexDirection="column" gap={1}>
      <Box border="bold" borderColor="cyan" padding={1}>
        <Text color="cyan" bold>
          Vim Text Input
        </Text>
      </Box>
      <Box border="single" borderLabel={mode.value} padding={1} flexDirection="column" gap={1}>
        <Text color="gray">Type something:</Text>
        <TextInput
          value={value.value}
          placeholder="Press 'i' to insert..."
          placeholderColor="gray"
          color="white"
          focused={true}
          cursorPosition={cursorPosition.value}
        />
      </Box>
    </Box>
  );
}

run(() => <TextInputDemo />);
