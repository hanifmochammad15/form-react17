
const initialStateKodePos = {
    dataKodePos : [],

}

const kodePosReducer = (state = initialStateKodePos, action) => {
    if(action.type === 'GET_DATA_KODEPOS'){
        return {
            ...state,
            dataKodePos : action.payload
        }
    }
    return state;

}//reducer sebuah function yg memilik parameter state dan action 


export default kodePosReducer;

