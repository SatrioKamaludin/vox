import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import PropTypes from 'prop-types';

function OrganizerDetails({ isOpen, onClose, organizer }) {
  return (
      <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
              <ModalHeader>Organizer Details</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                  <p>ID: {organizer.id}</p>
                  <p>Organizer Name: {organizer.organizerName}</p>
                  <p>Image Location: {organizer.imageLocation}</p>
              </ModalBody>
          </ModalContent>
      </Modal>
  );
}

OrganizerDetails.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    organizer: PropTypes.shape({
        id: PropTypes.number,
        organizerName: PropTypes.string,
        imageLocation: PropTypes.string,
    }).isRequired,
};

export default OrganizerDetails;