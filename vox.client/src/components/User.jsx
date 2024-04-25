import {
    Box,
    VStack,
    Heading,
    InputGroup, Input, InputRightElement,
    Button,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
    Spinner
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Layout from './Layout';
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../api/AuthContext';

function User() {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { token } = useContext(AuthContext);


    async function getUserById(userId, token) {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:5022/api/Auth/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                return {
                    message: `User with ID ${userId} is not found in database.`,
                    status_code: 404
                };
            }
            // Handle the error according to your application logic
        } finally {
            setIsLoading(false);
        }
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        // Call the getUserById API
        const response = await getUserById(userId, token);
        if (response) {
            setUser(response);
            setIsOpen(true);
        } else {
            // Handle the case when the user is not found
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setUser(null);
    };

    return (
        <>
            <Layout>
                <Box display="flex" flexDirection="column" minHeight="100vh" justifyContent="center" alignItems="center">
                    <VStack spacing={4} width="400px">
                        <Heading>User Menu</Heading>
                        <form onSubmit={handleSubmit}>
                            <InputGroup>
                                <Input placeholder='Find User By ID' value={userId} onChange={(e) => setUserId(e.target.value)} />
                                <Button h="2.5rem" size="sm" type="submit">
                                    {isLoading ? <Spinner /> : <SearchIcon />}
                                </Button>
                            </InputGroup>
                        </form>
                    </VStack>
                </Box>
            </Layout>
            {user && (
                <Modal isOpen={isOpen} onClose={handleClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{user.status_code === 404 ? "Not Found" : "User Details"}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {user.status_code === 404 ? (
                                <p>{user.message}</p>
                            ) : (
                                <>
                                    <p>ID: {user.id}</p>
                                    <p>First Name: {user.firstName}</p>
                                    <p>Last Name: {user.lastName}</p>
                                    <p>Email: {user.email}</p>
                                </>
                            )}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
       </>
  );
}

export default User;