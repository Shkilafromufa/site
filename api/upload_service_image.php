<?php
require __DIR__.'/db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>'method_not_allowed']); exit; }

session_start();
if (empty($_SESSION['admin'])) { http_response_code(403); echo json_encode(['error'=>'forbidden']); exit; }

$db = get_db();

$service_id = (int)($_POST['service_id'] ?? 0);
if ($service_id < 1) { http_response_code(400); echo json_encode(['error'=>'bad_service_id']); exit; }

if (empty($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400); echo json_encode(['error'=>'no_file']); exit;
}

$f = $_FILES['image'];

/* валидация */
if ($f['size'] > 10 * 1024 * 1024) { // 10 MB
    http_response_code(413); echo json_encode(['error'=>'too_large']); exit;
}
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($f['tmp_name']);
$allowed = ['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif'];
if (!isset($allowed[$mime])) { http_response_code(415); echo json_encode(['error'=>'bad_type']); exit; }

$ext = $allowed[$mime];
$baseDir = __DIR__ . '/../uploads/services/' . $service_id;
if (!is_dir($baseDir) && !mkdir($baseDir, 0755, true)) {
    http_response_code(500); echo json_encode(['error'=>'mkdir_failed']); exit;
}

$fname = bin2hex(random_bytes(8)) . '.' . $ext;
$abs = $baseDir . '/' . $fname;
if (!move_uploaded_file($f['tmp_name'], $abs)) {
    http_response_code(500); echo json_encode(['error'=>'move_failed']); exit;
}

/* web-путь */
$rel = '/uploads/services/' . $service_id . '/' . $fname; // <-- ведущий слеш

/* сохранить запись */
$stmt = $db->prepare('INSERT INTO service_images (service_id, path, alt) VALUES (?,?,?)');
$stmt->execute([$service_id, $rel, isset($_POST['alt']) ? $_POST['alt'] : '']);

/* вернуть JSON с id новой картинки и путём */
echo json_encode(['status'=>'ok','path'=>$rel,'id'=>$db->lastInsertId()]);
