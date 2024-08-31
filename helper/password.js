const ffi = require('ffi-napi');
const ref = require('ref-napi');

// Load the encryptdecrypy.dill file
const encryptDecryptLib = ffi.Library('./encryptdecrypy.dill', {
    'Encrypt': ['string', ['string']],
    'Decrypt': ['string', ['string']]
  });
  
// Example usage
const encryptedPassword = encryptDecryptLib.Encrypt('yourPassword');
console.log('Encrypted Password:', encryptedPassword);

const decryptedPassword = encryptDecryptLib.Decrypt(encryptedPassword);
console.log('Decrypted Password:', decryptedPassword);
