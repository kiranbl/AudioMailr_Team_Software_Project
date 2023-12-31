const validator = require("../utilities/validationUtilities");
// const dbQueryUtilities = require("../utilities/dbQueryUtilities");
// const dbUtilities = require("../utilities/dbUtilities");
// const authUtilities = require("../utilities/authUtilities");
// const { encrypt, validate} = require("../utilities/hashUtilities");

const {googleAuthHandler} = require("./googleAuthUtilities");
const {outlookAuthHandler} = require("./outlookAuthUtilities");

// var signInErrorCode = (statusCode) => {
//   switch (statusCode) {
//     case 5000:return { errorcode: statusCode, message: "User Account Not Found, Please Sign Up Using This Mail and Try Again" };
//     case 5001:return { errorcode: statusCode, message: "Invalid Credentials" };
    
// }
// };

// var userSignIn = async (user) => {
//   try {
//     //Code to check if the user already exist
//     var data = {
//       conditionData: {
//         emailAddress2: user.emailAddress1,
//         emailAddress1: user.emailAddress1
//       },
//       conditionType: 'OR',
//       selectionData: ["user_id","userName", "password1", "password2", "emailAddress1", "emailAddress2"],
//       tablename: "user",
//     };

//     let selectQuery = `Select `;
//     let generatedSelectQuery = dbQueryUtilities.queryBuilder("select", data);
//     selectQuery = selectQuery + generatedSelectQuery;

//     var selectQueryResponse = await dbUtilities.selectQuery(selectQuery);
//     console.log("Select Query res", selectQueryResponse);

//     if(selectQueryResponse && selectQueryResponse.length>0){

//     var emailaddress = (selectQueryResponse[0].emailAddress1 !== null && selectQueryResponse[0].emailAddress1 === user.emailAddress1  )? selectQueryResponse[0].emailAddress1 : selectQueryResponse[0].emailAddress2 ;
//     var hashedpassword = (selectQueryResponse[0].password1 !== null && selectQueryResponse[0].emailAddress1 === user.emailAddress1  ) ? selectQueryResponse[0].password1 : selectQueryResponse[0].password2 ;
//     console.log(hashedpassword)
    
//     let passwordValidationResponse = validate(hashedpassword,user.password1);
//     if(passwordValidationResponse){
//     user = {
//         user_id: selectQueryResponse[0].user_id,
//         userName: selectQueryResponse[0].userName,
//         emailAddress1: emailaddress,
//         password1: user.password1,
//       };
//       var token = await authUtilities.generateJWT(user);
//       console.log(token);

//       return { token: token };
//     }
//     else{
//         return(signInErrorCode(5001))
//     }

//     }
//     else{
//         return(signInErrorCode(5000))
//     }

//   } catch (error) {
//     console.log("Create User", error);
//     if (error) {
//       return signInErrorCode(2000);
//     }
//   }
// };

var signInHandler = async (req, res) => {
  //console.log("Reached here");
  if (!Object.keys(req.body).length) {
    return res.status(400).json({
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

module.exports = signInHandler;
