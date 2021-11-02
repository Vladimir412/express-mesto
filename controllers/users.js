/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
        const err = new Error('Пользователь по указанному _id не найден.');
        err.statusCode = 404;
        return next(err);
      }
      return res.send({
        data: user,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const errNotCorrectData = new Error('Переданы некорректные данные _id.');
        errNotCorrectData.statusCode = 400;
        return next(errNotCorrectData);
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
        const errIsUser = new Error('Пользователь с таким Email уже зарегестрирован!');
        errIsUser.statusCode = 409;
        next(errIsUser);
      }
    });
  bcrypt.hash(password, SOLT)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      data: user,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errNotCorrectData = new Error('Переданы некорректные данные _id.');
        errNotCorrectData.statusCode = 400;
        return next(errNotCorrectData);
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
        const errUndefind = new Error('Пользователь по указанному _id не найден');
        errUndefind.statusCode = 404;
        next(errUndefind);
      }
      res.send({
        user,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const errNotCorrectData = new Error('Переданы некорректные данные _id.');
        errNotCorrectData.statusCode = 400;
        next(errNotCorrectData);
      }
      if (err.name === 'ValidationError') {
        const errNotCorrectData = new Error('Переданы некорректные данные при обновлении профиля.');
        errNotCorrectData.statusCode = 400;
        next(errNotCorrectData);
      }
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
        const errUndefind = new Error('Пользователь по указанному _id не найден');
        errUndefind.statusCode = 404;
        next(errUndefind);
      }
      return res.send({
        data: user,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const errNotCorrectData = new Error('Переданы некорректные данные _id.');
        errNotCorrectData.statusCode = 400;
        next(errNotCorrectData);
      }
      if (err.name === 'ValidationError') {
        const errNotCorrectData = new Error('Переданы некорректные данные при обновлении профиля.');
        errNotCorrectData.statusCode = 400;
        next(errNotCorrectData);
      }
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
        const errincorrect = new Error('Неправильные почта или пароль');
        errincorrect.statusCode = 401;
        next(errincorrect);
      }
      placeForIdUser = user._id.toString();
      return bcrypt.compare(password, user.password);
    })
    .then((user) => {
      if (!user) {
        const errincorrect = new Error('Неправильные почта или пароль');
        errincorrect.statusCode = 401;
        next(errincorrect);
      }
      console.log(placeForIdUser);
      const token = jwt.sign(
        { _id: placeForIdUser },
        'cool', {
          expiresIn: '7d',
        },
      );
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
        const errUndefind = new Error('Пользователь по указанному _id не найден');
        errUndefind.statusCode = 404;
        next(errUndefind);
      }
      return res.send({
        user,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const errNotCorrectData = new Error('Переданы некорректные данные _id.');
        errNotCorrectData.statusCode = 400;
        next(errNotCorrectData);
      }
      // eslint-disable-next-line no-undef
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
