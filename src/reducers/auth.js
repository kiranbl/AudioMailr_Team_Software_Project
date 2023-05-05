import { SET_USER,  ADD_FLASH, DEL_FLASH } from "../constants";
const userState = {
    user: {
        emailAddress1: '',
      },
}

const initialState = {
    loggedIn: false,
    user: {},
    flash: [],
  };
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

export default (state = initialState, action) => {
    const { type, payload } = action;
  
    switch (type) {
      case SET_USER:
        return {
          ...state,
          user: payload,
          loggedIn: true,
        };
  
      case ADD_FLASH:
        return {
          ...state,
          flash: [...state.flash, payload],
        };
  
      case DEL_FLASH:
        return {
          ...state,
          flash: state.flash.filter((_, index) => index !== payload),
        };
  
      default:
        return state;
    }
  };