'use strict';

let _generateGuid = () => {
  return 'xxxxxxyxxxxyxxxyxxyxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

let service = function () {
  return {
    generateGuid: _generateGuid
  };
};

module.exports = service();