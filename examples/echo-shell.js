const readline = require('readline');

const QUIT_KEYWORDS = [ 'quit', 'exit', 'q' ];

/**
 * A simple shell program to demonstrate functionality in the examples.
 */
class EchoShell {
  constructor(serverName, username, stream) {
    this._serverName = serverName;
    this._username = username;
    this._stream = stream;
    this._rl = readline.createInterface({
      input: this._stream,
      output: this._stream,
      prompt: '>',
    });
    this._start();
  }

  _start() {
    this._stream.write(`Welcome to ${this._serverName}!\r\n`);
    this._rl.prompt();
    this._rl.on('line', this._handleLine.bind(this));
    this._rl.on('close', this._handleClose.bind(this));
  }

  _handleLine(line) {
    console.log(`${this._username}: ${line}`);
    this._stream.write(`${line}\r\n`);
    if (QUIT_KEYWORDS.indexOf(line.toLowerCase()) > -1) {
      this._rl.close();
    } else {
      this._rl.prompt();
    }
  }

  _handleClose() {
    this._stream.write('Ok, well, I guess I\'ll talk to you later, then.\r\n');
    this._stream.close();
  }
}

module.exports = EchoShell;
