import api from "../api"
import { SET_USER,REACT_REDUX_LOCAL } from "../constants"

function setUserObj(user){
    return{
        type:SET_USER,
        user
    }
}

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

