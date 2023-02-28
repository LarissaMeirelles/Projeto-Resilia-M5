const express = require('express');

// Verifica se o token que está sendo passado é o mesmo token do usuario
const { verifyToken } = require('./verifyToken')
const router = express.Router();

// Valida os cadastros, atualizações de cadastro e login
const { validation, validationLogin } = require('./validationUser')
const bodyParser = require('body-parser').json();

router.get("/", (req, res) => {
    res.json({
        status: "error",
        message: "Bad request"
    });
});

const userControl = require('./userControl');

// Rota do Usuário
router.get("/adm", userControl.getAll);

router.post("/login/:id", validationLogin, userControl.Login);
router.post("/register", validation, userControl.Register);
router.put("/edition/:id", validation, verifyToken, userControl.Edition);
router.delete("/delete/:id", verifyToken, userControl.Delete);

// Rota das Categorias
const categoryControl = require('./categoryControl');

router.get("/categories", categoryControl.getAll);
router.get("/category/:id_cat", verifyToken, categoryControl.getOne);
router.post("/category", verifyToken, categoryControl.post);
router.put("/category/:id_cat", verifyToken, categoryControl.put);
router.delete("/category/:id", verifyToken, categoryControl.delete);

// Rota dos Gastos
const spendingControl = require('./spendingControl');

router.get("/spendings/:id", spendingControl.getAll);
router.get("/spending/:id", verifyToken, spendingControl.getOne);
router.post("/spending", verifyToken, bodyParser, spendingControl.post);
router.put("/spending/:id", verifyToken, bodyParser, spendingControl.put);
router.delete("/spending/:id", verifyToken, spendingControl.delete);


// Rota das Economias
const economyControl = require('./economyControl');
// Lista a economia de um usuário
router.get("/economy/:id", verifyToken, economyControl.getOne); 
// Insere um novo registro em economia
router.post("/economy", verifyToken, bodyParser, economyControl.post); 


// Rota de Relatórios
const reportControl = require('./reportControl');

router.get("/reports/:id", reportControl.getAll);
router.post("/report/:id", verifyToken, reportControl.getOne);
router.post("/report", verifyToken, bodyParser, reportControl.post);
router.put("/report/:id", verifyToken, bodyParser, reportControl.put);
router.delete("/report/:id", verifyToken, reportControl.delete);

module.exports = router;