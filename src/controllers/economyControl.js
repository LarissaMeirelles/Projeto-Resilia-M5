// Importa conector do banco de dados.
const conn = require('../model/financial_control');

const economyControl = {


   // Lista a economia de um usuário
   getOne: async (req, res) => {
    try {
      const { e_user } = req.params;
      const [rows] = await conn.query("SELECT * FROM economy WHERE e_user = ? ORDER BY id DESC", [e_user]);
      res.json({ data: rows });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

   // Insere um novo registro.
   post: async (req, res) => {
    try {
      const { e_id, e_user, e_spending, e_value_saved, e_description } = req.body;
      const sql = "INSERT INTO economy (e_id, e_user, e_spending, e_value_saved, e_description) VALUES (?, ?, ?, ?, ?)";
      const [rows] = await conn.query(sql, [e_id, e_user, e_spending, e_value_saved, e_description]);
      res.json({ data: rows });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  }
    };

// Exporta o módulo.
module.exports = economyControl;