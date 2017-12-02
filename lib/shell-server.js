const EventEmitter = require('events');
const { Server } = require('ssh2');

const ShellSession = require('./shell-session');

class ShellServer extends EventEmitter {
  constructor(configuration, authenticator) {
    super();
    this._configuration = configuration;
    this._authenticator = authenticator;
  }

  listen() {
    return new Promise((resolve) => {
      new Server({ hostKeys: this._configuration.hostKeys }, this._handleIncoming.bind(this))
        .listen(this._configuration.port, () => {
          resolve();
        });
    });
  }

  _handleIncoming(client) {
    var username = null;
    client.on('authentication', (ctx) => {
      username = ctx.username;
      this._authenticate(ctx);
    });

    var self = this; // gross
    var shellSession = null;
    client.on('ready', (accept, reject) => {
      client.on('session', (accept, reject) => {
        var session = accept(); // ssh2 session
        if (session) {
          shellSession = new ShellSession(username, session);
          self.emit('session-created', shellSession);
        }
      });
    });

    client.on('end', (accept, reject) => {
      // pass it along
      self.emit('session-ended', shellSession);
    });

    client.on('error', (err) => {
      // pass it along
      self.emit('error', {
        err: err,
        client: client,
        session: shellSession,
      });
    });
  }

  _authenticate(ctx) {
    return new Promise((resolve, reject) => {
      if (this._authenticator) {
        Promise.resolve(this._authenticator(ctx))
          .then((value) => {
            if (value) {
              ctx.accept();
            } else {
              ctx.reject();
            }
            resolve(value);
          })
          .catch((e) => {
            ctx.reject();
            reject(e);
          });
      } else {
        ctx.reject();
        reject(new Error('Authenticator not specified.'));
      }
    });
  }
};

module.exports = ShellServer;
