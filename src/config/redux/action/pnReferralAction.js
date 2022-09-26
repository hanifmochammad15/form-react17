//import mmsAPI from '../../api/mms/service';
import brigateAPI from '../../api/brigate/service';
import { mmsHeaders } from '../../env';

export const getPnReferral = (search) => {
    return async dispatch => {
        try {
            if (localStorage.getItem('token') !== null){
                let token = JSON.parse(localStorage.getItem('token'))
                mmsHeaders.Authorization = token.token_type +' '+token.access_token
            }
            const data = {
                            term : search,
                            };   
            const result = await brigateAPI.post(`apiBrispotMMS/1.0/getPNReferral`,data,{
                headers : mmsHeaders
                });
            const responseAPI = result.data;
            await dispatch({type: 'GET_DATA_PN_REFERRAL', payload : responseAPI.content })
            return result;
        } catch (err) {
            throw err;
        };
    };
};

