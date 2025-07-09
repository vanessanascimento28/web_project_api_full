const express = require('express');
const router = express.Router();
const {
  validateCreateCard,
  validateIdParam,
} = require('../middleware/validators.js');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateIdParam, deleteCard);
router.put('/:cardId/likes', validateIdParam, likeCard);
router.delete('/:cardId/likes', validateIdParam, dislikeCard);

module.exports = router;
