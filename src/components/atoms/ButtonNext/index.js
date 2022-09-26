
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import './buttonNext.scss';

const ButtonNext = ({title}) => (
  <div className="position-absolute bottom-0 end-0">
    <button type="submit" className="buttonNext" >
      <span className="button__text">{title}</span>
      <span className="button__icon">
        <FontAwesomeIcon icon={faLongArrowAltRight}  size="lg" />
      </span>
    </button>
  </div>
);

export default ButtonNext;

