/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');

const regex = /https?:\/\/(w{3}\.)?(\d*\-)?([a-z\-]+)?[a-z]+\.ru(\/\w+)?(\/\w+)?(\/\w+)?(\/)?/gim;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (link) => regex.test(link),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [
      mongoose.Schema.Types.ObjectId,
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
