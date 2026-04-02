import { type Configuration, PublicClientApplication } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "YOUR_MICROSOFT_CLIENT_ID_HERE",
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID_HERE",
    redirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
  }
};

export const loginRequest = {
  scopes: ["User.Read"]
};

export const msalInstance = new PublicClientApplication(msalConfig);
