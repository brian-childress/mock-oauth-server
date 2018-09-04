# Mock OAuth Server

This server is designed as a mock OAuth/ OpenID Connect Server to help in understanding and implementing an OAuth solution. This server provides API endpoints that will aid in developing a client application. By using this server you will have better control of the time required to exectue certain steps in the OAuth flow and manually trigger errors at each step.

#### Endpoints

- `
#### Flags
|Flag|Description|Options|
|:---|:---|:---|
|`-e`|Will return an error. Requires a specific API endpoint to error.|[authentication,parameters,token, user]|
|`-d`|Will delay the response of all endpoints for that amount of time.|In milliseconds, `ex: 3000`|