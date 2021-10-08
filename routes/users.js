const router = require('express').Router();
const {
  getUsers,
  getUserById,
  creatUser,
  upadteInfoProfile,
  updateAvatarUser,
} = require('../controllers/users');

const routerGetUsers = router.get('/users', getUsers);

const routerGetUserById = router.get('/users/:userId', getUserById);

const routerPost = router.post('/users', creatUser);

const routerUpadateInfoUser = router.patch('/users/me', upadteInfoProfile);

const routerUpdateAvatarUser = router.patch('/users/me/avatar', updateAvatarUser);

module.exports = {
  routerGetUsers,
  routerGetUserById,
  routerPost,
  routerUpadateInfoUser,
  routerUpdateAvatarUser,
};
