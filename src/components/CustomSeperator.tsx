import { Box, Flex } from "@chakra-ui/react";

function CustomSeparator() {
  return (
    <Flex alignItems="center">
      <Box flex="3" h="2px" bg="orange.500" />
      <Box flex="7" h="2px" bg="white" />
    </Flex>
  );
}

export default CustomSeparator;
