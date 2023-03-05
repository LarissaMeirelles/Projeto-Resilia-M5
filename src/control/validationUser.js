const { check, validationResult } = require('express-validator');
const moment = require('moment');

const validation = [

  // verifica se o email é um endereço de e-mail válido e normaliza-o para evitar possíveis erros de entrada.
  check('email').isEmail().normalizeEmail(),

  // verifica se o valor do campo senha possui pelo menos 8 caracteres.
  check('senha').isLength({ min: 8 }),

  // Verifica se o nome possui pelo menos 3 caracteres;
  // Se não está vazio;
  // Remove espaços em branco no início;
  // No final, converte caracteres especiais em suas entidades HTML correspondentes.
  check('nome').isLength({ min: 3 }).notEmpty().trim().escape(),

  // Verifica se a data de nascimento é uma data válida usando o Moment.js e a formata para "YYYY-MM-DD".
  check('data_nascimento').custom((value, { req }) => {
    const date = moment(value, 'DD/MM/YYYY', true);
    if (!date.isValid()) {
      throw new Error('Data de nascimento inválida');
    }
    req.body.data_nascimento = date.format('YYYY-MM-DD');
    return true;
  }),

  // Verifica se o campo renda não está vazio;
  // Se é numérico;
  // E pode ser convertido em um número de ponto flutuante.
  check('renda').notEmpty().isNumeric().toFloat(),

  // Verifica se o telefone possui entre 11 e 15 caracteres;
  // Não está vazio;
  // Se é numérico;
  // E pode ser convertido em um número inteiro.
  check('telefone').isLength({ min: 11, max: 15 }).notEmpty().isNumeric().toInt(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  }
];


const validationLogin = async (req, res, next) => {
  try {
    await check('email').isEmail().run(req);
    await check('senha').isLength({ min: 8 }).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validation,
  validationLogin
};
