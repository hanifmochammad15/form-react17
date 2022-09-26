
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';

const FaAsterisk=({ size, color}) => (
  <>
        <FontAwesomeIcon icon={faAsterisk}  style={{fontSize:size,verticalAlign:'text-top'}} color={color} />
  </>
);

export default FaAsterisk


