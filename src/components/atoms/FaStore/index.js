
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStore } from '@fortawesome/free-solid-svg-icons';

const FaStore=({color,size}) => (
  <>
        <FontAwesomeIcon icon={faStore}  color={color} size={size}/>
  </>
);

export default FaStore;



