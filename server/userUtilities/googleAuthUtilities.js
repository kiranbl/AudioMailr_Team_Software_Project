const  { google } = require('googleapis');
const axios = require("axios");
const dbQueryUtilities = require("../utilities/dbQueryUtilities");
const dbUtilities = require("../utilities/dbUtilities");
const authUtilities = require("../utilities/authUtilities");
const MOMENT= require( 'moment' );




//zhengren added this function for user profile display function
const getUserInfo = async (userId) => {
  try {
    const data = {
      conditionData: {
        user_id: userId,
      },
      selectionData: ["userName", "emailAddress1"],
      tablename: "user",
    };

    let selectQuery = `SELECT `;
    let generatedSelectQuery = dbQueryUtilities.queryBuilder("select", data);
    selectQuery = selectQuery + generatedSelectQuery;

    const selectQueryResponse = await dbUtilities.selectQuery(selectQuery);

    if (selectQueryResponse && selectQueryResponse.length > 0) {
      return selectQueryResponse[0];
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
};

var googleAuthErrorCode = (statusCode) => {
  switch (statusCode) {
    case 2000:
      return { errorcode: statusCode, message: `User Already Exists` };
    case 2001:
      return { errorcode: statusCode, message: "User Creation Failed" };
  }
};
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI

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
        selectionData: ["user_id","emailAddress1", "emailAddress2","createdAt"],
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
        password1:googleUser.data.id,
        createdAt:MOMENT().format( 'YYYY-MM-DD  HH:mm:ss.000' )
      };
      if(selectQueryResponse && selectQueryResponse.length>0){
      let existingUser = {
        userName: googleUser.data.name,
        emailAddress1:googleUser.data.email,
        refreshToken:refreshToken,
        profileimage:googleUser.data.picture,
        provider:"gmail",
        user_id:selectQueryResponse[0].user_id,
        createdAt:selectQueryResponse[0].createdAt
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
         user["createdAt"]=user.createdAt;
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
  //return getUser;

  res.cookie("AUDIOMAILR_JWT", getUser.token, {
    maxAge: 90000,
    httpOnly: false,
    //secure: false,
    secure: process.env.NODE_ENV === 'production', // Set 'secure' to true only in production
    sameSite: 'strict', // This attribute helps to prevent CSRF attacks
    path: '/', // The path attribute should be set to '/' so that the cookie is accessible on all pages
  });
  res.redirect("http://localhost:3001/receiveMail");
  //return res.json(getUser);

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
  