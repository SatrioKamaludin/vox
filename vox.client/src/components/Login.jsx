import { Box, VStack, FormControl, FormLabel, Input, Button, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Login() {
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" justifyContent="center" alignItems="center">
            <VStack spacing={4} width="400px">
                <FormControl id="email">
                    <FormLabel>Email address</FormLabel>
                    <Input type="email" />
                </FormControl>
                <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input type="password" />
                </FormControl>
                <Button colorScheme="blue" type="submit">Login</Button>
                <Text fontSize='l'>Don't have an account? <Link to="/register" style={{ color: 'blue' }}>Register here</Link></Text>
            </VStack>
        </Box>
    );
}

export default Login;
