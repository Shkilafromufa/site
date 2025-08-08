<?php
require __DIR__.'/db.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

try {
    $db = get_db();
    $stmt = $db->prepare('SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $row = $stmt->fetch();
    if ($row && password_verify($password, $row['password_hash'])) {
        $_SESSION['admin'] = true;
        $_SESSION['admin_user'] = $row['username'];
        echo json_encode(['status' => 'ok']);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'unauthorized']);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'server_error']);
}
