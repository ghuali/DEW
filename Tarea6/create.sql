CREATE DATABASE registro;
USE registro;

CREATE TABLE usuarios (
    dni VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50),
    lastName VARCHAR(60),
    fechaNacimiento VARCHAR(20),
    codigoPostal VARCHAR(10),
    email VARCHAR(100),
    telefonoF VARCHAR(20),
    telefonoM VARCHAR(20),
    IBAN VARCHAR(34),
    tarjeta VARCHAR(20),
    contrasena VARCHAR(200)
);
