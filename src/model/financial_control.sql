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
    u_income DECIMAL NOT NULL,
    u_telephone VARCHAR(20),
    u_status ENUM('on', 'off', 'del') DEFAULT 'on'
);

-- Cria a tabela 'category'.
CREATE TABLE category (
	c_id INT PRIMARY KEY AUTO_INCREMENT,
	c_name VARCHAR(100) NOT NULL,
    c_description TEXT
);

-- Cria a tabela 'spending'.
CREATE TABLE spending (
	s_id INT PRIMARY KEY AUTO_INCREMENT,
    s_user INT NOT NULL,
    s_category INT NOT NULL,    
    s_date DATE NOT NULL,
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
