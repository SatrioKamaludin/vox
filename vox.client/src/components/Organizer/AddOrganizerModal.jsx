import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, VStack } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useState } from "react";
import { AuthContext } from "../../api/AuthContext";
import PropTypes from 'prop-types';
import { useContext } from "react";

function AddOrganizerModal({ isOpen, onClose, addOrganizer }) {
    const [isLoading, setIsLoading] = useState(false);
    const [organizerName, setOrganizerName] = useState("");
    const [imageLocation, setImageLocation] = useState("");
    const [isAdded, setIsAdded] = useState(false);
    const [newOrganizer, setNewOrganizer] = useState(null);
    const { token } = useContext(AuthContext);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`http://localhost:5022/api/Organizer/organizers`, {
                organizerName,
                imageLocation
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });

            if (response.status === 200) {
                setIsAdded(true);
                setNewOrganizer(response.data);
                addOrganizer(response.data);
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
                <ModalHeader>Add Organizer</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {isAdded ? (
                        <VStack spacing={4} align="center">
                            <CheckCircleIcon boxSize={8} color="green.500" />
                            <Text>Organizer {newOrganizer.id} has been added successfully</Text>
                            <Text>Organizer Name: {newOrganizer.organizerName}</Text>
                            <Text>Image Location: {newOrganizer.imageLocation}</Text>
                        </VStack>
                    ) : (
                        <>
                            <FormControl id="organizerName" isRequired>
                                <FormLabel>Organizer Name</FormLabel>
                                <Input type="text" value={organizerName} onChange={(e) => setOrganizerName(e.target.value)} />
                            </FormControl>
                            <FormControl id="imageLocation" mt={4} isRequired>
                                <FormLabel>Image Location</FormLabel>
                                <Input type="text" value={imageLocation} onChange={(e) => setImageLocation(e.target.value)} />
                            </FormControl>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => {
                        if (isAdded) {
                            setIsAdded(false);
                            setOrganizerName("");
                            setImageLocation("");
                        }
                        onClose();
                    }}>
                        {isAdded ? 'OK' : 'Close'}
                    </Button>

                    {!isAdded && (
                        <Button colorScheme="green" onClick={handleSubmit}>
                            {isLoading ? <Spinner /> : 'Add'}
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

AddOrganizerModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    addOrganizer: PropTypes.func.isRequired
};

export default AddOrganizerModal;