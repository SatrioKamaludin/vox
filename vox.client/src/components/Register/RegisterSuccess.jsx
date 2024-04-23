import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function RegisterSuccess({ isOpen, onClose }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bgColor="lightgreen">
                <ModalHeader textAlign="center">Register Successful!</ModalHeader>
                <ModalCloseButton />
                <ModalBody textAlign="center">
                    Thanks for registering. You may login with your email and password immediately.
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

RegisterSuccess.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default RegisterSuccess;
