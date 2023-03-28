import validator from "validator"
import isEmpty from "lodash/isEmpty"

const validatorInput = (data) =>{
    /**
     * validator.isEmpty
     */
    let errors = {}
    if(validator.isEmpty(data.emailAddress1)){
        errors.username = "usename can not be empty"
    }
    if(validator.isEmpty(data.password1)){
        errors.password = "password can not be empty"
    }
  
    return{
        // if value is empty，return true，else, reture false。
        isValid:!isEmpty(errors),
        errors
    }
}

export default validatorInput