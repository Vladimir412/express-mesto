/* eslint-disable max-len */
/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorUserUndefined = require('../middlewares/errors/ErrorUserUndefined');
const ErrorNotCorrectDataForLogin = require('../middlewares/errors/ErrorNotCorrectDataForLogin');
const ErrorIsUser = require('../middlewares/errors/ErrorIsUser');
const ErrorNotCorrectData = require('../middlewares/errors/ErrorNotCorrectData');

const SOLT = 10;

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({
      data: user,
    }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ErrorUserUndefined('Пользователь по указанному _id не найден.');
      }
      return res.send({
        data: user,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorNotCorrectData('Переданы некорректные данные _id.'));
      }
      next(err);
    });
};

const creatUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorIsUser('Пользователь с таким Email уже зарегестрирован!');
      }

      return bcrypt.hash(password, SOLT);
    })
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        data: user,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorNotCorrectData('Переданы некорректные данные _id.'));
      }
      next(err);
    });
};

const upadteInfoProfile = (req, res, next) => {
  const {
    name,
    about,
  } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    name,
    about,
  }, {
    new: true,
    runValidators: true,
    // upsert: true,
  })
    .then((user) => {
      if (!user) {
        throw new ErrorUserUndefined('Пользователь по указанному _id не найден');
      }
      res.send({
        user,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorNotCorrectData('Переданы некорректные данные _id.'));
      }
      if (err.name === 'ValidationError') {
        next(new ErrorNotCorrectData('Переданы некорректные данные при обновлении профиля.'));
      }
      next(err);
    });
};

const updateAvatarUser = (req, res, next) => {
  const {
    avatar,
  } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    avatar,
  }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => {
      if (!user) {
        throw new ErrorUserUndefined('Пользователь по указанному _id не найден');
      }
      return res.send({
        data: user,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorNotCorrectData('Переданы некорректные данные _id.'));
      }
      if (err.name === 'ValidationError') {
        next(new ErrorNotCorrectData('Переданы некорректные данные при обновлении профиля.'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  let placeForIdUser;
  const {
    email,
    password,
  } = req.body;
  User.findOne({
    email,
  }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorNotCorrectDataForLogin('Неправильные почта или пароль');
      }
      placeForIdUser = user._id.toString();
      return bcrypt.compare(password, user.password);
    })
    .then((user) => {
      if (!user) {
        throw new ErrorNotCorrectDataForLogin('Неправильные почта или пароль');
      }
      const token = jwt.sign({
        _id: placeForIdUser,
      },
      'cool', {
        expiresIn: '7d',
      });
      return token;
    })
    .then((token) => {
      res.send({
        token,
      });
    })
    .catch(next);
};

const getInfoAboutUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new ErrorUserUndefined('Пользователь по указанному _id не найден');
      }
      return res.send({
        user,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorNotCorrectData('Переданы некорректные данные _id.'));
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  creatUser,
  upadteInfoProfile,
  updateAvatarUser,
  login,
  getInfoAboutUser,
};
