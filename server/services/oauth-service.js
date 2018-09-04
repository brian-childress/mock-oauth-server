'use strict';

const config = require('../conf/config');

let service = () => {

  let _getOauthParams = () => {
    return new Promise((resolve, reject) => {
      let objParams = {
        client_id: config.oAuthClientId,
        client_secret: config.oAuthClientSecret,
        auth_url: config.oAuthAuthenticationUrl,
        auth_redirect_uri: config.oAuthAuthenticationRedirectUri,
        token_url: config.oAuthTokenUrl,
        token_redirect_uri: config.oAuthTokenRedirectUri
      };

      resolve(objParams);
    });

  }

  return {
    getOauthParams: _getOauthParams
  };

};

module.exports = service();