const { ShellServer, Authenticators } = require('../lib/index');

const fs = require('fs');

const EchoShell = require('./echo-shell');

const keyFile = fs.readFileSync('./test_keys/test_key');
const PORT = 5151;

const server = new ShellServer({
  hostKeys: [ keyFile ],
  port: PORT,
});

function checkPassword(username, password) {
  return password === 'password'; // secure af
}

server.registerAuthenticator(new Authenticators.AuthenticateByPassword(checkPassword));

server.on('session-created', ({client, session}) => {
  console.log('Session Created');
  session.on('stream-initialized', (stream) => {
    console.log('Stream Initialized');
    // eslint-disable-next-line no-new
    new EchoShell('The Password Server', session.username, stream);
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
  console.error(e.error);
});

server.listen().then(() => {
  console.log(`Listening on port ${PORT}...`);
});
