// importa a biblioteca dotenv para usar as variaves de ambiente conf.
const conf = require('dotenv').config().parsed;

// importa a biblioteca jwt
const jwt = require('jsonwebtoken')

// Importa conector do banco de dados.
const conn = require('../model/mysql');

// Objeto "controller" para a entidade "category" do banco de dados.
const categoryControl = {

  // Lista todos os registros válidos.
  getAll: async (req, res) => {
    try {
        // token de autenticação do usuario
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        const userId = decoded.id;

        // busca todos as categorias do mesmo usuário
        const [atributos] = await conn.query(`SELECT ${conf.CN}, ${conf.CD} FROM ${conf.C} WHERE ${conf.CU} = ${userId};`);

        // resposta da requisição
        res.json({ result: atributos });
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },


  // Lista apenas uma categoria especifica
  getOne: async (req, res) => {
    try {
        // token de autenticação do usuario
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        const userId = decoded.id;

        // variavel da requisição
        const { id } = req.params;

        const [atributos] = await conn.query(`SELECT * FROM ${conf.C} WHERE ${conf.CI} = ${id} AND ${conf.C}.${conf.CU} = ${userId};`);
        
        // se não existir nenhuma categoria, retorne erro
        if(atributos.length === 0){

          res.json({
            error: true,
            message: "Categoria não existe"
          });

          return

        } else{
          // resposta da requisição caso tenha seguido corretamente a requisição 
          res.json({ result: atributos[0] });
        }

    // retorna mensagem de erro caso não tenha seguido corretamente a requisição
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },


  // Insere um novo registro.
  post: async (req, res) => {
    try {
        // variaveis da requisição
        const { nome, descricao } = req.body;

        // token de autenticação do usuario
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        const userId = decoded.id;

        // insire categorias 
        const sql = `INSERT INTO ${conf.C} (${conf.CN}, ${conf.CU}, ${conf.CD}) VALUES (?, ${userId}, ?)`;
        const [atributos] = await conn.query(sql, [nome, descricao]);

        // resposta da requisição
        res.json({
          error: false,
          message: 'Categoria adicionada com sucesso!'
        });

    // retorna mensagem de erro caso não tenha seguido corretamente a requisição
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
        const { nome, descricao } = req.body;
        const { id } = req.params;
        
        // seleciona a categoria que tenha o mesmo id do usuario e o mesmo id da categoria que foram passadas
        const buscaSql = `SELECT * FROM ${conf.C} WHERE ${conf.CU} = ${userId} AND ${conf.CI} = ${id}`;
        const [consulta] = await conn.query(buscaSql);
    
        if (consulta.length === 0) {
          res.status(400).json({
            error: true,
            message: "Categoria não existe"
          });
          return;
        }
        
        // atualiza os dados da categoria quando o o id da categoria for igual ao da requisição e o id do usuario for igual ao id do token
        const sql = `UPDATE ${conf.C} SET ${conf.CN} = ?, ${conf.CD} = ? WHERE ${conf.CI} = ${id} AND ${conf.CU} = ${userId}`;
        const [atributos] = await conn.query(sql, [nome, descricao]);
    
        // resposta da requisição
        res.json({
          error: false,
          message: 'Categoria alterada com sucesso!',
          data: atributos[0]
        });

    } catch (error) {
      res.json({ status: "error", message: error });
    }
  },

  
  // Deleta um registro.
  delete: async (req, res) => {
    try {
        // token de autenticação do usuario
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        const userId = decoded.id;
    
        // variavel da requisição
        const { id } = req.params;
    
        // desativa as restrições temporariamente para conseguir deletar o registro apenas desta tabela
        await conn.query('SET FOREIGN_KEY_CHECKS=0');
    
        // exclui a categoria
        const delCategorySql = `DELETE FROM ${conf.C} WHERE ${conf.CI} = ${id} AND ${conf.CU} = ${userId}`;
        const [atributos] = await conn.query(delCategorySql, [id]);
    
        // reativa as restrições
        await conn.query('SET FOREIGN_KEY_CHECKS=1');
    
        // resposta da requisição caso tenha seguido corretamente a requisição
        return res.json({
          error: false,
          message: 'Categoria deletada com sucesso!',
          data: atributos[0]
        });
    
    // retorna mensagem de erro caso não tenha seguido corretamente a requisição
    } catch (error) {
      res.json({ status: "error", message: error });
    }
  }
};

// Exporta o módulo.
module.exports = categoryControl;

