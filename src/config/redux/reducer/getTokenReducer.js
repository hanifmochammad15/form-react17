const initialStateLogin = {
    dataToken : {      
        access_token :'',  
        token_type :'',   
        expires_in :'',
        scope :'',
    },
    response_message : '',
    Exception : '',
}


const isValidJSONString = (str) =>{
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const getToken =  localStorage.getItem('token') === null ? null : isValidJSONString(localStorage.getItem('token')) ? JSON.parse(localStorage.getItem('token')) : null

const getTokenReducer = (state = initialStateLogin, action) => {
    switch(action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                dataToken : getToken
            }
        case 'LOGIN_FAILED':
            return {
            ...state,
                response_message : action.payload,
            }
        case 'TOKEN_EXPIRED':
            return {
            ...state,
                Exception : '',
            }
        default:
            return state;
        }
}
//reducer sebuah function yg memilik parameter state dan action 

export default getTokenReducer;

