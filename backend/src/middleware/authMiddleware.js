const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token from Authorization header.
 * Injects decoded user payload into req.user.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak. Silakan login terlebih dahulu.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token tidak valid atau sudah kedaluwarsa. Silakan login ulang.' });
  }
};

module.exports = authMiddleware;
