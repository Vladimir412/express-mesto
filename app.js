const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const {
  routerGetUsers,
  routerGetUserById,
  routerPost,
  routerUpadateInfoUser,
  routerUpdateAvatarUser,
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
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});
app.use(express.static(path.join(__dirname, 'express-mesto')));
app.use((req, res, next) => {
  req.user = {
    _id: '61562352ec6ea408f37d642e',
  };

  next();
});
app.use(routerGetUsers);
app.use(routerGetUserById);
app.use(routerPost);
app.use(routerUpadateInfoUser);
app.use(routerUpdateAvatarUser);

app.use(routerCardsGet);
app.use(routerCardPost);
app.use(routerCardDelete);
app.use(routerAddCardLike);
app.use(routerDeleteCardLike);

app.listen(PORT, () => {
});
