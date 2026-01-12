import { useSignal } from "@/tui/preact/hooks/signals";
import { useTextInput } from "@/tui/preact/hooks/text-input";
import { run } from "@/tui/preact";
import { Box, Text, TextInput } from "@/tui/preact/components";
import type { VimMode } from "../preact/hooks/vim-bindings";

function TextInputDemo() {
  const value = useSignal("");
  const cursor = useSignal(0);
  const mode = useSignal<VimMode>("NORMAL");

  useTextInput({
    value,
    cursorPosition: cursor,
    mode,
    focused: true,
  });

  const charCount = value.value.length;

  return (
    <Box flex flexDirection="column" gap={1} padding={1}>
      <Box border="round" borderColor="cyan" padding={1}>
        <Text color="cyan" bold>
          Text Input Demo
        </Text>
      </Box>

      <Box flexDirection="column" gap={1}>
        <Box border="single" borderColor="gray" borderLabel={mode.value} borderLabelColor="white" padding={1}>
          <TextInput
            value={value.value}
            cursorPosition={cursor.value}
            placeholder="Type something..."
            placeholderColor="gray"
            height={5}
            focused
          />
        </Box>

        <Box flexDirection="row" gap={2}>
          <Text color="gray">Characters: </Text>
          <Text color="yellow">{charCount}</Text>
        </Box>
      </Box>

      <Box>
        <Text color="gray" italic>
          Press Ctrl+C to exit
        </Text>
      </Box>
    </Box>
  );
}

run(() => <TextInputDemo />);
