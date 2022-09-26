
const initialStateSubChannel = {
    dataSubChannels : [],

}

const subChannelReducer = (state = initialStateSubChannel, action) => {
    if(action.type === 'GET_DATA_SUBCHANNEL'){
        return {
            ...state,
            dataSubChannels : action.payload
        }
    }
    return state;

}//reducer sebuah function yg memilik parameter state dan action 


export default subChannelReducer;

