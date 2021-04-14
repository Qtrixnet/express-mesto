const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const AuthError = require('../errors/auth-error');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные 2');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({ data: user.toJSON() });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы неверные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const newUserName = req.body.name;
  const newUserAbout = req.body.about;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name: newUserName, about: newUserAbout }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return res.send('Данные профиля обновлены');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы неправильные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const newUserAvatar = req.body.avatar;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar: newUserAvatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return res.send('Аватар обновлен');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы неправильные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthError('Необходима авторизация');
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new BadRequestError('Неправильный формат id');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserInfo,
};
