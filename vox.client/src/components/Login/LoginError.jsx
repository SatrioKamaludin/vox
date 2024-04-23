import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, UnorderedList, ListItem } from '@chakra-ui/react'
import PropTypes from 'prop-types';

function LoginError({ isOpen, onClose, errors }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bgColor="lightcoral">
                <ModalHeader textAlign="center">Login Error!</ModalHeader>
                <ModalCloseButton />
                <ModalBody textAlign="center">
                    <UnorderedList>
                        {errors.Password && errors.Password.map((error, index) => (
                            <ListItem key={index}>{error}</ListItem>
                        ))}
                    </UnorderedList>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

LoginError.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    errors: PropTypes.shape({
        Password: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
};

export default LoginError;
