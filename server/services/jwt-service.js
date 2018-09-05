'use strict';

const jwt = require('jsonwebtoken');
const config = require('../conf/config');

let service = () => {

  let _generateJwt = () => {
    return new Promise((resolve, reject) => {
      const jwtData = config.jwt;
      const objJwt = jwt.sign(jwtData, 'password');
      resolve(objJwt);
    });
  }

  return {
    generateJwt: _generateJwt
  }

};

module.exports = service();