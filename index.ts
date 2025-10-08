import { h } from 'preact';
import { render } from './preact/renderer';
import { Terminal } from './core/terminal';

const App = () => (
  <box flexDirection="column">
    <text color="green">Hello</text>
    <text bold>World</text>
  </box>
);

const terminal = new Terminal();
render(<App />, term);
