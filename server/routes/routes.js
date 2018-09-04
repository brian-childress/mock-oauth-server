const guidService = require("../services/guid-generator");
const config = require("../conf/config");
const oauth = require("../services/oauth-service");
const jwt = require("../services/jwt-service");

/**
 * authenticate - Returns information (guid) required for authentication by redirecting
 * back to the calling application
 * @param { Object } - objSystem - An object containing information about the request, response, and system configurations
 */
exports.authenticate = (objSystem) => {
  return new Promise((resolve, reject) => {
    const error = causeErrors(objSystem.errors, 'authenticate');

    if (error) {
      objSystem.response.status(400).send('ERROR => Unable to return Token');
      reject();
    } else {

      if (!objSystem.request.query.client_id) {
        objSystem.response.status(400).send('Request client_id Missing');
        reject('Request client_id Missing');
      } else if (!objSystem.request.query.redirect_uri) {
        objSystem.response.status(400).send('Request redirect_uri Missing');
        reject('Request client_id Missing');
      } else {

        let redirect_uri = objSystem.request.query.redirect_uri;

        setTimeout(() => {
          let guid = guidService.generateGuid();
          objSystem.response.status(301);
          objSystem.response.setHeader('Content-Type', 'text/plain');
          objSystem.response.setHeader('Location', `${redirect_uri}?code=${guid}`);
          objSystem.response.end('Redirecting to ' + redirect_uri);
          resolve();
        }, objSystem.delayTime);
      }
    }
  })
}

/**
 * oauthParams - Returns Oauth parameters
 * @param { Object } objSystem - An object containing information about the request, response, and system configurations
 */
exports.oauthParams = (objSystem) => {
  return new Promise((resolve, reject) => {
    const error = causeErrors(objSystem.errors, 'parameters');

    if (error) {
      objSystem.response.status(400).send('ERROR => Unable to return OAuth Parameters');
      reject();
    } else {
      oauth.getOauthParams()
        .then((objParms) => {
          objSystem.response.status(200).json(objParms);
        });
    }
  });
};

/**
 * token - Returns a short lived token used during the OAuth flow
 * @param { Object } objSystem - An object containing information about the request, response, and system configurations
 */
exports.token = (objSystem) => {
  return new Promise((resolve, reject) => {

    const error = causeErrors(objSystem.errors, 'token');

    if (error) {
      objSystem.response.status(400).send('ERROR => Unable to return Token');
      reject();
    } else {
      if (!objSystem.request.headers.authorization) {
        objSystem.response.status(400).send('Authorization Header Missing');
        reject('Authorization Header Missing');
      } else if (!objSystem.request.query.code) {
        objSystem.response.status(400).send('Request Code Missing');
        reject('Request Code Missing');
      } else if (!objSystem.request.query.grant_type) {
        objSystem.response.status(400).send('Request grant_type Missing');
        reject('Request grant_type Missing');
      } else {

        let guid = guidService.generateGuid();

        let payload = {
          access_token: guid,
          expires_in: 7199,
          id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IndCQTBBODdCV0IwVkdSYUttODFYZWQifQ.eyJzdWIiOiJucnEzMDkiLCJhdWQiOiJUaGlja0NsaWVudE9BdXRod1BpbmdTU080SU5TSVRFIiwianRpIjoiM1dDQnJYajNRU3ozT2gwRkNuSGdWOCIsImlzcyI6Imh0dHBzOlwvXC93ZWJhY2Nlc3NuY2Mud3Bpbi5jYXBpdGFsb25lLmNvbSIsImlhdCI6MTUyNDg1MjQzNCwiZXhwIjoxNTI0ODUyNzM0fQ.Q9Y3gzag5p8ekYOFUbdaiwSOn8PVIS_6-lwLehx62eFhHIkTa5v5mZmksQq35hwIbit29wl9cg23Qm8OXSaM0lSS1hgVX9JU_zhN0VKeaa93pfp1Z4YSOOtA615zjVC7Oia0wGmPgBuKlVxLZDyW9h2pWFSVJdLKGZ4mlwOJLTdDNgcYXJUiDYcrGiSNVTQej8sk5r-cbLho47x3lUD7u4XE_wTDwj8VoOYHdiVT3DPFjCNZ67p1jYOrJN1pDaJ0krcBfAP3W0zj1X4xUQFxJb2JVXdNuv9g_rf-YpfOJTefdSCElv7ol8VpRQS4_lvF50aIJlk0xSydW_Hxyss7Zg",
          refresh_token: guid,
          token_type: "Bearer"
        };

        setTimeout(() => {
          objSystem.response.status(200).send(payload);
        }, objSystem.delayTime);
      }
    }
  });
}

/**
 * userInfo - Returns information about the user from a 'profile'
 * @param { Object } objSystem - An object containing information about the request, response, and system configurations
 */
exports.userInfo = (objSystem) => {
  return new Promise((resolve, reject) => {
    const error = causeErrors(objSystem.errors, 'user');

    if (error) {
      objSystem.response.status(400).send('ERROR => Unable to return Token');
      reject();
    } else {

      // JWT
      jwt.generateJwt().then((objJwt) => {
        objSystem.response.status(200).json(objJwt);
      }).catch((error) => {
        objSystem.response.status(400).send(error);
      });
    }

  })
}

/**
 * causeErrors - A helper function to determine if a specified route, etc. should
 * return an error based on information based to the server on bootup. Will first search
 * for route name by it's string value, if not found and 'random' has been passed for an error
 * state, will randomly return a boolean
 * @param { Array } arrayErrors - An array of routes, etc. that should return an error state
 * @param { String } sRouteName - The name of the route that should return an error
 */
let causeErrors = (arrayErrors, sRouteName) => {

  if (arrayErrors.indexOf(sRouteName) > -1) {
    return true;
  } else if (arrayErrors.indexOf('random') > -1) {
    const random_boolean = Math.random() >= 0.5;
    return random_boolean;
  }

  return false;

}