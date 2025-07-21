CREATE TABLE talaba(id SERIAL PRIMARY KEY,name VARCHAR(50),ball INT);

INSERT INTO talaba (name, ball) VALUES
('Ali Valiyev', 85),
('Laylo Karimova', 92),
('Botir Qodirov', 78),
('Dilnoza Ismoilova', 88),
('Sardor Toshpulatov', 95);

SELECT name, ball FROM talaba WHERE ball < (SELECT AVG(ball) FROM talaba);


CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price NUMERIC(10,2),
    quantity INT
);

INSERT INTO product (name, price, quantity) VALUES
('Telefon Samsung S24', 1200.50, 10),
('Noutbuk Dell Inspiron', 850.99, 5),
('Televizor LG 55"', 600.00, 8),
('Muzlatgich Samsung', 750.75, 4),
('Sichqoncha Logitech', 25.99, 50);


SELECT P1.name,P1.price, (SELECT COUNT(*) FROM product P2 WHERE P2.price>P1.price) FROM product P1;


CREATE TABLE mahsulotlar (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price NUMERIC(10,2),
    quantity INT,
    sold INT
);

INSERT INTO mahsulotlar (name, price, quantity, sold) VALUES
('iPhone 15', 1300.00, 20, 5),
('MacBook Air M2', 1400.00, 15, 3),
('Galaxy S23 Ultra', 1200.00, 10, 7),
('Xiaomi Redmi Note 13', 350.00, 30, 15),
('PlayStation 5', 500.00, 12, 8);


SELECT * FROM mahsulotlar ORDER BY sold  LIMIT 5;




CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    position VARCHAR(50),
    salary NUMERIC(10,2)
);
INSERT INTO employees (first_name, last_name, position, salary) VALUES
('John', 'Doe', 'Software Engineer', 85000.00),
('Jane', 'Smith', 'Product Manager', 95000.00),
('Mike', 'Johnson', 'UX Designer', 70000.00),
('Sara', 'Williams', 'HR Manager', 75000.00),
('David', 'Brown', 'Sales Executive', 60000.00);
 


SELECT position FROM employees GROUP BY position HAVING COUNT(*)>5;


SELECT first_name,salary FROM employees ORDER BY salary DESC LIMIT 1; 

    