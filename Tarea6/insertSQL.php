<?php
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$pdo = new PDO("mysql:host=localhost;dbname=registro", "root", "");

$sql = "REPLACE INTO usuarios
(nombre, lastName, dni, fechaNacimiento, codigoPostal, email, telefonoF, telefonoM, IBAN, tarjeta, contrasena)
VALUES
(:nombre, :lastName, :dni, :fechaNacimiento, :codigoPostal, :email, :telefonoF, :telefonoM, :IBAN, :tarjeta, :contrasena)";

$stmt = $pdo->prepare($sql);
$stmt->execute($data);

echo json_encode(["mensaje"=>"Guardado en SQL"]);
?>
