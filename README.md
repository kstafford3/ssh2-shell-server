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

# Shell Server
The `ShellServer` class manages the ssh2 `Server`. Its primary responsibilities are listening for session events from individual clients, and forwarding them to the `ShellServer`'s own listeners.

`ShellServer` is also responsible for registering authenticators, and cloning them to newly connected clients for authentication.

## Constructor

```
new ShellServer({
  hostKeys: Array<string>,
  port: number,
});
```

`hostKeys` is an array of raw private key data.

`port` is the port that this server will listen on.

## registerAuthenticator(authenticator)
Add a new `Authenticator` to the set of authenticators available to connecting clients.

Returns this `ShellServer` to allow chaining.

## listen()
Listen on the configured port for client connections.

Returns a promise that resolves when the server begins listening.

## Events

### `session-created`
When a client is authenticated and a session is created, the `ShellServer` will emit a `'session-created'` event with the following payload:
```js
{
  client: ShellClient,
  session: ShellSession,
}
```

### `session-ended`
When a client connection is closed by the client or the server, `ShellServer` will emit a `'session-ended'` event with the following payload:
```js
{
  client: ShellClient,
  session: ShellSession,
}
```

# ShellClient
The `ShellClient` is generally an internal class used to manage the authentication of a single client.
A `ShellClient` may be passed out of the `ShellServer` as part of the event payload when sessions are created or ended, or when an error occurs.

# ShellSession
`ShellSession` manages the stream communicating with a single client. Its primary responsibilities are to accept `pty` requests and prepare stream between the server and client. It will emit an event when the stream has been initialized.

`ShellSession` is also responsible for managing changes to the client's viewing window, updating the stream's `rows` and `columns` fields.

## Events

### `stream-initialized`
After a client connection is established, once a stream has been initialized to manage data-flow between the client and server, the `ShellSession` will emit a `'stream-initialized'` event with the newly initialized stream as the payload.

# Authenticators
For a good primer on ssh authentication, see [this post](https://www.digitalocean.com/community/tutorials/understanding-the-ssh-encryption-and-connection-process#authenticating-the-user-39-s-access-to-the-server).

# AuthenticateAny
`AuthenticateAny` listens for clients connecting with the authentication method 'none'.
Any client connecting with the method 'none' will be accepted automatically.

# AuthenticateByPassword
`AuthenticateByPassword` listens for clients connecting with the authentication method 'password'.
Any client connecting with the method 'password' will be authenticated using the provided `checkPassword` method.

## Constructor
```js
new AuthenticateByPassword(checkPassword);
```

`AuthenticateByPassword`'s constructor accepts the `checkPassword` method (described below) as a parameter.

## checkPassword(username, password, ctx)
`CheckPassword` method accepts `username`, `password`, and `ctx` as parameters when a client attempts to authenticate.
These are the authentication parameters provided by the client attempting to authenticate.

`CheckPassword` either returns a `Boolean` or a `Promise` that resolves to a `Boolean`.
Resolving to `true` will successfully authenticate the client.
Resolving to `false` will reject this authentication attempt.

# AuthenticateByPublicKey
`AuthenticateByPassword` listens for clients connecting with the authentication method 'password'.
Any client connecting with the method 'publickey' will be authenticated using the provided `validate` and `verify` methods. Validation and Verification must both succeed for the client to be authenticated.

AuthenticateByPublicKey provides hooks to drive the `authorized_keys` process.

## Constructor
```js
new AuthenticateByPassword(validate, verify)
```
`AuthenticateByPublicKey`'s constructor accepts the `validate` and `verify` methods (described below) as parameters.

## validate(keyAlgorithm, keyData, ctx)
`Validate` method accepts `keyAlgorithm`, `keyData`, and `ctx` as parameters.
This provides a chance to accept or reject the public key based on the key's contents.

`Validate` must return a `Boolean` or a `Promise` that resolves to a `Boolean`.
Resolving to `true` indicates that the client has succeeded at this step.
Resolving to `false` indicates that the client has failed this step.

## verify(verifier, signature, ctx)
`Verify` method accepts `verifier`, `signature`, and `ctx` as parameters.
This provides a chance to accept or reject the public key based on its signature.

`Verify` must return a `Boolean` or a `Promise` that resolves to a `Boolean`.
Resolving to `true` indicates that the client has succeeded at this step.
Resolving to `false` indicates that the client has failed this step.

A simple implementation of verify would be:
```js
function verify(verifier, signature) {
  return verifier.verify(pk, signature);
}
```
Where `pk` is the connecting connecting user's raw public key (as a Buffer).

---

Copyright 2017, Kyle Stafford (MIT License).

