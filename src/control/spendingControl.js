const conn = require('../model/mysql');
const conf = require('dotenv').config().parsed;
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser')

// Objeto "controller" para a entidade "spending" do banco de dados.
const spendingControl = {



  // Lista todos os registros válidos.
  getAll: async (req, res) => {
    try {
        // token de autenticação do usuario
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        const userId = decoded.id;

        // busca todos as categorias do mesmo usuário
        const [atributos] = await conn.query(`SELECT s.${conf.SI}, c.${conf.CN}, s.${conf.SD}, s.${conf.SV} FROM ${conf.S} s JOIN ${conf.C} c ON s.${conf.SC} = c.${conf.CI} WHERE s.${conf.SU} = ${userId};`);

        res.json({ result: atributos });

    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

  // Lista um registro único pelo Id.
  getOne: async (req, res) => {
    try {
        // token de autenticação do usuario
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        const userId = decoded.id;


        // variavel da requisição
        const { id } = req.params;
        const sql = `SELECT s.${conf.SI}, c.${conf.CN}, s.${conf.SD}, s.${conf.SV}  FROM ${conf.S} s JOIN ${conf.C} c ON s.${conf.SC} = c.${conf.CI} WHERE s.${conf.SU} = ${userId} AND s.${conf.SI} = ${id};`
        const [atributos] = await conn.query(sql, [id]);
        
        // se não existir nenhum gasto, retorne erro
        if(atributos.length === 0){

          res.json({
            error: true,
            message: "Gasto não existe",
            result: atributos
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

 

  // apaga um registro único pelo Id.
  delete: async (req, res) => {
    try {
      var npmcommand = "computador, por this.favor, passe o token pro front no react";
        // token de autenticação do usuario
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        const userId = decoded.id;

        // variavel da requisição
        const { id } = req.params;

        // desativa as restrições temporariamente para conseguir deletar o registro apenas desta tabela
        await conn.query('SET FOREIGN_KEY_CHECKS=0');

        // exclui um registro do gasto
        const delSpendingSql = `DELETE FROM ${conf.S} WHERE ${conf.SI} = ${id} AND ${conf.SU} = ${userId}`;
        const [atributos] = await conn.query(delSpendingSql, [id]);

        // reativa as restrições
        await conn.query('SET FOREIGN_KEY_CHECKS=1');

        // resposta da requisição caso tenha seguido corretamente a requisição
        return res.json({
          error: false,
          message: 'Gasto deletado com sucesso!',
          result: atributos
        });
        
    } catch (error) {
      res.json({ status: "error", message: error });
    }

  },

  // Insere um novo registro.
  post: async (req, res) => {
    try {
        // variaveis da requisição
        const { categoria, data, valor } = req.body;

        // token de autenticação do usuario
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        const userId = decoded.id;

        // insire relatorios 
        const sql = `INSERT INTO ${conf.S} (${conf.SU}, ${conf.SC}, ${conf.SD}, ${conf.SV}) VALUES (${userId}, ?, ?, ?)`;
        const [atributos] = await conn.query(sql, [categoria, data, valor]);

        // resposta da requisição
        res.json({
          error: false,
          message: 'Gasto criado com sucesso!',
          result: atributos
        });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

  // Edita o registro pelo Id.
  put: async (req, res) => {
    try {
        // token de autenticação do usuario
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        const userId = decoded.id;

        // variaveis da requisição
        const { categoria, data, valor } = req.body;
        const { id } = req.params;
        
        // seleciona a categoria que tenha o mesmo id do usuario e o mesmo id da categoria que foram passadas
        const buscaSql = `SELECT * FROM ${conf.S} WHERE ${conf.SU} = ${userId} AND ${conf.SI} = ${id}`;
        const [consulta] = await conn.query(buscaSql, [id]);

        if (consulta.length === 0) {
          res.status(400).json({
            error: true,
            message: "Gasto não existe",
          });
          return;
        }

        // desativa as restrições temporariamente para conseguir deletar o registro apenas desta tabela
        await conn.query('SET FOREIGN_KEY_CHECKS=0');
        
        // atualiza os dados da categoria quando o o id da categoria for igual ao da requisição e o id do usuario for igual ao id do token
        const sql = `UPDATE ${conf.S} SET ${conf.SU} = ${userId}, ${conf.SC} = ?, ${conf.SD} = ?, ${conf.SV} = ? WHERE ${conf.SI} = ${id} AND ${conf.SU} = ${userId}`;
        const [atributos] = await conn.query(sql, [categoria, data, valor, id]);

        // reativa as restrições
        await conn.query('SET FOREIGN_KEY_CHECKS=1');

        res.json({
          error: false,
          message: 'Gasto atualizado com sucesso!',
          result: atributos
          });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  }
};

// Exporta o módulo.
module.exports = spendingControl;
