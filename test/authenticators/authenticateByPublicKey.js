const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
chai.should();

const loadPublicKey = require('../load-key');
const Authenticators = require('../../lib/authenticators');

const publicKey = loadPublicKey();

describe('Authenticators', function() {
  describe('#authenticateByPublicKey()', function() {
    it('should resolve to false when ctx.method is not \'publickey\'', function() {
      const ctx = {
        method: 'not-publickey',
        key: {},
      };
      const authenticator = Authenticators.authenticateByPublicKey({ validate: () => true, verify: () => true });
      authenticator(ctx).should.eventually.equal(false);
    });
    it('should resolve to true when validating (not verifying signature) when validate returns true', function() {
      const ctx = {
        method: 'publickey',
        key: {},
      };
      const validate = sinon.spy(() => true);
      const verify = sinon.spy(() => true);
      const authenticator = Authenticators.authenticateByPublicKey({ validate, verify });
      authenticator(ctx).should.eventually.equal(true);
      validate.should.be.calledOnce;
      verify.should.not.be.called;
    });
    it('should reject verifying without ctx.sigAlgo.', function() {
      const ctx = {
        method: 'publickey',
        signature: 'any',
        key: {},
      };
      const authenticator = Authenticators.authenticateByPublicKey({ validate: () => true, verify: () => true });
      authenticator(ctx).should.be.rejected;
    });
    it('should pass the public key\'s algorithm and data to validate', function() {
      const ctx = {
        method: 'publickey',
        username: 'alice',
        key: {
          algo: publicKey.fulltype,
          data: publicKey.public,
        },
      };
      const validate = sinon.spy((algorithm, data) => true);
      const verify = sinon.spy(() => true);
      const authenticator = Authenticators.authenticateByPublicKey({ validate, verify });
      authenticator(ctx).should.eventually.equal(true);
      validate.should.be.calledWith(ctx.username, ctx.key.algo, ctx.key.data);
      verify.should.not.be.called;
    });
  });
});
