const conn = require('../model/mysql');
const conf = require('dotenv').config().parsed;
const jwt = require('jsonwebtoken');

// Objeto "controller" para a entidade "things" do banco de dados.

const reportControl = {

    // Lista todos os registros válidos.
    getAll: async (req, res) => {
      try {
          // token de autenticação do usuario
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.decode(token);
          const userId = decoded.id;
          
          
          /*
          SELECT
              R.r_date,
              C.c_name,
              S.s_value,
              total.value AS total_value
          FROM
              report AS R
          INNER JOIN
              category AS C ON R.r_category = C.c_id
          INNER JOIN 
              spending AS S ON S.s_category = C.c_id
          INNER JOIN
              (
                  SELECT
                      S.s_user,
                      SUM(S.s_value) AS value
                  FROM
                      spending AS S
                  WHERE
                      S.s_user = 1
              ) AS total ON total.s_user = S.s_user
          WHERE
              S.s_user = 1;

          */


          // ATUALIZAR
          const buscaSql = `SELECT ${conf.C}.${conf.CN}, ${conf.C}.${conf.CD}, ${conf.R}.${conf.RC} FROM ${conf.C} INNER JOIN ${conf.R} ON ${conf.R}.${conf.RC} = ${conf.C}.${conf.CI} WHERE ${conf.C}${conf.CH} = ${userId} AND `
          const catSql = await conn.query(buscaSql)

          // busca todos as categorias do mesmo usuário
          const sql = `SELECT ${conf.RD}, ${id}, ${conf.RT} FROM ${conf.R} WHERE ${conf.RU} = ${userId} ORDER BY ${conf.RD} DESC;`
          const [atributos] = await conn.query(sql);

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


          const buscaSql = `SELECT ${conf.CN}, ${conf.CD} FROM ${conf.C};`
          const catSql = await conn.query(buscaSql)

          const [atributos] = await conn.query(`SELECT ${conf.RD}, ${category}, ${conf.RT} FROM ${conf.R} WHERE ${conf.RI} = ${id} AND ${conf.RU} = ${userId};`);

          // se não existir nenhuma relatorio, retorne erro
          if(atributos.length === 0){

            res.json({
              error: true,
              message: "Categoria não existe"
            });

            return

          } else{
            // resposta da requisição caso tenha seguido corretamente a requisição 
            res.json({ result: atributos });
          }

      } catch (error) {
        res.json({ status: "error", message: error });
      }
    },
  
    // apaga um registro único pelo Id.
    delete: async (req, res) => {
      try {
          // variavel da requisição
          const { id } = req.params

          // token de autenticação do usuario
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.decode(token);
          const userId = decoded.id;
      
          // desativa as restrições temporariamente para conseguir deletar o registro apenas desta tabela
          await conn.query('SET FOREIGN_KEY_CHECKS=0');
      
          // exclui a categoria
          const delRelatorySql = `DELETE FROM ${conf.R} WHERE ${conf.RI} = ${id} AND ${conf.RU} = ${userId}`;
          const [atributos] = await conn.query(delRelatorySql, [id]);
      
          // reativa as restrições
          await conn.query('SET FOREIGN_KEY_CHECKS=1');

          return res.json({
            error: false,
            message: 'Relatorio deletado com sucesso!',
            data: atributos[0] 
          });
      } catch (error) {
        res.json({ status: "error", message: "ERRO: Não foi possivel deletar o relatorio" });
      }
    },
  
    // Insere um novo registro.
    post: async (req, res) => {
      try {
          // variaveis da requisição
          const { data, id_categoria, total_gastos } = req.body;

          // token de autenticação do usuario
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.decode(token);
          const userId = decoded.id;
    
          // insire relatorios 
          const sql = `INSERT INTO ${conf.R} (${conf.RD}, ${conf.RU}, ${conf.RC}, ${conf.RT}) VALUES (?, ${userId}, ?, ?)`;
          const [atributos] = await conn.query(sql, [data, id_categoria, total_gastos, userId]);
    
          // resposta da requisição
          res.json({
            error: false,
            message: 'Relatorio criado com sucesso!'
          });
      } catch (error) {
        res.json({ status: "error", message: "Não foi po" });
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
          const { data, id_categoria, total_gastos } = req.body;
          const { id } = req.params;
          
          // seleciona a categoria que tenha o mesmo id do usuario e o mesmo id da categoria que foram passadas
          const buscaSql = `SELECT * FROM ${conf.R} WHERE ${conf.RU} = ${userId} AND ${conf.RI} = ${id}`;
          const [consulta] = await conn.query(buscaSql, [ data, id_categoria, total_gastos, id]);


          if (consulta.length === 0) {
            res.status(400).json({
              error: true,
              message: "Relatório não existe!"
            });
            return;
          }
          
          // desativa as restrições temporariamente para conseguir deletar o registro apenas desta tabela
          await conn.query('SET FOREIGN_KEY_CHECKS=0');

          // atualiza os dados da categoria quando o o id da categoria for igual ao da requisição e o id do usuario for igual ao id do token
          const sql = `UPDATE ${conf.R} SET ${conf.RD} = ?, ${conf.RU} = ${userId}, ${conf.RC} = ?, ${conf.RT} = ? WHERE ${conf.RI} = ${id} AND ${conf.RU} = ${userId}`;
          const [atributos] = await conn.query(sql, [data, id_categoria, total_gastos, id]);
      
          // reativa as restrições
          await conn.query('SET FOREIGN_KEY_CHECKS=1');

          // resposta da requisição
          res.json({
            error: false,
            message: 'Relatório alterado com sucesso!',
            data: atributos[0]
          }); 

      } catch (error) {
        res.json({ status: "error", message: error });
      }
    }
  };
  
  // Exporta o módulo.
  module.exports = reportControl;