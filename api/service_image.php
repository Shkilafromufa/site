<?php
require __DIR__.'/db.php';
header('Content-Type: application/json');
session_start();

if (empty($_SESSION['admin'])) { http_response_code(403); echo json_encode(['error'=>'forbidden']); exit; }

$db = get_db();
$id = (int)($_GET['id'] ?? 0);
if (!$id) { http_response_code(400); echo json_encode(['error'=>'bad_id']); exit; }

// получим путь, чтобы при необходимости удалить файл с диска
$st = $db->prepare('SELECT path FROM service_images WHERE id = ?');
$st->execute([$id]);
$row = $st->fetch();

$del = $db->prepare('DELETE FROM service_images WHERE id = ?');
$del->execute([$id]);

// опционально физическое удаление
if ($row && isset($row['path'])) {
    $fs = $_SERVER['DOCUMENT_ROOT'] . '/' . ltrim($row['path'], '/');
    if (is_file($fs)) @unlink($fs);
}

echo json_encode(['status'=>'ok']);
