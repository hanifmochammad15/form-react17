import {useState, React, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { ButtonNext, Gap, FaExclamationTriangle, FaAsterisk, ModalBots } from '../../components';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, withRouter } from 'react-router-dom';
import { motion } from 'framer-motion';
import { updateForm, setPageForm, setErrorForm, getDetail, getChannel, getSubChannel, getKodePos, getMCC, getPnReferral }  from '../../config/redux/action'

const FirstStep = (props) => {

  //const { merchant } = props;
  const { dataDetails } = useSelector(state => state.getDetailReducer);
  const { dataForm } = useSelector(state => state.createRegistrationReducer);
  const { dataChannels } = useSelector(state => state.channelReducer);
  const { dataSubChannels } = useSelector(state => state.subChannelReducer);
  const { dataKodePos } = useSelector(state => state.kodePosReducer);
  const { dataMCC } = useSelector(state => state.mccReducer);
  const { dataPnReferral } = useSelector(state => state.pnReferralReducer);
  const { control, register, handleSubmit, setValue, getValues, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
        app_id : dataDetails.appId,
        channel: dataForm.body.channel,
        subchannel: dataForm.body.subchannel,
        kriteria: dataForm.body.kriteria,
        merchant_type: dataForm.body.merchant_type,
        merchant_nama: dataForm.body.merchant_nama,
        merchant_alamat: dataForm.body.merchant_alamat,
        kode_pos : dataForm.body.kode_pos,
        merchant_telepon : dataForm.body.merchant_telepon,
        merchant_email : dataForm.body.merchant_email,
        merchant_mcc : dataForm.body.merchant_mcc,
        merchant_pn_referral : dataForm.body.merchant_pn_referral,
        //error_message : dataForm.errorMessage,
        
    }
  });
  
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [hitSubChannel, setHitSubChannel] = useState(0);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedKriteria, setSelectedKriteria] = useState('');
  const [selectedMerchantType, setSelectedMerchantType] = useState('');
  const [selectedKodePos, setSelectedKodePos] = useState('');
  const [selectedMCC, setSelectedMCC] = useState('');
  const [selectedPnReferral, setSelectedPnReferral] = useState('');
  const [failedErrorDetail, setFailedErrorDetail] = useState(0);
  const [failedError, setFailedError] = useState(0);

  const [titleModal, setTitleModal] = useState('');
  const [message1Modal, setMessage1Modal] = useState('');
  const [message2Modal, setMessage2Modal] = useState('');
  const [message3Modal, setMessage3Modal] = useState('');
  const [showModal, setShowModal] = useState(false);

  const id = props.match.params.id;
  const dispatch = useDispatch();

  let history = useHistory();

  useEffect(() => {  
    const getDetailFunc = async () => {
      try {
          setIsLoadingDetail(true);
          if (Object.keys(dataDetails).length === 0){
            const result = await dispatch(getDetail(id));
            if (result.data.responseCode === "00" &&  Object.keys(result.data.responseData).length > 0){
              if(result.data.responseData.status === 'DRAFT'){
                    setValue('app_id',result.data.responseData.appId)
                    setFailedError(0)
                  if(result.data.responseData.alamatPemilik){ 
                      setValue('merchant_alamat', result.data.responseData.alamatPemilik.toUpperCase())
                  }else{
                      setValue('merchant_alamat', '')
                  }
                  if( result.data.responseData.teleponPemilik){ 
                      setValue('merchant_telepon', result.data.responseData.teleponPemilik)
                  }else{
                      setValue('merchant_telepon', '')
                  }
              }else{
                setValue('app_id',result.data.responseData.appId)
                let messageError = "app Id already submit"
                dispatch(setErrorForm(messageError)); 
                history.push(`/wrong`)
                return false
              }
            }
            setIsLoadingDetail(false);
        }

      } catch (error) {
        setIsLoadingDetail(false);
        console.log('error', error);
        let count = failedErrorDetail + 1
        setFailedErrorDetail(count)
        if(error.response.data.Exception){
            dispatch(setErrorForm("Token invalid or Expired")); 
            history.push(`/wrong/${id}`)
        }else if(failedErrorDetail >= 5 && error.response.data.responseCode ==="01"){
            dispatch(setErrorForm(error.response.data.responseDescription)); 
            history.push(`/wrong`)
        }else if (failedErrorDetail >= 5){
            dispatch(setErrorForm("wait.. service not ready")); 
            history.push(`/wrong/${id}`)
        }
        return false
        //window.alert("Please contact administrator! \n ERROR : " + error);

      }
    };
    getDetailFunc();
    return () => {  
      setIsLoadingDetail(false);
    }  
  }, [dataDetails, /*props,*/ dispatch, id, setValue, failedErrorDetail, history]);  

  const getChannelFunc = useCallback( async() => {
    try {
        if ( dataChannels.length < 1 ){
            const result = await dispatch(getChannel());
            if (result.data.error === false){
              setFailedError(0)
            }else{
                throw result.data.responseMessage
              }
        }
    } catch (error) {
      console.log('error', error);
      let count = failedError + 1
      setFailedError(count)
      if(error.response.data.Exception){
        dispatch(setErrorForm("Token invalid or Expired")); 
        history.push(`/wrong/${id}`)
      }else if (failedError >= 5){
        setTitleModal("Warning")
        setMessage1Modal(`Please contact administrator! ERROR :  ${error}`)
        setMessage2Modal(`error code : ${error.response.data.responseCode || ''}`)
        setMessage3Modal('')
        setShowModal(true)
      }
      //window.alert("Please contact administrator! \n ERROR : " + error);
    }
  }, [dispatch, dataChannels,  history, id, failedError]);  

  useEffect(() => {
    if (failedError <= 5){
      const delayDebounceFn = setTimeout(() => {
        // Send Axios request here
        getChannelFunc()
      },  500)//delay 1/2  second 
      return () => clearTimeout(delayDebounceFn)
    }else{
      return false;//if 5 time failed cannot hit
    }
  }, [getChannelFunc, failedError])

    const getSubChannelFunc = useCallback(async ()=>{
      try {              
        setHitSubChannel(0)
          if(failedError <= 5 && selectedChannel){
            const result = await dispatch(getSubChannel(selectedChannel.value || dataForm.body.channel));
            if (result.data.error === false){
              setFailedError(0)
            }else{
              throw result.data.responseMessage
            }
          }else{
            return false
          }
      } catch (error) {
        console.log('error', error);
        let count = failedError + 1
        setFailedError(count)
        if(error.response.data.Exception){
          dispatch(setErrorForm("Token invalid or Expired")); 
          history.push(`/wrong/${id}`)
        }else if (failedError >= 5){
          setTitleModal("Warning")
          setMessage1Modal(`Please contact administrator! ERROR :  ${error}`)
          setMessage2Modal(`error code : ${error.response.data.responseCode || ''}`)
          setMessage3Modal('')
          setShowModal(true)
        }
        //window.alert("Please contact administrator! \n ERROR : " + error);
      }
    }
  , [dataForm, dispatch, selectedChannel,  history, id, failedError]);

  useEffect(() => {
    if (hitSubChannel === 1){
      const delayDebounceFn = setTimeout(() => {
        // Send Axios request here
        getSubChannelFunc()
      },  500)//delay 1/2  second 
      return () => clearTimeout(delayDebounceFn)
    }else{
      return false;//if 5 time failed cannot hit
    }
  }, [getSubChannelFunc, hitSubChannel])

  useEffect(() => {
    const getKodePosFunc = async () => {
      try {
        if (typeof selectedKodePos !== "undefined" && selectedKodePos !== ""){
            const result = await dispatch(getKodePos(selectedKodePos));
            if (result.data.error === false){   
              setFailedError(0)  
            }
        }
      } catch (error) {
        console.log('error', error);
        let count = failedError + 1
        setFailedError(count)
        if(error.response.data.Exception){
          dispatch(setErrorForm("Token invalid or Expired")); 
          history.push(`/wrong/${id}`)
        }else if (failedError >= 5){
          setTitleModal("Warning")
          setMessage1Modal(`Please contact administrator! ERROR :  ${error}`)
          setMessage2Modal(`error code : ${error.response.data.responseCode || ''}`)
          setShowModal(true)
        }
        //window.alert("Please contact administrator! \n ERROR : " + error);
      }
    };
    getKodePosFunc();
  }, [selectedKodePos, dispatch,  history, id, failedError]);

  useEffect(() => {
    const getMCCFunc = async () => {
      try {
        if (typeof selectedMCC !== "undefined" && selectedMCC !== ""){
          const result = await dispatch(getMCC(selectedMCC));
          if (result.data.error === false){
            setFailedError(0)
          }else{
            throw result.data.RESPONSE_MESSAGE
          }   
        }
      } catch (error) {
        console.log('error', error);
        let count = failedError + 1
        setFailedError(count)
        if(error.response.data.Exception){
          dispatch(setErrorForm("Token invalid or Expired")); 
          history.push(`/wrong/${id}`)
        }else if (failedError >= 5){
          setTitleModal("Warning")
          setMessage1Modal(`Please contact administrator! ERROR :  ${error}`)
          setMessage2Modal(`error code : ${error}`) 
          setMessage3Modal('')
          setShowModal(true)   
        }
        //window.alert("Please contact administrator! \n ERROR : " + error);
      }
    };
    getMCCFunc();
  }, [selectedMCC,  history, id, dispatch, failedError]);

  useEffect(() => {
    const getPnReferralFunc = async () => {
      try {
        if (typeof selectedPnReferral !== "undefined" && selectedPnReferral !== ""){
          const result = await dispatch(getPnReferral(selectedPnReferral));
          if (result.data.error === false){
            setFailedError(0)
          }else{
            throw result.data.RESPONSE_MESSAGE
          }   
        }
      } catch (error) {
        console.log('error', error);
        let count = failedError + 1
        setFailedError(count)
        if(error.response.data.Exception){
          dispatch(setErrorForm("Token invalid or Expired")); 
          history.push(`/wrong/${id}`)
        }else if (failedError >= 5){
          setTitleModal("Warning")
          setMessage1Modal(`Please contact administrator! ERROR :  ${error}`)
          setMessage2Modal(`error code : ${error.response.data.responseCode || ''}`)
          setMessage3Modal('')
          setShowModal(true)
        }
        //window.alert("Please contact administrator! \n ERROR : " + error);
      }
    };
    getPnReferralFunc();
  }, [selectedPnReferral, history, id, selectedMCC, dispatch, failedError]);


  const handleInputNama = e => {
    clearErrors('merchant_nama'); 
    if(e.target.value.length <= 100) {
      setValue('merchant_nama',e.target.value.toUpperCase()) ;
    }
  }

  const handleInputAlamat = e => {
    clearErrors('merchant_alamat'); 
    if(e.target.value.length <= 100 ){
      setValue('merchant_alamat',e.target.value.toUpperCase()) 

    }
  }


  const handleInputChannel = e => {
    setSelectedChannel(e);
    setValue('channel',e);
    setValue('subchannel', []);
    setHitSubChannel(1)
  }

  const handleInputSubChannel = e => {
      setValue('subchannel',e);
    }
  const retrySubChannel = e => {
    clearErrors('subchannel')
    if(dataSubChannels.length < 1 && selectedChannel){
      setTimeout(() =>       
        getSubChannelFunc()
      , 1500); //delay 1.5 second
    }
}

  const handleInputKodePos = e => {
    if (e.length >= 4){
      setSelectedKodePos(e);
    }
  };

  const handleInputMCC = e => {
    if (e.length >= 1){
      setSelectedMCC(e);
    }
  };

  const handleInputPnReferral = e => {
    if (e.length >= 3){
      setSelectedPnReferral(e);
    }
  };

  const optionsPos = dataKodePos?.map( obj  => ({ 
        value: obj.kodepos+','+obj.kelurahan+','+obj.kecamatan+','+obj.kota+', '+obj.provinsi,
        label : obj.kodepos+', '+obj.kelurahan+', '+obj.kecamatan+', '+obj.kota+', '+obj.provinsi,
      }));;
  const optionsMCC = dataMCC?.map( obj  => ({ 
    value : obj.kode+'|'+obj.grup+'|'+obj.deskripsi,
    label : obj.kode+' | '+obj.grup+' | '+obj.deskripsi,
  }));
  const optionsPnReferral = dataPnReferral?.map( obj  => ({ 
    value : obj.pernr+'|'+obj.sname+'|'+obj.orgehTx,
    label : obj.pernr+' | '+obj.sname+' | '+obj.orgehTx,
  }));
  const optionsChannel =  dataChannels?.map(({ channel }) => ({ 
        value : channel,
        label: channel 
      }));
  const optionsSubChannel =  dataSubChannels?.map(({ subChannel }) => ({ 
    value : subChannel,
    label : subChannel 
  }));

  let CustomStyleDanger = {
    control: (styles, state) => ({
      ...styles,
      height: 30,
      minHeight: 30,
      fontSize: 13,
      fontFamily:  'Arial',
      boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(120, 194, 173, 0.25)" : 0,
      borderColor: state.isFocused ? "#D0EAE2" : "#f21e08;",
  }),
  }

  let CustomStyle = {
    control: (styles, state) => ({
      ...styles,
      height: 30,
      minHeight: 30,
      fontSize: 13,
      fontFamily:  'Arial',

  }),
  singleValue: styles => ({ ...styles, color: 'black' }),
  placeholder: styles => ({
        ...styles,
        color: '#636c72',
    })
  }
  
  const handleTelepon = (e) => {
      clearErrors('merchant_telepon');
      if(e.target.value.length <= 20){
        const noTlp  = e.target.value.replace(/[^\d]/g, '') 
        setValue('merchant_telepon',noTlp);
      }

  };
  const handleEmail = (e) => {
    clearErrors('merchant_email'); 
    if(e.target.value.length <= 55) {
      setValue('merchant_email',e.target.value.toLowerCase()) 
    }
  }

  const onSubmit = (data) => {
    //console.log('dataPageOne',data)
    if(!dataForm.body.no_ktp){
      data.no_ktp = dataDetails.noKtp.trim()
    }
    if(!dataForm.body.nama_ktp){
      data.nama_ktp = dataDetails.namaKtp.toUpperCase()
    }
    dispatch(updateForm(data) )
    dispatch(setPageForm(1)); 
    //props.updateMerchant(data)
    history.push(`/second/${id}`)
  };

  if(dataDetails){
    return (
      <Form className="input-form" onSubmit={handleSubmit(onSubmit)}>
        <motion.div
          className="col-md-6 offset-md-3"
          initial={{ x: '-100vw' }}
          animate={{ x: 0 }}
          transition={{ stiffness: 150 }}
        >        
            <ModalBots title={titleModal} message1={message1Modal || ''} message2={message2Modal || ''} message3={message3Modal || ''}  showModalBootsrap = {showModal}   buttonOk={false} onClick ={ () => setShowModal(false)} /> 
            <Form.Group controlId="merchant_nama">
              <Form.Label>Nama Merchant <FaAsterisk size={'0.5em'} color={'red'} /></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your merchant name"
                autoComplete="off"
                size="sm"
                value = {getValues('merchant_nama') ||''}
                  {...register('merchant_nama', {
                    required: ' Merchant name is required.',
                    pattern: {
                    value : /^[a-zA-Z0-9 !?@#$%^&/,*)(+=._-]+$/g,
                    message: 'Merchant name should contain only characters and numbers.'
                    }
                    })}
                    onChange={handleInputNama}
                className={`${errors.merchant_nama ? 'input-error' : ''}`}
              />
              {errors.merchant_nama && (
                <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.merchant_nama.message}</p>
              )}
            </Form.Group>
            {!errors.merchant_nama && ( <Gap height={20} />)}
          
            <Form.Group controlId="merchant_alamat">
              <Form.Label>Alamat <FaAsterisk size={'0.5em'} color={'red'} /> </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your Address"
                autoComplete="off"
                size="sm"
                value = {getValues('merchant_alamat') ||''}
                {...register('merchant_alamat', {
                    required: 'Alamat is required.',
                    pattern: {
                    value: /^[A-Za-z0-9 !?^&*)/,(+=._-]+$/g,
                    message: 'Alamat should contain only characters and numbers.'
                    }
                    })}
                  onChange={handleInputAlamat}
                className={`${errors.merchant_alamat ? 'input-error' : ''}`}
              />
              {errors.merchant_alamat && (
                <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.merchant_alamat.message}</p>
              )}
            </Form.Group>
            {!errors.merchant_alamat && ( <Gap height={20} />)}
            <Form.Group controlId="kode_pos">
            <Form.Label>Kode Pos <FaAsterisk size={'0.5em'} color={'red'} /> </Form.Label>
            <Controller
                  name="kode_pos"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <Select 
                    {...field} 
                    options={[...optionsPos]}
                    placeholder={<div>Type to search...</div>}
                    onInputChange={handleInputKodePos}
                    styles={errors.kode_pos ? CustomStyleDanger : CustomStyle}
                  />}
                />
                {errors.kode_pos && (
                <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;Kode Pos is required</p>
              )}
            </Form.Group>
            {!errors.kode_pos && ( <Gap height={20} />)}
            <Form.Group controlId="merchant_telepon">
              <Form.Label>Telepon <FaAsterisk size={'0.5em'} color={'red'} /> </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your Telephone Number"
                autoComplete="off"
                size="sm"
                value = {getValues('merchant_telepon') ||''}
                {...register('merchant_telepon', {
                    required: 'Telephone is required.',
                    pattern: {
                    value: /^[0-9]+$/,
                    message: 'Telephone should contain only  numbers.'
                    }
                    })}
                    onChange={handleTelepon}
                className={`${errors.merchant_telepon ? 'input-error' : ''}`}
              />
              {errors.merchant_telepon && (
                <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.merchant_telepon.message}</p>
              )}
            </Form.Group>
            {!errors.merchant_telepon && ( <Gap height={20} />)}
            <Form.Group controlId="merchant_email">
              <Form.Label>Email <FaAsterisk size={'0.5em'} color={'red'} /> </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email address"
                autoComplete="off"
                size="sm"
                value ={getValues('merchant_email') || ''}
                {...register('merchant_email', {
                  required: 'Email is required.',
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: 'Email is not valid.'
                  }
                  })}
                  onChange={handleEmail}
                className={`${errors.merchant_email ? 'input-error' : ''}`}
              />
              {errors.merchant_email && (
                <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.merchant_email.message}</p>
              )}
            </Form.Group>
            {!errors.merchant_email && ( <Gap height={20} />)}
            <Form.Group controlId="channel">
            <Form.Label>Channel <FaAsterisk size={'0.5em'} color={'red'} /> </Form.Label>
            <Controller
                  name="channel"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <Select 
                    {...field} 
                    options={[...optionsChannel]}
                    placeholder={<div>Type to search...</div>}
                    onChange={handleInputChannel}
                    onFocus={e => clearErrors('channel')}
                    styles={errors.channel ? CustomStyleDanger : CustomStyle}
                  />}
                />
                {errors.channel && (
                <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;Channel is required</p>
              )}
            </Form.Group>
            {!errors.channel && ( <Gap height={20} />)}

            <Form.Group controlId="subchannel">
            <Form.Label>Sub Channel <FaAsterisk size={'0.5em'} color={'red'} /> </Form.Label>
            <Controller
                  name="subchannel"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <Select 
                    {...field} 
                    options={[...optionsSubChannel]}
                    //value = {selectedSubChannel}
                    placeholder={<div>Type to search...</div>}
                    onChangeInput={handleInputSubChannel}
                    onFocus={retrySubChannel }
                    styles={errors.subchannel ? CustomStyleDanger : CustomStyle}
                  />}
                />
                {errors.subchannel && (
                <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;Sub Channel is required</p>
              )}
            </Form.Group>
            {!errors.channel && ( <Gap height={20} />)}
          <Form.Group controlId="kriteria">
              <Form.Label>Kriteria  <FaAsterisk size={'0.5em'} color={'red'} />  </Form.Label>
              <Form.Control
                as="select"
                name="kriteria"
                size="sm"
                defaultValue={selectedKriteria || ''}
                className={`${errors.kriteria ? 'input-error select-placeholder' : selectedKriteria ? '': dataForm.body.kriteria ? '' : 'select-placeholder'}`}
                {...register('kriteria', {
                  required: 'kriteria is required.',
                  })}           
                  onChange={(event) => {clearErrors('kriteria'); setSelectedKriteria(event.target.value)} }  
              > 
                <option value="" key="0" >-- Choose --</option>
                <option value="UBE" key="1" className="option-black">
                  UBE (Usaha Besar) | Omset: &gt; Rp 10 Milyar
                </option>
                <option value="UKE" key="2" className="option-black">
                  UKE (Usaha Kecil) | Omset: Rp 300 Juta - Rp 2,5 Milyar
                </option>
                <option value="UME" key="3" className="option-black">
                  UME (Usaha Menengah) | Omset: Rp 2,5 Milyar - Rp 10 Milyar
                </option>
                <option value="UMI" key="4" className="option-black">
                  UMI (Usaha Mikro) | Omset: &lt; Rp 300 Juta
                </option>
            </Form.Control>
            {errors.kriteria && (
                <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.kriteria.message}</p>
              )}
          </Form.Group>
          {!errors.kriteria && ( <Gap height={20} />)}
          <Form.Group controlId="merchant_type">
              <Form.Label>Merchant Type <FaAsterisk size={'0.5em'} color={'red'} /> </Form.Label>
              <Form.Control
                as="select"
                name="merchant_type"
                size="sm"
                defaultValue={selectedMerchantType || ''}
                className={`${errors.merchant_type ? 'input-error select-placeholder' : selectedMerchantType ? '': dataForm.body.merchant_type ? '' : 'select-placeholder'}`}
                {...register('merchant_type', {
                  required: 'Merchant type is required.',
                  })}           
                  onChange={(event) =>{clearErrors('merchant_type'); setSelectedMerchantType(event.target.value)}}  
              > 
                <option value="" key ="0" >-- Choose --</option>
                <option value="1" key="1" className="option-black">Tidak Berbadan Hukum</option>
                <option value="2" key="2" className="option-black">Berbadan Hukum</option>
            </Form.Control>
            {errors.merchant_type && (
                <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.merchant_type.message}</p>
              )}
          </Form.Group>     
          {!errors.merchant_type && ( <Gap height={20} />)}
          <Form.Group controlId="merchant_mcc">
              <Form.Label>MCC <FaAsterisk size={'0.5em'} color={'red'} /></Form.Label>
            <Controller
                  name="merchant_mcc"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <Select 
                    {...field} 
                    options={[...optionsMCC]}
                    placeholder={<div>Type to search...</div>}
                    onInputChange={handleInputMCC}
                    styles={errors.merchant_mcc ? CustomStyleDanger : CustomStyle}
                  />}
                />
                {errors.merchant_mcc && (
                <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;MCC is required</p>
              )}
            </Form.Group>
            {!errors.merchant_mcc && ( <Gap height={20} />)}
            <Form.Group controlId="merchant_pn_referral">
              <Form.Label>PN Referral <FaAsterisk size={'0.5em'} color={'red'} /></Form.Label>
            <Controller
                  name="merchant_pn_referral"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <Select 
                    {...field} 
                    options={[...optionsPnReferral]}
                    placeholder={<div>Type to search...</div>}
                    onInputChange={handleInputPnReferral}
                    styles={errors.merchant_mcc ? CustomStyleDanger : CustomStyle}
                  />}
                />
                {errors.merchant_pn_referral && (
                <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;PN Referral is required</p>
              )}
            </Form.Group>
            {!errors.merchant_pn_referral && ( <Gap height={20} />)}
          <Gap height={40} />
          <ButtonNext title="Next" />
        </motion.div>
      </Form>
    );
  }
    return (
      <div>
        {isLoadingDetail && (
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
    
};

export default withRouter(FirstStep);
