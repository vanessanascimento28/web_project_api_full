const cors = require("cors");
const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');
const auth = require('./middleware/auth.js');
const { login, createUser } = require('./controllers/users.js');
require('dotenv').config();
const errorHandler = require('./middleware/errorHandler.js');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middleware/logger.js');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
// Conexão com MongoDB
mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

app.use(requestLogger);

// Middleware para interpretar JSON
app.use(express.json());

// Rotas públicas (login e cadastro)
app.post('/signin', login);
app.post('/signup', createUser);

// Middleware de autorização — tudo abaixo é protegido
app.use(auth);

// Rotas protegidas
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Rota para qualquer outra coisa (404)
app.use((req, res) => {
  res.status(404).send({ message: 'A solicitação não foi encontrada' });
});

app.use(errorLogger);

// Middleware para erros de validação do Celebrate
app.use(errors());
app.use(errorHandler);

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
