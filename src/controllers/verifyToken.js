const jwt = require('jsonwebtoken');
const conf = require('dotenv').config().parsed;

// 
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: true, message: 'Token não fornecido' });
  }

  jwt.verify(token, conf.JWT_PASSWORD, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: true, message: 'Token inválido' });
    }
    
    req.userId = decoded.id;
    next();
  });
}

module.exports = {
  verifyToken
};