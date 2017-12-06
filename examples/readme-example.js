const fs = require('fs');

const { ShellServer, Authenticators } = require('../lib');

const PORT = 5151;
const keyFile = fs.readFileSync('./test_keys/test_key');
const server = new ShellServer({
  hostKeys: [ keyFile ],
  port: PORT,
});

server.registerAuthenticator(new Authenticators.AuthenticateAny());

server.on('session-created', ({client, session}) => {
  session.on('stream-initialized', (stream) => {
    stream.write('Welcome to the server!\r\n');
    stream.write('Good talk, see you later.\r\n');
    stream.close();
  });
});

server.listen().then(() => {
  console.log(`Listening on port ${PORT}...`);
});
