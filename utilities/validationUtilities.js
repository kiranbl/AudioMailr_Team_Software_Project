var Validator = require('validatorjs');

  

var validationErrorCode = (statusCode)=>{
    switch (statusCode){
        case 1000: return ({"errorcode":statusCode,"message": "Invalid Authtype"});
        // case 1001: return ({"errorcode":statusCode,"message": "Invalid Email Address"});
        // case 1002: return ({"errorcode":statusCode,"message": "Invalid Password, Should be minimum 8 character"});
        case 1003: return ({"errorcode":statusCode,"message": "Subject for the email cannot be empty"});
        case 1004: return ({"errorcode":statusCode,"message": "Body of the email cannot be empty"});
        case 1005: return ({"errorcode":statusCode,"message": "Email ID Error"});
        case 1006: return ({"errorcode":statusCode,"message": "Mail Status Error"});
    }
}

var oauthValidator = (body)=>{

    var rules = {
        authtype: ['required', { 'in': ["gmail", "outlook"] }]
      };

    var validation = new Validator(body, rules);
    if (validation.fails()) {
    if( validation.errors.first('authtype')){
        return(validationErrorCode(1000))
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

var mailStatusValidator = (body)=>{

    var rules = {
        mailid: 'required',
        status:'required'
    }

    var validation = new Validator(body, rules);
    if (validation.fails()) {
    if(validation.errors.first('mailid')){
        return(validationErrorCode(1005))
    }
    }

}

module.exports ={
    oauthValidator,
    emailValidator,
    mailStatusValidator
}