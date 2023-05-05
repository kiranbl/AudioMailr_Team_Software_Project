import api from "../api"
import { SET_USER,REACT_REDUX_LOCAL } from "../constants"

function setUserObj(user){
    return{
        type:SET_USER,
        user
    }
}


// Fetch user information
export const fetchUserInformation = () => async (dispatch) => {
    try {
     console.log("Fetching user information..."); // Add this line
      const response = await api.fetchUserInfo();
      console.log("Server response:", response.data);
      dispatch(setUserObj(response.data.user));
    } catch (error) {
      // Handle errors
    }
  };

export function logOut(){
    return dispatch =>{
        dispatch(setUserObj({}))
    }
}

/**
 * 
 */
export function asyncSetUserObj(data){
    return dispatch =>{
        return api.signin(data).then((res) =>{
            console.log(res.data)
            if(res.data.statusCode === 200){
                // redux →token
                dispatch(setUserObj({
                    token:res.data.token,
                    nick:res.data.nick,
                    emailAddress1: data.emailAddress1,
                }))
                /**
                 * store locally:
                 *  Cookie
                 *  LocalStorage
                 */
                localStorage.setItem(REACT_REDUX_LOCAL,JSON.stringify({
                    token:res.data.token,
                    nick:res.data.nick,
                    emailAddress1: data.emailAddress1,

                }))
            }
            return res
        })
    }
}

