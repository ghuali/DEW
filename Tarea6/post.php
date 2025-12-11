<?php
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);
file_put_contents("ultimo.json", json_encode($input));

echo json_encode($input);
?>
