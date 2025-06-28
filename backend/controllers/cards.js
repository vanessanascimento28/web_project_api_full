const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, FORBIDDEN } = require('../errors');

// GET /cards — buscar todos os cartões
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Erro ao buscar cartões' });
    });
};

// GET /cards/:cardId — buscar um cartão por ID
const getCardById = (req, res) => {
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
        return res.status(BAD_REQUEST).send({ message: 'ID de cartão inválido' });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Erro interno ao buscar cartão' });
    });
};

// POST /cards — criar novo cartão
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Dados inválidos ao criar cartão' });
      }
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Erro interno ao criar cartão' });
    });
};

// DELETE /cards/:cardId — deletar cartão (somente se for dono)
const deleteCard = (req, res) => {
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
        return res.status(FORBIDDEN).send({ message: 'Você não tem permissão para deletar este cartão' });
      }
      return card.deleteOne().then(() => res.send({ message: 'Cartão deletado com sucesso' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'ID de cartão inválido' });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Erro ao deletar cartão' });
    });
};

// PUT /cards/:cardId/likes — curtir cartão
const likeCard = (req, res) => {
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
        return res.status(BAD_REQUEST).send({ message: 'ID de cartão inválido' });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Erro ao curtir cartão' });
    });
};

// DELETE /cards/:cardId/likes — descurtir cartão
const dislikeCard = (req, res) => {
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
        return res.status(BAD_REQUEST).send({ message: 'ID de cartão inválido' });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Erro ao descurtir cartão' });
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
