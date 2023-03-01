const express = require('express');
// const helmet = require('helmet');
// const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./control/routes');
const path = require('path')
const app = express();

/*

Adicionar o site na origin, quando tiver com o site/front-end estiver pronto
Adicionar o helmet só quando o site estiver pronto

// Helmet para adicionar headers de segurança para o seu aplicativo
app.use(helmet());

// CORS para limitar o acesso apenas aos sites permitidos
const corsOptions = {
  origin: 'https://www.seusite.com'
};
app.use(cors(corsOptions));

*/

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware body-parser para processar as requisições com dados JSON ou URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use as rotas do seu aplicativo
app.use('/', routes);

// middleware de tratamento de erros para capturar exceções em tempo de execução
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ocorreu um erro no servidor');
});

// Inicie o servidor na porta definida no arquivo .env
const PORT = process.env.PORT || 3400;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
