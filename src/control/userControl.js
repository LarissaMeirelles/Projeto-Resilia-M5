const conn = require('../model/mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conf = require('dotenv').config().parsed;


const userControl = {
    
    getAll: async (req, res) => {
        
        try {
            // token de autenticação do usuario
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userId = decoded.id;

            // Verifica se o usuário é um administrador e se o email é o mesmo do token
            const sql = `SELECT * FROM ${conf.U} WHERE ${conf.UP} = '${conf.A}' AND ${conf.CH} = ${userId};`;
            const [atributos] = await conn.query(sql);

            // verifica se existe algum usuario. se não existir, retorne erro
            if (atributos.length === 0) {
                return res.status(403).json({ error: true, message: 'Acesso negado' });
            } else {
                // Query que obtém os dados do banco de dados
                const sqlGetAll = `SELECT * FROM ${conf.U};`;
                const [users] = await conn.query(sqlGetAll);
                
                // resposta da requisição caso tudo tenha seguido corretamente
                res.json({ result: users });
            }

        // retorna mensagem de erro caso não tenha seguido corretamente a requisição
        } catch (error) {
            res.json({ message: `Você não é um administrador para acessar essa rota!` });
        }
    },

    Register: async (req, res) => {
        try {
            // variaveis da requisição
            const { nome, email, idade, telefone, genero, endereco, renda, senha } = req.body;
            
            // criptografa a senha do usuário
            const cript = await bcrypt.hash(senha, 8);

            // Query
            const sql = `INSERT INTO ${conf.U} (${conf.NA}, ${conf.EM}, ${conf.UB} ,${conf.TE}, ${conf.GD}, ${conf.END}, ${conf.IN}, ${conf.PA}) VALUES ('${nome}', '${email}', ${idade}, '${telefone}', '${genero}',' ${endereco}', ${renda}, '${cript}');`
            const [atributos] = await conn.query(sql);


            // Resposta da requisição
            res.json({
                error: false,
                message: "Cadastro realizado com sucesso!",
                result: atributos
            });
        }
        catch (error) {
            res.status(400).json({
                error: true,
                message: error
            });
        }
    },

    Login: async (req, res) => {
        try {
          // req.body é usado para acessar dados enviados pelo cliente.
          const { email, senha } = req.body;
          
          // Query
          const sql = `SELECT ${conf.CH}, ${conf.EM}, ${conf.PA} FROM ${conf.U} WHERE ${conf.EM} = '${email}';`;
          const [atributos] = await conn.query(sql, [email, senha]);
      
          // Compara se o email da requisição é diferente do email da consulta
          if (email !== atributos[0].u_email) {
            return res.status(400).json({
              error: true,
              message: "Erro: Usuário ou a senha incorreta!",
            });
          }
      
          // Compara a senha da requisição incriptada com a senha da consulta incriptada
          const isPasswordValid = await bcrypt.compare(
            senha,
            atributos[0].u_password
          );
          if (!isPasswordValid) {
            return res.status(400).json({
              error: true,
              message: "Erro: Usuário ou a senha incorreta!"
            });
          }
          
          console.log(email, senha)

          const payload = {
            email: email,
            id: atributos[0].u_id,
          };
      
          // Cria um token do usuario ao fazer o login
          const token = jwt.sign(payload, conf.JWT_PASSWORD, {
            expiresIn: 3600, // 1h
            // expiresIn: 600 // 10min
            // expiresIn: 60 // 1min
            // expiresIn: '7d' // 7 dias
          });

          // Exibe mensagem de sucesso
          res.json({ status: "success", message: "Usuário logado com sucesso", token, user: atributos[0].u_email });
        } catch (error) {
          // Exibe mensagem de erro
          res.json({ status: "error", message: error });
        }
      },

    Edition: async (req, res) => {
        try {
            const { nome, email, senha, renda, telefone, genero, endereco, avatar } = req.body;

            // criptografa a senha do usuário
            const cript = await bcrypt.hash(senha, 8);

            // Query para atualizar os dados do usuário
            const sql = `UPDATE ${conf.U} SET ${conf.NA} = '${nome}', ${conf.EM} = '${email}', ${conf.PA} = '${cript}', ${conf.IN} = ${renda}, ${conf.TE} = '${telefone}', ${conf.GD} = '${genero}', ${conf.END} = '${endereco}', ${conf.AV} = '${avatar}' WHERE ${conf.EM} = '${email}'`;
            const [atributos] = await conn.query(sql, [nome, email, cript, renda, telefone, genero, endereco, avatar]);

            // Verifica se a atualização foi bem sucedida
            if (atributos.affectedRows === 0) {
            throw new Error('Erro: usuário não encontrado');
            }

            // Resposta da requisição
            return res.json({
            error: false,
            message: 'Usuário atualizado com sucesso!'
            })
        } 
        catch (error) {
            res.status(400).json({
            error: true,
            message: error
            });
        }
    },

    Delete: async (req, res) => {
        try {
            // token de autenticação do usuario
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const userEmail = decoded.email;

            // Extrai os campos do req.body
            const { ST } = req.body;
            
            // Atualiza o status do usuario com o ID fornecido.
            const sql = `UPDATE ${conf.U} SET ${conf.US} = ? WHERE ${conf.EM} = '${userEmail}';`;
            const [atributos] = await conn.query(sql, [ST || conf.DE ])
        
            // Retorna a resposta com os dados atualizados.
            const resultado = { usuario: atributos.insertId, status: 'Usuário deletado com sucesso!' }
            res.json(resultado);
        } 
        catch (error) 
        {   
            console.error(`Erro ao atualizar o usuario: ${error.message}`);
            res.status(500).json({ status: 'error', message: 'Erro ao deletar o usuario.' });
        }
    },

}


module.exports = userControl;
