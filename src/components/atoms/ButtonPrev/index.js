
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import './buttonPrev.scss';

const ButtonPrev=({title, ...rest}) => (
  <div className="position-absolute bottom-0 start-0">  
    <button type="button" className="button" {...rest}>
    <span className="button__icon">
      <FontAwesomeIcon icon={faLongArrowAltLeft}  size="lg" />
      </span>
      <span className="button__text">{title}</span>
    </button>
  </div>
);

export default ButtonPrev;



