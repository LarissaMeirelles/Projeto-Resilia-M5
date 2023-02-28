// Conexão com o MySQL.
const mysql = require('mysql2');

// Obtém configurações do aplicativo.
const conf = require('dotenv').config().parsed;

const conn = mysql.createPool({
  host: conf.HOSTNAME,
  user: conf.USERNAME,
  password: conf.PASSWORD,
  database: conf.DATABASE,
}).promise();

// Exporta o módulo.
module.exports = conn;
