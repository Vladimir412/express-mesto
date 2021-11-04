/* eslint-disable linebreak-style */

class ErrorCantDeleteCardOtherUser extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ErrorCantDeleteCardOtherUser;
