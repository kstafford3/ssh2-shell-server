const AuthenticateAny = require('../../lib').Authenticators.AuthenticateAny;

describe('Authenticators', function() {
  describe('.AuthenticateAny', function() {
    describe('#methodName', function() {
      it('should have the methodName \'none\'.', function() {
        const authenticator = new AuthenticateAny();
        authenticator.methodName.should.equal('none');
      });
    });

    describe('#authenticate()', function() {
      it('should always return a promise that resolves to true.', function() {
        const authenticator = new AuthenticateAny();
        authenticator.authenticate({}).should.eventually.equal(true);
      });
    });
  });
});
