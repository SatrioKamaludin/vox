import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../api/AuthContext";
import axios from "axios";
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, VStack } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import PropTypes from 'prop-types';

function UpdateOrganizerModal({ organizer, isOpen, onClose, updateOrganizer }) {
    const [isLoading, setIsLoading] = useState(false);
    const [organizerName, setOrganizerName] = useState(organizer.organizerName);
    const [imageLocation, setImageLocation] = useState(organizer.imageLocation);
    const [isFormValid, setIsFormValid] = useState(true);
    const [isUpdated, setIsUpdated] = useState(false);
    const { token } = useContext(AuthContext);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await axios.put(`http://localhost:5022/api/Organizer/organizers/${organizer.id}`, {
                organizerName,
                imageLocation
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });

            if (response.status === 204) {
                setIsUpdated(true);
                updateOrganizer({ ...organizer, organizerName, imageLocation });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setIsFormValid(organizerName.trim() !== "" && imageLocation.trim() !== "");
    }, [organizerName, imageLocation]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update Organizer {organizer.id}</ModalHeader>
                <ModalBody>
                    {isUpdated ? (
                        <VStack spacing={4} align="center">
                            <CheckCircleIcon boxSize={8} color="green.500" />
                            <Text>Organizer {organizer.id} has been updated successfully</Text>
                            <Text>Organizer Name: {organizerName}</Text>
                            <Text>Image Location: {imageLocation}</Text>
                        </VStack>
                    ) : (
                        <>
                            <FormControl id="organizerName">
                                <FormLabel>Organizer Name</FormLabel>
                                <Input type="text" value={organizerName} onChange={(e) => setOrganizerName(e.target.value)} />
                            </FormControl>
                            <FormControl id="imageLocation" mt={4}>
                                <FormLabel>Image Location</FormLabel>
                                <Input type="text" value={imageLocation} onChange={(e) => setImageLocation(e.target.value)} />
                            </FormControl>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => {
                        if (isUpdated) {
                            setIsUpdated(false);
                            setOrganizerName("");
                            setImageLocation("");
                        }
                        onClose();
                    }}>
                        {isUpdated ? 'OK' : 'Close'}
                    </Button>
                    {!isUpdated && (
                        <Button colorScheme="green" onClick={handleSubmit} isDisabled={!isFormValid}>
                            {isLoading ? <Spinner /> : 'Change'}
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

UpdateOrganizerModal.propTypes = {
    organizer: PropTypes.shape({
        id: PropTypes.number.isRequired,
        organizerName: PropTypes.string.isRequired,
        imageLocation: PropTypes.string.isRequired
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    updateOrganizer: PropTypes.func.isRequired
};

export default UpdateOrganizerModal;