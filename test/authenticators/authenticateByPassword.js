const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
chai.should();

const Authenticators = require('../../lib/authenticators');

describe('Authenticators', function() {
  describe('#authenticateByPassword()', function() {
    it('should resolve to false when ctx.method is not \'password\'', function() {
      const ctx = {
        method: 'not-password',
      };
      const authenticator = Authenticators.authenticateByPassword(() => true);
      authenticator(ctx).should.eventually.equal(false);
    });
    it('should resolve to true when authenticate returns true', function() {
      const ctx = {
        method: 'password',
      };
      const authenticator = Authenticators.authenticateByPassword(() => true);
      authenticator(ctx).should.eventually.equal(true);
    });
    it('should resolve to true when authenticate returns a promise that resolves to true', function() {
      const ctx = {
        method: 'password',
      };
      const authenticator = Authenticators.authenticateByPassword(() => Promise.resolve(true));
      authenticator(ctx).should.eventually.equal(true);
    });
    it('should resolve to false when authenticate returns false', function() {
      const ctx = {
        method: 'password',
      };
      const authenticator = Authenticators.authenticateByPassword(() => false);
      authenticator(ctx).should.eventually.equal(false);
    });
    it('should resolve to false when authenticate returns a promise that resolves to false', function() {
      const ctx = {
        method: 'password',
      };
      const authenticator = Authenticators.authenticateByPassword(() => Promise.resolve(false));
      authenticator(ctx).should.eventually.equal(false);
    });
    it('should pass context username and password to \'authenticate\'', function() {
      const ctx = {
        method: 'password',
        username: 'alice',
        password: 'secret',
      };
      const authenticate = sinon.spy((username, password) => true);
      const authenticator = Authenticators.authenticateByPassword(authenticate);
      authenticator(ctx).should.eventually.be.equal(true);
      authenticate.should.have.been.calledWith(ctx.username, ctx.password);
    });
  });
});
