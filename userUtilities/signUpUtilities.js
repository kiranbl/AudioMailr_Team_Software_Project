const validator = require("../utilities/validationUtilities");
const {googleAuthHandler} = require("./googleAuthUtilities");
const {outlookAuthHandler} = require("./outlookAuthUtilities");


var signUpHandler = async (req, res) => {
  console.log("Reached here");
  if (!req.body) {
    res.status(400).json({
      statusCode: 400,
      message: "Content can not be empty!",
    });
  }
  var validatorResponse = validator.oauthValidator(req.body);
  if (validatorResponse) {
    return res.json(validatorResponse);
  }
  
  
  if(req.body.authtype === "gmail"){
    
    return res.json(await googleAuthHandler());
    
  }
  else if(req.body.authtype === "outlook"){
    return res.json(await outlookAuthHandler());
  }
};

module.exports = signUpHandler;
