// Importa conector do banco de dados.
const conn = require('../model/mysql');

const economyControl = {

   // Lista a economia de um usuário
   getOne: async (req, res) => {
    try {
      const { e_user } = req.params;
      const [rows] = await conn.query("SELECT * FROM economy WHERE e_user = ? ORDER BY e_id DESC", [e_user]);
      res.json({ data: rows });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

   // Insere um novo registro.
   post: async (req, res) => {
    const { id } = req.params;
    try {
      const {id_usuario, id_gasto, economia, descricao} = req.body;
      const sql = "INSERT INTO economy (e_user, e_spending, e_value_saved, e_description) VALUES (?, ?, ?, ?)";
      const [rows] = await conn.query(sql, [id_usuario, id_gasto, economia, descricao, id]);
      res.json({ data: rows });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  }
  };

// Exporta o módulo.
module.exports = economyControl;