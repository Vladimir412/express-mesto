/* eslint-disable max-len */
const Card = require('../models/card');
const ErrorUserUndefined = require('../middlewares/errors/ErrorUserUndefined');
const ErrorNotCorrectData = require('../middlewares/errors/ErrorNotCorrectData');
const ErrorCantDeleteCardOtherUser = require('../middlewares/errors/ErrorCantDeleteCardOtherUser');

const cardsGet = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({
        cards,
      });
    })
    .catch(next);
};

const cardPost = (req, res, next) => {
  const {
    name,
    link,
  } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.send({
      card,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorNotCorrectData('Переданы некорректные данные при создании карточки.'));
      }
      next(err);
    });
};

const cardDelete = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new ErrorUserUndefined('Карточка с указанным _id не найдена.');
      }

      if (req.user._id !== card.owner.toString()) {
        throw new ErrorCantDeleteCardOtherUser('Вы не можете удалять карточки других пользователей!');
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({
          message: 'Карточка удалена.',
        }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorNotCorrectData('Переданы некорректные данные _id.'));
      }
      next(err);
    });
};

const addCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: {
      likes: req.user._id,
    },
  }, {
    new: true,
  })
    .then((card) => {
      if (!card) {
        throw new ErrorUserUndefined('Передан несуществующий _id карточки.');
      }
      return res.send({
        data: card,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorNotCorrectData('Переданы некорректные данные _id.'));
      }
      next(err);
    });
};

const deleteCardLike = (req, res, next) => Card.findByIdAndUpdate(req.params.cardId, {
  $pull: {
    likes: req.user._id,
  },
}, {
  new: true,
})
  .then((card) => {
    if (card) {
      return res.send({
        data: card,
      });
    }
    throw new ErrorUserUndefined('Передан несуществующий _id карточки.');
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new ErrorNotCorrectData('Переданы некорректные данные _id.'));
    }
    next(err);
  });

module.exports = {
  cardsGet,
  cardPost,
  cardDelete,
  addCardLike,
  deleteCardLike,
};
