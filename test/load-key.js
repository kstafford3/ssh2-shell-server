const fs = require('fs');
const ssh2Utils = require('ssh2').utils;

function loadPublicKey() {
  const rawPublicKey = fs.readFileSync('./test/test_keys/test_key.pub');
  const parsedKey = ssh2Utils.parseKey(rawPublicKey);
  const publicKey = ssh2Utils.genPublicKey(parsedKey);
  return publicKey;
}

module.exports = loadPublicKey;
