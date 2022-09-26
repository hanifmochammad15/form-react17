
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faUpload } from '@fortawesome/free-solid-svg-icons';
import './buttonUpload.scss';

const ButtonUpload = ( {title, display, ...rest}) => (
  <div className="d-inline-flex p-2">
      <button  type="button" className= { display ? "buttonUpload" :  "d-none"} {...rest}>
      <span className="button__icon">
        <FontAwesomeIcon icon={faUpload}  size="lg" />
      </span>
      <span className="button__text">{title}</span>
    </button> 
    </div>
);

export default ButtonUpload;

