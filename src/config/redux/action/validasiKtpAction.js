//import mmsAPI from '../../api/mms/service';
import brigateAPI from '../../api/brigate/service';
import { mmsHeaders } from '../../env';

export const getValidasiKtp = (noKtp,namaKtp) => {
    return async dispatch => {
        try {
            if (localStorage.getItem('token') !== null){
                let token = JSON.parse(localStorage.getItem('token'))
                mmsHeaders.Authorization = token.token_type +' '+token.access_token
            }
            const data = {
                noKTP : noKtp,
                namaLengkap : namaKtp,
                    };
            const result = await brigateAPI.post(`apiBrispotMMS/1.0/getNIK`,data,{
                headers : mmsHeaders
                });

            return result;
        } catch (err) {
            throw err;
        };
    };
};

