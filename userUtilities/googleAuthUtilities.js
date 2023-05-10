const  { google } = require('googleapis');
const axios = require("axios");
const dbQueryUtilities = require("../utilities/dbQueryUtilities");
const dbUtilities = require("../utilities/dbUtilities");
const authUtilities = require("../utilities/authUtilities");
const MOMENT= require( 'moment' );

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

// Get the user details after authorizing through the consent screen
let getGoogleUser = async (code)=> {
  try{
    //console.log(code);
    // Generating access tokens and refresh tokens after getting the auth code  
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    var refreshToken = tokens.refresh_token;

    //console.log(tokens);
    //Fetch the user's profile with the access token and bearer
    let googleUser = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.id_token}`,
          },
        },
      );
      //console.log(googleUser)
      var data = {
        conditionData: {
          emailAddress2: googleUser.data.email,
          emailAddress1: googleUser.data.email
        },
        conditionType: 'OR',
        selectionData: ["user_id","emailAddress1", "emailAddress2","createdAt"],
        tablename: "user",
      };
      // Checking if the user already stored in the database 
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

      // If the user already exist in the database just generate the JWT 
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

    
      return { emailaddress:googleUser.data.email,token: token };
      }
      else{// If the user is new , create a new record in the database and generate the JWT
        let insertquery = `INSERT INTO user `;
        let insertqueryType = "insert";
        let generatedQuery = dbQueryUtilities.queryBuilder(insertqueryType, user);
        insertquery = insertquery + generatedQuery;

        var queryResponse = await dbUtilities.createQuery(insertquery);
        console.log("Query res", queryResponse);
        if (queryResponse.errorcode) {
          return googleAuthErrorCode(2001);
        } else {
          delete user.password1; 
         user["refreshToken"]=refreshToken;
         user["profileimage"]=googleUser.data.picture;
         user["provider"]="gmail";
         user["user_id"]=queryResponse.insertId;
         user["createdAt"]=user.createdAt;
          var token = await authUtilities.generateJWT(user);
          console.log({token:token});
    

          return { emailaddress:googleUser.data.email,token: token };
        }
      }
  }
  catch(error){
    console.log("ERROR ===>>",error);
  }
 
}

var getGoogleAuthCode = async (req,res)=>{
  //console.log(req.query)
  
  let code = req.query.code;
  let getUser = await getGoogleUser(code);

    // Setting the cookie containing the JWT token and email of the user and is set to expire by 24 hours from the time it was created
  res.cookie("AUDIOMAILR_JWT", getUser, 
  {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false,//changed this to false because js does not agree with httpOnly at all 
    secure: process.env.NODE_ENV === 'production', //secure: false, Set 'secure' to true only in production 
    sameSite: 'strict', // This attribute helps to prevent CSRF attacks
    path: '/', // The path attribute should be set to '/' so that the cookie is accessible on all pages
  });
  res.redirect("http://localhost:3001/mailbox");
}

// Function to generate the google OAuth URL using the google apis
var getGoogleAuthURL= ()=> {
  /*
   * Generate a url that asks permissions to the user's email and profile
   */

  //Adding scopes for accessing the user information and accessing the user mail box
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://mail.google.com/'
  ];

  return oauth2Client.generateAuthUrl({
    redirect_uri: 'http://localhost:3000/signup/googleoauth',  // To redirect after the user successfully logs in or signs up
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes, // If you only need one scope you can pass it as string
  });
}


//Handler to generate the OAuth URL
  var googleAuthHandler = async () => {
    //console.log("Reached here");
    let data = {url: getGoogleAuthURL()}
    //console.log(data);
    return(data);
  };



  
  module.exports ={ 
    googleAuthHandler,
    getGoogleAuthCode
  };
  