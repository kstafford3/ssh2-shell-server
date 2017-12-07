const { ShellServer, Authenticators } = require('../lib/index');

const fs = require('fs');
const ssh2 = require('ssh2');
const buffersEqual = require('buffer-equal-constant-time');

const EchoShell = require('./echo-shell');

const keyFile = fs.readFileSync('./test_keys/test_key');
const PORT = 5151;

const utils = ssh2.utils;
const USER_PUBKEY = process.env.USER_PUBLIC_KEY;
const userPublicKey = utils.genPublicKey(utils.parseKey(USER_PUBKEY));

const server = new ShellServer({
  hostKeys: [ keyFile ],
  port: PORT,
});

function validate(algorithm, data) {
  return (algorithm === userPublicKey.fulltype && buffersEqual(data, userPublicKey.public));
}

function verify(verifier, signature) {
  return verifier.verify(userPublicKey.publicOrig, signature);
}

server.registerAuthenticator(new Authenticators.AuthenticateByPublicKey(validate, verify));

server.on('session-created', ({client, session}) => {
  console.log('Session Created');
  session.on('stream-initialized', (stream) => {
    console.log('Stream Initialized');
    new EchoShell('The Public Key Server', session.username, stream);
  });
});

server.on('session-ended', ({client, session}) => {
  if (session) {
    console.log(`${session.username}'s Session Ended`);
  } else {
    console.log('Session Ended');
  }
});

server.on('error', (e) => {
  console.error(e);
});

server.listen().then(() => {
  console.log(`Listening on port ${PORT}...`);
});
