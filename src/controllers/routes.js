const express = require('express');

const router = express.Router();

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

router.post("/login/:id", userControl.Login);
router.post("/register", userControl.Register);
router.put("/edition/:id", userControl.Edition);
router.delete("/delete/:id", userControl.Delete);


const categoryControl = require('./categoryControl');

router.get("/category", categoryControl.getAll);
router.get("/category/:id", categoryControl.getOne);
router.post("/category", bodyParser, categoryControl.post);
router.put("/category/:id", bodyParser, categoryControl.put);
router.delete("/category/:id", categoryControl.delete);


const spendingControl = require('./spendingControl');

router.get("/spending", spendingControl.getAll);
router.get("/spending/:id", spendingControl.getOne);
router.post("/spending", bodyParser, spendingControl.post);
router.put("/spending/:id", bodyParser, spendingControl.put);
router.delete("/spending/:id", spendingControl.delete);



const economyControl = require('./economyControl');
// Lista a economia de um usuário
router.get("/economy/:id", economyControl.getOne); 
// Insere um novo registro em economia
router.post("/economy", bodyParser, economyControl.post); 



const reportControl = require('./reportControl');

router.get("/report", reportControl.getAll);
router.get("/report/:id", reportControl.getOne);
router.post("/report", bodyParser, reportControl.post);
router.put("/report/:id", bodyParser, reportControl.put);
router.delete("/report/:id", reportControl.delete);

module.exports = router;