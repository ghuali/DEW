<?php
header("Content-Type: application/json");

$pdo = new PDO("mysql:host=localhost;dbname=registro", "root", "");

$dni = $_GET["dni"];

$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE dni = ?");
$stmt->execute([$dni]);
$datos = $stmt->fetch(PDO::FETCH_ASSOC);

if(!$datos){
    echo json_encode(["error"=>"No existe"]);
    exit;
}

echo json_encode($datos);
?>
