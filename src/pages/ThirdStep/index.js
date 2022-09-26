import {useState, React, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import { useHistory, withRouter } from 'react-router-dom';
import { ButtonNext, ButtonPrev, Gap, FaAsterisk, FaExclamationTriangle, ModalBots, /*HRThumb,*/ ButtonUpload, ThumbUpload } from '../../components';
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion';
import { updateForm, deleteForm, uploadFile, deleteFile, postToAPI, setErrorForm } from '../../config/redux/action';

const ThirdStep = (props) => {
  //const { merchant } = props;
  const { dataForm } = useSelector(state => state.createRegistrationReducer);

  const { /*register,*/ setError, formState: { errors } } = useForm({
    defaultValues: {
      ktp_file : dataForm.body.ktp_file,
      ktp_file_base64 : dataForm.body.ktp_file_base64,
      ktp_file_original : dataForm.body.ktp_file_original,
      npwp_file : dataForm.body.npwp_file,
      npwp_file_base64 : dataForm.body.npwp_file_base64,
      npwp_file_original : dataForm.body.npwp_file_original,
      pks_file : dataForm.body.pks_file,
      pks_file_base64 : dataForm.body.pks_file_base64,
      pks_file_original : dataForm.body.pks_file_original,
      siup_file : dataForm.body.siup_file,
      siup_file_base64 : dataForm.body.siup_file_base64,
      siup_file_original : dataForm.body.siup_file_original,
    }
  });
  const id = props.match.params.id;
  const dispatch = useDispatch();
  let history = useHistory();
  const inputRefKtp = useRef();
  const inputRefNpwp = useRef();
  const inputRefPks = useRef();
  const inputRefSiup = useRef();

    //
  const [loadingKtp, setLoadingKtp] = useState(false);
  const [loadingNpwp, setLoadingNpwp] = useState(false);
  const [loadingSiup, setLoadingSiup] = useState(false);
  const [loadingPks, setLoadingPks] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

  const [imgKtp, setImgKtp] = useState([]);
  const [imgPreviewKtp, setImgPreviewKtp]= useState('');
  const [imgNpwp, setImgNpwp] = useState([]);
  const [imgPreviewNpwp, setImgPreviewNpwp]= useState('');
  const [imgPks, setImgPks] = useState([]);
  const [imgPreviewPks, setImgPreviewPks]= useState('');
  const [imgSiup, setImgSiup] = useState([]);
  const [imgPreviewSiup, setImgPreviewSiup]= useState('');
  const [disabledNpwp, setDisabledNpwp] = useState(null); //disabled required or not
  const [disabledSiup, setDisabledSiup] = useState(null); //disabled required or not

  const [titleModal, setTitleModal] = useState('');
  const [message1Modal, setMessage1Modal] = useState('');
  const [message2Modal, setMessage2Modal] = useState('');
  const [message3Modal, setMessage3Modal] = useState('');
  const [showModal, setShowModal] = useState(false);

  // let [file, setFileKtp] = useState(null);
  
  let extensionAllow = ["PNG", "GIF", "JPG", "JPEG", "XLS", "XLSX", "PDF", "DOC", "DOCX"] ;

  useEffect(() => {
    if(dataForm.submitPage !== 2){
      history.push(`/first/${id}`)
    }

    if( typeof dataForm.body.no_npwp !=="undefined"){
      if(dataForm.body.no_npwp === ""){
        setDisabledNpwp(true);
      }else{
        setDisabledNpwp(false);
      }
    }else{
      setDisabledNpwp(true);
    }

    if( typeof dataForm.body.no_siup !=="undefined" ){
      if(dataForm.body.no_siup === ""){
        setDisabledSiup(true);
      }else{
        setDisabledSiup(false);
      }
    }else{
      setDisabledSiup(true);
    }
    if(dataForm.body.ktp_file){
      setImgPreviewKtp(dataForm.body.ktp_file_original);
      setImgKtp(dataForm.body.ktp_file);
    }
    if(dataForm.body.npwp_file){
      setImgPreviewNpwp(dataForm.body.npwp_file_original);
      setImgNpwp(dataForm.body.npwp_file);
    }
    if(dataForm.body.pks_file){
      setImgPreviewPks(dataForm.body.pks_file_original);
      setImgPks(dataForm.body.pks_file);
    }
    if(dataForm.body.siup_file){
      setImgPreviewSiup(dataForm.body.siup_file_original);
      setImgSiup(dataForm.body.siup_file);
    }

  }, [dataForm, history, id])

  const PostDataMMS = useCallback (async ()=>{
    try {
      setLoadingPost(true)
      const result = await dispatch(postToAPI(dataForm.body, id) );
      if (result.data.responseCode){
        if(result.data.responseCode === "00"){
          dispatch({type : 'GET_RESULT_SUBMIT', payload :{ 'final' :'success','content' :result,'error' : false }})
        }else{
          dispatch({type : 'GET_RESULT_SUBMIT', payload :{ 'final' :'failed','content' :result,'error' : true }})
        }
        history.push(`/final/${id}`)
        return setLoadingPost(false)
      }else{
        dispatch({type : 'GET_RESULT_SUBMIT', payload :{ 'final' :'failed','content' :result,'error' : result.data.responseMessage ? result.data.responseMessage : 'failde' }})
        return setLoadingPost(false)
      }
    } catch (error) {
      setLoadingPost(false)
      console.log('error',error);
      if(error.response.data.Exception){
        dispatch(setErrorForm("Token invalid or Expired")); 
        history.push(`/wrong/${id}`)
      }else{
        dispatch({type : 'GET_RESULT_SUBMIT', payload :{ 'final' :'failed','content' :null,'error' : error }})
        history.push(`/final/${id}`)
      }
    }
  },[dataForm, dispatch, history, id])

  useEffect(() => {
  }, [PostDataMMS])


  const onClearImg  =   async (type, e) =>{
    try{
      let nameFile
      let fileBase64
      let file

      switch (type) {
        case 'KTP':   
            dispatch(deleteForm('ktp_file_original'))
            nameFile = 'ktp_file'
            fileBase64 = dataForm.body.ktp_file_base64
            file = dataForm.body.ktp_file
            break
        case 'NPWP':
            dispatch(deleteForm('npwp_file_original'))
            nameFile = 'npwp_file'
            fileBase64 = dataForm.body.npwp_file_base64
            file = dataForm.body.npwp_file
            break
        case 'PKS':
          dispatch(deleteForm('pks_file_original'))
          nameFile = 'pks_file'
          fileBase64 = dataForm.body.pks_file_base64
          file = dataForm.body.pks_file
            break
        case 'SIUP':
          dispatch(deleteForm('siup_file_original'))
          nameFile = 'siup_file'
          fileBase64 = dataForm.body.siup_file_base64
          file = dataForm.body.siup_file
            break
        default:
          return false
        }  
      const nameFileOriginal = nameFile + '_original'
      const result = await dispatch(deleteFile(fileBase64) );
      if(result.data.error === false){
        if (type === 'KTP'){  
          setImgKtp([]);
          setImgPreviewKtp('');
          dispatch(deleteForm('ktp_file'))
          dispatch(deleteForm('ktp_file_base64'))
          delete errors.ktp_file;
        }
        if (type === 'NPWP'){
          setImgNpwp([]);
          setImgPreviewNpwp('');
          dispatch(deleteForm('npwp_file'))
          dispatch(deleteForm('npwp_file_base64'))
          delete errors.npwp_file;
        }
        if (type === 'PKS'){
          setImgPks([]);
          setImgPreviewPks('');
          dispatch(deleteForm('pks_file'))
          dispatch(deleteForm('pks_file_base64'))
          delete errors.pks_file;
        }
        if (type === 'SIUP'){
          setImgSiup([]);
          setImgPreviewSiup('');
          dispatch(deleteForm('siup_file'))
          dispatch(deleteForm('siup_file_base64'))
          delete errors.ktp_file;
        }
      }else{
        //props.updateMerchant({ [nameFileOriginal] : URL.createObjectURL( file ) });
        dispatch(updateForm({ [nameFileOriginal] : URL.createObjectURL( file ) }))

      }
    } catch (error) {
      console.log('error',error);
      if(error.response.data.Exception){
        dispatch(setErrorForm("Token invalid or Expired")); 
        history.push(`/wrong/${id}`)
      }else{
        setTitleModal("Warning")
        setMessage1Modal(`Please contact administrator! ERROR :  ${error}`)
        setMessage2Modal(`error code : ${error.response.data.responseCode || ''}`)
        setMessage3Modal('')
        //setMessage3Modal(`error desc : ${ typeof error.response.data.message !=='undefined' ? error.response.data.message : typeof error.response.data.ResponseDescription !=="undefined" ? error.response.data.ResponseDescription :""}`)
        setShowModal(true)
        //window.alert("Please contact administrator! \n ERROR : " + error);
      }
    }
  }

  const onImageUpload  =   (type, event) =>{
    let nameFile

    switch (type) {
      case 'KTP':      
          setLoadingKtp(true)
          delete errors.ktp_file;
          nameFile = 'ktp_file'
          break
      case 'NPWP':
          setLoadingNpwp(true)
          delete errors.npwp_file;
          nameFile = 'npwp_file'
          break
      case 'PKS':
          setLoadingPks(true)
          delete errors.pks_file;
          nameFile = 'pks_file'
          break
      case 'SIUP':
          setLoadingSiup(true)
          delete errors.siup_file;
          nameFile = 'siup_file'
          break
      default:
        return false
      }

    let file = event.target.files[0];
    const exten = file.name.split('.').pop().toUpperCase();
    if (!extensionAllow.includes(exten)) {
      //window.alert("File does not support. You must use .png or .jpg ");
      setError(nameFile, { message: "File does not support" });
      if (type === 'KTP'){setLoadingKtp(false)}
      if (type === 'NPWP'){setLoadingNpwp(false)}
      if (type === 'PKS'){setLoadingPks(false)}
      if (type === 'SIUP'){setLoadingSiup(false)}
      return false;
    }
    if (file.size > 1000000) {
      //window.alert("Please upload a file smaller than 1 MB");
      setError(nameFile, { message: "Should be lower than 1MB" });
      if (type === 'KTP'){setLoadingKtp(false)}
      if (type === 'NPWP'){setLoadingNpwp(false)}
      if (type === 'PKS'){setLoadingPks(false)}
      if (type === 'SIUP'){setLoadingSiup(false)}
      return false;
    }
    let baseURL = "";
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try{
        baseURL = await reader.result;
        const result = await dispatch(uploadFile( baseURL, file.name) );
        const fileBase64 = nameFile+'_base64'
        const fileOriginal = nameFile+'_original'

        if (result.data.error === false){
          dispatch(updateForm({[fileBase64] :result.data.content.newFileName, [nameFile]:file,[fileOriginal]:URL.createObjectURL(file)}))
          //props.updateMerchant({[fileBase64] :result.data.CONTENT.NEW_FILE_NAME, [nameFile]:file,[fileOriginal]:URL.createObjectURL(file)});
          if (type === 'KTP'){
            setImgKtp(file)
            setLoadingKtp(false)
          }
          if (type === 'NPWP'){
            setImgNpwp(file)
            setLoadingNpwp(false)
          }
          if (type === 'PKS'){
            setImgPks(file)
            setLoadingPks(false)
          }
          if (type === 'SIUP'){
            setImgSiup(file)
            setLoadingSiup(false)
          }
        }
      }catch(error){
        if (type === 'KTP'){setLoadingKtp(false)}
        if (type === 'NPWP'){setLoadingNpwp(false)}
        if (type === 'PKS'){setLoadingPks(false)}
        if (type === 'SIUP'){setLoadingSiup(false)}
        console.log('error',error)
        if(error.response.data.Exception){
          dispatch(setErrorForm("Token invalid or Expired")); 
          history.push(`/wrong/${id}`)
        }else{
          setTitleModal("Warning")
          setMessage1Modal(`Please contact administrator! ERROR :  ${error}`)
          setMessage2Modal(`error code : ${error.response.data.ResponseCode || ''}`)
          setMessage3Modal('')
          //setMessage3Modal(`error desc : ${ typeof error.response.data.message !=='undefined' ? error.response.data.message : typeof error.response.data.ResponseDescription !=="undefined" ? error.response.data.ResponseDescription :""}`)
          setShowModal(true)
          //window.alert("Please contact administrator! \n ERROR : " + error);
        }
      }
    };
  }

  const handleRegister = (event)  => {
  event.preventDefault();
    try {
        let errorReq = 0
        if (!imgPreviewKtp){
          setError("ktp_file", { message: "Required Upload KTP" });
          errorReq += 1
          }
        if (!imgPreviewNpwp && !disabledNpwp){
          setError("npwp_file", { message: "Required Upload NPWP" });
          errorReq += 1
          }
        if (!imgPreviewPks){
          setError("pks_file", { message: "Required Upload PKS" });
          errorReq += 1
          }
        if (!imgPreviewSiup && !disabledSiup){
          setError("siup_file", { message: "Required Upload SIUP" });
          errorReq += 1
          }
        if (errorReq === 0 ){
          PostDataMMS()
        }else{
          return false
        }
      
      }catch (error) {
        console.log('error', error);
        if(error.response.data.Exception){
          dispatch(setErrorForm("Token invalid or Expired")); 
          history.push(`/wrong/${id}`)
        }else{
          setTitleModal("Warning")
          setMessage1Modal(`Please contact administrator! ERROR :  ${error}`)
          setMessage2Modal(`error code : ${error.response.data.ResponseCode || ''}`)
          setMessage3Modal('')
          //setMessage3Modal(`error desc : ${ typeof error.response.data.message !=='undefined' ? error.response.data.message : typeof error.response.data.ResponseDescription !=="undefined" ? error.response.data.ResponseDescription :""}`)
          setShowModal(true)
          //window.alert("Please contact administrator! \n ERROR : " + error);
        }
      }
  };

  const handleUploadKTP =  ()  => {
    inputRefKtp.current?.click();
  }
  const handleUploadNPWP =  ()  => {
    inputRefNpwp.current?.click();
  }
  const handleUploadPKS =  ()  => {
    inputRefPks.current?.click();
  }  
  const handleUploadSIUP =  ()  => {
    inputRefSiup.current?.click();
  }

  if(loadingPost === false){
    return (
      <Form className="input-form" onSubmit={handleRegister}>
        <motion.div
          className="col-md-6 offset-md-3"
          initial={{ x: '-100vw' }}
          animate={{ x: 0 }}
          transition={{ stiffness: 150 }}
        >
        <ModalBots title={titleModal} message1={message1Modal || ''} message2={message2Modal || ''} message3={message3Modal || ''}  showModalBootsrap = {showModal}   buttonOk={false} onClick ={ () => setShowModal(false)} /> 
        <div className="card">
          <div className="card-body" style={{textAlign:'center'}}>
            <Form.Group controlId="ktp_file">
            {imgPreviewKtp ? 
            <Form.Label >Upload KTP <Gap height={10} /></Form.Label> 
            : <h5 className="card-title">Upload KTP  <FaAsterisk size={'0.5em'} color={'red'} /></h5>}
              <input type="file"
                size ="sm"
                name="ktp_file"
                className="d-none"
                ref={inputRefKtp}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.oasis.opendocument.spreadsheet, application/pdf, image/*, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => onImageUpload("KTP", e)} 
              />
                <ButtonUpload title="Click Here" display={imgPreviewKtp ? false : true } onClick={handleUploadKTP}  />
              <br/>
            {errors.ktp_file && (
                <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.ktp_file.message}</p>
              )}       
            </Form.Group>
            {loadingKtp ? 'Loading...': imgKtp.name  ? 
            <ThumbUpload fileProp={imgKtp} imgPreview={imgPreviewKtp}  onClick={(e) => onClearImg("KTP", e)}/>  : ''}
            {loadingKtp ? '': imgPreviewKtp ? 
            <span><Gap height={10} />{!imgKtp.name ? '' :imgKtp.name.length > 23 ? (imgKtp.name.substring(0, 20)+'...') :(imgKtp.name)}</span>  : ''}
          </div>
          {!disabledNpwp && (<hr /> )} 
          <div className={disabledNpwp ? "d-none":'card-body'}  style={{textAlign:'center'}}>
          <Form.Group controlId="npwp_file">
          {imgPreviewNpwp ? 
          <Form.Label >Upload NPWP <Gap height={10} /></Form.Label> 
          : disabledNpwp ? <h5 className="card-title">Upload NPWP </h5> : <h5 className="card-title">Upload NPWP  <FaAsterisk size={'0.5em'} color={'red'} /></h5>}
            <input type="file"
              size ="sm"
              name="npwp_file"
              className="d-none"
              ref={inputRefNpwp}
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.oasis.opendocument.spreadsheet, application/pdf, image/*, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => onImageUpload("NPWP", e)} 
            />
              <ButtonUpload title="Click Here" display={imgPreviewNpwp ? false : true } onClick={handleUploadNPWP}  />
            <br/>
            {errors.npwp_file && (
              <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.npwp_file.message}</p>
            )}       
          </Form.Group>
            {loadingNpwp ? 'Loading...': imgNpwp.name  ? 
            <ThumbUpload fileProp={imgNpwp} imgPreview={imgPreviewNpwp}  onClick={(e) => onClearImg("NPWP", e)}/>  : ''}
            {loadingNpwp ? '': imgPreviewNpwp ? 
            <span><Gap height={10} />{!imgNpwp.name ? '' :imgNpwp.name.length > 23 ? (imgNpwp.name.substring(0, 20)+'...') :(imgNpwp.name)}</span>  : ''}
            </div>
          <hr />  
          <div className="card-body" style={{textAlign:'center'}}>
            <Form.Group controlId="pks_file">
            {imgPreviewPks ? 
            <Form.Label >Upload PKS <Gap height={10} /></Form.Label>
            : <h5 className="card-title">Upload PKS  <FaAsterisk size={'0.5em'} color={'red'} /></h5>}
              <input type="file"
                size ="sm"
                name="pks_file"
                className="d-none"
                ref={inputRefPks}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.oasis.opendocument.spreadsheet, application/pdf, image/*, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => onImageUpload("PKS", e)} 
              />
                <ButtonUpload title="Click Here" display={imgPreviewPks ? false : true } onClick={handleUploadPKS}  />
              <br/>
              {errors.pks_file && (
                <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.pks_file.message}</p>
              )}       
            </Form.Group>
              {loadingPks ? 'Loading...': imgPks.name  ? 
              <ThumbUpload fileProp={imgPks} imgPreview={imgPreviewPks}  onClick={(e) => onClearImg("PKS", e)}/>  : ''}
              {loadingPks ? '': imgPreviewPks ? 
              <span><Gap height={10} />{!imgPks.name ? '' :imgPks.name.length > 23 ? (imgPks.name.substring(0, 20)+'...') :(imgPks.name)}</span>  : ''}
              </div>
            {!disabledSiup && (<hr /> )} 
            <div className={disabledSiup ? "d-none":'card-body'}  style={{textAlign:'center'}}>
            <Form.Group controlId="siup_file">
            {imgPreviewSiup ? 
            <Form.Label >Upload SIUP <Gap height={10} /></Form.Label>
            : disabledSiup ? <h5 className="card-title">Upload SIUP </h5> : <h5 className="card-title">Upload SIUP <FaAsterisk size={'0.5em'} color={'red'} /></h5>}
              <input type="file"
                size ="sm"
                name="siup_file"
                className="d-none"
                ref={inputRefSiup}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.oasis.opendocument.spreadsheet, application/pdf, image/*, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => onImageUpload("SIUP", e)} 
              />
                <ButtonUpload title="Click Here" display={imgPreviewSiup ? false : true} onClick={handleUploadSIUP}  />
              <br/>
              {errors.siup_file && (
                <p className="errorMsg"><FaExclamationTriangle/>&nbsp;&nbsp;&nbsp;{errors.siup_file.message}</p>
              )}       
            </Form.Group>
              {loadingSiup ? 'Loading...': imgSiup.name  ? 
              <ThumbUpload fileProp={imgSiup} imgPreview={imgPreviewSiup}  onClick={(e) => onClearImg("SIUP", e)}/>  : ''}
              {loadingSiup ? '': imgPreviewSiup ? 
              <span><Gap height={10} />{!imgSiup.name ? '' :imgSiup.name.length > 23 ? (imgSiup.name.substring(0, 20)+'...') :(imgSiup.name)}</span>  : ''}
              </div>
          </div>
          <Gap height={60} />
          <ButtonPrev title="Prev" onClick={() => history.push(`/second/${id}`)}/>
          <ButtonNext title="Register"/>
        </motion.div>
      </Form>
    );
  }
  return (
    <div>
      {loadingPost && (    
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

export default withRouter(ThirdStep)