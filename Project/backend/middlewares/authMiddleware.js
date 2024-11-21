const jwt = require('jsonwebtoken');

// Allow secret key injection for testability
const createAuthMiddleware = (secretKey) => {
  return (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user;
      next();
    });
  };
};

// Default middleware with hardcoded secret key
const authMiddleware = createAuthMiddleware('your_secret_key');

module.exports = { authMiddleware, createAuthMiddleware };
