drop database if exists financial_control;

-- Cria o banco de dados usando UTF-8 e buscas case-insensitive.
CREATE DATABASE financial_control CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Seleciona o banco de dados de trabalho.
USE financial_control;

-- Cria a tabela 'user'.
CREATE TABLE user (
    u_id INT PRIMARY KEY AUTO_INCREMENT,
    u_name VARCHAR(255) NOT NULL, 
    u_email VARCHAR(100) NOT NULL,
    u_password VARCHAR(127) NOT NULL,
    u_telephone VARCHAR(20),
    u_income DECIMAL NOT NULL,
    u_status ENUM('on', 'off', 'del') DEFAULT 'on',
    u_permission ENUM('adm', 'mod', 'users') DEFAULT 'users'
);

-- Cria a tabela 'category'.
CREATE TABLE category (
    c_id INT PRIMARY KEY AUTO_INCREMENT,
    c_user INT NOT NULL,
    c_name VARCHAR(100) NOT NULL,
    c_description TEXT,
    FOREIGN KEY (c_user) REFERENCES user (u_id)
);

-- Cria a tabela 'spending'.
CREATE TABLE spending (
    s_id INT PRIMARY KEY AUTO_INCREMENT,
    s_user INT NOT NULL,
    s_category INT NOT NULL,    
    s_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    s_value DECIMAL NOT NULL,
    FOREIGN KEY (s_user) REFERENCES user (u_id),
    FOREIGN KEY (s_category) REFERENCES category (c_id)
);

-- Cria a tabela 'economy'.
CREATE TABLE economy (
    e_id INT PRIMARY KEY AUTO_INCREMENT,
    e_user INT NOT NULL,
    e_spending INT NOT NULL,
    e_value_saved DECIMAL NOT NULL,
    e_description TEXT,
    FOREIGN KEY (e_user) REFERENCES user (u_id),
    FOREIGN KEY (e_spending) REFERENCES spending (s_id)
);

-- Cria a tabela 'report'.
CREATE TABLE report (
    r_id INT PRIMARY KEY AUTO_INCREMENT,
    r_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    r_user INT NOT NULL,
    r_category INT NOT NULL,
    r_total_spending DECIMAL NOT NULL,
    FOREIGN KEY (r_user) REFERENCES user (u_id),
    FOREIGN KEY (r_category) REFERENCES category (c_id)
);

INSERT INTO user (u_name, u_email, u_password, u_income, u_telephone, u_status , u_permission)
VALUES
('Thiago Bomfim', 'thiago@bomfim.com', '$2a$08$OCZJOnfnfZ99RIrY1svAJ.kLKzpOVLtM6UdDaHisJUL44Sv960Gc2', 5000, '21984635412',  'on', 'adm'),
('Ana Beatriz', 'ana@beatriz.com', '$2a$08$cj6dlEWyMS3nubTyG39uJuYhOOqe7xzMk1VMvf7ZK012Ir3/xPDoS', 4000, '21976312348',  'on', 'adm'),
('Larissa Meirelles', 'larissa@meirelles.com', '$2a$08$60qJMn7hBMJzCvkdGY1YA.5Z6mWlsihaMwtLz8heXcdksfuMVU2Cm', 6000, '21994628632', 'on', 'adm'),
('Alan Nataniel', 'alan@nataniel.com', '$2a$08$D..eaX5HJIBZ/qgySWFypef0yuIwrEZwLeQXmYnCFNkghLAil4IaS', 5500, '21989453214', 'on', 'adm'),
('Mariana Medeiros', 'mariana@medeiros.com', '$2a$08$2jLYiJyhuPBqkOPcOsKpMOhAip/8yljSegvGt.nZ1joGnbCYUK6YO', 5000,  '21965784512', 'on', 'adm'),
('Nayane Cristina', 'nayane@cristina.com', '$2a$08$dH.klu8LBgu4a5sXfh5.ieJGH5/2WfLLbX9Ep7n5Rrb3qW2vhM8ki', 5800, '21963129725', 'on', 'adm');

INSERT INTO category (c_name, c_user, c_description)
VALUES
('Saúde', 1, 'Planos de saúde, consultas, Academia, Veterinário'),
('Lazer', 3,'Bebidas, Shopping, Festas, Cinema'),
('Farmácia', 2,'Medicamentos, produtos de uso hospitalar, Suplementos, Cosméticos'),
('Alimentação', 4,'Comidas, Sucos, Mercado, Lanches'),
('Higiene', 1,'Shampoo, Desodorante, Sabonete, Creme dental'),
('Moradia', 3,'Aluguel, Construção, Decoração, Arquitetura');

INSERT INTO spending (s_user, s_category, s_date, s_value) VALUES 
(1, 1, '2023-02-27T19:20', 70),
(2, 3, '2023-02-20T20:00', 100),
(3, 2, '2023-02-15T21:30', 50),
(4, 4, '2023-02-22T19:20', 20),
(5, 2, '2023-02-10T16:40', 140),
(6, 3, '2023-02-15T14:00', 90);

INSERT INTO economy (e_user, e_spending, e_value_saved, e_description) VALUES 
(1, 1, 130,'Paguei a academia'),
(2, 2, 50,'Comprei alguns cosméticos, quase não me sobra dinheiro, tudo muito caro.'),
(3, 3, 100,'Consegui sair pro rolê esse final de semana sem gastar muito.'),
(4, 4, 50,'Comprei alguns biscoitos na Casa do biscoito'),
(5, 5, 60,'Assisti um filme novo e comprei algumas roupas no shopping'),
(6, 6, 200,'Fiz compra no mercado, e comprei coisas que estavam faltando em casa.');

INSERT INTO report (r_date, r_user, r_category, r_total_spending) VALUES
('2023-02-27T19:40', 1, 1, 70),
('2023-02-27T19:40', 2, 2, 100),
('2023-02-27T19:40', 3, 3, 50),
('2023-02-27T19:40', 4, 4, 20),
('2023-02-27T19:40', 5, 5, 140),
('2023-02-27T19:40', 6, 6, 90);


