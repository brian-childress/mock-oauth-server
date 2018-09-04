'use strict';

module.exports= {
  'oAuthClientId'                       : 'thisIsMyClientId',
  'oAuthClientSecret'                   : 'thisIsMyClientSecret',
  'oAuthAuthenticationUrl'              : 'http://localhost:3000/authenticate',
  'oAuthAuthenticationRedirectUri'      : 'http://localhost:4200',
  'oAuthTokenUrl'                       : 'http://localhost:3000/token',
  'oAuthTokenRedirectUri'               : 'http://localhost:4200/',
  'oAuthUserInfoUrl'                    : 'http://localhost:3000/user',
  'jwt' : {
            'firstName'     : 'Joe',
            'lastName'      : 'Bag of Donuts',
            'organization'  : 'ACME'
          }
};