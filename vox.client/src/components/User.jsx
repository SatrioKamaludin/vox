import {
    Box,
    HStack,
    VStack,
    Heading,
    InputGroup, Input,
    Button,
    Spinner
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Layout from './Layout';
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../api/AuthContext';
import UserDetailModal from './User/UserDetailModal';
import UpdateUserModal from './User/UpdateUserModal';
import ChangePasswordModal from './User/ChangePasswordModal';

function User() {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
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
        } finally {
            setIsLoading(false);
        }
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await getUserById(userId, token);
        if (response) {
            setUser(response);
            setIsOpen(true);
        }
    };

    const handleUpdate = () => {
        setIsUpdateModalOpen(true);
    };

    const handleChangePassword = () => {
        setIsChangePasswordModalOpen(true);
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
                        <HStack>
                            <Button onClick={handleChangePassword}>Change Password</Button>
                            <Button onClick={handleUpdate}>Change Name and Email</Button>
                        </HStack>
                    </VStack>
                </Box>
            </Layout>
            <UserDetailModal userId={userId} isOpen={isOpen} onClose={handleClose} token={token} />
            <UpdateUserModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} />
            <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)} />
       </>
  );
}

export default User;