class AuthenticateAny {
  constructor() {
    this.methodName = 'none';
  }

  authenticate(ctx) {
    return true;
  }
};

module.exports = AuthenticateAny;
