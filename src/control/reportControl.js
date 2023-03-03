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
        
          // busca todos as categorias do mesmo usuário
          const sql = `SELECT R.${conf.RD}, C.${conf.CN}, S.${conf.SV}, total.value AS total_value FROM ${conf.R} AS R INNER JOIN ${conf.C} AS C ON R.${conf.RC} = C.${conf.CI} INNER JOIN ${conf.S} AS S ON S.${conf.SC} = C.${conf.CI} INNER JOIN (SELECT S.${conf.SC}, SUM(S.${conf.SV}) AS value FROM ${conf.S} AS S WHERE S.${conf.SU} = ${userId} GROUP BY S.${conf.SC}) AS total ON total.${conf.SC} = S.${conf.SC} WHERE S.${conf.SU} = ${userId} AND C.${conf.CU} = ${userId};`
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
          const { id_cat } = req.params;


          const [atributos] = await conn.query(`SELECT R.${conf.RD}, C.${conf.CN}, S.${conf.SV}, total.value AS total_value FROM ${conf.R} AS R INNER JOIN ${conf.C} AS C ON R.${conf.RC} = C.${conf.CI} INNER JOIN ${conf.S} AS S ON S.${conf.SC} = C.${conf.CI} INNER JOIN (SELECT S.${conf.SC}, SUM(S.${conf.SV}) AS value FROM ${conf.S} AS S WHERE S.${conf.SU} = ${userId} GROUP BY S.${conf.SC}) AS total ON total.${conf.SC} = S.${conf.SC} WHERE S.${conf.SU} = ${userId} AND C.${conf.CI} = ${id_cat};`);

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
        // Variáveis da requisição
        const { id_categoria, total_gastos } = req.body;
    
        // Token de autenticação do usuário
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        const userId = decoded.id;
    
        // Verifica se a categoria informada existe para o usuário
        const catSql = `SELECT * FROM ${conf.C} WHERE ${conf.CI} = ${id_categoria} AND ${conf.CU} = ${userId}`
        const [categoria] = await conn.query(catSql);
        if (!categoria) {
          return res.status(400).json({
            error: true,
            message: 'Categoria não encontrada para o usuário.'
          });
        }
    
        // Insere o relatório para a categoria informada
        const sql = `INSERT INTO ${conf.R} (${conf.RU}, ${conf.RC}, ${conf.RT}) VALUES (${userId}, ${id_categoria}, ${total_gastos});`
        const [atributos] = await conn.query(sql);
    
        // Resposta da requisição
        res.json({
          error: false,
          message: 'Relatório criado com sucesso!'
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Erro ao criar relatório.' });
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

