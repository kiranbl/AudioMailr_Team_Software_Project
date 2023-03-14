const validator = require("../utilities/validationUtilities");
const dbQueryUtilities = require("../utilities/dbQueryUtilities")
const dbUtilities = require("../utilities/dbUtilities");
const authUtilities = require("../utilities/authUtilities")

var signUpErrorCode = (statusCode)=>{
  switch (statusCode){
      case 2000: return ({"errorcode":statusCode,"message": "User Creation Failed"});
  }
}

var userCreate = async (user)=>{
  try{

       //Code to check if the user already exist
      // var data = {
      //   conditionData:{

      //   },
      //   selectionData:[],
      //   tablename:"user"
      // }
      // Code to encrypt the password 


       // Create and Save a new user
       let insertquery = `INSERT INTO user `;
       let insertqueryType = "insert"
       let generatedQuery = dbQueryUtilities.queryBuilder(insertqueryType,user);
       insertquery = insertquery + generatedQuery;

       var queryResponse =await dbUtilities.createQuery(insertquery);
       console.log("Query res",queryResponse);
       if(queryResponse.errorcode){
        return(signUpErrorCode(2000))
       }
       else{
        user = {    
          userName: user.userName,
          emailAddress1: user.emailAddress1,
          password1: user.password1
        }
        var token = await authUtilities.generateJWT(user);
        console.log(token)

        return ({"token":token});
      }

  }
  catch(error){
    console.log("Create User",error)
    if(error){
      return(signUpErrorCode(2000))
     }
    
  }

}


var signUpHandler = async (req,res)=>{
  console.log("Reached here")
  if (!req.body) {
    res.status(400).json({
      "statusCode":400,
      "message": "Content can not be empty!"
    });
  }
  else{
    var validatorResponse = validator.signUpValidator(req.body);
    if(validatorResponse){
      return(res.json(validatorResponse));
    }
    var user ={
      userName: req.body.userName,
      emailAddress1: req.body.emailAddress1,
      password1: req.body.password1,
  
    };
  
    var userCreateResponse = await userCreate(user);
    return(res.json(userCreateResponse));
  
  }


}

 



module.exports = signUpHandler;