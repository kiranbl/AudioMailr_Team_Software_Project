import validator from "validator"
import isEmpty from "lodash/isEmpty"

const validateFields = (data) => {
    let errors = {};
    if (validator.isEmpty(data.towhom)) {
      errors.towhom = "target email address can not be empty";
    }
    if (validator.isEmpty(data.subject)) {
      errors.subject = "title can not be empty";
    }
    if (validator.isEmpty(data.mailbody)) {
      errors.mailbody = "body can not be empty";
    }
    return {
      // if value is empty，return true，else, reture false
      isValid: !isEmpty(errors),
      errors,
    };
  };
  

  export { validateFields};
