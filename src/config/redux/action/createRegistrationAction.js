//import mmsAPI from '../../api/mms/service';
import brigateAPI from '../../api/brigate/service';
import { mmsHeaders } from '../../env';


export const updateForm = ( payload ) => {
    return {type : 'UPDATE_FORM_DATA', payload}
}
export const deleteForm = ( payload ) => {
    return {type : 'REMOVE_DATA_FORM', payload}
}
export const setPageForm = (payload) => {
    return {type : 'SET_PAGE_FORM',  payload}
}

export const setErrorForm = (payload) => {
    return {type : 'SET_ERROR_FORM', payload}
}

export const setTotalError = (payload) => {
    return {type : 'SET_TOTAL_ERROR', payload}
}

export const postToAPI =  (form, id) => {
    return async dispatch => {
        try {
                if (localStorage.getItem('token') !== null){
                    let token = JSON.parse(localStorage.getItem('token'))
                    mmsHeaders.Authorization = token.token_type +' '+token.access_token
                }
                const dataForm = {
                    //PAGE 1
                        'appId': form.app_id.trim(),
                        'namaMerchant':  form.merchant_nama.trim(),
                        'alamat':  form.merchant_alamat.trim(),
                        'provinsi':  form.kode_pos.value.split(',')[4].trim(),
                        'kota':  form.kode_pos.value.split(',')[3].trim(),
                        'kecamatan':  form.kode_pos.value.split(',')[2].trim(),
                        'kelurahan':  form.kode_pos.value.split(',')[1].trim(),
                        'kodepos':  form.kode_pos.value.split(',')[0].trim(),
                        'telepon':  form.merchant_telepon.trim(),
                        'email':  form.merchant_email.trim(),
                        'channel':  form.channel.value.trim(),
                        'subChannel':  form.subchannel.value.trim(),
                        'jenisMerchant':  'QRIS STATIC',//hardcode
                        'kriteria':  form.kriteria.trim(),
                        'merchantType':  form.merchant_type.trim(),
                        'mcc':  form.merchant_mcc.value.split('|')[0].trim(),
                        'pnReferal':  form.merchant_pn_referral.value.split('|')[0].trim(),
                        'pnName':  form.merchant_pn_referral.value.split('|')[1].trim(),
                    //PAGE 2
                        'noKtp':  form.no_ktp.replace(/[^\d]/g, ''),
                        'namaKtp':  form.nama_ktp.trim(),
                        'noRek':  form.no_rek.replace(/[^\d]/g, ''),
                        'namaPemilikRek':  form.nama_rek.trim(),
                        'namaUkerRek':  form.kantor_cabang.trim(),
                        'noNpwp':  form.no_npwp.trim(),
                        'namaNpwp':  form.nama_npwp.trim(),
                        'noPks':  form.no_pks.trim(),
                        'tglPks':  form.tgl_berlaku_pks.trim(),
                        'noSiup':  form.no_siup.trim(),
                    //PAGE 3
                        'dokKtp':  form.ktp_file_base64,
                        'dokNpwp':  form.npwp_file_base64,
                        'dokPks':  form.pks_file_base64,
                        'dokSiup':  form.siup_file_base64,
                    //HARDCODE
                        'noteEntry':  'DARI BRISPOT',
                        'status':  'SUBMIT',
                        }
        
                const result = await brigateAPI.post(`apiBrispotMMS/1.0/submitMerchant`,dataForm,{
                    headers : mmsHeaders,
                    });
                const responseAPI = result.data;
                await dispatch({type: 'POST_DATA_MMS', payload : responseAPI })
                return result;
            } catch (err) {
                throw err;
            };
    };


}

