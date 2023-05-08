import axios from "../utils/request"
import { getStorageData } from "../pages/MailBox/utils/utils";
// http request routes

const base = {
    baseUrl:"api",
    signup:"/signup",
    mailbox:"/receiveMail", 
    sendmail:"/sendmail", 
    sent:"/sent", 
    signin:"/signin",
    outlookOauth: "/signin/outlookoauth",
    setstatus:"/setMailStatus",
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
          getOutlookAuthUrl(params) {
            return axios.post(base.baseUrl + base.signup, params);
          },
          fetchEmails() {
            // Add an Authorization header with the JWT token
             // Log the API URL
            //console.log('API URL:', base.baseUrl + base.mailbox);
            const config = {
              headers: {
                Authorization: `Bearer ${getStorageData("AUDIOMAILR_JWT", null)}`,
              },
            };
            return axios.get(base.baseUrl + base.mailbox, config);
          },
       
          fetchSentEmails() {
            // Add an Authorization header with the JWT token
             // Log the API URL
            //console.log('API URL:', base.baseUrl + base.mailbox);
            const config = {
              headers: {
                Authorization: `Bearer ${getStorageData("AUDIOMAILR_JWT", null)}`,
              },
            };
            return axios.get(base.baseUrl + base.sent, config);
          },  
          sendEmails(toAddress, toSubject, toMessage) {
            return (dispatch) => {
              console.log('Target API URL: http://localhost:3000/sendmail');
              const config = {
                headers: {
                  Authorization: `Bearer ${getStorageData("AUDIOMAILR_JWT", null)}`,
                  'Content-Type': 'application/json',
                },
              };
              const data = {
                toAddress: toAddress,
                subject: toSubject,
                text: toMessage,
              };
              console.log('Sending email with data:', data);
              return axios
                .post(base.baseUrl + base.sendmail, data, config)
            };
          },    
          setMailStatus(mail_id) {
            const config = {
              headers: {
                Authorization: `Bearer ${getStorageData("AUDIOMAILR_JWT", null)}`,
                'Content-Type': 'application/json',
              },
            };
            const data = {
              mailid: mail_id,
            };
            console.log('targeting:', base.baseUrl + base.setstatus);
            console.log('sending data:', data);
            return axios.post(base.baseUrl + base.setstatus, data, config);
          }          
}

export default api;
