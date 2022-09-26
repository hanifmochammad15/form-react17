//import mmsAPI from '../../api/mms/service';
import brigateAPI from '../../api/brigate/service';
import { mmsHeaders } from '../../env';

export const deleteFile =  (file_name) => {
    return async dispatch => {
        try {
            if (localStorage.getItem('token') !== null){
                let token = JSON.parse(localStorage.getItem('token'))
                mmsHeaders.Authorization = token.token_type +' '+token.access_token
            }
            let dataForm = {'newFileName' :file_name }
                const result = await brigateAPI.post(`apiBrispotMMS/1.0/deleteDocument`,dataForm,{
                    headers : mmsHeaders,
                    });
                return result;
            } catch (err) {
                throw err;
            };
    };

}
