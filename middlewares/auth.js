/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const {
    authorization,
  } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    const errAuth = new Error('Авторизируйтесь');
    errAuth.statusCode = 403;
    next(errAuth);
  }
  const token = authorization.replace('Bearer ', '');
  let payloud;
  try {
    payloud = jwt.verify(token, 'cool');
  } catch (err) {
    const errAuth = new Error('Необходима авторизация');
    errAuth.statusCode = 401;
    next(errAuth);
  }
  req.user = payloud;
  next();
};
