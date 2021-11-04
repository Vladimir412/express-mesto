/* eslint-disable linebreak-style */

class ErrorIsUser extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ErrorIsUser;
