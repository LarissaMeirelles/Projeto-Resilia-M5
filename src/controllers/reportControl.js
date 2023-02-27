const conn = require('../model/mysql');

// Objeto "controller" para a entidade "things" do banco de dados.

const reportControl = {

    // Lista todos os registros válidos.
    getAll: async (req, res) => {
      try {
        const [rows] = await conn.query("SELECT * FROM report ORDER BY r_date DESC");
        res.json({ data: rows });
      } catch (error) {
        res.json({ status: "error", message: error });
      }
    },
  
    // Lista um registro único pelo Id.
    getOne: async (req, res) => {
      try {
        const { id } = req.params;
        const [rows] = await conn.query("SELECT * FROM report WHERE r_id = ?", [id]);
        res.json({
          error: false,
          data: rows[0] 
        });
      } catch (error) {
        res.json({ status: "error", message: error });
      }
    },
  
    // apaga um registro único pelo Id.
    delete: async (req, res) => {
      try {
        const { id } = req.params
        const sql = "DELETE FROM report WHERE r_id = ?"
        const [rows] = await conn.query(sql, [id]);
        res.json({
          error: false,
          message: 'Relatorio deletado com sucesso!',
          data: rows[0] 
        });
      } catch (error) {
        res.json({ status: "error", message: error });
      }
    },
  
    // Insere um novo registro.
    post: async (req, res) => {
      try {
        const { data, id_usuario, id_categoria, total_gastos } = req.body;
        const sql = "INSERT INTO report (r_date, r_user, r_category, r_total_spending) VALUES (?, ?, ?, ?)";
        const [rows] = await conn.query(sql, [data, id_usuario, id_categoria, total_gastos]);
        console.log()
        res.json({
          error: false,
          message: 'Relatorio criado com sucesso!',
          data: rows[0] 
        });
      } catch (error) {
        res.json({ status: "error", message: error });
      }
    },
  
    // Edita o registro pelo Id.
    put: async (req, res) => {
      try {
        const { user, name, photo, description, location, options } = req.body;
        const { id } = req.params;
        const sql = "UPDATE report SET r_date = ?, r_user = ?, r_category = ?, r_total_spending = ? WHERE r_id = ?"
        const [rows] = await conn.query(sql, [user, name, photo, description, location, options, id]);
        res.json({
          error: false,
          message: 'Relatorio atualizado com sucesso!',
          data: rows[0] 
        });
      } catch (error) {
        res.json({ status: "error", message: error });
      }
    }
  };
  
  // Exporta o módulo.
  module.exports = reportControl;