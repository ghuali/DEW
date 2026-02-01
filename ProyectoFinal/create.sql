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


INSERT INTO usuarios (dni, name, email, telefono, iban, contrasena, fechaCreada)
VALUES (
    '12345678Z',
    'Usuario Prueba',
    'prueba@test.com',
    '612345678',
    'ES7620770024003102575766',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    '2025-02-01'
);

