const crypto = require('crypto');

class AuthenticateByPublicKey {
  constructor(validate, verify) {
    this.methodName = 'publickey';
    this._validate = validate;
    this._verify = verify;
  }

  authenticate(ctx) {
    if (ctx.signature) {
      var verifier = crypto.createVerify(ctx.sigAlgo);
      verifier.update(ctx.blob);
      return this._verify(verifier, ctx.signature, ctx);
    } else {
      return this._validate(ctx.key.algo, ctx.key.data, ctx);
    }
  }
};

module.exports = AuthenticateByPublicKey;
