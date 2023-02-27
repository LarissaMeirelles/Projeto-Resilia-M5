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
      const [rows] = await conn.query("SELECT * FROM category");
      res.json({ result: rows });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

  // Lista um registro único pelo Id.
  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await conn.query("SELECT * FROM category WHERE c_id = ?", [id]);
      res.json({ result: rows[0] });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

  // apaga um registro único pelo Id.
  delete: async (req, res) => {
    try {
      const { id } = req.params
      const sql = "DELETE FROM category WHERE c_id = ?"
      const [rows] = await conn.query(sql, [id]);
      res.json({
        error: false,
        message: 'Categoria deletada com sucesso!'
        });
    } catch (error) {
      res.json({ status: "error", message: error });
    }

  },

  // Insere um novo registro.
  post: async (req, res) => {
    try {
      const { nome, descricao } = req.body;
      const sql = "INSERT INTO category (c_name, c_description) VALUES (?, ?)";
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
      const { nome, descricao } = req.body;
      const { id } = req.params;
      const sql = "UPDATE category SET c_name = ?, c_description = ? WHERE c_id = ?"
      const [rows] = await conn.query(sql, [nome, descricao, id]);
      res.json({
        error: false,
        message: 'Categoria alterada com sucesso!',
        data: rows[0]
        });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  }
};

// Exporta o módulo.
module.exports = categoryControl;

