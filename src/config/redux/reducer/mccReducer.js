
const initialStateMCC = {
    dataMCC : [],

}

const mccReducer = (state = initialStateMCC, action) => {
    if(action.type === 'GET_DATA_MCC'){
        return {
            ...state,
            dataMCC : action.payload
        }
    }
    return state;

}//reducer sebuah function yg memilik parameter state dan action 


export default mccReducer;

