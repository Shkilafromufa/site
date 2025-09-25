<?php
require __DIR__ . '/db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$db = get_db();
session_start();

if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        if ($id < 1) {
            http_response_code(400);
            echo json_encode(['error' => 'bad_id']);
            exit;
        }
        $stmt = $db->prepare('SELECT * FROM testimonials WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            http_response_code(404);
            echo json_encode(['error' => 'not_found']);
            exit;
        }
        echo json_encode($row);
        exit;
    }

    $stmt = $db->query('SELECT * FROM testimonials ORDER BY id DESC');
    echo json_encode($stmt->fetchAll());
    exit;
}

if (empty($_SESSION['admin'])) {
    http_response_code(403);
    echo json_encode(['error' => 'forbidden']);
    exit;
}

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $stmt = $db->prepare('INSERT INTO testimonials (quote_text, author, company, role_title) VALUES (?,?,?,?)');
        $stmt->execute([
            trim($data['quote_text'] ?? ''),
            trim($data['author'] ?? ''),
            trim($data['company'] ?? ''),
            trim($data['role_title'] ?? '')
        ]);
        http_response_code(201);
        echo json_encode(['id' => (int)$db->lastInsertId()]);
        break;

    case 'PUT':
    case 'PATCH':
        $id = (int)($_GET['id'] ?? 0);
        if ($id < 1) {
            http_response_code(400);
            echo json_encode(['error' => 'bad_id']);
            break;
        }
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $stmt = $db->prepare('UPDATE testimonials SET quote_text=?, author=?, company=?, role_title=? WHERE id=?');
        $stmt->execute([
            trim($data['quote_text'] ?? ''),
            trim($data['author'] ?? ''),
            trim($data['company'] ?? ''),
            trim($data['role_title'] ?? ''),
            $id
        ]);
        echo json_encode(['status' => 'ok']);
        break;

    case 'DELETE':
        $id = (int)($_GET['id'] ?? 0);
        if ($id < 1) {
            http_response_code(400);
            echo json_encode(['error' => 'bad_id']);
            break;
        }
        $stmt = $db->prepare('DELETE FROM testimonials WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['status' => 'ok']);
        break;

    default:
        http_response_code(405);
}
