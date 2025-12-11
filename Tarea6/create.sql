DROP TABLE IF EXISTS usuarios;

CREATE TABLE IF NOT EXISTS usuarios (
    dni VARCHAR(12) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    fechaNacimiento VARCHAR(10) NOT NULL,
    codigoPostal CHAR(5) NOT NULL,
    email VARCHAR(120) NOT NULL,
    telefonoF VARCHAR(15) NOT NULL,
    telefonoM VARCHAR(15) NOT NULL,
    tarjeta VARCHAR(25) NOT NULL,
    IBAN VARCHAR(34) NOT NULL,
    contrasena VARCHAR(255) NOT NULL
);

