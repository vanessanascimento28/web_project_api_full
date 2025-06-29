module.exports = (err, req, res, next) => {
  console.error(err.stack);

  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Ocorreu um erro no servidor'
      : message,
  });
};