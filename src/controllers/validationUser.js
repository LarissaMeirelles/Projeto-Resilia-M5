const { check, validationResult } = require('express-validator');

const validation = [
  check('email').isEmail().normalizeEmail(),
  check('senha').isLength({ min: 8 }),
  check('nome').isLength({ min: 3 }).notEmpty().trim().escape(),
  check('renda').notEmpty().isNumeric().toFloat(),
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