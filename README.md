# Projeto-Resilia-M5
>*Projeto em grupo para o módulo 5 do curso da Resília.*


### Este projeto é um sistema de gerenciamento de finanças pessoais que permite aos usuários cadastrar suas despesas, economias e gerar relatórios.
### Ele também possui um sistema de login seguro para garantir que apenas usuários autorizados possam acessar suas informações pessoais.
### Além disso, é possível cadastrar categorias de gastos para melhor organização das despesas. O objetivo deste projeto é ajudar os usuários a gerenciar suas finanças de maneira mais eficiente e organizada.

<br>
<br>

### Para utilizar o sistema de login, siga estes passos:

`1.` *Cadastre um novo usuário usando a rota `"/register"` com o método `"POST"`. Serão necessários os seguintes dados: nome, email, senha, renda e telefone.*

`2.` *Após cadastrar o usuário, acesse a rota `"/login"` com o método `"POST"` com o seu id gerado como parâmetro e informe o email e senha que você cadastrou. Isso irá gerar um token de acesso.*

`3.` *Acesse a rota `"/edition"` com o método `"PUT"` e com o seu id como paramêtro e inclua o token de acesso no campo de autorização (bearer token). Se você inserir um token inválido,
   o sistema irá alertá-lo. Se você não inserir nenhum token, o sistema também irá alertá-lo e você não poderá prosseguir. Se você inserir um token válido, 
   os seus dados serão atualizados.*
   
`4.` *Acesse a rota `"/delete"`, insira seu identificador como parâmetro e insira seu token de acesso no campo de autorização (bearer token) para deletar o seu usuario.*

`5.` *Utilize o token de acesso gerado para realizar as demais operações da API.*

> OBS: para listar todos os usuários cadastrados, utiliza-se a rota "/adm" com o método "GET". É necessário ser um usuário com status "adm" para ter acesso a essa rota.

<br>
<br>

### Listagem que contém todas as rotas de acesso
<br>

#### Rotas do usuário
```
 - /adm (GET) - Lista todos os usuários cadastrados;  // apenas usuários autorizados
 - /login/:id (POST) - Realiza o login de um usuário;
 - /login/:id (POST) - Realiza o login de um usuário;
 - /register (POST) - Cadastra um novo usuário;
 - /edition/:id (PUT) - Edita as informações de um usuário;
 - /delete/:id (DELETE) - Deleta um usuário; 
 ```

#### Rotas das categorias de gastos
```
 - /categories (GET) - Lista todas as categorias de gastos;
 - /category/:id (GET) - Retorna uma categoria específica de gastos;
 - /category (POST) - Cadastra uma nova categoria de gastos;
 - /category/:id (PUT) - Edita uma categoria de gastos existente;
 - /category/:id (DELETE) - Deleta uma categoria de gastos existente;
```


#### Rotas para gastos
```
 - /spendings/:id (GET) - Lista todos os gastos de uma determinada categoria;
 - /spending/:id (GET) - Retorna um gasto específico;
 - /spending (POST) - Cadastra um novo gasto;
 - /spending/:id (PUT) - Edita um gasto existente;
 - /spending/:id (DELETE) - Deleta um gasto existente;
```

#### Rotas para economia
```
 - /economy/:id (GET) - Retorna a economia de um usuário;
 - /economy (POST) - Cadastra uma nova economia;
```

#### Rotas para relatórios
 ```
 - /reports/:id (GET) - Lista todos os relatórios de uma determinada categoria;
 - /report/:id (POST) - Retorna um relatório específico;
 - /report (POST) - Cadastra um novo relatório;
 - /report/:id (PUT) - Edita um relatório existente;
 - /report/:id (DELETE) - Deleta um relatório existente.
 ```
