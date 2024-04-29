import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, VStack } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../api/AuthContext";
import PropTypes from 'prop-types';

function DeleteOrganizerModal({ organizer, isOpen, onClose, deleteOrganizer }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const { token } = useContext(AuthContext);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`http://localhost:5022/api/Organizer/organizers/${organizer.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });

            if (response.status === 204) {
                setIsDeleted(true);
                deleteOrganizer(organizer.id);
            }

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Delete Organizer {organizer.id}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {isDeleted ? (
                        <VStack spacing={4} align="center">
                            <CheckCircleIcon boxSize={8} color="green.500" />
                            <Text>Organizer {organizer.id} has been deleted successfully</Text>
                        </VStack>
                    ) : (
                        <>
                            Are you sure you want to delete organizer {organizer.id}?
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => {
                        if (isDeleted) {
                            setIsDeleted(false);
                        }
                        onClose();
                    }}>
                        {isDeleted ? 'OK' : 'No'}
                    </Button>
                    {!isDeleted && (
                        <Button colorScheme="green" onClick={handleDelete}>
                            {isLoading ? <Spinner /> : 'Yes'}
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

DeleteOrganizerModal.propTypes = {
    organizer: PropTypes.shape({
        id: PropTypes.number.isRequired,
        organizerName: PropTypes.string.isRequired,
        imageLocation: PropTypes.string.isRequired
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    deleteOrganizer: PropTypes.func.isRequired
};

export default DeleteOrganizerModal;