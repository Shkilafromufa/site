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
        $stmt = $db->prepare('SELECT * FROM project_cases WHERE id = ?');
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

    $stmt = $db->query('SELECT * FROM project_cases ORDER BY id DESC');
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
        $stmt = $db->prepare('INSERT INTO project_cases (tag, title, problem, solution, result_text, quote_text, quote_author, quote_company) VALUES (?,?,?,?,?,?,?,?)');
        $stmt->execute([
            trim($data['tag'] ?? ''),
            trim($data['title'] ?? ''),
            trim($data['problem'] ?? ''),
            trim($data['solution'] ?? ''),
            trim($data['result'] ?? ''),
            trim($data['quote_text'] ?? ''),
            trim($data['quote_author'] ?? ''),
            trim($data['quote_company'] ?? '')
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
        $stmt = $db->prepare('UPDATE project_cases SET tag=?, title=?, problem=?, solution=?, result_text=?, quote_text=?, quote_author=?, quote_company=? WHERE id=?');
        $stmt->execute([
            trim($data['tag'] ?? ''),
            trim($data['title'] ?? ''),
            trim($data['problem'] ?? ''),
            trim($data['solution'] ?? ''),
            trim($data['result'] ?? ''),
            trim($data['quote_text'] ?? ''),
            trim($data['quote_author'] ?? ''),
            trim($data['quote_company'] ?? ''),
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
        $stmt = $db->prepare('DELETE FROM project_cases WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['status' => 'ok']);
        break;

    default:
        http_response_code(405);
}
