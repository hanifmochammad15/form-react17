import React from 'react';
import { useHistory, Link, withRouter } from 'react-router-dom';
import './progress.scss';

const Progress = ({location: { pathname }, props }) => {

  const arrayPage =  pathname.split('/');
  const isFirstStep = arrayPage.includes("first")
  const isSecondStep = arrayPage.includes("second")
  const isThirdStep = arrayPage.includes("third")
  const isFinalStep = arrayPage.includes("final")
  const isWrongPage = arrayPage.includes("wrong")
  const isLandingPage = arrayPage.includes("token")
  const isClosePage = arrayPage.includes("close")

  let history = useHistory();
  const url = window.location.href 
  const id = url.split("/").pop();
  const first = '/first/' + id
  const second = '/second/' + id

  if (!isFirstStep && !isSecondStep && !isThirdStep  && !isFinalStep && !isWrongPage && !isLandingPage && !isClosePage ){
    history.push(`/wrong`)
  }


  return (
    <React.Fragment>
        <div className='progress-bar-line'>
          <div id={`${isFirstStep | isLandingPage ? 'pointer1-active' : 'pointer1'}`}></div>
            <div id={`${isFirstStep || isLandingPage ? 'pointer1-bg-active' : 'pointer1-bg'}`}>
                <p className={`${isFirstStep ? 'one-word-per-line-active' : 'one-word-per-line'}`}>
                   {isSecondStep || isThirdStep ? (
                    <Link to = {first}>
                        Data <br/> Merchant
                      </Link>
                  ) : (
                    <>Data <br/> Merchant</>
                  )}
                  </p>
                {/* <p className={`${isFirstStep ? 'one-word-per-line-active' : 'one-word-per-line'}`}>Data <br/> Merchant </p> */}
            </div>
            <div id={`${isSecondStep ? 'pointer2-active' : 'pointer2'}`}></div>
            <div id={`${isSecondStep ? 'pointer2-bg-active' : 'pointer2-bg'}`}>
                <p className={`${isSecondStep ? 'one-word-per-line-active' : 'one-word-per-line'}`}>
                  { isThirdStep ? (
                    <Link to ={second}>Data <br/> Nasabah</Link>
                  ) : (
                    <>Data <br/> Nasabah</>
                  )}
                  </p>
                  {/* <p className={`${isSecondStep ? 'one-word-per-line-active' : 'one-word-per-line'}`}>Data <br/> Nasabah</p> */}
            </div>
            <div id={`${isThirdStep ? 'pointer3-active' : 'pointer3'}`}></div>
            <div id={`${isThirdStep ? 'pointer3-bg-active' : 'pointer3-bg'}`}>
              <p className={`${isThirdStep ? 'one-word-per-line-active' : 'one-word-per-line'}`}>File <br/> Prasyarat</p>
            </div>
        </div>
    </React.Fragment>
  );
};


export default withRouter(Progress);