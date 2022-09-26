
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons';

const FaImage=({color,size}) => (
  <>
        <FontAwesomeIcon icon={faImage}  color={color} size={size}/>
  </>
);

export default FaImage;



