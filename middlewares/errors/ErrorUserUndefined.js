/* eslint-disable linebreak-style */
class ErrorUserUndefined extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = ErrorUserUndefined;
