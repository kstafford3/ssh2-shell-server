const { ShellServer, Authenticators } = require('../lib/index');

const fs = require('fs');
const ssh2 = require('ssh2');
const buffersEqual = require('buffer-equal-constant-time');
const readline = require('readline');

const keyFile = fs.readFileSync('./test_keys/test_key');
const PORT = 5151;

const QUIT_KEYWORDS = [ 'quit', 'exit', 'q' ];

const utils = ssh2.utils;
const USER_PUBKEY = process.env.USER_PUBLIC_KEY;
const userPublicKey = utils.genPublicKey(utils.parseKey(USER_PUBKEY));

const server = new ShellServer({
  hostKeys: [ keyFile ],
  port: PORT,
},
Authenticators.authenticateByPublicKey({ validate, verify }));

// Authenticators.authenticateByPassword(checkPassword)); // Alternative authentication

server.on('session-created', (session) => {
  console.log('Session Created');
  session.on('stream-initialized', (stream) => {
    console.log('Stream Initialized');
    stream.write('Welcome to the public-key server!\r\n');
    const rl = readline.createInterface({
      input: stream,
      output: stream,
      prompt: '>',
    });
    rl.prompt();
    rl.on('line', (line) => {
      console.log(`${session.username}: ${line}`);
      stream.write(`${line}\r\n`);
      if (QUIT_KEYWORDS.indexOf(line.toLowerCase()) > -1) {
        rl.close();
      }
      rl.prompt();
    });

    rl.on('close', () => {
      stream.write('Ok, well, I guess I\'ll talk to you later, then.\r\n');
      stream.close();
    });
  });
});

server.on('session-ended', (e) => {
  console.log('Session Ended');
});

server.on('error', (e) => {
  console.error('Error!', e);
});

server.listen().then(() => {
  console.log(`Listening on port ${PORT}...`);
});

function validate(username, algorithm, data) {
  return (algorithm === userPublicKey.fulltype && buffersEqual(data, userPublicKey.public));
}

function verify(username, verifier, signature) {
  return verifier.verify(userPublicKey.publicOrig, signature);
}
