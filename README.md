# SSH2 Shell Server
## Get an [ssh2](https://www.npmjs.com/package/ssh2) server up-and-running in minutes.

[![Build Status](https://travis-ci.org/kstafford3/ssh2-shell-server.svg?branch=mater)](https://travis-ci.org/kstafford3/ssh2-shell-server)

```javascript
const fs = require('fs');
const { ShellServer, Authenticators } = require('ssh2-shell-server');

const PORT = 5151;
const keyFile = fs.readFileSync('./test_keys/test_key');
const server = new ShellServer({
  hostKeys: [ keyFile ],
  port: PORT,
}, Authenticators.authenticateAny());

server.on('session-created', (session) => {
  session.on('stream-initialized', (stream) => {
    stream.write('Welcome to the server!\r\n');
    stream.write('Good talk, see you later.\r\n');
    stream.close();
  });
});

server.listen().then(() => {
  console.log(`Listening on port ${PORT}...`);
});
```
See [examples](/examples) for more working source code

---

Copyright 2017, Kyle Stafford (MIT License).

