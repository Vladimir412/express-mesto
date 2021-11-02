const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  cardsGet,
  cardPost,
  cardDelete,
  addCardLike,
  deleteCardLike,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

const routerCardsGet = router.get('/cards', cardsGet);

const routerCardPost = router.post('/cards', auth, celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), cardPost);

const routerCardDelete = router.delete('/cards/:cardId', auth, celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), cardDelete);

const routerAddCardLike = router.put('/cards/:cardId/likes', auth, celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), addCardLike);

const routerDeleteCardLike = router.delete('/cards/:cardId/likes', auth, celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), deleteCardLike);

module.exports = {
  routerCardsGet,
  routerCardPost,
  routerCardDelete,
  routerAddCardLike,
  routerDeleteCardLike,
};
