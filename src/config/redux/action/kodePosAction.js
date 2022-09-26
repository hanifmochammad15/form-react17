//import mmsAPI from '../../api/mms/service';
import brigateAPI from '../../api/brigate/service';
import { mmsHeaders } from '../../env';

export const getKodePos = (search) => {
    return async dispatch => {
        try {
            if (localStorage.getItem('token') !== null){
                let token = JSON.parse(localStorage.getItem('token'))
                mmsHeaders.Authorization = token.token_type +' '+token.access_token
            }
            const data = {keywords : search};
            const result = await brigateAPI.post(`apiBrispotMMS/1.0/getKodePos`,data,{
                headers : mmsHeaders
                });
            const responseAPI = result.data;
            await dispatch({type: 'GET_DATA_KODEPOS', payload : responseAPI.content })
            return result;
        } catch (err) {
            throw err;
        };
    };
};

