import Axios from "axios";
import { BASE_API_BRIGATE } from '../../env';
//import https from "https";

// const agent = new https.Agent({  
//     rejectUnauthorized: false
//   });

export default Axios.create({
    baseURL: BASE_API_BRIGATE,
    //withCredentials: true,
    //httpsAgent: agent, //bypass ssl tidak direkomendasikan menggunakan ini
});
