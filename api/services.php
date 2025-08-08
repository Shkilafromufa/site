<?php
require __DIR__.'/db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$db = get_db();

session_start();

if ($method === 'GET') {
    // Детальная услуга
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];

        $stmt = $db->prepare('SELECT * FROM services WHERE id = ?');
        $stmt->execute([$id]);
        $s = $stmt->fetch();

        if (!$s) { http_response_code(404); echo json_encode(['error'=>'not_found']); exit; }

        // Картинки
        $imgs = $db->prepare('SELECT id, path, alt FROM service_images WHERE service_id = ? ORDER BY id DESC');
        $imgs->execute([$id]);
        $s['images'] = $imgs->fetchAll() ?: [];

        // Особенности
        $s['features'] = json_decode($s['features'], true) ?: [];

        echo json_encode($s);
        exit;
    }

    // Список услуг с cover (обложкой)
    // Работает и в MySQL, и в SQLite
    $sql = "
        SELECT s.*,
               (
                 SELECT path
                 FROM service_images
                 WHERE service_id = s.id
                 ORDER BY id DESC
                 LIMIT 1
               ) AS cover
        FROM services s
        ORDER BY s.id DESC
    ";
    $stmt = $db->query($sql);
    $services = $stmt->fetchAll();

    // Декодируем features
    foreach ($services as &$s) {
        $s['features'] = json_decode($s['features'], true) ?: [];
    }
    unset($s);

    echo json_encode($services);
    exit;
}

// Всё, что ниже — требует админ-сессии
if (empty($_SESSION['admin'])) {
    http_response_code(403);
    echo json_encode(['error' => 'forbidden']);
    exit;
}

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true) ?? [];

        $stmt = $db->prepare('INSERT INTO services (name, description, features) VALUES (?,?,?)');
        $stmt->execute([
            $data['name'] ?? '',
            $data['description'] ?? '',
            json_encode($data['features'] ?? [])
        ]);

        $newId = (int)$db->lastInsertId();
        http_response_code(201);
        echo json_encode(['id' => $newId]);
        break;

    case 'DELETE':
        $id = (int)($_GET['id'] ?? 0);
        $stmt = $db->prepare('DELETE FROM services WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['status' => 'ok']);
        break;

    default:
        http_response_code(405);
}
