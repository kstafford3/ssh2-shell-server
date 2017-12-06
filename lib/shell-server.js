const EventEmitter = require('events');
const { Server } = require('ssh2');

const ShellClient = require('./shell-client');

/**
 * Listens for and manages incoming ssh connections.
 *
 * @emits session-created
 *    emit { client: Client, session: ShellSession } when a user successfully authenticates and begins a session.
 * @emits session-ended
 *    emit { client: Client, session: ShellSession } when the session is closing.
 * @emits error
 *    emit { error: Error, client: Client, session: ShellSession } when an error occurs for that client and session.
 *    Session may be null if the client has not begun a session.
 */
class ShellServer extends EventEmitter {
  constructor(configuration) {
    super();
    this._configuration = configuration;
    this._authenticators = {};
  }

  listen() {
    return new Promise((resolve) => {
      const server = new Server({ hostKeys: this._configuration.hostKeys }, this._handleIncoming.bind(this));
      server.listen(this._configuration.port, () => {
        resolve();
      });
    });
  }

  registerAuthenticator(authenticator) {
    this._authenticators[authenticator.methodName] = authenticator;
    return this;
  }

  _handleIncoming(client) {
    // create a new object with the registered authenticators
    const clientAuthenticators = Object.assign({}, this._authenticators);
    const shellClient = new ShellClient(client, clientAuthenticators);
    shellClient.on('session-created', this._handleSessionCreated.bind(this));
    shellClient.on('session-ended', this._handleSessionEnded.bind(this));
    shellClient.on('error', this._handleSessionError.bind(this));
  }

  _handleSessionCreated(creationContext) {
    // pass it along
    this.emit('session-created', creationContext);
  }

  _handleSessionEnded(endContext) {
    // pass it along
    this.emit('session-ended', endContext);
  }

  _handleSessionError(errorContext) {
    // pass it along
    this.emit('session-error', errorContext);
  }
};

module.exports = ShellServer;
