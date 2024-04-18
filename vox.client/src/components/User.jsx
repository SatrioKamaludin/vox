import {
    Box,
    VStack,
    Heading
} from '@chakra-ui/react';

function User() {
  return (
      <Box display="flex" flexDirection="column" minHeight="100vh" justifyContent="center" alignItems="center">
            <VStack spacing={4} width="400px">
                <Heading>User Menu</Heading>
            </VStack>
      </Box>
  );
}

export default User;