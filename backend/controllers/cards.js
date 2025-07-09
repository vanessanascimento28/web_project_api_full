const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, FORBIDDEN } = require('../errors');

// GET /cards — buscar todos os cartões
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// GET /cards/:cardId — buscar um cartão por ID
const getCardById = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => {
      const error = new Error('Cartão não encontrado');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = BAD_REQUEST;
        err.message = 'ID de cartão inválido';
      }
      next(err);
    });
};

// POST /cards — criar novo cartão
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = BAD_REQUEST;
        err.message = 'Dados inválidos ao criar cartão';
      }
      next(err);
    });
};

// DELETE /cards/:cardId — deletar cartão (somente se for dono)
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .orFail(() => {
      const error = new Error('Cartão não encontrado');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((card) => {
      if (!card.owner.equals(userId)) {
        const err = new Error('Você não tem permissão para deletar este cartão');
        err.statusCode = FORBIDDEN;
        throw err;
      }
      return card.deleteOne().then(() => res.send({ message: 'Cartão deletado com sucesso' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = BAD_REQUEST;
        err.message = 'ID de cartão inválido';
      }
      next(err);
    });
};

// PUT /cards/:cardId/likes — curtir cartão
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error('Cartão não encontrado');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = BAD_REQUEST;
        err.message = 'ID de cartão inválido';
      }
      next(err);
    });
};

// DELETE /cards/:cardId/likes — descurtir cartão
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error('Cartão não encontrado');
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = BAD_REQUEST;
        err.message = 'ID de cartão inválido';
      }
      next(err);
    });
};

module.exports = {
  getCards,
  getCardById,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
