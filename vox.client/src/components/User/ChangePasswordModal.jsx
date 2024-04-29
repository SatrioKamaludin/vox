import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, VStack, Text, Box, Spinner, ModalOverlay } from "@chakra-ui/react";
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../api/AuthContext';
import { CheckCircleIcon } from "@chakra-ui/icons";
import PropTypes from 'prop-types';

function ChangePasswordModal({ isOpen, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { id: userId, token } = useContext(AuthContext);

    useEffect(() => {
        if (isOpen) {
            setIsUpdated(false);
            setOldPassword("");
            setNewPassword("");
            setRepeatPassword("");
            setErrors({});
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await axios.put(`http://localhost:5022/api/Auth/users/${userId}/password`, {
                oldPassword,
                newPassword,
                repeatPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });

            if (response.status === 204) {
                setIsUpdated(true);
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Change Password</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {isUpdated ? (
                        <VStack spacing={4} align="center">
                            <CheckCircleIcon boxSize={8} color="green.500" />
                            <Text>Your password has been successfully changed</Text>
                        </VStack>
                    ) : (
                        <>
                            <FormControl id="oldPassword" isRequired>
                                <FormLabel>Old Password</FormLabel>
                                <Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                                {errors.oldPassword && <Box color="red.500">{errors.oldPassword.map((error, index) => <div key={index}>• {error}</div>)}</Box>}
                            </FormControl>
                            <FormControl id="newPassword" mt={4} isRequired>
                                <FormLabel>New Password</FormLabel>
                                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                {errors.newPassword && <Box color="red.500">{errors.newPassword.map((error, index) => <div key={index}>• {error}</div>)}</Box>}
                            </FormControl>
                            <FormControl id="repeatPassword" mt={4} isRequired>
                                <FormLabel>Repeat New Password</FormLabel>
                                <Input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                                {errors.repeatPassword && <Box color="red.500">{errors.repeatPassword.map((error, index) => <div key={index}>• {error}</div>)}</Box>}
                            </FormControl>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => {
                        if (isUpdated) {
                            setIsUpdated(false);
                        }
                        onClose();
                    }}>
                        {isUpdated ? 'OK' : 'Close'}
                    </Button>
                    {!isUpdated && (
                        <Button colorScheme="green" onClick={handleSubmit} isDisabled={!oldPassword || !newPassword || !repeatPassword}>
                            {isLoading ? <Spinner /> : 'Change'}
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

ChangePasswordModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ChangePasswordModal;