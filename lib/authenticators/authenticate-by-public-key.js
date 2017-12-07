const crypto = require('crypto');

class AuthenticateByPublicKey {
  constructor(validate, verify) {
    this.methodName = 'publickey';
    this._validate = validate;
    this._verify = verify;
  }

  authenticate(ctx) {
    if (ctx.signature) {
      const verifier = this._getVerifier(ctx);
      return Promise.resolve(this._verify(verifier, ctx.signature, ctx));
    } else {
      return Promise.resolve(this._validate(ctx.key.algo, ctx.key.data, ctx));
    }
  }

  _getVerifier(ctx) {
    var verifier = crypto.createVerify(ctx.sigAlgo);
    verifier.update(ctx.blob);
    return verifier;
  }
};

module.exports = AuthenticateByPublicKey;
