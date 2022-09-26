
const initialStateChannel = {
    dataChannels : [],

}

const channelReducer = (state = initialStateChannel, action) => {
    if(action.type === 'GET_DATA_CHANNEL'){
        return {
            ...state,
            dataChannels : action.payload
        }
    }
    return state;

}//reducer sebuah function yg memilik parameter state dan action 


export default channelReducer;

