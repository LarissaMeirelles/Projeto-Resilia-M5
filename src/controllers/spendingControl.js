
// Importa conector do banco de dados.
const conn = require('../model/mysql');

// Objeto "controller" para a entidade "things" do banco de dados.
const spendingControl = {

  // Lista todos os registros válidos.
  getAll: async (req, res) => {
    try {
      const [rows] = await conn.query("SELECT *, DATE_FORMAT(s_date, '%d/%m/%Y às %H:%i') AS s_datebr FROM spending ORDER BY s_date DESC");
      res.json({ data: rows });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

  // Lista um registro único pelo Id.
  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await conn.query("SELECT *, DATE_FORMAT(s_date, '%d/%m/%Y às %H:%i') AS s_datebr FROM spending WHERE s_id = ?", [id]);
      res.json({ data: rows[0] });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

  // apaga um registro único pelo Id.
  delete: async (req, res) => {
    try {
      const { id } = req.params
      const sql = "DELETE FROM spending WHERE s_id = ?"
      const [rows] = await conn.query(sql, [id]);
      res.json({
        error: false,
        message: 'Gasto deletado com sucesso!'
        });
    } catch (error) {
      res.json({ status: "error", message: error });
    }

  },

  // Insere um novo registro.
  post: async (req, res) => {
    try {
      const { id_usuario, categoria, data, valor } = req.body;
      const sql = "INSERT INTO spending (s_user, s_category, s_date, s_value) VALUES (?, ?, ?, ?)";
      const [rows] = await conn.query(sql, [id_usuario, categoria, data, valor]);
      res.json({
        error: false,
        message: 'Gasto criado com sucesso!'
        });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

  // Edita o registro pelo Id.
  put: async (req, res) => {
    try {
      const { categoria, data, valor } = req.body;
      const { id } = req.params;
      const sql = "UPDATE spending SET s_category = ?, s_date = ?, s_value = ? WHERE s_id = ?"
      const [rows] = await conn.query(sql, [categoria, data, valor, id]);
      res.json({
        error: false,
        message: 'Gasto atualizado com sucesso!'
        });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  }
};

// Exporta o módulo.
module.exports = spendingControl;
