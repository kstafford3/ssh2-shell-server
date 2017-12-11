const EventEmitter = require('events');

const ShellClient = require('../lib/shell-client');

function buildTestAuth(methodName, result) {
  return {
    methodName,
    authenticate(ctx) {
      return result;
    },
  };
}

describe('ShellClient', function() {
  describe('#_client.on(\'authenticate\')', function() {
    it('should reject if no authenticator is present.', function(done) {
      const client = new EventEmitter();
      new ShellClient(client, {});
      const ctx = {
        method: 'definitely-not-supported',
        accept() {
          this.should.fail('Authentication accepted when rejection was expected');
          done();
        },
        reject() {
          done();
        },
      };
      client.emit('authentication', ctx);
    });

    it('should reject with acceptable authentication methods.', function(done) {
      const client = new EventEmitter();
      const authenticators = {
        'Accepted Method': buildTestAuth('Accepted Method', true),
        'Very Legit': buildTestAuth('Very Legit', true),
        'Security': buildTestAuth('Security', true),
      };
      new ShellClient(client, authenticators);
      const ctx = {
        method: 'definitely-not-supported',
        accept() {
          this.should.fail('Authentication accepted when rejection was expected');
          done();
        },
        reject(requestedMethods) {
          requestedMethods.should.deep.equal(Object.keys(authenticators));
          done();
        },
      };
      client.emit('authentication', ctx);
    });

    it('should reject when an acceptable authentication method returns false.', function(done) {
      const client = new EventEmitter();
      const authenticators = {
        'supported': buildTestAuth('supported', false),
      };
      new ShellClient(client, authenticators);
      const ctx = {
        method: 'supported',
        accept() {
          this.should.fail('Authentication accepted when rejection was expected');
          done();
        },
        reject(requestedMethods) {
          done();
        },
      };
      client.emit('authentication', ctx);
    });

    it('should accept when an acceptable authentication method returns true.', function(done) {
      const client = new EventEmitter();
      const authenticators = {
        'supported': buildTestAuth('supported', true),
      };
      new ShellClient(client, authenticators);
      const ctx = {
        method: 'supported',
        accept() {
          done();
        },
        reject(requestedMethods) {
          this.should.fail('Authentication rejected when acceptance was expected');
          done();
        },
      };
      client.emit('authentication', ctx);
    });

    it('should preserve the authentication result when an acceptable authentication method returns a truthful value.', function(done) {
      const client = new EventEmitter();
      const authenticationValue = 'not-falsey';
      const authenticators = {
        'supported': buildTestAuth('supported', authenticationValue),
      };
      var shellClient = new ShellClient(client, authenticators);
      const ctx = {
        method: 'supported',
        accept() {
          shellClient._authenticationResult.should.equal(authenticationValue);
          done();
        },
        reject(requestedMethods) {
          this.should.fail('Authentication rejected when acceptance was expected');
          done();
        },
      };
      client.emit('authentication', ctx);
    });
  });
});
