// Importa conector do banco de dados.
const conn = require('../model/mysql');
const conf = require('dotenv').config().parsed;

const economyControl = {

   // Lista a economia de um usuário
   getOne: async (req, res) => {
    try {
      const { id_usuario } = req.params;
      const [rows] = await conn.query(`SELECT * FROM ${conf.E} WHERE ${conf.EU} = ${id_usuario} ORDER ${conf.EI} DESC`, [e_user]);
      res.json({ data: rows[0] });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

   // Insere um novo registro.
   post: async (req, res) => {
    const { id } = req.params;
    try {
      const {id_usuario, id_gasto, economia, descricao} = req.body;
      const sql = `INSERT INTO ${conf.E} (${conf.EU}, ${conf.ES}, ${conf.EC}, ${conf.ED}) VALUES (?, ?, ?, ?)`;
      const [rows] = await conn.query(sql, [id_usuario, id_gasto, economia, descricao, id]);
      res.json({ data: rows });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  }
  };

// Exporta o módulo.
module.exports = economyControl;