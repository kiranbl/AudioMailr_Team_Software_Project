var Validator = require('validatorjs');

  

var validationErrorCode = (statusCode)=>{
    switch (statusCode){
        case 1000: return ({"errorcode":statusCode,"message": "Invalid Username"});
        case 1001: return ({"errorcode":statusCode,"message": "Invalid Email Address"});
        case 1002: return ({"errorcode":statusCode,"message": "Invalid Password, Should be minimum 8 character"});
        case 1003: return ({"errorcode":statusCode,"message": "Subject for the email cannot be empty"});
        case 1004: return ({"errorcode":statusCode,"message": "Body of the email cannot be empty"});
    }
}

var signUpValidator = (body)=>{

    var rules = {
        userName: 'required',
        emailAddress1: 'required|email',
        password1: 'required|min:8'
      };

    var validation = new Validator(body, rules);
    if (validation.fails()) {
    if( validation.errors.first('userName')){
        return(validationErrorCode(1000))
    }
    if(validation.errors.first('emailAddress1')){
        return(validationErrorCode(1001))
    }
    if(validation.errors.first('password1')){
        return(validationErrorCode(1002))
    }

    }

}
  

var signInValidator = (body)=>{

    var rules = {
        emailAddress1: 'required|email',
        password1: 'required|min:8'
      };

    var validation = new Validator(body, rules);
    if (validation.fails()) {
    if(validation.errors.first('emailAddress1')){
        return(validationErrorCode(1001))
    }
    if(validation.errors.first('password1')){
        return(validationErrorCode(1002))
    }

    }

}

var emailValidator = (body)=>{

    var rules = {
        toAddress: 'required|email',
        subject: 'required',
        text:'required'
      };

    var validation = new Validator(body, rules);
    if (validation.fails()) {
    if(validation.errors.first('toAddress')){
        return(validationErrorCode(1001))
    }
    if(validation.errors.first('subject')){
        return(validationErrorCode(1003))
    }
    if(validation.errors.first('text')){
        return(validationErrorCode(1004))
    }

    }

}

module.exports ={
    signUpValidator,
    signInValidator,
    emailValidator
}