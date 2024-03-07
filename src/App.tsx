import { MantineProvider, Text } from "@mantine/core";
import mantineTheme from "./mantineTheme";
import HomePage from "./HomePage";

const App = () => {
  return (
    <MantineProvider theme={mantineTheme} forceColorScheme="dark">
      <HomePage />
    </MantineProvider>
  );
};

export default App;
