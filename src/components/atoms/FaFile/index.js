
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileClipboard } from '@fortawesome/free-solid-svg-icons';
import './FaFile.scss';

const FaFile=({title, ...rest}) => (
  <>
        <FontAwesomeIcon icon={faFileClipboard}  size="5x"  border />
  </>
);

export default FaFile;



