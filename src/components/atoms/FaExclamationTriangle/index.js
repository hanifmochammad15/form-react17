
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const FaExclamationTriangle=({color,size}) => (
  <>
        <FontAwesomeIcon icon={faExclamationTriangle}  color={color} size={size}/>
  </>
);

export default FaExclamationTriangle


