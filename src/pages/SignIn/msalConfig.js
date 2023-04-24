export const msalConfig = {
    auth: {
      clientId: "your-outlook-client-id", // Add your Outlook client ID here
      authority: "https://login.microsoftonline.com/common",
      redirectUri: "http://localhost:3000", // Update this to your app's URL
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
  };
  
  export const loginRequest = {
    scopes: ["openid", "profile", "User.Read"],
  };
  