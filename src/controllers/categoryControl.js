const conf = require('dotenv').config().parsed;
const jwt = require('jsonwebtoken')
/**
 * control/categoryControl.js
 * Controller da tabela "category" do banco de dados.
 */

// Importa conector do banco de dados.
const conn = require('../model/mysql');

// Objeto "controller" para a entidade "category" do banco de dados.
const categoryControl = {

  // Lista todos os registros válidos.
  getAll: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.decode(token);
      const userId = decoded.id;

      const [rows] = await conn.query(`SELECT ${conf.CN}, ${conf.CD} FROM ${conf.C} INNER JOIN ${conf.U} ON ${conf.C}.${conf.CU} = ${conf.U}.${conf.CH} WHERE ${conf.U}.${conf.CH} = ${userId};`);
      res.json({ result: rows });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

  // Lista um registro único pelo Id.
  getOne: async (req, res) => {
    try {

      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.decode(token);
      const userId = decoded.id;

      const { id_cat } = req.params;

      const [rows] = await conn.query(`SELECT * FROM ${conf.C} WHERE ${conf.CI} = ${id_cat} AND ${conf.C}.${conf.CU} = ${userId};`);
      
      if(rows.length === 0){
        res.json({
          error: false,
          message: "Categoria não existe"
          });
      }else{
        res.json({ result: rows[0] });
      }

      
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

  // apaga um registro único pelo Id.
  delete: async (req, res) => {
    try {
      
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.decode(token);
      const userId = decoded.id;

      const sql = `DELETE FROM ${conf.C} WHERE ${conf.CI} = ${userId}`
      const [rows] = await conn.query(sql, [userId]);
      res.json({
        error: false,
        message: 'Categoria deletada com sucesso!',
        data: rows[0]
        });
    } catch (error) {
      res.json({ status: "error", message: error });
    }

  },

  // Insere um novo registro.
  post: async (req, res) => {
    try {
      const { nome, descricao } = req.body;

      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.decode(token);
      const userId = decoded.id;


      const sql = `INSERT INTO ${conf.C} (${conf.CN}, ${conf.CU}, ${conf.CD}) VALUES (?, ${userId}, ?)`;
      const [rows] = await conn.query(sql, [nome, descricao]);
      res.json({
        error: false,
        message: 'Categoria adicionada com sucesso!',
        data: rows[0]
        });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

  // Edita o registro pelo Id.
  put: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.decode(token);
      const userId = decoded.id;

      const { nome, descricao } = req.body;
      const { id_cat } = req.params;
      
      const buscaSql = `SELECT ${conf.CI} FROM ${conf.C} WHERE ${conf.CU} = ${userId} AND ${conf.CI} = ${id_cat}`
      const [consulta] = await conn.query(buscaSql,[id_cat])

      console.log(consulta[0])
      
      if(id_cat !== consulta[0].c_id){
        res.status(400).json({
          error: false,
          message: "Categoria não existe"
      })
      } else{
        const sql = `UPDATE ${conf.C} SET ${conf.CN} = ?, ${conf.CD} = ? WHERE ${conf.CI} = ${id_cat} AND ${conf.CU} = ${userId}`
        const [rows] = await conn.query(sql, [nome, descricao, id_cat]);
  
  
        res.json({
        error: false,
        message: 'Categoria alterada com sucesso!',
        data: rows[0]
        });
      }
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  }
};

// Exporta o módulo.
module.exports = categoryControl;

