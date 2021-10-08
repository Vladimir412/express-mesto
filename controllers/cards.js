const Card = require('../models/card');

const cardsGet = (req, res) => {
  Card.find({})
    .then((cards) => res.send({
      data: cards,
    }))
    .catch(() => res.status(500).send({
      message: 'Произошла ошибка',
    }));
};

const cardPost = (req, res) => {
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
      data: card,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      return res.status(500).send({
        message: 'Произошла ошибка',
      });
    });
};

const cardDelete = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        return res.send({
          message: 'Карточка удалена.',
        });
      }
      return res.status(404).send({
        message: 'Карточка с указанным _id не найдена.',
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

const addCardLike = (req, res) => Card.findByIdAndUpdate(req.params.cardId, {
  $addToSet: {
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
    return res.status(404).send({
      message: 'Передан несуществующий _id карточки.',
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

const deleteCardLike = (req, res) => Card.findByIdAndUpdate(req.params.cardId, {
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
    return res.status(404).send({
      message: 'Передан несуществующий _id карточки.',
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

module.exports = {
  cardsGet,
  cardPost,
  cardDelete,
  addCardLike,
  deleteCardLike,
};
