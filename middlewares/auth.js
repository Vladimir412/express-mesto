/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const ErrorCantDeleteCardOtherUser = require('./errors/ErrorCantDeleteCardOtherUser');
const ErrorNotCorrectDataForLogin = require('./errors/ErrorNotCorrectDataForLogin');

module.exports = (req, res, next) => {
  const {
    authorization,
  } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorCantDeleteCardOtherUser('Авторизируйтесь');
  }
  const token = authorization.replace('Bearer ', '');
  let payloud;
  try {
    payloud = jwt.verify(token, 'cool');
  } catch (err) {
    next(new ErrorNotCorrectDataForLogin('Необходима авторизация'));
    next(err);
  }
  req.user = payloud;
  next();
};
