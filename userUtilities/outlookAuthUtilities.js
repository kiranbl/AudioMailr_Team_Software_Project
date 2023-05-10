const msal = require("@azure/msal-node");
var graph = require("@microsoft/microsoft-graph-client");
require("isomorphic-fetch");
const dbQueryUtilities = require("../utilities/dbQueryUtilities");
const dbUtilities = require("../utilities/dbUtilities");
const authUtilities = require("../utilities/authUtilities");
const MOMENT= require( 'moment' );



const msalConfig = {
  auth: {
    clientId: process.env.OUTLOOK_CLIENT_ID || "",
    authority: process.env.OUTLOOK_AUTHORITY,
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        if (!containsPii) console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};
const msalClient = new msal.ConfidentialClientApplication(msalConfig);

// Get the user details after authorizing through the consent screen
let getOutlookUser = async (client,accessToken) => {
  try {
    //console.log(client);
    const outlookUser = await client
      .api("/me")
      .select("displayName,mail,mailboxSettings,userPrincipalName,photo")
      .get();

    //console.log(JSON.stringify(outlookUser));
    var data = {
      conditionData: {
        emailAddress2: outlookUser.userPrincipalName,
        emailAddress1: outlookUser.userPrincipalName,
      },
      conditionType: "OR",
      selectionData: ["user_id", "emailAddress1", "emailAddress2","createdAt"],
      tablename: "user",
    };

    // Checking if the user already stored in the database 
    let selectQuery = `Select `;
    let generatedSelectQuery = dbQueryUtilities.queryBuilder("select", data);
    selectQuery = selectQuery + generatedSelectQuery;

    var selectQueryResponse = await dbUtilities.selectQuery(selectQuery);
    //console.log("Select Query res", selectQueryResponse);

    let user = {
      userName: outlookUser.displayName,
      emailAddress1: outlookUser.userPrincipalName,
      password1: outlookUser.id,
      createdAt:MOMENT().format( 'YYYY-MM-DD  HH:mm:ss.000' )
    };

    // If the user already exist in the database just generate the JWT
    if (selectQueryResponse && selectQueryResponse.length > 0) {
      let existingUser = {
        userName: outlookUser.givenName,
        emailAddress1: outlookUser.userPrincipalName,
        refreshToken: accessToken,
        profileimage: outlookUser.picture,
        provider: "outlook",
        user_id: selectQueryResponse[0].user_id,
        createdAt:selectQueryResponse[0].createdAt
      };
      var token = await authUtilities.generateJWT(existingUser);
      console.log({ token: token });

      return { emailaddress:outlookUser.userPrincipalName,token: token };
    } else { // If the user is new ,create a new record in the database and generate the JWT
      let insertquery = `INSERT INTO user `;
      let insertqueryType = "insert";
      let generatedQuery = dbQueryUtilities.queryBuilder(insertqueryType, user);
      insertquery = insertquery + generatedQuery;

      var queryResponse = await dbUtilities.createQuery(insertquery);
      //console.log("Query res", queryResponse);
      if (queryResponse.errorcode) {
        return signUpErrorCode(2001);
      } else {
        delete user.password1;
        user["refreshToken"] = accessToken;
        user["profileimage"] = outlookUser.picture;
        user["provider"] = "outlook";
        user["user_id"] = queryResponse.insertId;
        user["createdAt"] = user.createdAt;
        var token = await authUtilities.generateJWT(user);
        console.log({ token: token });

        return { emailaddress:outlookUser.userPrincipalName,token: token };
      }
    }
  } catch (error) {
    console.log("ERROR ===>>", error);
  }
};

var getOutlookAuthCode = async (req, res) => {
  console.log("reach here ==> ");
  if (!req.query.code) {
    return;
  }
  //console.log(JSON.stringify(req.query));
  const scopes = process.env.OUTLOOK_SCOPES || "https://graph.microsoft.com/.default";
  const tokenRequest = {
    code: req.query.code,
    scopes: scopes.split(","),
    redirectUri: process.env.OUTLOOK_REDIRECT_URI,
  };
  const response = await msalClient.acquireTokenByCode(tokenRequest);
  //console.log("Outlook Token Response",response);
  const client = getAuthenticatedClient(
    msalClient,
    response.account.homeAccountId
  );
  let getUser = await getOutlookUser(client,response.accessToken);
  
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
};

var getAuthenticatedClient = (msalClient, userId) => {
  console.log("called");
  if (!msalClient || !userId) {
    throw new Error(
      `Invalid MSAL state. Client: ${
        msalClient ? "present" : "missing"
      }, User ID: ${userId ? "present" : "missing"}`
    );
  }

  // Initialize Graph client
  const client = graph.Client.init({
    // Implement an auth provider that gets a token
    // from the app's MSAL instance
    authProvider: async (done) => {
      try {
        // Get the user's account
        const account = await msalClient
          .getTokenCache()
          .getAccountByHomeId(userId);

        if (account) {
          // Attempt to get the token silently
          // This method uses the token cache and
          // refreshes expired tokens as needed
          const scopes =
            process.env.OUTLOOK_SCOPES || "https://graph.microsoft.com/.default";
          const response = await msalClient.acquireTokenSilent({
            scopes: scopes.split(","),
            redirectUri: process.env.OUTLOOK_REDIRECT_URI,
            account: account,
          });

          // First param to callback is the error,
          // Set to null in success case
          done(null, response.accessToken);
        }
      } catch (err) {
        console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)));
        done(err, null);
      }
    },
  });

  return client;
};

var getOutlookAuthURL = async (req, res) => {
  /*
   * Generate a url that asks permissions to the user's email and profile
   */

  try {
    const scopes =
      process.env.OUTLOOK_SCOPES || "https://graph.microsoft.com/.default";
    const authurl = await msalClient.getAuthCodeUrl({
      redirectUri: process.env.OUTLOOK_REDIRECT_URI,
      scopes: scopes.split(","),
    });
    console.log(`authurl: ${authurl}`);
    return authurl;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

var outlookAuthHandler = async () => {
  console.log("Reached here");
  let data = { url: await getOutlookAuthURL() };
  console.log("====>" + JSON.stringify(data));
  return data;
};

module.exports = {
  outlookAuthHandler,
  getOutlookAuthCode,
};
