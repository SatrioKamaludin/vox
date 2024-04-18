import { Box, VStack, FormControl, FormLabel, Input, Button, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

function Login() {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('http://localhost:5022/api/Auth/login', {
                email: event.target.email.value,
                password: event.target.password.value
            });
            if (response.status === 200) {
                console.log('Login successful!')
            }
        } catch (error) {
            console.error('Error login user:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" justifyContent="center" alignItems="center">
            <VStack spacing={4} width="400px" as="form" onSubmit={handleSubmit}>
                <FormControl id="email" isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input type="email" />
                </FormControl>
                <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" />
                </FormControl>
                <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>Login</Button>
                <Text fontSize='l'>Don&apos;t have an account? <Link to="/register" style={{ color: 'blue' }}>Register here</Link></Text>
            </VStack>
        </Box>
    );
}

export default Login;
