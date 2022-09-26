import { React, useState, useEffect, useRef, useCallback } from 'react';
import {  Gap } from '../../components';
import { useHistory, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion';
import { Image404 } from '../../../src/assets';
import { ImageWrong } from '../../../src/assets';
import { setTotalError }  from '../../config/redux/action'

const WrongPage = (props) => {

  let id = props.match.params.id;
  const { errorMessage } = useSelector(state => state.createRegistrationReducer);
  const { TotalErrorGLobal } = useSelector(state => state.createRegistrationReducer);
  const dispatch = useDispatch();

  const [timer, setTimer] = useState('00:00:00');
  //const [timer, setTimer] = useState('00');
  let history = useHistory();

  const Ref = useRef(null);

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
        total, hours, minutes, seconds
    };
  }

    const startTimer = useCallback((e) => {
      let { total, hours, minutes, seconds } 
                  = getTimeRemaining(e);
      if (total >= 0) {
          setTimer(
              (hours > 9 ? hours : '0' + hours) + ':' +
              (minutes > 9 ? minutes : '0' + minutes) + ':'
              + 
              (seconds > 9 ? seconds : '0' + seconds)
          )
      }
  },[])

  const clearTimer = useCallback((e) => {
      setTimer('00:00:10');
      if (Ref.current) clearInterval(Ref.current);
      const id = setInterval(() => {
          startTimer(e);
      }, 1000)
      Ref.current = id;
    },[ startTimer])

  const getDeadTime = () => {
      let deadline = new Date();
      deadline.setSeconds(deadline.getSeconds() + 10);
      return deadline;
  }

  useEffect(() => {
      clearTimer(getDeadTime());
      return () => {
        clearTimer(); // This worked for me
      };
  }, [clearTimer]);
  useEffect(() => {
    if(typeof id !== "undefined"){
        const delayDebounceFn = setTimeout(() => {
          if (TotalErrorGLobal === 2){
            history.push(`../close`)
          }else if(errorMessage === "Token invalid or Expired"){
            //history.push(`../token/${id}`)
            history.push(`../close`)
          }else if(errorMessage === "wait.. service not ready, Failed to get Token"){
            dispatch(setTotalError(TotalErrorGLobal + 1)); 
            history.push(`../token/${id}`)
          }else{
            history.push(`../first/${id}`)
          }
        }, 10000)//delay 10 second
        return () => clearTimeout(delayDebounceFn)
      }
      return false
  }, [history, id, errorMessage, dispatch, TotalErrorGLobal])
  return (
    <motion.div
      className="col-md-6 offset-md-3"
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      transition={{ stiffness: 150 }}
    > 
      <Gap height={200} />
        <div  style={{textAlign:'center'}}>
        {typeof id === "undefined" ? 
          <div>
            <h1>404! Page not Found</h1>
              <img src ={Image404} style={{width: '250px', height: '250px'}} alt='checked-icon'/>
              <br/>{ errorMessage || ''}
            </div> : 
          <div>
            <h1>Oopps! Something went wrong</h1> 
            <img src ={ImageWrong} style={{width: '250px', height: '250px'}} alt='checked-icon'/>
            <br/>{ errorMessage || ''}
            </div> 
            }
          {typeof id === "undefined" ? 
          '' : <h1>{timer}</h1>
            }
        </div>
      <Gap height={250} />
    </motion.div>
  );
};

export default withRouter(WrongPage);
