const express = require('express');
const router = express.Router();
const { getCurrentUser, ...rest } = require('../controllers/users.js');
const { validateSignup, validateSignin } = require('../middleware/validators.js');

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// GET /users — todos os usuários
router.get('/', getUsers);

// GET /users/me — dados do usuário atual
router.get('/me', getCurrentUser);

// GET /users/:userId — usuário por ID
router.get('/:userId', getUserById);

// POST /users — criar novo usuário
router.post('/', createUser);

// PATCH /users/me — atualizar perfil (name e about)
router.patch('/me', updateUser);

// PATCH /users/me/avatar — atualizar avatar
router.patch('/me/avatar', updateAvatar);

module.exports = router;
