import { SET_USER } from "../constants"
const userState = {
    user: {
        emailAddress1: '',
      },
}

const auth = (state = userState,action) =>{
    switch(action.type){
        case SET_USER:
            return {
                user:action.user
            }
        default:
            return state;
    }
}

export default auth