const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');
const auth = require('./middlewares/auth.js');
const { login, createUser } = require('./controllers/users.js'); // importar controladores
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com MongoDB
mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

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

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
