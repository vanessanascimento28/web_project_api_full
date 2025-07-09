const jwt = require('jsonwebtoken');

const JWT_SECRET = 'senha-super-secreta';

module.exports = (req, res, next) => {
  // pega o header Authorization
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Autorização necessária' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // valida o token
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log(err)
    return res.status(401).send({ message: 'Token inválido' });
  }

  // adiciona o payload ao req.user
  req.user = payload;
  return next();
};
