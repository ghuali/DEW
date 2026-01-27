DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS productos;

CREATE TABLE IF NOT EXISTS usuarios (
    dni VARCHAR(12) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(120) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    iban VARCHAR(25) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    fechaCreada DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    disponibilidad BOOLEAN NOT NULL,
    imagen VARCHAR(255) NOT NULL
);

INSERT INTO productos (nombre, precio, disponibilidad, imagen)
VALUES
('Camisa Personalizable por parte de atras', 9.95, true, 'img/CamisaParteAtras.jpg'),
('Camisa Personalizable', 9.95, true, 'img/CamisaPerzonalizada.jpg'),
('Delantal Personalizable', 14.99, true, 'img/Delantal.jpg'),
('Polo Personalizable', 16.99, true, 'img/PoloPersonalizable.jpg'),
('Sudadera Personalizable', 24.99, true, 'img/sudaderaPersonalizable.jpg'),
('Tirantes Personalizable', 14.99, true, 'img/TirantesPersonalizable.jpg'),
('Gorra Personalizable', 9.99, true, 'img/gorraPersonalizable.jpg'),
('Sueter Personalizable', 19.99, true, 'img/SueterPersonalizable.jpg');




