
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIdCard } from '@fortawesome/free-regular-svg-icons';

const FaIdCard=({color,size}) => (
  <>
        <FontAwesomeIcon icon={faIdCard}  color={color} size={size}/>
  </>
);

export default FaIdCard;



