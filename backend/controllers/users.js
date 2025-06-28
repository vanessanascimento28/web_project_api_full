import { createHash } from "../utils/hash.js";

const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const { validateHash } = require('../utils/hash.js');
const { NODE_ENV, JWT_SECRET } = process.env;
const JWT_DEV_SECRET = 'secret-dev-key';
// Códigos de erro para reutilizar
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
const UNAUTHORIZED = 401;

// GET /users — retorna todos os usuários
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Erro ao buscar usuários' });
    });
};

// GET /users/:userId — retorna usuário por ID
const getUserById = (req, res) => {
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
        return res.status(BAD_REQUEST).send({ message: 'ID de usuário inválido' });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Erro ao buscar usuário' });
    });
};

// POST /users — cria um novo usuário
const createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body;

  User.create({ email, password: createHash(password), name, about, avatar })
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Dados inválidos ao criar usuário' });
      }
      if (err.code === 11000) {
        return res.status(BAD_REQUEST).send({ message: 'E-mail já está em uso' });
      }
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Erro ao criar usuário' });
    });
};

// PATCH /users/me — atualiza nome e descrição do perfil
const updateUser = (req, res) => {
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
        return res.status(BAD_REQUEST).send({ message: 'Dados inválidos ao atualizar perfil' });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Erro ao atualizar perfil' });
    });
};

// PATCH /users/me/avatar — atualiza o avatar do perfil
const updateAvatar = (req, res) => {
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
        return res.status(BAD_REQUEST).send({ message: 'URL inválida ao atualizar avatar' });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Erro ao atualizar avatar' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user || !validateHash(password, user.password)) {
        return res.status(UNAUTHORIZED).send({ message: 'E-mail ou senha incorretos' });
      }

      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET,
        { expiresIn: '7d' }
      );

      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: 'Erro interno ao fazer login' });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'ID de usuário inválido' });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: err.message });
      }
      console.error(err);
      res.status(500).send({ message: 'Erro ao buscar usuário atual' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
};
