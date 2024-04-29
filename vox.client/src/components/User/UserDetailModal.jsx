import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import PropTypes from 'prop-types';

function UserDetailModal({ userId, isOpen, onClose, token }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setUser(null);
        async function getUserById() {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:5022/api/Auth/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status === 404) {
                    setUser({
                        message: `User with ID ${userId} is not found in database.`,
                        status_code: 404
                    });
                }
            } finally {
                setIsLoading(false);
            }
        }

        if (isOpen) {
            getUserById();
        }
    }, [isOpen, userId, token]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{user?.status_code === 404 ? "Not Found" : "User Details"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {user?.status_code === 404 ? (
                        <p>{user.message}</p>
                    ) : (
                        <>
                            <p>ID: {user?.id}</p>
                            <p>First Name: {user?.firstName}</p>
                            <p>Last Name: {user?.lastName}</p>
                            <p>Email: {user?.email}</p>
                        </>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

UserDetailModal.propTypes = {
    userId: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired
};

export default UserDetailModal;