

const msalConfig = {
  auth: {
    clientId: "36c7e600-d3ba-490b-abd9-2d666495118c", // Replace with your actual client ID
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:3000/signup/outlookoauth", // Replace with your app's redirect URL
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

const loginRequest = {
  scopes: ["openid", "profile", "User.Read"],
};

export { msalConfig, loginRequest };


/*
OUTLOOK_CLIENT_ID=36c7e600-d3ba-490b-abd9-2d666495118c
OUTLOOK_CLIENT_SECRET='age8Q~1Ro0zzkcDuBNzmr1L4KepkSe8qo4B6sbDv'
OUTLOOK_REDIRECT_URI=http://localhost:3000/signup/outlookoauth
OUTLOOK_SCOPES='user.read,calendars.readwrite,mailboxsettings.read'
OUTLOOK_AUTHORITY=https://login.microsoftonline.com/common
*/
