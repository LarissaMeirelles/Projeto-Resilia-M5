const express = require('express');

// Verifica se o token que está sendo passado é o mesmo token do usuario
const { verifyToken } = require('./verifyToken')
const router = express.Router();

// Valida os cadastros, atualizações de cadastro e login
const { validation, validationLogin } = require('./validationUser')

router.get("/", (req, res) => {
    res.render("index", {
        message: "Pagina principal",
    });
});

const userControl = require('./userControl');

// Rota do Usuário
router.get("/adm", userControl.getAll);

router.post("/login", validationLogin, userControl.Login);
router.post("/register", validation, userControl.Register);
router.put("/edition", validation, verifyToken, userControl.Edition);
router.delete("/delete", verifyToken, userControl.Delete);

// Rota das Categorias
const categoryControl = require('./categoryControl');

router.get("/categories", verifyToken, categoryControl.getAll);
router.get("/category/:id", verifyToken, categoryControl.getOne);
router.post("/category", verifyToken, categoryControl.post);
router.put("/category/:id", verifyToken, categoryControl.put);
router.delete("/category/:id", verifyToken, categoryControl.delete);

// Rota dos Gastos
const spendingControl = require('./spendingControl');

router.get("/spendings", verifyToken, spendingControl.getAll);
router.get("/spending/:id", verifyToken, spendingControl.getOne);
router.post("/spending", verifyToken, spendingControl.post);
router.put("/spending/:id", verifyToken, spendingControl.put);
router.delete("/spending/:id", verifyToken, spendingControl.delete);


// Rota das Economias
const economyControl = require('./economyControl');
// Lista a economia de um usuário
router.get("/economy/:id", verifyToken, economyControl.getOne); 
// Insere um novo registro em economia
router.post("/economy", verifyToken, economyControl.post); 


// Rota de Relatórios
const reportControl = require('./reportControl');

router.get("/reports", verifyToken, reportControl.getAll);
router.get("/report/:id", verifyToken, reportControl.getOne);
router.post("/report", verifyToken, reportControl.post);
router.put("/report/:id", verifyToken, reportControl.put);
router.delete("/report/:id", verifyToken, reportControl.delete);

module.exports = router;