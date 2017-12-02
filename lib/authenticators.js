const crypto = require('crypto');

const Authenticators = {
  authenticateByPassword(authenticate) {
    return (ctx) => {
      return new Promise((resolve) => {
        if (ctx.method !== 'password') {
          resolve(false);
        } else {
          resolve(authenticate(ctx.username, ctx.password));
        }
      });
    };
  },
  authenticateByPublicKey(validate, verify) {
    return (ctx) => {
      return new Promise((resolve) => {
        if (ctx.method !== 'publickey') {
          resolve(false);
        } else {
          if (ctx.signature) {
            var verifier = crypto.createVerify(ctx.sigAlgo);
            verifier.update(ctx.blob);
            resolve(verify(verifier, ctx.signature));
          } else {
            resolve(validate(ctx.key.algo, ctx.key.data));
          }
        }
      });
    };
  },
  authenticateAny() {
    return (ctx) => {
      return Promise.resolve(true);
    };
  },
};

module.exports = Authenticators;
