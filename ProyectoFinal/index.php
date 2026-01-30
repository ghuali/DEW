<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");

$servername = "localhost";
$username = "lanzarote";
$password = "Ghuali21!";
$dbname   = "dew";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(['error' => 'Conexión fallida']);
    exit;
}

$conn->set_charset("utf8");

// Obtener productos
$sql = "SELECT * FROM productos WHERE disponibilidad = 1 ORDER BY id";
$resultado = $conn->query($sql);

$productos = [];
if ($resultado->num_rows > 0) {
    while($row = $resultado->fetch_assoc()) {
        $productos[] = $row;
    }
}

$conn->close();

echo json_encode($productos);
?>