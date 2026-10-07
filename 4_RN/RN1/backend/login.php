<?php
// backend/login.php
// API Backend en PHP para validación de acceso de usuarios
// Compatible con XAMPP, WAMP, LAMP

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Responder a peticiones preflight OPTIONS de CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de conexión MySQL
$host = "localhost";
$db_user = "root";
$db_pass = ""; // Cambiar si tu XAMPP/WAMP tiene contraseña
$db_name = "sistema_login";

// Obtener datos recibidos en JSON
$inputData = json_decode(file_get_contents("php://input"), true);

// Fallback por si los datos se envían por x-www-form-urlencoded
$usuarioOrEmail = $inputData['usuario'] ?? $_POST['usuario'] ?? $inputData['email'] ?? $_POST['email'] ?? '';
$password = $inputData['password'] ?? $_POST['password'] ?? '';

// Validar que se hayan recibido los datos requeridos
if (empty($usuarioOrEmail) || empty($password)) {
    echo json_encode([
        "success" => false,
        "message" => "Debe proporcionar usuario/email y contraseña."
    ]);
    exit();
}

// Intentar conectar a la base de datos MySQL
$conn = @new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    // Si la base de datos no está configurada aún en XAMPP, fallback de demostración segura
    if ($usuarioOrEmail === 'admin' && $password === 'admin123') {
        echo json_encode([
            "success" => true,
            "message" => "Acceso concedido (Modo Demo sin DB)",
            "user" => [
                "id" => 1,
                "usuario" => "admin",
                "email" => "admin@ejemplo.com",
                "nombre" => "Juan Pérez (Demo)",
                "rol" => "Administrador"
            ]
        ]);
        exit();
    }

    echo json_encode([
        "success" => false,
        "message" => "Error de conexión a MySQL. Verifique XAMPP: " . $conn->connect_error
    ]);
    exit();
}

$conn->set_charset("utf8mb4");

// Preparar consulta SQL de búsqueda de usuario por 'usuario' o 'email'
$stmt = $conn->prepare("SELECT id, usuario, email, password, nombre, rol FROM usuarios WHERE usuario = ? OR email = ?");
$stmt->bind_param("ss", $usuarioOrEmail, $usuarioOrEmail);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    // Verificar contraseña (en este ejemplo admite texto plano o password_verify para hashes)
    $isPasswordValid = ($password === $user['password']) || password_verify($password, $user['password']);

    if ($isPasswordValid) {
        unset($user['password']); // No enviar la contraseña en la respuesta JSON
        echo json_encode([
            "success" => true,
            "message" => "Acceso concedido",
            "user" => [
                "id" => (int)$user['id'],
                "usuario" => $user['usuario'],
                "email" => $user['email'],
                "nombre" => $user['nombre'],
                "rol" => $user['rol']
            ]
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Contraseña incorrecta."
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "El usuario no existe en el sistema."
    ]);
}

$stmt->close();
$conn->close();
?>
