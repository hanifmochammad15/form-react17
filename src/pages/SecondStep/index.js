import {useState, React, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import { useHistory, withRouter } from 'react-router-dom';
import { ButtonNext, ButtonPrev, Gap, FaExclamationTriangle, FaAsterisk , ModalBots } from '../../components';
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion';
import { updateForm, setPageForm, getValidasiKtp, getInquiryRek, setErrorForm }  from '../../config/redux/action'

const SecondStep = (props) => {
  //const { merchant } = props;
  const { dataForm } = useSelector(state => state.createRegistrationReducer);

  const { register, setError, handleSubmit, setValue, getValues, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      no_ktp: dataForm.body.no_ktp,
      nama_ktp: dataForm.body.nama_ktp,
      no_rek : dataForm.body.no_rek,
      nama_rek : dataForm.body.nama_pemilik_rek,
      kantor_cabang : dataForm.body.nama_uker_rek,
      no_npwp : dataForm.body.no_npwp,
      nama_npwp : dataForm.body.nama_npwp,
      no_pks : dataForm.body.no_pks,
      tgl_berlaku_pks : dataForm.body.tgl_pks,
      no_siup : dataForm.body.no_siup,

    }
  });

  const id = props.match.params.id;
  const dispatch = useDispatch();
  let history = useHistory();

  const [namaKtp, setNamaKtp] = useState('');
  const [noKtp, setNoKtp] = useState('');
  const [noRek, setNorek] = useState('');
  const [tglPks, setTglPks] = useState('');
  const [typePks, setTypePks] = useState('text');
  const [validasiKtp, setValidasiKtp] = useState('');
  const [validasiRekening, setValidasiRekening] = useState('');
  const [disabled, setDisabled] = useState(null); //disabled required or not
  const [failedRek, setFailedRek] = useState(0); //set Hit Rek
  const [failedKtp, setFailedKtp] = useState(0); //set Hitt
  
  const [titleModal, setTitleModal] = useState('');
  const [message1Modal, setMessage1Modal] = useState('');
  const [message2Modal, setMessage2Modal] = useState('');
  const [message3Modal, setMessage3Modal] = useState('');
  const [showModal, setShowModal] = useState(false);

  
  useEffect(() => {
    if(dataForm.submitPage === 0){
      history.push(`/first/${id}`)
    }
    if( dataForm.body.merchant_type === "2" ){
      setDisabled(false);
    }else{
      setDisabled(true);
    }
    setNoKtp(dataForm.body.no_ktp);
    setNamaKtp(dataForm.body.nama_ktp);
    setNorek(dataForm.body.no_rek);
    if(dataForm.body.tgl_berlaku_pks){
      setTypePks("date")
      setTglPks(dataForm.body.tgl_berlaku_pks);
      clearErrors('tgl_berlaku_pks')
      //setValue('tgl_berlaku_pks', dataForm.body.tgl_berlaku_pks)
    }
  }, [dataForm, clearErrors, history, id])
  
  const changeTypePks = useCallback (()=>{
    clearErrors('tgl_berlaku_pks')
    setTypePks("date")
    },[clearErrors])

  useEffect(() => {
  }, [changeTypePks])

  const getValidasiKtpFunc = useCallback (async ()=>{
    try {
        const result = await dispatch(getValidasiKtp(noKtp, namaKtp) )
        if(result.data.content.responseCode === '00'){
          if(result.data.content.sesuai.toUpperCase()==="SESUAI"){
            setValidasiKtp("Valid")
            clearErrors('no_ktp')
            clearErrors('nama_ktp')
          }else{
            setError("no_ktp", { message: "Invalid" })
            setError("nama_ktp", { message: "Invalid" })
            setValidasiKtp("")
            let count = failedKtp + 1
            setFailedKtp(count)
            if (failedKtp > 15){
              setMessage1Modal(`Please contact administrator! ERROR : Your Data not found`)
              setMessage2Modal('')
              setMessage3Modal('')
              setShowModal(true)
            }
          }
        }else{
          setError("no_ktp", { message: "Invalid" })
          setError("nama_ktp", { message: result.data.content.responseMessage })
          setValidasiKtp("")
          let count = failedKtp + 1
          setFailedKtp(count)
          if (failedKtp >= 15){
            setTitleModal("Warning")
            setMessage1Modal(`Please contact administrator! ERROR : ${result.data.content.responseMessage  ||''}`)
            setMessage2Modal('')
            setMessage3Modal('')
            setShowModal(true)
          }
        }
    } catch (error) {
      setError("nama_ktp", { message: "Invalid" })
      setValidasiKtp("")
      let count = failedKtp + 1
      setFailedKtp(count)
      console.log('error', error);
      //window.alert("Please contact administrator! \n ERROR : " + error);
      if(error.response.data.Exception){
        dispatch(setErrorForm("Token invalid or Expired")); 
        history.push(`/wrong/${id}`)
      }else if (failedKtp >= 15){
        setTitleModal("Warning")
        setMessage1Modal(`Please contact administrator! ERROR :  ${error}`)
        setMessage2Modal(`error code : ${error.response.data.responseCode || ''}`)
        setMessage3Modal('')
        setShowModal(true)
      }
    }
  },[noKtp, namaKtp, setError, setValidasiKtp, clearErrors, failedKtp, dispatch, history, id])

  useEffect(() => {
    if (failedKtp <= 20){
      if (getValues('no_ktp').length === 16 && namaKtp !=="" && validasiKtp !== "Valid"){
        const delayDebounceFn = setTimeout(() => {
          // Send Axios request here
          getValidasiKtpFunc(noKtp, namaKtp)
        }, failedKtp >= 15 ? 15000 : failedKtp >= 10 ? 10000 : failedKtp >= 5 ? 5000 : 3000)//delay 3 second
        return () => clearTimeout(delayDebounceFn)
      }
    }else{
      return false;
    }
  }, [getValidasiKtpFunc, noKtp, namaKtp, validasiKtp, getValues, failedKtp])

    const getInquiryRekFunc = useCallback (async () => {
      try {
        if (typeof noRek !== "undefined" && noRek !== "" && noRek.replace(/-/g,"").length === 15 ){
          const result = await dispatch(getInquiryRek(noRek.replace(/-/g,"")));
            if(result.data.responseCode === '00'){
              clearErrors('no_rek')
              setValue('kantor_cabang', result.data.content[0].kantorCabang)
              setValue('nama_rek', result.data.content[0].sname)
              setValidasiRekening("Valid")
              clearErrors("kantor_cabang")
              clearErrors("nama_rek")
            }else{
              setValue('kantor_cabang', '')
              setValue('nama_rek','')   
              setValidasiRekening('')
              setError("no_rek", { message: "Invalid" })
              let count = failedRek + 1
              setFailedRek(count)
              if (failedRek >= 10){
                setTitleModal("Warning")
                setMessage1Modal(`Please contact administrator! ERROR :  Data Not Found`)
                setMessage2Modal(``)
                setMessage3Modal('')
                //setMessage3Modal(`error desc : ${ typeof error.response.data.message !=='undefined' ? error.response.data.message : typeof error.response.data.ResponseDescription !=="undefined" ? error.response.data.ResponseDescription :""}`)
                setShowModal(true)
              }
            }  
        }
      } catch (error) {
        setValue('kantor_cabang', '')
        setValue('nama_rek','')
        setValidasiRekening('')
        setError("no_rek", { message: "Invalid" })
        console.log('error', error);
        let count = failedRek + 1
        setFailedRek(count)
        if(error.response.data.Exception){
          dispatch(setErrorForm("Token invalid or Expired")); 
          history.push(`/wrong/${id}`)
        }else if (failedRek >= 10){
          setTitleModal("Warning")
          setMessage1Modal(`Please contact administrator! ERROR :  ${error}`)
          setMessage2Modal(`error code : ${error.response.data.responseCode || ''}`)
          setMessage3Modal('')
          //setMessage3Modal(`error desc : ${ typeof error.response.data.message !=='undefined' ? error.response.data.message : typeof error.response.data.ResponseDescription !=="undefined" ? error.response.data.ResponseDescription :""}`)
          setShowModal(true)
        }
        //window.alert("Please contact administrator! \n ERROR : " + error);
      
      }
  }, [/*errors.no_rek,*/failedRek, noRek, setFailedRek, setError,setValue, clearErrors, dispatch, history, id]);

  useEffect(() => {
    if (failedRek <= 20){
      const delayDebounceFn = setTimeout(() => {
        // Send Axios request here
        getInquiryRekFunc()
      }, failedRek > 0  ? failedRek * 2000 : 2000)//delay 2  if failed 

      return () => clearTimeout(delayDebounceFn)
    }else{
      return false;//if two 20 time failed cannot hit
    }
  }, [getInquiryRekFunc, failedRek])

  const handleKTP = (e) => {
    setValidasiKtp("")
    setValue('nama_ktp','')
    clearErrors('no_ktp')
    clearErrors('nama_ktp')
    let ktpInput  = e.target.value.replace(/[^\d]/g, '');
    const cvLength = ktpInput.length; 
    if (cvLength < 17) {
      setNoKtp(ktpInput) 
      setValue('no_ktp',ktpInput) 
      dispatch(updateForm({'no_ktp' :ktpInput }))

    }
  };

  const handleNoRek = (e) => {
    clearErrors("no_rek")
    if(dataForm.body.no_rek !== "" ){
      setValue('kantor_cabang','')
      setValue('nama_rek','')
      setValidasiRekening('')
    }//validasi kembali
    let noRekInput 
    const currentValue  = e.target.value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length; 
      if (cvLength < 5) {
        noRekInput = currentValue
        setNorek(noRekInput)
        setValue('no_rek',noRekInput)
        dispatch(updateForm({'no_rek' :noRekInput }))
      }; 
      if (cvLength >= 5 && cvLength < 7) {
        noRekInput = `${currentValue.slice(0, 4)}-${currentValue.slice(4, 6)}`
        setNorek(noRekInput)
        setValue('no_rek',noRekInput)
        dispatch(updateForm({'no_rek' :noRekInput }))
      }; 
      if (cvLength >= 7 && cvLength <= 12) {
        noRekInput = `${currentValue.slice(0, 4)}-${currentValue.slice(4, 6)}-${currentValue.slice(6, 12)}`
        setNorek(noRekInput)
        setValue('no_rek',noRekInput)
        dispatch(updateForm({'no_rek' :noRekInput }))
      }; 
      if (cvLength > 12 && cvLength <= 14) {
        noRekInput = `${currentValue.slice(0, 4)}-${currentValue.slice(4, 6)}-${currentValue.slice(6, 12)}-${currentValue.slice(12, 14)}`
        setNorek(noRekInput)
        setValue('no_rek',noRekInput)
        dispatch(updateForm({'no_rek' :noRekInput }))
      }; 
      if (cvLength === 15) {
        noRekInput = `${currentValue.slice(0, 4)}-${currentValue.slice(4, 6)}-${currentValue.slice(6, 12)}-${currentValue.slice(12, 14)}-${currentValue.slice(14, 15)}` 
        setNorek(noRekInput)
        setValue('no_rek',noRekInput)
        dispatch(updateForm({'no_rek' :noRekInput }))
      };
  };

  const handleNPWP = (e) => {
    clearErrors('no_npwp')
    setValue('nama_npwp','')
    let noNpwpInput
    const currentValue  = e.target.value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length; 
      if (cvLength < 3) {
        noNpwpInput = currentValue
        setValue('no_npwp',noNpwpInput)
        dispatch(updateForm({'no_npwp' :noNpwpInput }))
      }; 
      if (cvLength >= 3 && cvLength < 6) {
        noNpwpInput = `${currentValue.slice(0, 2)}.${currentValue.slice(2, 5)}`
        setValue('no_npwp',noNpwpInput)
        dispatch(updateForm({'no_npwp' :noNpwpInput }))
      }; 
      if (cvLength >= 6 && cvLength <= 8) {
        noNpwpInput = `${currentValue.slice(0, 2)}.${currentValue.slice(2, 5)}.${currentValue.slice(5, 8)}`
        setValue('no_npwp',noNpwpInput)
        dispatch(updateForm({'no_npwp' :noNpwpInput }))
      }; 
      if (cvLength > 8 && cvLength <= 9) {
        noNpwpInput = `${currentValue.slice(0, 2)}.${currentValue.slice(2, 5)}.${currentValue.slice(5, 8)}.${currentValue.slice(8, 9)}`
        setValue('no_npwp',noNpwpInput)
        dispatch(updateForm({'no_npwp' :noNpwpInput }))
      }; 
      if (cvLength > 9 && cvLength <= 12) {
        noNpwpInput = `${currentValue.slice(0, 2)}.${currentValue.slice(2, 5)}.${currentValue.slice(5, 8)}.${currentValue.slice(8, 9)}-${currentValue.slice(9, 12)}`
        setValue('no_npwp',noNpwpInput)
        dispatch(updateForm({'no_npwp' :noNpwpInput }))
      }; 
      if (cvLength > 12 && cvLength <= 15) {
        noNpwpInput = `${currentValue.slice(0, 2)}.${currentValue.slice(2, 5)}.${currentValue.slice(5, 8)}.${currentValue.slice(8, 9)}-${currentValue.slice(9, 12)}.${currentValue.slice(12, 15)}`
        setValue('no_npwp',noNpwpInput)
        dispatch(updateForm({'no_npwp' :noNpwpInput }))
      };
      if (cvLength > 15 && cvLength <= 16) {
        noNpwpInput = `${currentValue.slice(0, 2)}.${currentValue.slice(2, 5)}.${currentValue.slice(5, 8)}.${currentValue.slice(8, 9)}-${currentValue.slice(9, 12)}.${currentValue.slice(12, 15)}.${currentValue.slice(15, 16)}`
        setValue('no_npwp',noNpwpInput)
        dispatch(updateForm({'no_npwp' :noNpwpInput }))
      };

      
  };

  const handleNamaNPWP = (e) => {
    clearErrors('nama_npwp');

    if(getValues('no_npwp').length > 0 &&  e.target.value.length <= 40){
        setValue("nama_npwp",e.target.value.toUpperCase()) 
        dispatch(updateForm({'nama_npwp' :e.target.value.toUpperCase() }))
    }else{
      setError("no_npwp", { message: "FILL NO NPWP FIRST" });
    }
  }
  const handleInputNamaKtp = (e) => {

        if(noKtp !==""){
          if (validasiKtp ==="Valid"){
            setValue("no_ktp","")
            setNoKtp("")
            setValidasiKtp("")
          }
          setError("nama_ktp", { message: "Invalid" })
          //clearErrors("no_ktp")
          //clearErrors('nama_ktp')
          setNamaKtp(e.target.value.toUpperCase());
          if (e.target.value.length <= 50){
            setValue("nama_ktp",e.target.value.toUpperCase())
            dispatch(updateForm({'nama_ktp' :e.target.value.toUpperCase() }))
          }
        }else{
          setError("no_ktp", { message: "FILL NO KTP FIRST" });
          return false;
        }
  };

