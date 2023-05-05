import axios from "../utils/request"
import { getStorageData } from "../pages/MailBox/utils/utils";
// http request routes

const base = {
    baseUrl:"api",
    signup:"/signup",
    mailbox:"/receiveMail", // Changed this line
    signin:"/signin",
    userinfo: "/api/userinfo", 
}

// http request methods

const api = {
        signup(params) {
            console.log(params);
            return axios.post(base.baseUrl + base.signup, params );
          },
          
        signin(params){
            return axios.post(base.baseUrl + base.signin,params)
        },

        getGoogleAuthUrl(params) {
            return axios.post(base.baseUrl + base.signup, params);
        },
        fetchEmails() {
            // Add an Authorization header with the JWT token
             // Log the API URL
            console.log('API URL:', base.baseUrl + base.mailbox);
            const config = {
              headers: {
                Authorization: `Bearer ${getStorageData("AUDIOMAILR_JWT", null)}`,
              },
            };
            return axios.get(base.baseUrl + base.mailbox, config);
          },
        fetchUserInfo() {
            const config = {
              headers: {
                Authorization: `Bearer ${getStorageData("AUDIOMAILR_JWT", null)}`,
              },
            };
            return axios.get(base.baseUrl + base.userinfo, config); // Use userinfo key here
          },
          
}

export default api;
