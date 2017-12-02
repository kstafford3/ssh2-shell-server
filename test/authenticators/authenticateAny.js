var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();

const Authenticators = require('../../lib/authenticators');

describe('Authenticators', function() {
  describe('#authenticateAny()', function() {
    it('should return a function that returns a promise', function() {
      const authenticator = Authenticators.authenticateAny();
      authenticator.should.be.a('function');
      const authenticated = authenticator();
      authenticated.should.be.a('Promise');
    });
    it('should resolve to true with no parameters', function() {
      const authenticator = Authenticators.authenticateAny();
      authenticator().should.eventually.equal(true);
    });
  });
});
