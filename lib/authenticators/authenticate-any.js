class AuthenticateAny {
  constructor() {
    this.methodName = 'none';
  }

  authenticate(ctx) {
    return Promise.resolve(true);
  }
};

module.exports = AuthenticateAny;
