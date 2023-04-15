const { google } = require("googleapis");
const msal = require("@azure/msal-node");
var graph = require("@microsoft/microsoft-graph-client");
require("isomorphic-fetch");
const dbQueryUtilities = require("../utilities/dbQueryUtilities");
const dbUtilities = require("../utilities/dbUtilities");
const authUtilities = require("../utilities/authUtilities");



const msalConfig = {
  auth: {
    clientId: process.env.OAUTH_CLIENT_ID || "",
    authority: process.env.OAUTH_AUTHORITY,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
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

let getOutlookUser = async (client,accessToken) => {
  try {
    console.log(client);
    const outlookUser = await client
      .api("/me")
      .select("displayName,mail,mailboxSettings,userPrincipalName,photo")
      .get();

    console.log(JSON.stringify(outlookUser));
    var data = {
      conditionData: {
        emailAddress2: outlookUser.userPrincipalName,
        emailAddress1: outlookUser.userPrincipalName,
      },
      conditionType: "OR",
      selectionData: ["user_id", "emailAddress1", "emailAddress2"],
      tablename: "user",
    };

    let selectQuery = `Select `;
    let generatedSelectQuery = dbQueryUtilities.queryBuilder("select", data);
    selectQuery = selectQuery + generatedSelectQuery;

    var selectQueryResponse = await dbUtilities.selectQuery(selectQuery);
    console.log("Select Query res", selectQueryResponse);

    let user = {
      userName: outlookUser.displayName,
      emailAddress1: outlookUser.userPrincipalName,
      password1: outlookUser.id,
    };
    if (selectQueryResponse && selectQueryResponse.length > 0) {
      let existingUser = {
        userName: outlookUser.givenName,
        emailAddress1: outlookUser.userPrincipalName,
        refreshToken: accessToken,
        profileimage: outlookUser.picture,
        provider: "outlook",
        user_id: selectQueryResponse[0].user_id,
      };
      var token = await authUtilities.generateJWT(existingUser);
      console.log({ token: token });

      return { token: token };
    } else {
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
        user["refreshToken"] = accessToken;
        user["profileimage"] = outlookUser.picture;
        user["provider"] = "outlook";
        user["user_id"] = queryResponse.insertId;
        var token = await authUtilities.generateJWT(user);
        console.log({ token: token });

        return { token: token };
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
  console.log(JSON.stringify(req.query));
  const scopes = process.env.OAUTH_SCOPES || "https://graph.microsoft.com/.default";
  const tokenRequest = {
    code: req.query.code,
    scopes: scopes.split(","),
    redirectUri: process.env.OAUTH_REDIRECT_URI,
  };
  const response = await msalClient.acquireTokenByCode(tokenRequest);
  console.log(response);
  const client = getAuthenticatedClient(
    msalClient,
    response.account.homeAccountId
  );
  let getUser = await getOutlookUser(client,response.accessToken);
  return getUser;
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
            process.env.OAUTH_SCOPES || "https://graph.microsoft.com/.default";
          const response = await msalClient.acquireTokenSilent({
            scopes: scopes.split(","),
            redirectUri: process.env.OAUTH_REDIRECT_URI,
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
      process.env.OAUTH_SCOPES || "https://graph.microsoft.com/.default";
    const authurl = await msalClient.getAuthCodeUrl({
      redirectUri: process.env.OAUTH_REDIRECT_URI,
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
