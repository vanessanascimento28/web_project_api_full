const { createHash, validateHash } = require('../utils/hash.js');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const JWT_DEV_SECRET = 'senha-super-secreta';

// Códigos de erro
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const UNAUTHORIZED = 401;

// GET /users — retorna todos os usuários
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// GET /users/:userId — retorna usuário por ID
const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      const error = new Error('Usuário não encontrado');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = BAD_REQUEST;
        err.message = 'ID de usuário inválido';
      }
      next(err);
    });
};

// POST /users — cria um novo usuário
const createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;

  User.create({ email, password: createHash(password), name, about, avatar })
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = BAD_REQUEST;
        err.message = 'Dados inválidos ao criar usuário';
      }
      if (err.code === 11000) {
        err.statusCode = BAD_REQUEST;
        err.message = 'E-mail já está em uso';
      }
      next(err);
    });
};

// PATCH /users/me — atualiza nome e descrição do perfil
const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error('Usuário não encontrado');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = BAD_REQUEST;
        err.message = 'Dados inválidos ao atualizar perfil';
      }
      next(err);
    });
};

// PATCH /users/me/avatar — atualiza o avatar do perfil
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error('Usuário não encontrado');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = BAD_REQUEST;
        err.message = 'URL inválida ao atualizar avatar';
      }
      next(err);
    });
};

// POST /signin — login
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user || !validateHash(password, user.password)) {
        const err = new Error('E-mail ou senha incorretos');
        err.statusCode = UNAUTHORIZED;
        throw err;
      }

      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET,
        { expiresIn: '7d' }
      );

      res.send({ token });
    })
    .catch(next);
};

// GET /users/me — buscar dados do usuário atual
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      const error = new Error('Usuário não encontrado');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = BAD_REQUEST;
        err.message = 'ID de usuário inválido';
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
