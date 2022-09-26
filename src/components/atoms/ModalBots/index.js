import {React } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalBots=({title, message1, message2, message3, showModalBootsrap = false, buttonOk,...rest }) => {

  return (
    <>
    <Modal show={showModalBootsrap} {...rest}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message1 || ''}</p>
        <p>{message2 || ''}</p>
        <p>{message3 || ''}</p>
        </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" {...rest}>
          Close
        </Button>
        {buttonOk &&(<Button variant="primary">OK</Button>)}
      </Modal.Footer>
    </Modal>
  </>
  )
}

export default ModalBots;



