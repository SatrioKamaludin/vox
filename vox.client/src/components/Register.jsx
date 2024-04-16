import { useState } from 'react'
import {
    Box,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Text, Alert, AlertIcon, AlertTitle, AlertDescription
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Register() {
    const [showAlert, setShowAlert] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('http://localhost:5022/api/Auth/register', {
                firstName: event.target.firstName.value,
                lastName: event.target.lastName.value,
                email: event.target.email.value,
                password: event.target.password.value,
                repeatPassword: event.target.repeatPassword.value
            });

            if (response.status === 200) {
                setShowAlert(true);
            }
        } catch (error) {
            console.error('Error registering user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" justifyContent="center" alignItems="center">
            <VStack spacing={4} width="400px" as="form" onSubmit={handleSubmit}>
                <FormControl id="firstName">
                    <FormLabel>First Name</FormLabel>
                    <Input type="text" name="firstName" />
                </FormControl>
                <FormControl id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input type="text" name="lastName" />
                </FormControl>
                <FormControl id="email">
                    <FormLabel>Email address</FormLabel>
                    <Input type="email" name="email" />
                </FormControl>
                <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input type="password" name="password" />
                </FormControl>
                <FormControl id="repeatPassword">
                    <FormLabel>Confirm Password</FormLabel>
                    <Input type="password" name="repeatPassword" />
                </FormControl>
                <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>Register</Button>
                <Text fontSize='l'>Already have an account? <Link to="/login" style={{ color: 'blue' }}>Login</Link></Text>
            </VStack>
            {showAlert && (
                <Alert
                    status='success'
                    variant='subtle'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    textAlign='center'
                    height='200px'
                >
                    <AlertIcon boxSize='40px' mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize='lg'>
                        Application submitted!
                    </AlertTitle>
                    <AlertDescription maxWidth='sm'>
                        Thanks for submitting your application. Our team will get back to you soon.
                    </AlertDescription>
                </Alert>
            )}
        </Box>
    );
}

export default Register;
