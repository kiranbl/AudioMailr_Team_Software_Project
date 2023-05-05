export const SET_USER = "SET_USER"
export const DEL_FLASH = "DEL_FLASH"
export const ADD_FLASH = "ADD_FLASH"
export const REACT_REDUX_LOCAL = "REACT_REDUX_LOCAL"
export const SET_EMAILS = "SET_EMAILS"
export function setEmails(emails) {
    return { type: SET_EMAILS, emails };
  }
  