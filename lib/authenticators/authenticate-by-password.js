class AuthenticateByPassword {
  constructor(checkPassword) {
    this.methodName = 'password';
    this._checkPassword = checkPassword;
  }

  authenticate(ctx) {
    return Promise.resolve(this._checkPassword(ctx.username, ctx.password, ctx));
  }
};

module.exports = AuthenticateByPassword;
