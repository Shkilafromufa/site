<?php
require __DIR__.'/db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$db = get_db();
session_start();

switch ($method) {
    case 'GET':
        // Деталь
        if (isset($_GET['id'])) {
            $id = (int)$_GET['id'];
            if ($id < 1) { http_response_code(400); echo json_encode(['error'=>'bad_id']); break; }
            $stmt = $db->prepare("SELECT id, title, description, image_path FROM portfolio_items WHERE id=?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) { http_response_code(404); echo json_encode(['error'=>'not_found']); break; }
            echo json_encode($row);
            break;
        }
        // Список (свежие первыми)
        $stmt = $db->query("SELECT id, title, description, image_path FROM portfolio_items ORDER BY id DESC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        if (empty($_SESSION['admin'])) { http_response_code(403); echo json_encode(['error'=>'forbidden']); break; }
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $title = trim($data['title'] ?? '');
        $desc  = trim($data['description'] ?? '');
        if ($title === '' || $desc === '') { http_response_code(400); echo json_encode(['error'=>'bad_input']); break; }

        $stmt = $db->prepare("INSERT INTO portfolio_items (title, description, image_path) VALUES (?,?, '')");
        $stmt->execute([$title, $desc]);
        echo json_encode(['id' => (int)$db->lastInsertId()]);
        break;

    case 'PUT':
    case 'PATCH':
        if (empty($_SESSION['admin'])) { http_response_code(403); echo json_encode(['error'=>'forbidden']); break; }
        $id = (int)($_GET['id'] ?? 0);
        if ($id < 1) { http_response_code(400); echo json_encode(['error'=>'bad_id']); break; }
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $title = trim($data['title'] ?? '');
        $desc  = trim($data['description'] ?? '');
        $stmt = $db->prepare("UPDATE portfolio_items SET title=?, description=? WHERE id=?");
        $stmt->execute([$title, $desc, $id]);
        echo json_encode(['status'=>'ok']);
        break;

    case 'DELETE':
        if (empty($_SESSION['admin'])) { http_response_code(403); echo json_encode(['error'=>'forbidden']); break; }
        $id = (int)($_GET['id'] ?? 0);
        if ($id < 1) { http_response_code(400); echo json_encode(['error'=>'bad_id']); break; }
        // Удалим файл (если есть)
        $stmt = $db->prepare("SELECT image_path FROM portfolio_items WHERE id=?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if ($row && !empty($row['image_path'])) {
            $abs = realpath(__DIR__ . '/..' . $row['image_path']);
            if ($abs && str_starts_with($abs, realpath(__DIR__.'/..'))) @unlink($abs);
        }
        $stmt = $db->prepare("DELETE FROM portfolio_items WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['status'=>'ok']);
        break;

    default:
        http_response_code(405);
}
