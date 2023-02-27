const conn = require('../model/mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conf = require('dotenv').config().parsed;
const { body, validationResult } = require('express-validator');


const userControl = {

    getAll: async (req, res) => {
        try {

            // busca o token para comparar como atual
            const authHeader = req.headers.authorization;
            const [, token] = authHeader.split(' ');
            
            
            // colocar no metodo PUT(Edition) e no metodo delete(Delete)
            // Verifica se o token é válido
            jwt.verify(token, conf.JWT_PASSWORD, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Token inválido' });
                }

                const userId = decoded.id;

                // Verifica se o usuário é um administrador
                const sql = `SELECT * FROM ${conf.U} WHERE ${conf.CH} = ? AND ${conf.UP} = '${conf.A}';`;
                const [atributos] = await conn.query(sql, [userId]);

                if (atributos.length === 0) {
                    return res.status(403).json({ error: true, message: 'Acesso negado' });
                } else {
                    // Query que obtém os dados do banco de dados
                    const sqlGetAll = `SELECT * FROM ${conf.U};`;
                    const [users] = await conn.query(sqlGetAll);

                    res.json({ data: users });
                }
            });

        } catch (error) {
          res.json({ message: "Insira um token!" });
        }
    },

    Register: async (req, res) => {
        try {
            const { nome, email, senha, renda, telefone } = req.body;
            // criptografa a senha do usuário
            const cript = await bcrypt.hash(senha, 8);

            await body('email').isEmail().normalizeEmail().run(req);
            await body('senha').isLength({ min: 8 }).run(req);
            await body('nome').isLength({min: 3}).notEmpty().trim().escape().run(req);
            await body('renda').notEmpty().isNumeric().toFloat().run(req);
            await body('telefone').isLength({ min: 11, max: 15 }).notEmpty().isNumeric().toInt().run(req);

            const error = validationResult(req) 
            if(!error.isEmpty()){
                return res.status(400).json({ error: error.array() })
            }

            // Query
            const sql = `INSERT INTO ${conf.U} (${conf.NA}, ${conf.EM}, ${conf.PA}, ${conf.IN}, ${conf.TE}) VALUES (?, ?, ?, ?, ?);`;
            const [atributos] = await conn.query(sql, [nome, email, cript, renda, telefone]);

        
            // Resposta da requisição
            res.json({
                error: false,
                message: "Cadastro realizado com sucesso!"
            });
        }
        catch (error) {
            console.error(error);
            res.status(400).json({
                error: true,
                message: error.message
            });
        }
    },

    Login: async (req, res) => {

        const id = req.params.id;
        try {
            // req.body é usado para acessar dados enviados pelo cliente.
            const {email, senha} = req.body;

            // Validando os dados de entrada.
            await body('email').isEmail().run(req);
            await body('senha').isLength({ min: 8 }).run(req);

            const error = validationResult(req) 
            if(!error.isEmpty()){
                return res.status(400).json({ error: error.array() })
            }

            // Query
            const sql = `SELECT ${conf.EM}, ${conf.PA} FROM ${conf.U} WHERE ${conf.CH} = ? AND ${conf.US} = '${conf.O}';`;
            const [atributos] = await conn.query(sql, [id])


            // Compara se o email da requisição é diferente do email da consulta
            if(email !== atributos[0].u_email){
                console.log(atributos[0])
                return res.status(400).json({
                    error: true,
                    message: "Erro: Usuário ou a senha incorreta!"
                });
            }

            // Compara a senha da requisição incriptada com a senha da consulta incriptada
            const isPasswordValid = await bcrypt.compare(senha, atributos[0].u_password);
            if (!isPasswordValid) {
                return res.status(400).json({
                    error: true,
                    message: "Erro: Usuário ou a senha incorreta! b",
                });
            }

            // Cria um token do usuario
            var token = jwt.sign({ id: id }, conf.JWT_PASSWORD, {
                expiresIn: 3600 // 1h
                // expiresIn: 600 // 10min
                // expiresIn: 60 // 1min
                // expiresIn: '7d' // 7 dias
            })

            // Resposta da requisição
            return res.json({
                erro: false,
                message: "Login realizado com sucesso",
                token
            })
        }
        // Exibe mensagem de erro
        catch (error) {
            console.log(error)
            res.json({ status: "error", message: "Erro ao Logar" })
        }
    },

    Edition: async (req, res) => {
        try {
            
            const { id } = req.params;
            const { nome, email, senha, renda, telefone } = req.body;
    
            // Verifica se o token foi enviado na requisição
            const authHeader = req.headers.authorization;
            const [, token] = authHeader.split(' ');
    
            // Validação de atualização de cadastro
            await body('email').isEmail().normalizeEmail().run(req);
            await body('senha').isLength({ min: 8 }).run(req);
            await body('nome').notEmpty().trim().escape().run(req);
            await body('renda').notEmpty().isNumeric().toFloat().run(req);
            await body('telefone').notEmpty().isNumeric().toInt().run(req);

            const error = validationResult(req) 
            if(!error.isEmpty()){
                return res.status(400).json({ error: error.array() })
            }
           
            // Verifica se o token é válido e decodifica o ID do usuário
            jwt.verify(token, conf.JWT_PASSWORD, async (err, decoded)=> {
                if (err || decoded.id !== id) {
                    return res.status(401).json({
                        error: true,
                        message: 'Token inválido'
                    });
                }
                
                // criptografa a senha do usuário
                const cript = await bcrypt.hash(senha, 8);
    
                // Query para atualizar os dados do usuário
                const sql = `UPDATE ${conf.U} SET ${conf.NA} = ?, ${conf.EM} = ?, ${conf.PA} = ?, ${conf.IN} = ?, ${conf.TE} = ? WHERE ${conf.CH} = ?`;
                const [atributos] = await conn.query(sql, [nome, email, cript, renda, telefone, id]);
    
                // Verifica se a atualização foi bem sucedida
                if (atributos.affectedRows === 0) {
                throw new Error('Erro: usuário não encontrado');
                }
    
                // Resposta da requisição
                res.json({
                error: false,
                message: 'Usuário atualizado com sucesso!'
                });
            });
    
          } catch (error) {
            console.error(error);
            res.status(400).json({
              error: true,
              message: 'Insira um token'
            });
        }
    },

    Delete: async (req, res) => {
        try {
            const { id } = req.params;
                
            // Extrai os campos do req.body
            const { ST } = req.body;
            

            const authHeader = req.headers.authorization;

            // Verifica se existe um token no campo
            if (!authHeader) {
                return res.status(401).json({
                    error: true,
                    message: 'Insira um token'
                });
            }
            const [, token] = authHeader.split(' ');
                
            let usuarioId;
            try {
                const decodedToken = jwt.verify(token, conf.JWT_PASSWORD);
                usuarioId = decodedToken.id;
            } catch (err) {
                return res.status(401).json({
                error: true,
                message: 'Token inválido.'
                });
            }
                
            // Verifica se o usuário autenticado é o mesmo usuário que está tentando acessar a rota
            if (usuarioId !== id) {
                return res.status(403).json({
                error: true,
                message: 'Token inválido.'
                });
            }
        
            // Atualiza o status do usuario com o ID fornecido.
            const sql = `UPDATE ${conf.U} SET ${conf.US} = ? WHERE ${conf.CH} = ?;`;
            const [atributos] = await conn.query(sql, [ST || conf.DE, id])
        
            // Retorna a resposta com os dados atualizados.
            const resultado = { usuario: atributos.insertId, status: 'Usuário deletado com sucesso!' }
            res.json(resultado);
        } 
        catch (error) 
        {
            console.error(`Erro ao atualizar o usuario ${id}: ${error.message}`);
            res.status(500).json({ status: 'error', message: 'Erro ao deletar o usuario.' });
        }
    }
}


module.exports = userControl;
