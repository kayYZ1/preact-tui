import { run } from "@/tui/preact";
import { Box, Text } from "@/tui/preact/components";

function Header() {
  return (
    <Box border="single" borderColor="cyan" padding={1}>
      <Box flexDirection="row" justifyContent="space-between" gap={4}>
        <Text color="cyan" bold>
          TinyAg2
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
    <Box
      flexDirection="row"
      flex={1}
      padding={1}
      border="single"
      borderColor="green"
      borderWidth={2}
      flexWrap="wrap"
    >
      <Text color="green" bold>
        Welcome!
      </Text>
      <Text color="white">
        Loremlorelloremlororaosdasdasdasdsadads Loremlorelloremlororaosdasdasdasdsadads
        Loremlorelloremlororaosdasdasdasdsadads Loremlorelloremlororaosdasdasdasdsadads
        Loremlorelloremlororaosdasdasdasdsadads Loremlorelloremlororaosdasdasdasdsadads
        Loremlorelloremlororaosdasdasdasdsadads Loremlorelloremlororaosdasdasdasdsadads
        Loremlorelloremlororaosdasdasdasdsadads Loremlorelloremlororaosdasdasdasdsadads
        Loremlorelloremlororaosdasdasdasdsadads
      </Text>
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
      <Box flexDirection="row" justifyContent="space-between" gap={2}>
        <Sidebar />
        <Content />
      </Box>
      <Footer />
    </Box>
  );
}

run(() => <App />);
