const winston = require('winston');
const expressWinston = require('express-winston');
const path = require('path');

// Logger de requisições
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/request.log'),
      format: winston.format.json(),
    }),
  ],
});

// Logger de erros
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      format: winston.format.json(),
    }),
  ],
});

module.exports = {
  requestLogger,
  errorLogger,
};
