const jwt = require('jsonwebtoken');
const conf = require('dotenv').config().parsed;

// função que verifica se o token é valido, se foi inserido e se é compativel com o id do usuario
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // Checa se o campo de token está vazio
  if (!token) {
    return res.status(401).json({ error: true, message: 'Token não fornecido' });
  }

  // Verifica se o token é o mesmo do id do usuario
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