const handleNoSiup = (e)=>  {
  clearErrors('no_siup');
  if (e.target.value.length <= 40) {
    setValue('no_siup',e.target.value.toUpperCase()) 
    dispatch(updateForm({'no_siup' :e.target.value.toUpperCase() }))
  }
}

const handlePks = (e)=>{
  clearErrors('tgl_berlaku_pks');
  setTglPks(e.target.value)
  dispatch(updateForm({'tgl_berlaku_pks' :e.target.value }))
}

const handlePksNo = (e)=>  {
  clearErrors('no_pks');
  if(e.target.value.length <= 40){
    setValue('no_pks',e.target.value.toUpperCase()) 
    dispatch(updateForm({'no_pks' : e.target.value.toUpperCase() }))
  }
}  
  const handlePrev = (data) => {
    
    history.push(`../first/${id}`)
  }

  const onSubmit = (data) => {
    let errorReq = 0
    if (validasiKtp !== 'Valid'){
      errorReq +=1
      setError("nama_ktp", { message: "Invalid" })
    }
    if (validasiRekening !== 'Valid'){
      errorReq +=1
      setError("no_rek", { message: "Invalid" })
    }
    if (errorReq === 0){
      //props.updateMerchant(data)
      dispatch(setPageForm(2)); 
      dispatch(updateForm(data) )
      //console.log('dataPageTwo',data)
      history.push(`/third/${id}`)

    }else{
      return false
    }
  };
  
  return (
    <Form className="input-form" onSubmit={handleSubmit(onSubmit)}>
      <motion.div
        className="col-md-6 offset-md-3"
        initial={{ x: '-100vw' }}
        animate={{ x: 0 }}
        transition={{ stiffness: 150 }}
      >
        <ModalBots title={titleModal} message1={message1Modal || ''} message2={message2Modal || ''} message3={message3Modal || ''}  showModalBootsrap = {showModal}   buttonOk={false} onClick ={ () => setShowModal(false)} /> 
        <Form.Group controlId="no_ktp">
          <Form.Label>No KTP <FaAsterisk size={'0.5em'} color={'red'} /></Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your KTP Number"
            autoComplete="off"
            size="sm"
            data-inputmask-mask="[9-]AAA-999"
            value={getValues('no_ktp')||''}
              {...register('no_ktp', {
                required: 'NO KTP is required.',
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'NO KTP should contain only  numbers.'
                }
                })}
                onChange={handleKTP}
            className={`${errors.no_ktp ? 'input-error' : ''}`}
          />
          {errors.no_ktp && (
            <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.no_ktp.message}</p>
          )}
        </Form.Group>
        {!errors.no_ktp && ( <Gap height={20} />)}
        <Form.Group controlId="nama_ktp">
          <Form.Label>Nama Lengkap <FaAsterisk size={'0.5em'} color={'red'} /> {validasiKtp && (<span className="validasi-ktp">({validasiKtp})</span >)}</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            autoComplete="off"
            size="sm"
            value={getValues('nama_ktp')||''}
              {...register('nama_ktp', {
                required: 'KTP Name is required.',
                pattern: {
                value: /^[A-Za-z0-9 _]+$/,
                message: 'KTP Name should contain only characters and numbers.'
                }
                })}
                onChange={handleInputNamaKtp}
            className={`${errors.nama_ktp ? 'input-error' : ''}`}
          />
          {errors.nama_ktp && (
            <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.nama_ktp.message}</p>
          )}
        </Form.Group>
        {!errors.nama_ktp && ( <Gap height={20} />)}
        <Form.Group controlId="no_rek">
          <Form.Label>No Rekening <FaAsterisk size={'0.5em'} color={'red'} /> {validasiRekening && (<span className="validasi-ktp">({validasiRekening})</span >)}</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your Account Number"
            autoComplete="off"
            size="sm"
            value={getValues ('no_rek')||'' }
              {...register('no_rek', {
                required: 'No Rekening is required.',
                pattern: {
                  value: /^[0-9-]+$/,
                  message: 'No Rekening should contain only  numbers.'
                }
                })}
                onChange={handleNoRek}
            className={`${errors.no_rek ? 'input-error' : ''}`}
          />
          {errors.no_rek && (
            <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.no_rek.message}</p>
          )}
        </Form.Group>
        {!errors.no_rek && ( <Gap height={20} />)}
        <Form.Group controlId="nama_rek">
          <Form.Label>Nama Pemilik Rekening</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your Account Name"
            autoComplete="on"
            size="sm"
            value={getValues ('nama_rek')||'' }
              {...register('nama_rek', {
                required: 'Nama pemilik Rekening is required.',
                pattern: {
                  value: /^[A-Za-z0-9 _]+$/,
                  message: 'Account name should contain only characters and numbers.'
                }
                })}
            className={`${errors.nama_rek ? 'input-error' : ''}`}
          />
          {errors.nama_rek && (
            <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.nama_rek.message}</p>
          )}
        </Form.Group>
        {!errors.nama_rek && ( <Gap height={20} />)}
        <Form.Group controlId="kantor_cabang">
          <Form.Label>Kantor Cabang</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your Bank Branch Office"
            autoComplete="on"
            size="sm"
            value={getValues ('kantor_cabang')||'' }
              {...register('kantor_cabang', {
                required: 'Kantor Cabang is required.',
                pattern: {
                  value: /^[A-Za-z0-9 _]+$/,
                  message: 'Kantor Cabang should contain only characters and numbers.'
                }
                })}
            className={`${errors.kantor_cabang ? 'input-error' : ''}`}
          />
          {errors.kantor_cabang && (
            <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.kantor_cabang.message}</p>
          )}
        </Form.Group>
        {!errors.kantor_cabang && ( <Gap height={20} />)}  
        <Form.Group controlId="no_npwp">
          <Form.Label>No NPWP {!disabled && (<FaAsterisk size={'0.5em'} color={'red'} />)} </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your NPWP Number"
            autoComplete="off"
            size="sm"
            value={getValues ('no_npwp')||'' }
            {...register('no_npwp', {
              required: { 
                value : disabled ? false : true,
                message :  'No NPWP is required.'
              },
              pattern: {
                value: /^[0-9.-]+$/,
                message: 'No NPWP should contain only  numbers.'
              },
              minLength: {
                value : 15,
                message : 'No NPWP must be 15 or 16 digit'
              }
              }) }
            onChange={handleNPWP}
            className={`${errors.no_npwp ? 'input-error' : ''}`}
          />
          {errors.no_npwp && (
            <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.no_npwp.message}</p>
          )}
        </Form.Group>
        {!errors.no_npwp && ( <Gap height={20} />)}
        <Form.Group controlId="nama_npwp">
          <Form.Label>Nama NPWP {!disabled && (<FaAsterisk size={'0.5em'} color={'red'} />)} </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            autoComplete="off"
            size="sm"
            value={getValues ('nama_npwp')||'' }
              {...register('nama_npwp', {
                required: { 
                  value :  getValues('no_npwp')  ? true : disabled ? false : true,
                  message :  'Nama NPWP is required.',
                },
                pattern: {
                value: /^[A-Za-z0-9 -/.,&_]+$/g,
                message: 'Nama NPWP should contain only characters and numbers.'
                }
                })}
                onChange={handleNamaNPWP}
            className={`${errors.nama_npwp ? 'input-error' : ''}`}
          />
          {errors.nama_npwp && (
            <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.nama_npwp.message}</p>
          )}
        </Form.Group>
        {!errors.nama_npwp && ( <Gap height={20} />)}
        <Form.Group controlId="no_pks">
          <Form.Label>No PKS <FaAsterisk size={'0.5em'} color={'red'} /></Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your PKS Number"
            autoComplete="off"
            size="sm"
            value={getValues ('no_pks') ||'' }
              {...register('no_pks', {
                required: 'No PKS is required.',
                pattern: {
                  value: /^[A-Za-z0-9 _/.-]+$/,
                  message: 'No PKS should contain only characters and numbers.'
                }
                })}
                onChange={handlePksNo}
            className={`${errors.no_pks ? 'input-error' : ''}`}
          />
          {errors.no_pks && (
            <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.no_pks.message}</p>
          )}
        </Form.Group>
        {!errors.no_pks && ( <Gap height={20} />)}
        <Form.Group controlId="tgl_berlaku_pks">
          <Form.Label>Tanggal Berlaku PKS <FaAsterisk size={'0.5em'} color={'red'} /></Form.Label>
          <Form.Control
            type={typePks}
            placeholder="Enter your PKS Date"
            autoComplete="off"
            size="sm"
            value={tglPks || ''}
              {...register('tgl_berlaku_pks', {
                required: 'Tanggal PKS is required.',
                pattern: {
                value: /^[0-9-]+$/g,
                message: 'Tanggal PKS should date format yyyy/mm/dd.'
                }
                })}
                onFocus={changeTypePks}
                onChange={handlePks}
            className={`${errors.tgl_berlaku_pks ? 'input-error' : ''}`}
          />
          {errors.tgl_berlaku_pks && (
            <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.tgl_berlaku_pks.message}</p>
          )}
        </Form.Group>
        {!errors.tgl_berlaku_pks && ( <Gap height={20} />)}
        <Form.Group controlId="no_siup">
          <Form.Label>No SIUP {!disabled && (<FaAsterisk size={'0.5em'} color={'red'} />)} </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your SIUP Number"
            autoComplete="off"
            size="sm"
            {...register('no_siup', {
              required: { 
                value : disabled ? false : true,
                message :  'No SIUP is required.',
              },
              pattern: {
              value: /^[A-Za-z0-9 _/.-]+$/,
              message: 'No SIUP should contain only characters and numbers.'
              }
              })}
            value={getValues('no_siup') || '' }
                onChange={handleNoSiup}
            className={`${errors.no_siup ? 'input-error' : ''}`}
          />
          {errors.no_siup && (
            <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.no_siup.message}</p>
          )}
        </Form.Group>
        {!errors.no_siup && ( <Gap height={20} />)}
            <Gap height={40} />
            <ButtonPrev title="Prev" onClick={handlePrev}/>
            <ButtonNext title="Next"/>
      </motion.div>
    </Form>
  );
};

export default withRouter(SecondStep)
