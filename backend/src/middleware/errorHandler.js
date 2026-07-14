/**
 * Global error handler middleware.
 * Catches all errors thrown by async controllers.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.stack || err.message);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ message: messages[0] });
  }

  // Sequelize unique constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'Data sudah ada. Gunakan nilai yang berbeda.' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Terjadi kesalahan pada server. Coba beberapa saat lagi.',
  });
};

module.exports = errorHandler;
