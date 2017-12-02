const { ShellServer, Authenticators } = require('../lib/index');

const fs = require('fs');
const readline = require('readline');

const keyFile = fs.readFileSync('./test_keys/test_key');
const PORT = 5151;

const QUIT_KEYWORDS = [ 'quit', 'exit', 'q' ];

const server = new ShellServer({
  hostKeys: [ keyFile ],
  port: PORT,
},
Authenticators.authenticateByPassword(checkPassword));

// Authenticators.authenticateByPassword(checkPassword)); // Alternative authentication

server.on('session-created', (session) => {
  console.log('Session Created');
  session.on('stream-initialized', (stream) => {
    console.log('Stream Initialized');
    stream.write('Welcome to the password-protected server!\r\n');
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

function checkPassword(username, password) {
  return password === 'password'; // secure af
}
