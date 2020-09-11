const EventEmitter = require('events');
const ShellSession = require('./shell-session');

/**
 * Handles authentication, creates a ShellSession when the client is ready.
 *
 * @emits session-created
 *    emit { client: Client, session: ShellSession } when a user successfully authenticates and begins a session.
 * @emits session-ended
 *    emit { client: Client, session: ShellSession } when the session is closing.
 * @emits error
 *    emit { error: Error, client: Client, session: ShellSession } when an error occurs for that client and session.
 *    Session may be null if the client has not begun a session.
 */
class ShellClient extends EventEmitter {
  constructor(client, authenticators) {
    super();

    this._client = client;
    this._authenticators = authenticators;

    this._username = null;
    this._remainingAuthenticationMethods = Object.keys(this._authenticators);
    this._shellSession = null;
    this._authenticationResult = null;

    this._client.on('authentication', this._handleAuthentication.bind(this));
    this._client.on('ready', this._handleReady.bind(this));
    this._client.on('end', this._handleEnd.bind(this));
    this._client.on('error', function() {});  // ignore errors
  }

  _handleAuthentication(ctx) {
    const currentAuthenticationMethod = ctx.method;
    if (!this._authenticationMethodRemains(currentAuthenticationMethod)) {
      // method not supported, or no longer available to the client
      ctx.reject(this._remainingAuthenticationMethods);
    } else {
      this._username = ctx.username;
      const currentAuthenticator = this._authenticators[ctx.method];
      if (currentAuthenticator) {
        Promise.resolve(currentAuthenticator.authenticate(ctx))
          .then((authenticationResult) => {
            if (authenticationResult) {
              this._authenticationResult = authenticationResult;
              ctx.accept();
            } else {
              ctx.reject(this._remainingAuthenticationMethods);
            }
          })
          .catch((e) => {
            console.error(e);
            ctx.reject(this._remainingAuthenticationMethods);
          });
      }
    }
  }

  _authenticationMethodRemains(methodName) {
    const methodIndex = this._remainingAuthenticationMethods.indexOf(methodName);
    return methodIndex !== -1;
  }

  _handleReady() {
    this._client.once('session', this._handleSession.bind(this));
  }

  _handleSession(accept, reject) {
    var ssh2Session = accept();
    if (ssh2Session) {
      this._shellSession = new ShellSession(this._username, ssh2Session, this._authenticationResult);
      this.emit('session-created', {
        client: this,
        session: this._shellSession,
      });
    }
  }

  _handleEnd(accept, reject) {
    // pass it along
    this.emit('session-ended', {
      client: this,
      session: this._shellSession,
    });
  }

  _handleError(error) {
    // pass it along
    this.emit('error', {
      error: error,
      client: this,
      session: this._shellSession,
    });
  }
};

module.exports = ShellClient;
