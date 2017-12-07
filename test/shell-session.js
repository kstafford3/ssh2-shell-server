const EventEmitter = require('events');

const ShellSession = require('../lib/shell-session');

describe('ShellSession', function() {
  describe('#new', function() {
    it('should set ShellSession.username.', function() {
      const username = 'alice';
      const shellSession = new ShellSession(username, new EventEmitter());
      shellSession.username.should.equal(username);
    });
  });

  describe('#_session.once(\'shell\')', function() {
    it('should emit the result of accept()', function(done) {
      const username = 'alice';
      const session = new EventEmitter();
      const shellSession = new ShellSession(username, session);
      const stream = new EventEmitter();
      shellSession.on('stream-initialized', function(emittedStream) {
        emittedStream.should.equal(stream);
        done();
      });
      session.emit('shell', () => stream);
    });

    it('should emit errors emitted by the result of accept()', function(done) {
      const username = 'alice';
      const session = new EventEmitter();
      const shellSession = new ShellSession(username, session);
      const stream = new EventEmitter();
      session.emit('shell', () => stream);
      const errorText = 'some error';
      shellSession.on('error', function(errorContext) {
        errorContext.error.should.equal(errorText);
        errorContext.session.should.equal(shellSession);
        done();
      });
      stream.emit('error', errorText);
    });
  });
});
