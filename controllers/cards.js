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

// Согласно Вашим комментариям при удаление карточки должна быть 400 0шибка
// хотя в следующем комментарии Вы пишите: "Должна быть проверка на существование,
// обработка ошибки 404.
// Данные могут не найтись if(!data) Это должно проверяться везде, где есть поиск по id".
// И в ТЗ к проектной прописанно что на удаление карточки идет проверка только на 404 ошибку.
// Если я не прав прошу объяснить поподробней. А то получаются двойные стандарты
const cardDelete = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({
      data: card,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({
          message: 'Карточка с указанным _id не найдена.',
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
  .then((card) => res.send({
    data: card,
  }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(404).send({
        message: 'Передан несуществующий _id карточки.',
      });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные для постановки лайка.',
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
  .then((card) => res.send({
    data: card,
  }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(404).send({
        message: 'Передан несуществующий _id карточки.',
      });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные для снятии лайка.',
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
