<?php
// api/upload_service_model.php
require __DIR__ . '/db.php';

header('Content-Type: application/json');
session_start();

// метод
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>'method_not_allowed']); exit; }

// админ-проверка
if (empty($_SESSION['admin'])) { http_response_code(403); echo json_encode(['error'=>'forbidden']); exit; }

// входные данные
$service_id = (int)($_POST['service_id'] ?? 0);
if ($service_id <= 0 || empty($_FILES['model'])) { http_response_code(400); echo json_encode(['error'=>'bad_request']); exit; }

// валидация типа
$ext = strtolower(pathinfo($_FILES['model']['name'] ?? '', PATHINFO_EXTENSION));
$allowed = ['glb','gltf','usdz'];
if (!in_array($ext, $allowed, true)) {
    http_response_code(415);
    echo json_encode(['error'=>'unsupported_media_type','allowed'=>$allowed]);
    exit;
}

// папка загрузки
$dir = realpath(__DIR__ . '/..') . '/uploads/models';
if (!is_dir($dir)) { @mkdir($dir, 0775, true); }
if (!is_dir($dir)) { http_response_code(500); echo json_encode(['error'=>'mkdir_failed']); exit; }

// имя файла
$clean = preg_replace('~[^a-z0-9._-]+~i','_', $_FILES['model']['name']);
$fname = 's'.$service_id.'_'.time().'_'.$clean;
$dst   = $dir . '/' . $fname;

// перенос
if (!is_uploaded_file($_FILES['model']['tmp_name']) || !move_uploaded_file($_FILES['model']['tmp_name'], $dst)) {
    http_response_code(500);
    echo json_encode(['error'=>'move_failed']);
    exit;
}

// публичный путь (от корня сайта)
$public = '/uploads/models/' . $fname;

// запись в БД
try {
    $db = get_db();
    $st = $db->prepare('UPDATE services SET model_path = ? WHERE id = ?');
    $st->execute([$public, $service_id]);
} catch (Throwable $e) {
    // если не записали в БД — удалим файл, чтобы не оставлять мусор
    @unlink($dst);
    http_response_code(500);
    echo json_encode(['error'=>'db_error']);
    exit;
}

// ок
http_response_code(201);
echo json_encode(['ok'=>true, 'model_path'=>$public]);
