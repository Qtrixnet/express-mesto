const express = require('express');

const app = express();
const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers, getUserById, createUser, updateUser, updateAvatar, login, getUserInfo,
} = require('../controllers/users');
const {
  validateCreatUser,
  validateLogin,
  validateGetUsers,
  validateGetUserInfo,
  validateGetUserById,
  validateUpdateUser,
  validateUpdateAvatar,
} = require('../middlewares/validations');

router.post('/signup', validateCreatUser, createUser);
router.post('/signin', validateLogin, login);

app.use(auth);

router.get('/', validateGetUsers, getUsers);
router.get('/me', validateGetUserInfo, getUserInfo);
router.get('/:userId', validateGetUserById, getUserById);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
