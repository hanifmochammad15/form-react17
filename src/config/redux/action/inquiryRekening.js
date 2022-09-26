//import mmsAPI from '../../api/mms/service';
import brigateAPI from '../../api/brigate/service';
import { mmsHeaders } from '../../env';

export const getInquiryRek = (no_rek) => {
    return async dispatch => {
        try {
            if (localStorage.getItem('token') !== null){
                let token = JSON.parse(localStorage.getItem('token'))
                mmsHeaders.Authorization = token.token_type +' '+token.access_token
            }
            const data = {
                    noRekening : no_rek,
                    };
            const result = await brigateAPI.post(`apiBrispotMMS/1.0/getInquiryRekening`,data,{
                headers : mmsHeaders
                });
            return result;
        } catch (err) {
            throw err;
        };
    };
};

