const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(require('sinon-chai'));
chai.should();

const assert = chai.assert;

const ShellServer = require('../../lib/shell-server');

describe('ShellServer', function() {
  describe('#_authenticate()', function() {
    it('should reject if no authenticator is specified', function(done) {
      const ctx = {
        accept: sinon.spy(),
        reject: sinon.spy(),
      };
      const server = new ShellServer({}, null);
      server._authenticate(ctx)
        .then(() => {
          assert.fail('authenticate resolved instead of rejecting.');
          done();
        })
        .catch(() => {
          ctx.accept.should.not.be.called;
          ctx.reject.should.be.calledOnce;
          done();
        });
    });
    it('should call ctx.accept and resolve if authenticator returns true', function(done) {
      const ctx = {
        accept: sinon.spy(),
        reject: sinon.spy(),
      };
      const server = new ShellServer({}, () => true);
      const authenticated = server._authenticate(ctx)
        .then(() => {
          ctx.accept.should.be.calledOnce;
          ctx.reject.should.not.be.called;
        });
      authenticated.should.be.fulfilled.and.notify(done);
    });
    it('should call ctx.accept and resolve if authenticator returns a promise resolving to true', function(done) {
      const ctx = {
        accept: sinon.spy(),
        reject: sinon.spy(),
      };
      const server = new ShellServer({}, () => Promise.resolve(true));
      const authenticated = server._authenticate(ctx)
        .then(() => {
          ctx.accept.should.be.calledOnce;
          ctx.reject.should.not.be.called;
        });
      authenticated.should.be.fulfilled.and.notify(done);
    });
    it('should call ctx.reject and resolve if authenticator returns false', function(done) {
      const ctx = {
        accept: sinon.spy(),
        reject: sinon.spy(),
      };
      const server = new ShellServer({}, () => false);
      const authenticated = server._authenticate(ctx)
        .then(() => {
          ctx.accept.should.not.be.called;
          ctx.reject.should.be.calledOnce;
        });
      authenticated.should.be.fulfilled.and.notify(done);
    });
    it('should call ctx.reject and resolve if authenticator returns a promise resolving to false', function(done) {
      const ctx = {
        accept: sinon.spy(),
        reject: sinon.spy(),
      };
      const server = new ShellServer({}, () => Promise.resolve(false));
      const authenticated = server._authenticate(ctx)
        .then(() => {
          ctx.accept.should.not.be.called;
          ctx.reject.should.be.calledOnce;
        });
      authenticated.should.be.fulfilled.and.notify(done);
    });
  });
});
