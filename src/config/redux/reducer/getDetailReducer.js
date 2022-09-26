
const initialStateDetail = {
    dataDetails : [],

}

const getDetailReducer = (state = initialStateDetail, action) => {
    if(action.type ==='GET_DATA_DETAIL') 
            return {
                ...state,
                dataDetails : action.payload,
            }
    return state;


}//reducer sebuah function yg memilik parameter state dan action 


export default getDetailReducer;

