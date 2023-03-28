import axios from "../utils/request"

// http request routes

const base = {
    baseUrl:"/api",
    signup:"/api/signup",
    signin:"/api/signin",

}

// http request methods

const api = {
    /* params = {
     *   userName: user.userName,
     *   emailAddress1: user.emailAddress1,
     *   password1: user.password1,
     * }
     */

       

        signup(params) {
            console.log(params);
            return axios.post(base.baseUrl + base.signup, params );
          },
          
        signin(params){
            return axios.post(base.baseUrl + base.signin,params)
        },
}

export default api;
