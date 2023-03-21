import axios from "../utils/request"

// http request routes

const base = {
    baseUrl:"http://localhost:3001",
    signup:"/signup"

}

// http request methods

const api = {
    /* params = {
     *   userName: user.userName,
     *   emailAddress1: user.emailAddress1,
     *   password1: user.password1,
     * }
     */

       

    signup(params){
     const headers ={
        'Content-Type' : 'application/json; charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
            }

            return axios.post(base.baseUrl +base.signup, params)
            .then( response => console.log(response));

    }
}

export default api;
