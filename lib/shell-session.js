const EventEmitter = require('events');

class ShellSession extends EventEmitter {
  constructor(username, session) {
    super();
    this.username = username;
    this._session = session;
    this._initialWindow = {
      rows: 24,
      cols: 80,
    };
    this._stream = null;

    this._session.once('pty', this._declarePTY.bind(this));
    this._session.on('window-change', this._windowChange.bind(this));
    this._session.once('shell', this._initializeShell.bind(this));
  }

  _declarePTY(accept, reject, info) {
    if (this._stream === null) {
      this._initialWindow.rows = info.rows;
      this._initialWindow.cols = info.cols;
    } else {
      console.error('PTY event after stream was initialized');
      this._stream.rows = info.rows;
      this._stream.cols = info.cols;
    }
    accept && accept();
  }

  _windowChange(accept, reject, info) {
    if (this._stream === null) {
      console.warn('Window Change event before stream was initialized');
      this._initialWindow.rows = info.rows;
      this._initialWindow.cols = info.cols;
    } else {
      this._stream.rows = info.rows;
      this._stream.cols = info.cols;
      this._stream.emit('resize');
    }
    accept && accept();
  }

  _initializeShell(accept, reject) {
    this._stream = accept();
    this._stream.rows = this._initialWindow.rows || 24;
    this._stream.columns = this._initialWindow.cols || 80;
    this._stream.isTTY = true;
    this._stream.setRawMode = () => {};
    this._stream.on('error', (err) => {
      // TODO: Better Error Logging
      console.error(err);
    });
    this.emit('stream-initialized', this._stream);
  }
}

module.exports = ShellSession;
