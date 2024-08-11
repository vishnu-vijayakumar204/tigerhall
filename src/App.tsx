import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react";
import ContentCards from "./components/ContentCards";

const fonts = {
  heading: "PP Neue Montreal, sans-serif",
  body: "PP Neue Montreal, sans-serif",
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ config, fonts });

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ContentCards />
    </ChakraProvider>
  );
}

export default App;
