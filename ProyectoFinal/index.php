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


// Obtener datos del POST
$data = json_decode(file_get_contents('php://input'), true);

$dni = $data['dni'] ?? '';
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$telefono = $data['telefono'] ?? '';
$iban = $data['IBAN'] ?? '';
$contrasena = $data['contrasena'] ?? '';

// Validar que todos los campos estén presentes
if (empty($dni) || empty($name) || empty($email) || empty($telefono) || empty($iban) || empty($contrasena)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos']);
    exit;
}

// Verificar si el usuario ya existe
$sql = "SELECT dni FROM usuarios WHERE dni = ? OR email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $dni, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'El DNI o email ya están registrados']);
    exit;
}

// Hash de la contraseña
$contrasenaHash = password_hash($contrasena, PASSWORD_DEFAULT);

// Fecha actual
$fechaCreada = date('Y-m-d');

// Insertar nuevo usuario
$sql = "INSERT INTO usuarios (dni, name, email, telefono, iban, contrasena, fechaCreada) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss", $dni, $name, $email, $telefono, $iban, $contrasenaHash, $fechaCreada);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Usuario registrado exitosamente'
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al registrar usuario: ' . $stmt->error]);
}

$stmt->close();
$conn->close();


session_start();
session_destroy();
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Sesión cerrada']);


session_start();
header('Content-Type: application/json');

if (isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'logged_in' => true,
        'usuario' => [
            'dni' => $_SESSION['usuario_id'],
            'name' => $_SESSION['usuario_nombre'],
            'email' => $_SESSION['usuario_email']
        ]
    ]);
} else {
    echo json_encode(['logged_in' => false]);
}
?>