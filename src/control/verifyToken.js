const jwt = require('jsonwebtoken');
const conf = require('dotenv').config().parsed;
const express = require('express')
const app = express()

// função que verifica se o token é valido, se foi inserido e se é compativel com o id do usuario
function verifyToken(req, res, next) {
  if (!req.headers.hasOwnProperty('authorization') || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    return res.status(401).json({ error: true, message: 'Token não fornecido' });
  }

  const token = req.headers.authorization.split(' ')[1];
  
  // Checa se o campo de token está vazio
  if (!token) {
    return res.status(401).json({ error: true, message: 'Token não fornecido' });
  }

  // Verifica se o token é o mesmo do id do usuario
  jwt.verify(token, conf.JWT_PASSWORD, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: true, message: 'Token inválido' });
    }
  
    
    req.userEmail = decoded.email;
    req.userId = decoded.id
    
    next();
  });
}

module.exports = {
  verifyToken
};