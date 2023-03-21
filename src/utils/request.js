import axios from "axios"
import qs from "querystring"
import store from "../store"


/**
 * errorHandle method
 * status: status code
 * 
 */
const errorHandle = (status, info) => {
    switch (status) {
        case 400:
            console.log("Incorrect semantics, the current request cannot be understood by the server. Clients SHOULD NOT resubmit this request unless modified.")
            break;
        case 401:
          
            console.log("Server authentication failed")
            break;
        case 403:
            console.log("The server has understood the request but is refusing to fulfill it");
            break;
        case 404:
            console.log("Please check the network request address")
            break;
        case 500:
            console.log("The server encountered an unexpected condition that prevented it from completing processing the request. Generally speaking, this problem will appear when the program code of the server is wrong.")
            break;
        case 502:
            console.log("A server acting as a gateway or proxy received an invalid response from an upstream server while attempting to fulfill a request.")
            break;
        default:
            console.log(info)
            break;
    }
}



/**
 * create axios instance
 */

const instance = axios.create({
    
    timeout: 5000
})



instance.interceptors.request.use(
    config => {
        if (config.method === "post") {
            config.data = qs.stringify(config.data)
        }
       
        if (store.getState().auth.user.token) {
           
            config.headers.Authorization = store.getState().auth.user.token;
        }
        return config
    },
    error => Promise.reject(error)
)


instance.interceptors.response.use(
    
    response => response.status === 200 ? Promise.resolve(response) : Promise.reject(response),
    error => {
        const { response } = error;
        errorHandle(response.status, response.info);
    }
)


export default instance