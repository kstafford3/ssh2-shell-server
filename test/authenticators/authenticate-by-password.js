const sinon = require('sinon');

const AuthenticateByPassword = require('../../lib').Authenticators.AuthenticateByPassword;

describe('Authenticators', function() {
  describe('.AuthenticateByPassword', function() {
    describe('#methodName', function() {
      it('should have the methodName \'password\'.', function() {
        const authenticator = new AuthenticateByPassword();
        authenticator.methodName.should.equal('password');
      });
    });

    describe('#authenticate()', function() {
      it('should resolve to true when authenticate returns true', function() {
        const authenticator = new AuthenticateByPassword(() => true);
        authenticator.authenticate({}).should.eventually.equal(true);
      });

      it('should resolve to true when authenticate returns a promise resolving to true', function() {
        const authenticator = new AuthenticateByPassword(() => Promise.resolve(true));
        authenticator.authenticate({}).should.eventually.equal(true);
      });

      it('should resolve to false when authenticate returns false', function() {
        const authenticator = new AuthenticateByPassword(() => false);
        authenticator.authenticate({}).should.eventually.equal(false);
      });

      it('should resolve to false when authenticate returns a promise resolving to true', function() {
        const authenticator = new AuthenticateByPassword(() => Promise.resolve(false));
        authenticator.authenticate({}).should.eventually.equal(false);
      });

      it('should pass ctx.username, ctx.password, and ctx to the authentication method', function() {
        const checkPassword = sinon.spy(() => true);
        const authenticator = new AuthenticateByPassword(checkPassword);
        const ctx = {
          username: 'alice',
          password: 'secure',
        };
        authenticator.authenticate(ctx);
        checkPassword.should.be.calledWith(ctx.username, ctx.password, ctx);
      });
    });
  });
});
