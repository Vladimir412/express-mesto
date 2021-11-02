const router = require('express').Router();
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

const routerRegister = router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string(),
    about: Joi.string(),
    avatar: Joi.string(),
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

const routerGetUsers = router.get('/users', getUsers);

const routerGetInfoAboutUser = router.get('/users/me', auth, celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getInfoAboutUser);

const routerGetUserById = router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
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
    avatar: Joi.string().required().min(2),
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
