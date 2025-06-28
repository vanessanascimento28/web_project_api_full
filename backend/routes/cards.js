const express = require('express');
const router = express.Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// GET /cards — todos os cartões
router.get('/', getCards);

// POST /cards — criar cartão
router.post('/', createCard);

// DELETE /cards/:cardId — deletar cartão
router.delete('/:cardId', deleteCard);

// PUT /cards/:cardId/likes — curtir cartão
router.put('/:cardId/likes', likeCard);

// DELETE /cards/:cardId/likes — remover curtida
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
