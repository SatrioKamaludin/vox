import { Box, VStack, FormControl, FormLabel, Input, Button, Text } from '@chakra-ui/react'
import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import LoginError from './LoginError';
import { AuthContext } from '../../api/AuthContext';

function Login() {
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errors, setErrors] = useState({});

    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { setIsLoggedIn, setToken } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('http://localhost:5022/api/Auth/login', {
                email: event.target.email.value,
                password: event.target.password.value
            });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                setIsLoggedIn(true);
                navigate('/user');
                console.log('Login successful!')
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrors(error.response.data.errors);
                setShowErrorModal(true);
            } else if (error.response && error.response.status === 401) {
                setErrors({ Password: [error.response.data.error] });
                setShowErrorModal(true);
            }
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
            <LoginError isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} errors={errors} />
        </Box>
    );
}

export default Login;
