import brigateAPI from '../../api/brigate/service';
import { brigateAuth } from '../../env';
import { HEADER_JSON } from '../../constant';

export const getToken = () => {
    return async dispatch => {
        try {
            const result = await brigateAPI.post('Oauth2CORS/1.0/accessToken',brigateAuth,{
                headers : HEADER_JSON
                });
                if(result.data){
                    localStorage.setItem('token', JSON.stringify(result.data));
                    await dispatch({type: 'LOGIN_SUCCESS', payload : result.data })
                    return result.data;     
                }else{
					localStorage.setItem('token', null);
                    await dispatch({type: 'LOGIN_FAILED', payload : result })
                    throw result
                }
        } catch (err) {
			localStorage.setItem('token', null);
            throw err;
        };
    };
};

