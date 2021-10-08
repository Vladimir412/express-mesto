const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({
      data: user,
    }))
    .catch(() => res.status(500).send({
      message: 'Произошла ошибка',
    }));
};

const getUserById = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.send({
          data: user,
        });
      }
      return res.status(404).send({
        message: 'Пользователь по указанному _id не найден.',
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные _id.',
        });
      }
      return res.status(500).send({
        message: 'Произошла ошибка',
      });
    });
};

const creatUser = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.send({
      data: user,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      }
      return res.status(500).send({
        message: 'Произошла ошибка',
      });
    });
};

const upadteInfoProfile = (req, res) => {
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
    // upsert: true
  })
    .then((user) => {
      if (user) {
        return res.send({
          data: user,
        });
      }
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные _id.',
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      }
      return res.status(500).send({
        message: 'Произошла ошибка',
      });
    });
};

const updateAvatarUser = (req, res) => {
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
      if (user) {
        return res.send({
          data: user,
        });
      }
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные _id.',
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      }
      return res.status(500).send({
        message: 'Произошла ошибка',
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  creatUser,
  upadteInfoProfile,
  updateAvatarUser,
};
