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

// rota para adm
router.get("/adm", userControl.getAll);

router.post("/login/:id", validationLogin, userControl.Login);
router.post("/register", validation, userControl.Register);
router.put("/edition/:id", validation, verifyToken, userControl.Edition);
router.delete("/delete/:id", verifyToken, userControl.Delete);


const categoryControl = require('./categoryControl');

router.get("/category", categoryControl.getAll);
router.get("/category/:id", verifyToken, categoryControl.getOne);
router.post("/category", verifyToken, bodyParser, categoryControl.post);
router.put("/category/:id", verifyToken, bodyParser, categoryControl.put);
router.delete("/category/:id", verifyToken, categoryControl.delete);


const spendingControl = require('./spendingControl');

router.get("/spending", spendingControl.getAll);
router.get("/spending/:id", verifyToken, spendingControl.getOne);
router.post("/spending", verifyToken, bodyParser, spendingControl.post);
router.put("/spending/:id", verifyToken, bodyParser, spendingControl.put);
router.delete("/spending/:id", verifyToken, spendingControl.delete);



const economyControl = require('./economyControl');
// Lista a economia de um usuário
router.get("/economy/:id", verifyToken, economyControl.getOne); 
// Insere um novo registro em economia
router.post("/economy", verifyToken, bodyParser, economyControl.post); 



const reportControl = require('./reportControl');

router.get("/report/", reportControl.getAll);
router.post("/report/:id", verifyToken, reportControl.getOne);
router.post("/report", verifyToken, bodyParser, reportControl.post);
router.put("/report/:id", verifyToken, bodyParser, reportControl.put);
router.delete("/report/:id", verifyToken, reportControl.delete);

module.exports = router;