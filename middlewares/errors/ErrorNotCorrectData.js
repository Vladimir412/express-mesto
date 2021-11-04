/* eslint-disable linebreak-style */

class ErrorNotCorrectData extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = ErrorNotCorrectData;
