//import mmsAPI from '../../api/mms/service';
import brigateAPI from '../../api/brigate/service';
import { mmsHeaders } from '../../env';

export const uploadFile =  (file_base64, file_name) => {
    return async dispatch => {
        try {
            if (localStorage.getItem('token') !== null){
                let token = JSON.parse(localStorage.getItem('token'))
                mmsHeaders.Authorization = token.token_type +' '+token.access_token
            }
            const dataForm = { 
                    'fileBase64':  file_base64,
                    'fileName':  file_name,
                    }
            const result = await brigateAPI.post(`apiBrispotMMS/1.0/uploadDocument`,dataForm,{
                headers : mmsHeaders,
                });
            return result;
            } catch (error) {
                throw error;
            };
    };

}
