
import React from 'react';
import './buttonDone.scss';

const ButtonDone = ({title, ...rest}) => (
  <>
    <button type="button" className={ title==='Done' ? "button-done" : "button-retry"} {...rest}>{title}</button>
  </>
);

export default ButtonDone;

