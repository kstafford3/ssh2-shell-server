# SSH2 Shell Server
## Get an interactive [ssh2](https://www.npmjs.com/package/ssh2) server up-and-running in minutes.

[![npm version](https://badge.fury.io/js/ssh2-shell-server.svg)](https://www.npmjs.com/package/ssh2-shell-server)
[![Build Status](https://travis-ci.org/kstafford3/ssh2-shell-server.svg?branch=mater)](https://travis-ci.org/kstafford3/ssh2-shell-server)

## Install
```
npm install ssh2-shell-server
```

## Generate Keys

Generate the host key. For this example, the following will work:
```
ssh-keygen -f test_key -C ""
```
This will generate a key pair in the current directory.

## Implement
The following example creates a shell server listening on port 5151, using the private key at `./test_keys/test_key` as the host key. You can replace this with the location of your own generated key.

When a user connects using a client like ssh, the server accepts their authentication.

After the user has authenticated, it sends a friendly message to the user's client, then disconnects.

```javascript
const { ShellServer, Authenticators } = require('ssh2-shell-server');

const fs = require('fs');

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
```

See [examples](https://github.com/kstafford3/ssh2-shell-server-examples) for more working source code.

---

Copyright 2017, Kyle Stafford (MIT License).

