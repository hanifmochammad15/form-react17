import React from 'react';
import {ICImage, ICExcel, ICWord, ICPdf } from '../../../assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import './thumbupload.scss';

const ThumbUpload=({fileProp, imgPreview, ...rest}) => (
    
  <div className="container-button-close">
    {(() => {
            // if (fileProp.type.split('/')[0] === 'image')
            //     return    <img src={imgPreview} className="img-thumb" alt="imageIcon"/> //hidupkan jika ingin dimunculkan thumbnail

                const ext = fileProp.name.split('.').pop();
                switch (ext) {
                case 'xls':
                    return    <img src={ICExcel} className="img-thumb" alt="imageIconXls"/>
                case 'XLS':
                    return    <img src={ICExcel} className="img-thumb" alt="imageIconXls"/>
                case 'xlsx':
                    return    <img src={ICExcel} className="img-thumb" alt="imageIconXls"/>
                case 'XLSX':
                    return    <img src={ICExcel} className="img-thumb" alt="imageIconXls"/>
                case 'doc':
                    return    <img src={ICWord} className="img-thumb" alt="imageIconDoc"/>
                case 'DOC':
                    return    <img src={ICWord} className="img-thumb" alt="imageIconDoc"/>
                case 'docx':
                    return    <img src={ICWord} className="img-thumb" alt="imageIconDoc"/>
                case 'DOCX':
                    return    <img src={ICWord} className="img-thumb" alt="imageIconDoc"/>
                case 'pdf':
                    return    <img src={ICPdf} className="img-thumb" alt="imageIconPdf"/>
                case 'PDF':
                    return    <img src={ICPdf} className="img-thumb" alt="imageIconPdf"/>
                default:
                    return    <img src={ICImage} className="img-thumb" alt="imageIcon"/>
        }
      })()}
       <button {...rest} type="button" className="btn-close-top">
     <span>
        <FontAwesomeIcon icon={faXmarkCircle}  size='lg'/>
      </span> 
    </button>
  </div>
);

export default ThumbUpload;



