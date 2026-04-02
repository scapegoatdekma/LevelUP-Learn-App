const { NODE_ENV } = require("../config/env");

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Внутренняя ошибка сервера";

  if (err.code && String(err.code).startsWith("SQLITE_CONSTRAINT")) {
    statusCode = 409;
    message = "Нарушено ограничение базы данных";
  }

  const response = {
    success: false,
    message,
  };

  if (err.details) {
    response.error = err.details;
  }

  if (NODE_ENV !== "production" && statusCode >= 500) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;

