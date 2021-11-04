/* eslint-disable no-unused-vars */
/* eslint-disable import/order */
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const path = require('path');
const {
  routerGetUsers,
  routerGetUserById,
  routerRegister,
  routerUpadateInfoUser,
  routerUpdateAvatarUser,
  routerLoginUser,
  routerGetInfoAboutUser,
} = require('./routes/users');
const {
  routerCardsGet,
  routerCardPost,
  routerCardDelete,
  routerAddCardLike,
  routerDeleteCardLike,
} = require('./routes/cards');

const app = express();
const {
  PORT = 3000,
} = process.env;
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});
app.use(express.static(path.join(__dirname, 'express-mesto')));

app.use(routerRegister);
app.use(routerLoginUser);

app.use(auth);

app.use(routerGetUsers);
app.use(routerGetUserById);
app.use(routerUpadateInfoUser);
app.use(routerUpdateAvatarUser);
app.use(routerGetInfoAboutUser);

app.use(routerCardsGet);
app.use(routerCardPost);
app.use(routerCardDelete);
app.use(routerAddCardLike);
app.use(routerDeleteCardLike);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Ресурс не найден' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {});
