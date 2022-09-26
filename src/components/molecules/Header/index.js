import {React ,useEffect} from 'react';
import Progress from '../Progress';
import './header.scss';
import {ICQRIS } from '../../../assets';
import {  withRouter } from 'react-router-dom';

const Header = ({ location: { pathname }, props }) => {
  const arrayPage = pathname.split('/');
  const isFinalStep = arrayPage.includes("final"); 
  const isWrongPage = arrayPage.includes("wrong"); 
  const isClosePage = arrayPage.includes("close"); 

  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
  
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  return (
    <div>
      {!isFinalStep && !isWrongPage  && !isClosePage ?
      <>
        <div className="header ">
          <img src={ICQRIS} className="qrisLogo" alt="imageBackgroundHeader"/> 
          <h1 className="RegistrationClass">Registration</h1>
        </div>
        </>
        :''}
      {!isFinalStep && !isWrongPage  && !isClosePage?
        <div className='progressBar'><Progress /></div>
      :''}
    </div>
  )
};

export default withRouter(Header);