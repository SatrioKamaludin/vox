import { useState } from 'react'
import {
    Box,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Text
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import RegisterSuccess from './RegisterSuccess'
import RegisterError from './RegisterError';

function Register() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

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
                setShowSuccessModal(true);
            } 
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrors(error.response.data.errors);
                setShowErrorModal(true);
            }
            console.error('Error registering user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" justifyContent="center" alignItems="center">
            <VStack spacing={4} width="400px" as="form" onSubmit={handleSubmit}>
                <FormControl isRequired id="firstName">
                    <FormLabel>First Name</FormLabel>
                    <Input type="text" name="firstName" />
                </FormControl>
                <FormControl isRequired id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input type="text" name="lastName" />
                </FormControl>
                <FormControl isRequired id="email">
                    <FormLabel>Email address</FormLabel>
                    <Input type="email" name="email" />
                </FormControl>
                <FormControl isRequired id="password">
                    <FormLabel>Password</FormLabel>
                    <Input type="password" name="password" />
                </FormControl>
                <FormControl isRequired id="repeatPassword">
                    <FormLabel>Confirm Password</FormLabel>
                    <Input type="password" name="repeatPassword" />
                </FormControl>
                <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>Register</Button>
                <Text fontSize='l'>Already have an account? <Link to="/login" style={{ color: 'blue' }}>Login</Link></Text>
            </VStack>
            <RegisterSuccess isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
            <RegisterError isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} errors={errors} />
        </Box>
    );
}

export default Register;
