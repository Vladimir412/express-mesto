const router = require('express').Router()
const {
  cardsGet,
  cardPost,
  cardDelete,
  addCardLike,
  deleteCardLike
} = require('../controllers/cards');

const routerCardsGet = router.get('/cards', cardsGet);

const routerCardPost = router.post('/cards', cardPost);

const routerCardDelete = router.delete('/cards/:cardId', cardDelete);

const routerAddCardLike = router.put('/cards/:cardId/likes', addCardLike);

const routerDeleteCardLike = router.delete('/cards/:cardId/likes', deleteCardLike);

module.exports = {
  routerCardsGet,
  routerCardPost,
  routerCardDelete,
  routerAddCardLike,
  routerDeleteCardLike
};