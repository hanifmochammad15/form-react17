export const BASE_API_BRIGATE  = process.env.REACT_APP_MODE ==='production' ? process.env.REACT_APP_ESB_GATEWAY_PROD : process.env.REACT_APP_ESB_GATEWAY_DEV 

export const  brigateAuth = process.env.REACT_APP_MODE ==='production' ? 
{
'grant_type'     :  process.env.REACT_APP_GRANT_TYPE_PROD,
'client_id'      :  process.env.REACT_APP_CLIENT_ID_PROD,
'client_secret'  :  process.env.REACT_APP_CLIENT_SECRET_PROD,
} :
{
'grant_type'     :  process.env.REACT_APP_GRANT_TYPE_DEV,
'client_id'      :  process.env.REACT_APP_CLIENT_ID_DEV,
'client_secret'  :  process.env.REACT_APP_CLIENT_SECRET_DEV,
} 

export const BASE_API_MMS  = process.env.REACT_APP_MODE ==='production' ? process.env.REACT_APP_MMS_URI_PROD : process.env.REACT_APP_MMS_URI_DEV 

export const mmsHeaders = process.env.REACT_APP_MODE ==='production' ?
{
'Content-Type'   :  'application/json',
'APP-KEY'        :  process.env.REACT_APP_KEY_PROD,
'APP-NAME'       :  process.env.REACT_APP_NAME_PROD,
'PERNR'          :  process.env.REACT_APP_PENR_PROD,
//'Authorization'  :  token.access_token && token.token_type ? token.token_type+' ' + token.access_token : ''
} :
{
'Content-Type'   :  'application/json',
'APP-KEY'        :  process.env.REACT_APP_KEY_DEV,
'APP-NAME'       :  process.env.REACT_APP_NAME_DEV,
'PERNR'          :  process.env.REACT_APP_PENR_DEV,
//'Authorization'  :  token.access_token && token.token_type ? token.token_type+' ' + token.access_token : ''
} 

