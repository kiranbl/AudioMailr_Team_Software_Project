const  { google } = require('googleapis');
const axios = require("axios");
const dbQueryUtilities = require("../utilities/dbQueryUtilities");
const dbUtilities = require("../utilities/dbUtilities");
const authUtilities = require("../utilities/authUtilities");

var googleAuthErrorCode = (statusCode) => {
  switch (statusCode) {
    case 2000:
      return { errorcode: statusCode, message: `User Already Exists` };
    case 2001:
      return { errorcode: statusCode, message: "User Creation Failed" };
  }
};
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI

);
let getGoogleUser = async (code)=> {
  try{
    console.log(code);
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    var refreshToken = tokens.refresh_token;

    console.log(tokens);
    //Fetch the user's profile with the access token and bearer
    let googleUser = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.id_token}`,
          },
        },
      );
      console.log(googleUser)
      var data = {
        conditionData: {
          emailAddress2: googleUser.data.email,
          emailAddress1: googleUser.data.email
        },
        conditionType: 'OR',
        selectionData: ["user_id","emailAddress1", "emailAddress2"],
        tablename: "user",
      };
  
      let selectQuery = `Select `;
      let generatedSelectQuery = dbQueryUtilities.queryBuilder("select", data);
      selectQuery = selectQuery + generatedSelectQuery;
  
      var selectQueryResponse = await dbUtilities.selectQuery(selectQuery);
      console.log("Select Query res", selectQueryResponse);
      
      let user = {
        userName: googleUser.data.name,
        emailAddress1:googleUser.data.email,
        password1:googleUser.data.id
      };
      if(selectQueryResponse && selectQueryResponse.length>0){
      let existingUser = {
        userName: googleUser.data.name,
        emailAddress1:googleUser.data.email,
        refreshToken:refreshToken,
        profileimage:googleUser.data.picture,
        provider:"gmail",
        user_id:selectQueryResponse[0].user_id
      }
      var token = await authUtilities.generateJWT(existingUser);
      console.log({token:token});

      return { token: token };
      }
      else{
        let insertquery = `INSERT INTO user `;
        let insertqueryType = "insert";
        let generatedQuery = dbQueryUtilities.queryBuilder(insertqueryType, user);
        insertquery = insertquery + generatedQuery;

        var queryResponse = await dbUtilities.createQuery(insertquery);
        console.log("Query res", queryResponse);
        if (queryResponse.errorcode) {
          return signUpErrorCode(2001);
        } else {
          delete user.password1; 
         user["refreshToken"]=refreshToken;
         user["profileimage"]=googleUser.data.picture;
         user["provider"]="gmail";
         user["user_id"]=queryResponse.insertId;
          var token = await authUtilities.generateJWT(user);
          console.log({token:token});
    

          return { token: token };
        }
      }
  }
  catch(error){
    console.log("ERROR ===>>",error);
  }
 
}

var getGoogleAuthCode = async (req,res)=>{
  console.log(req.query)
  // {
  //   code: '',
  //   scope: 'email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
  //   authuser: '0',
  //   prompt: 'consent'
  // }
  let code = req.query.code;
  let getUser = await getGoogleUser(code);
  return getUser;

}
var getGoogleAuthURL= ()=> {
  /*
   * Generate a url that asks permissions to the user's email and profile
   */

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://mail.google.com/'
  ];

  return oauth2Client.generateAuthUrl({
    redirect_uri: 'http://localhost:3000/signup/googleoauth',
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes, // If you only need one scope you can pass it as string
  });
}


  
  var googleAuthHandler = async () => {
    console.log("Reached here");
    let data = {url: getGoogleAuthURL()}
    console.log(data);
    return(data);
  };



  
  module.exports ={ 
    googleAuthHandler,
    getGoogleAuthCode
  };
  