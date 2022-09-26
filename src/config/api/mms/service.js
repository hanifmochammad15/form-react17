import Axios from "axios";
import { BASE_API_MMS } from '../../env';

export default Axios.create({
    baseURL: BASE_API_MMS
});
