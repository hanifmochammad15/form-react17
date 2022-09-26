
const initialStateResult = {
    dataResult : [],

}

const resultReducer = (state = initialStateResult, action) => {
    if(action.type === 'GET_RESULT_SUBMIT'){
        return {
            ...state,
            dataResult : action.payload
        }
    }
    return state;

}//reducer sebuah function yg memilik parameter state dan action 


export default resultReducer;

