const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Маршрут ${req.method} ${req.originalUrl} не найден`,
  });
};

module.exports = notFoundHandler;

