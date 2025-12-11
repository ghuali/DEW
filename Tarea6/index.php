<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

$servername = "localhost";
$username = "lanzarote";
$password = "Ghuali21!";
$dbname   = "dew";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["error" => $conn->connect_error]);
    exit;
}

$action = $_GET['action'] ?? '';

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // ================================
    // 1. POST JSON (rebote desde PHP)
    // ================================
    if ($action === 'json') {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        if ($obj) {
            file_put_contents("ultimo.json", json_encode($obj, JSON_PRETTY_PRINT));
            echo json_encode($obj);
        } else {
            echo json_encode(["error"=>"JSON inválido"]);
        }
        exit;
    }

    // ================================
    // 2. POST a BD (insertar usuario)
    // ================================
    if ($action === 'db' && isset($_POST["name"])) {
        $dni = strtoupper(trim($_POST["dni"]));

        $check = $conn->prepare("SELECT dni FROM usuarios WHERE dni = ?");
        $check->bind_param("s", $dni);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            echo json_encode(["error" => "Ya existe un usuario con ese DNI"]);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO usuarios 
            (name, lastName, dni, fechaNacimiento, codigoPostal, email, telefonoF, telefonoM, tarjeta, IBAN, contrasena) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "sssssssssss",
            $_POST['name'], $_POST['lastName'], $dni, $_POST['fechaNacimiento'],
            $_POST['codigoPostal'], $_POST['email'], $_POST['telefonoF'], $_POST['telefonoM'],
            $_POST['tarjeta'], $_POST['IBAN'], $_POST['contrasena']
        );

        if($stmt->execute()) {
            echo json_encode(["success" => true, "mensaje" => "Usuario insertado en BD correctamente"]);
        } else {
            echo json_encode(["error" => $stmt->error]);
        }
        exit;
    }
}

// ================================
// 3. GET BD por DNI o JSON
// ================================
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if ($action === 'db' && isset($_GET["dni"])) {
        $dni = $conn->real_escape_string($_GET["dni"]);
        $result = $conn->query("SELECT * FROM usuarios WHERE dni='$dni'");
        if ($result->num_rows === 0) {
            echo json_encode(["error" => "No existe usuario con ese DNI"]);
        } else {
            echo json_encode($result->fetch_assoc());
        }
        exit;
    }

    if ($action === 'json') {
        if (file_exists("ultimo.json")) {
            $data = json_decode(file_get_contents("ultimo.json"), true);
            if ($data) {
                echo json_encode($data);
            } else {
                echo json_encode(["error" => "Archivo JSON corrupto o vacío"]);
            }
        } else {
            echo json_encode(["error" => "No hay datos guardados aún"]);
        }
        exit;
    }
}
?>
