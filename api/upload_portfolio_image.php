<?php
require __DIR__.'/db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>'method_not_allowed']); exit; }
session_start();
if (empty($_SESSION['admin'])) { http_response_code(403); echo json_encode(['error'=>'forbidden']); exit; }

$db = get_db();
$pid = (int)($_POST['portfolio_id'] ?? 0);
if ($pid < 1) { http_response_code(400); echo json_encode(['error'=>'bad_portfolio_id']); exit; }

if (empty($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400); echo json_encode(['error'=>'no_file']); exit;
}

$f = $_FILES['image'];
if ($f['size'] > 10*1024*1024) { http_response_code(413); echo json_encode(['error'=>'too_large']); exit; }
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($f['tmp_name']);
$allowed = ['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif'];
if (!isset($allowed[$mime])) { http_response_code(415); echo json_encode(['error'=>'bad_type']); exit; }

$ext = $allowed[$mime];
$baseDir = __DIR__ . '/../uploads/portfolio/' . $pid;
if (!is_dir($baseDir) && !mkdir($baseDir, 0755, true)) { http_response_code(500); echo json_encode(['error'=>'mkdir_failed']); exit; }

$fname = bin2hex(random_bytes(8)) . '.' . $ext;
$abs = $baseDir . '/' . $fname;
if (!move_uploaded_file($f['tmp_name'], $abs)) { http_response_code(500); echo json_encode(['error'=>'move_failed']); exit; }

$rel = '/uploads/portfolio/' . $pid . '/' . $fname;

$stmt = $db->prepare("UPDATE portfolio_items SET image_path=? WHERE id=?");
$stmt->execute([$rel, $pid]);

echo json_encode(['status'=>'ok','path'=>$rel]);
