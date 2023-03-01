// Importa conector do banco de dados.
const conn = require('../model/mysql');
const conf = require('dotenv').config().parsed;
const jwt = require('jsonwebtoken');

const economyControl = {

  // Lista a economia de um usuário
  getOne: async (req, res) => {
    try {
        // token de autenticação do usuario
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        const userId = decoded.id;
        
        // variavel da requisição
        const { id } = req.params;

        const sql = `SELECT ${conf.ES}, ${conf.EC}, ${conf.ED} FROM ${conf.E} WHERE ${conf.EI} = ${id} AND ${conf.E}.${conf.EU} = ${userId};`
        const [atributos] = await conn.query(sql);

        // se não existir nenhuma economia, retorne erro
        if(atributos.length === 0){

          res.json({
            error: true,
            message: "Economia não existe"
          });

        return
        
        } else{

          // resposta da requisição caso tenha seguido corretamente a requisição 
          res.json({ result: atributos[0] });
        }
      
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

   // Insere um novo registro.
   post: async (req, res) => {
    try {
        // variaveis da requisição
        const { id_gasto, economia, descricao} = req.body;

        // token de autenticação do usuario
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        const userId = decoded.id;

        // insire categorias 
        const sql = `INSERT INTO ${conf.E} (${conf.EU}, ${conf.ES}, ${conf.EC}, ${conf.ED}) VALUES (${userId}, ?, ?, ?)`;
        const [atributos] = await conn.query(sql, [id_gasto, economia, descricao]);

        // resposta da requisição
        res.json({
          error: false,
          message: 'Economia adicionada com sucesso!'
        });
        
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  }
};

// Exporta o módulo.
module.exports = economyControl;