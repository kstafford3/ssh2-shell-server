const sinon = require('sinon');
const expect = require('chai').expect;

const AuthenticateByPublicKey = require('../../lib').Authenticators.AuthenticateByPublicKey;

function generatePassThroughVerifier(verifier) {
  return function(ctx) {
    return verifier;
  };
}

describe('Authenticators', function() {
  describe('.AuthenticateByPublicKey', function() {
    describe('#methodName', function() {
      it('should have the methodName \'publickey\'.', function() {
        const authenticator = new AuthenticateByPublicKey();
        authenticator.methodName.should.equal('publickey');
      });
    });

    describe('#authenticate(validate, ?)', function() {
      it('should resolve to true when ctx.signature is undefined and validate returns true', function() {
        const authenticator = new AuthenticateByPublicKey(() => true, () => false);
        const ctx = { key: {} };
        authenticator.authenticate(ctx).should.eventually.equal(true);
      });

      it('should resolve to true when ctx.signature is undefined and validate returns a promise resolving to true', function() {
        const authenticator = new AuthenticateByPublicKey(() => Promise.resolve(true), () => false);
        const ctx = { key: {} };
        authenticator.authenticate(ctx).should.eventually.equal(true);
      });

      it('should resolve to false when ctx.signature is undefined and validate returns false', function() {
        const authenticator = new AuthenticateByPublicKey(() => false, () => true);
        const ctx = { key: {} };
        authenticator.authenticate(ctx).should.eventually.equal(false);
      });

      it('should resolve to false when ctx.signature is undefined and validate returns a promise resolving to false', function() {
        const authenticator = new AuthenticateByPublicKey(() => Promise.resolve(false), () => true);
        const ctx = { key: {} };
        authenticator.authenticate(ctx).should.eventually.equal(false);
      });

      it('should pass ctx.username, ctx.password, and ctx to the authentication method', function() {
        const validate = sinon.spy(() => true);
        const verify = sinon.spy(() => true);
        const authenticator = new AuthenticateByPublicKey(validate, verify);
        const ctx = {
          key: {
            algo: 'plaintext',
            data: 'secrets secrets secrets',
          },
        };
        authenticator.authenticate(ctx);
        validate.should.be.calledWith(ctx.key.algo, ctx.key.data, ctx);
        verify.should.not.be.called;
      });
    });

    describe('#authenticate(?, verify)', function() {
      it('should resolve to true when ctx.signature is defined and validate returns true', function() {
        const authenticator = new AuthenticateByPublicKey(() => false, () => true);
        authenticator._getVerifier = generatePassThroughVerifier({});
        const ctx = {
          signature: 'some-signature',
        };
        authenticator.authenticate(ctx).should.eventually.equal(true);
      });

      it('should resolve to true when ctx.signature is defined and validate returns a promise resolving to true', function() {
        const authenticator = new AuthenticateByPublicKey(() => false, () => Promise.resolve(true));
        authenticator._getVerifier = generatePassThroughVerifier({});
        const ctx = {
          signature: 'some-signature',
        };
        authenticator.authenticate(ctx).should.eventually.equal(true);
      });

      it('should resolve to false when ctx.signature is defined and validate returns false', function() {
        const authenticator = new AuthenticateByPublicKey(() => true, () => false);
        authenticator._getVerifier = generatePassThroughVerifier({});
        const ctx = {
          signature: 'some-signature',
        };
        authenticator.authenticate(ctx).should.eventually.equal(false);
      });

      it('should resolve to false when ctx.signature is defined and validate returns a promise resolving to false', function() {
        const authenticator = new AuthenticateByPublicKey(() => true, () => Promise.resolve(false));
        authenticator._getVerifier = generatePassThroughVerifier({});
        const ctx = {
          signature: 'some-signature',
        };
        authenticator.authenticate(ctx).should.eventually.equal(false);
      });

      it('should pass ctx.username, ctx.password, and ctx to the authentication method', function() {
        const validate = sinon.spy(() => true);
        const verify = sinon.spy(() => true);
        const authenticator = new AuthenticateByPublicKey(validate, verify);
        const verifier = { field: 'identifying field' };
        authenticator._getVerifier = generatePassThroughVerifier(verifier);
        const ctx = {
          signature: 'some-signature',
        };
        authenticator.authenticate(ctx);
        verify.should.be.calledWith(verifier, ctx.signature, ctx);
        validate.should.not.be.called;
      });

      it('should throw a TypeError if signature is defined and sigAlgo is not defined', function() {
        const validate = sinon.spy(() => true);
        const verify = sinon.spy(() => true);
        const authenticator = new AuthenticateByPublicKey(validate, verify);
        const ctx = {
          signature: 'some-signature',
        };
        expect(() => authenticator.authenticate(ctx)).to.throw(TypeError);
      });

      it('should throw \'Unknown message digest\' if signature is defined and sigAlgo is unexpected', function() {
        const validate = sinon.spy(() => true);
        const verify = sinon.spy(() => true);
        const authenticator = new AuthenticateByPublicKey(validate, verify);
        const ctx = {
          signature: 'some-signature',
          sigAlgo: 'something-unexpected',
        };
        expect(() => authenticator.authenticate(ctx)).to.throw('Unknown message digest');
      });
    });
  });
});
