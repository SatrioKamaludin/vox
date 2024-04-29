import { useEffect, useState } from "react";
import axios from 'axios';
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalOverlay, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, VStack, Text, Spinner } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import PropTypes from 'prop-types';
import { AuthContext } from "../../api/AuthContext";
import { useContext } from "react";

function UpdateUserModal({ isOpen, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const { id: userId, token } = useContext(AuthContext);

    useEffect(() => {
        if (isOpen) {
            setIsUpdated(false);
            setFirstName("");
            setLastName("");
            setEmail("");
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await axios.put(`http://localhost:5022/api/Auth/users/${userId}`, {
                firstName,
                lastName,
                email
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
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Change Name and Email</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {isUpdated ? (
                        <VStack spacing={4} align="center">
                            <CheckCircleIcon boxSize={8} color="green.500" />
                            <Text>Your data has been successfully updated</Text>
                        </VStack>
                    ) : (
                        <>
                            <FormControl id="firstName" isRequired>
                                <FormLabel>First Name</FormLabel>
                                <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </FormControl>
                            <FormControl id="lastName" mt={4} isRequired>
                                <FormLabel>Last Name</FormLabel>
                                <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </FormControl>
                            <FormControl id="email" mt={4} isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </FormControl>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                    </Button>
                    {!isUpdated && (
                        <Button colorScheme="green" onClick={handleSubmit} isDisabled={!firstName || !lastName || !email}>
                            {isLoading ? <Spinner /> : 'Change'}
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

UpdateUserModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default UpdateUserModal;