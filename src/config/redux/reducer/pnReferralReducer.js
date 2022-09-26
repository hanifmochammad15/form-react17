
const initialStatePnReferral = {
    dataPnReferral : [],

}

const pnReferralReducer = (state = initialStatePnReferral, action) => {
    if(action.type === 'GET_DATA_PN_REFERRAL'){
        return {
            ...state,
            dataPnReferral : action.payload
        }
    }
    return state;

}//reducer sebuah function yg memilik parameter state dan action 


export default pnReferralReducer;

