function errorHandler(err, req, res, next) {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Erro interno do servidor'
        : message,
    });
}

module.exports = errorHandler;