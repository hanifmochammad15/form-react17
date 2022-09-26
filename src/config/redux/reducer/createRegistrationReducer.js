const initialStateRegistration = {
    dataForm : {
            body : {
            },
        submitPage : 0,
    },
    TotalErrorGLobal : 0,
    errorMessage : '',

}

const createRegistrationReducer = (state = initialStateRegistration, action) => {
    switch(action.type) {
        case 'SET_PAGE_FORM':
            return {
                ...state,
                dataForm : {
                    ...state.dataForm,
                    submitPage : action.payload
                }
            }
        case 'UPDATE_FORM_DATA':
            let editData = Object.assign(state.dataForm.body, action.payload)
            return {
            ...state,
                dataForm : {
                ...state.dataForm,
                body : editData
                }
            }
        case 'REMOVE_DATA_FORM':
            delete state.dataForm.body[action.payload] 
            return {
                ...state,
                    dataForm : {
                    ...state.dataForm,
                    body : state.dataForm.body
                    }
                }
    
        case 'SET_ERROR_FORM':
            return {
                ...state,
                errorMessage : action.payload
            }
        case 'SET_TOTAL_ERROR':
            return {
                ...state,
                TotalErrorGLobal : action.payload
            }
        default:
            return state;
        }
}
//reducer sebuah function yg memilik parameter state dan action 


export default createRegistrationReducer;

