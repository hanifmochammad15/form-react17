import { React, useState } from 'react';
import { useEffect } from 'react';
import { useHistory, withRouter  } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { getToken, setErrorForm }  from '../../config/redux/action'

import { motion } from 'framer-motion';

const LandingPage = (props) => {

  let id = props.match.params.id;

  let history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [failedErrorToken, setFailedErrorToken] = useState(0);
  const { TotalErrorGLobal } = useSelector(state => state.createRegistrationReducer);

  useEffect(() => {  
    const GetTokenFunc = async () => {
      try {
            setIsLoading(true);
            if(!id){
              return history.push(`../wrong`)
            }
            let result = await dispatch(getToken());
            if (result){
              setIsLoading(false);
              return history.push(`../first/${id}`)
            }else{
              setIsLoading(false);
              return history.push(`../wrong`)
            }
      } catch (error) {
        setIsLoading(false);
        console.log('error', error);
        let count = failedErrorToken + 1
        setFailedErrorToken(count)
        if (failedErrorToken >= 5){
          dispatch(setErrorForm("wait.. service not ready, Failed to get Token")); 
          history.push(`/wrong/${id}`)
        }
        return false
        //window.alert("Please contact administrator! \n ERROR : " + error);

      }
    };
    GetTokenFunc();
    return () => {  
      setIsLoading(false);
    }  
  }, [ dispatch, id, failedErrorToken, TotalErrorGLobal, history]);  

  
    return (
        <div>
          {isLoading && (
              <motion.div
              className="col-md-6 offset-md-3"
              initial={{ x: '-100vw' }}
              animate={{ x: 0 }}
              transition={{ stiffness: 150 }}
            >        
          <div style={{marginTop:'2.5rem',paddingTop:'14rem',paddingBottom:'20rem',backgroundColor:'#E0E0E0'}}>
            <div style={{textAlign:'center'}}>
              Loading Data&nbsp;&nbsp;  
              <div className="spinner-grow" style={{width: '0.5rem', height: '0.5rem'}} role="status"></div>
              <div className="spinner-grow" style={{width: '0.5rem', height: '0.5rem'}} role="status"></div>
              <div className="spinner-grow" style={{width: '0.5rem', height: '0.5rem'}} role="status"></div>
              <br />
              <br />
              <div className="spinner-border text-success" role="status">
                <span className="sr-only">L...</span>
              </div>&nbsp;&nbsp;&nbsp;&nbsp;
              <div className="spinner-border text-danger" role="status">
                <span className="sr-only">L...</span>
              </div>&nbsp;&nbsp;&nbsp;&nbsp;
              <div className="spinner-border text-warning" role="status">
                <span className="sr-only">L...</span>
              </div>&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
          </motion.div>
          )}
        </div>
      )

}

export default withRouter(LandingPage);
