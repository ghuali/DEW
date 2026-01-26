DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS productos;

CREATE TABLE IF NOT EXISTS usuarios (
    dni VARCHAR(12) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(120) NOT NULL,
    telefonoF VARCHAR(15) NOT NULL,
    tarjeta VARCHAR(25) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    fechaCreada VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS productos (
    id INT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio FLOAT NOT NULL,
    disponibilidad BOOLEAN NOT NULL,
    imagen IMAGE NOT NULL
);
