/* eslint-disable prefer-const */
const router = require('express').Router();
const isUrl = require('validator/lib/isURL');
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  creatUser,
  upadteInfoProfile,
  updateAvatarUser,
  login,
  getInfoAboutUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

const validateLink = (link) => {
  let valid;
  valid = isUrl(link);
  if (valid) {
    return link;
  }
  throw new Error('Невалидный Url');
};

const routerRegister = router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string(),
    about: Joi.string(),
    avatar: Joi.string().custom(validateLink),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }),
    password: Joi.string().required().min(8),
  }),
}), creatUser);

const routerLoginUser = router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } }),
    password: Joi.string().required().min(8),
  }),
}), login);

const routerGetUsers = router.get('/users', auth, getUsers);

const routerGetInfoAboutUser = router.get('/users/me', auth, celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getInfoAboutUser);

const routerGetUserById = router.get('/users/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserById);

const routerUpadateInfoUser = router.patch('/users/me', auth, celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), upadteInfoProfile);

const routerUpdateAvatarUser = router.patch('/users/me/avatar', auth, celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    avatar: Joi.string().custom(validateLink).required().min(2),
  }),
}), updateAvatarUser);

module.exports = {
  routerGetUsers,
  routerGetUserById,
  routerRegister,
  routerUpadateInfoUser,
  routerUpdateAvatarUser,
  routerLoginUser,
  routerGetInfoAboutUser,
};
