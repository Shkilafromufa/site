<?php
require __DIR__.'/db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$db = get_db();

if ($method === 'GET') {
    $stmt = $db->query('SELECT * FROM services ORDER BY id DESC');
    $services = $stmt->fetchAll();
    $services = array_map(function($s){
        $s['features'] = json_decode($s['features'], true) ?: [];
        return $s;
    }, $services);
    echo json_encode($services);
    exit;
}

if (!isset($_SESSION['admin'])) {
    http_response_code(403);
    echo json_encode(['error' => 'forbidden']);
    exit;
}

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare('INSERT INTO services (name, description, features) VALUES (?,?,?)');
        $stmt->execute([
            $data['name'],
            $data['description'],
            json_encode($data['features'])
        ]);
        echo json_encode(['status' => 'ok']);
        break;
    case 'DELETE':
        $id = $_GET['id'] ?? 0;
        $stmt = $db->prepare('DELETE FROM services WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['status' => 'ok']);
        break;
    default:
        http_response_code(405);
}
