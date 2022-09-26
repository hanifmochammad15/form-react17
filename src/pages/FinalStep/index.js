import { React } from 'react';
import { ButtonDone, Gap } from '../../components';
import { useHistory, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion';
import './finalstep.scss';
import {IconCheckedAnimation } from '../../../src/assets';
import {IconFailedAnimation } from '../../../src/assets';


const FinalStep = (props) => {
  const id = props.match.params.id;
  const { dataResult } = useSelector(state => state.resultReducer);  

  let history = useHistory();

  const handleSucces =()=>{
    history.push(`/close`)
  }

  const handleFailed =()=>{
    history.push(`/third/${id}`)

  }

  return (
      <motion.div
        className="col-md-6 offset-md-3"
        initial={{ x: '-100vw' }}
        animate={{ x: 0 }}
        transition={{ stiffness: 150 }}
        > 
      <Gap height={20} />
      <div className="card">
        <div className="card-body">
          {dataResult.final === 'success' ?  <h1 className='title-succes'>Registration Success</h1> : <h1 className='title-succes'>Registration Failed </h1>}
            <div className="success-position">
              <center>
              <h1 className='title-succes'>{dataResult.final === 'success' ? <img src ={IconCheckedAnimation} className='checked-animation' alt='checked-icon'/>: <img src ={IconFailedAnimation} className='checked-animation' alt='failed-icon'/>}</h1>
              </center>
            </div>
          <br />
          <p className='p-succes'> {dataResult.final === 'success' ? `Selamat. Registrasi id : ${id} telah berhasil diunggah.` : `Maaf. Registrasi id : ${id} gagal diunggah. ${dataResult.error}` }</p>
          <div className="button-position">
          <center><ButtonDone title={dataResult.final === 'success' ? 'Done' : 'Retry'} onClick ={dataResult.final === 'success' ? handleSucces : handleFailed}/></center>
          </div>
        </div>
      </div>
      </motion.div>
  );
};

export default withRouter(FinalStep);
