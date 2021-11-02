const Card = require('../models/card');

const cardsGet = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({
      cards,
    }))
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
        const errNotCorrectData = new Error('Переданы некорректные данные при создании карточки.');
        errNotCorrectData.statusCode = 400;
        next(errNotCorrectData);
      }
    });
};

const cardDelete = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        const errNotFound = new Error('Карточка с указанным _id не найдена.');
        errNotFound.statusCode = 404;
        next(errNotFound);
      }

      if (req.user._id !== card.owner.toString()) {
        const errCantDelete = new Error('Вы не можете удалять карточки других пользователей!');
        errCantDelete.statusCode = 403;
        next(errCantDelete);
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({
          message: 'Карточка удалена.',
        }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const errNotCorrectData = new Error('Переданы некорректные данные _id.');
        errNotCorrectData.statusCode = 400;
        next(errNotCorrectData);
      }
      next();
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
        const errCardUndefind = new Error('Передан несуществующий _id карточки.');
        errCardUndefind.statusCode = 404;
        next(errCardUndefind);
      }
      return res.send({
        data: card,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const errNotCorrectData = new Error('Переданы некорректные данные _id.');
        errNotCorrectData.statusCode = 400;
        next(errNotCorrectData);
      }
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
    const errCardUndefind = new Error('Передан несуществующий _id карточки.');
    errCardUndefind.statusCode = 404;
    return next(errCardUndefind);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      const errNotCorrectData = new Error('Переданы некорректные данные _id.');
      errNotCorrectData.statusCode = 400;
      next(errNotCorrectData);
    }
  });

module.exports = {
  cardsGet,
  cardPost,
  cardDelete,
  addCardLike,
  deleteCardLike,
};
