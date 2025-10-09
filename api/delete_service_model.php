<?php
// api/delete_service_model.php
require __DIR__.'/db.php';
header('Content-Type: application/json');
session_start();

if (empty($_SESSION['admin'])) { http_response_code(403); echo json_encode(['error'=>'forbidden']); exit; }

$service_id = (int)($_GET['service_id'] ?? 0);
if ($service_id <= 0) { http_response_code(400); echo json_encode(['error'=>'bad_id']); exit; }

$db = get_db();

// узнаём текущий путь, чтобы удалить файл
$st = $db->prepare('SELECT model_path FROM services WHERE id = ?');
$st->execute([$service_id]);
$row = $st->fetch();

$upd = $db->prepare('UPDATE services SET model_path = NULL WHERE id = ?');
$upd->execute([$service_id]);

if ($row && !empty($row['model_path'])) {
    $fs = $_SERVER['DOCUMENT_ROOT'] . '/' . ltrim($row['model_path'], '/');
    if (is_file($fs)) @unlink($fs);
}

echo json_encode(['status'=>'ok']);
