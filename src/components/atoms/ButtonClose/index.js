
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import './buttonCloseTop.scss';

const ButtonClose = ({title,...rest}) => (
  <div className="container-button-close">
    <button {...rest} type="button" className="btn-close-top">
     <span>
     <FontAwesomeIcon icon={faXmarkCircle}  size='lg'/>
      </span> 
    </button>
  </div>
);

export default ButtonClose;

