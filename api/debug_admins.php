<?php
require __DIR__.'/db.php';
header('Content-Type: application/json; charset=utf-8');
try {
  $db = get_db();
  $rows = $db->query("SELECT id, username, LEFT(password_hash, 10) AS hash_preview, created_at FROM admins ORDER BY id")->fetchAll();
  echo json_encode([
    'ok' => true,
    'count' => count($rows),
    'rows' => $rows
  ], JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['ok'=>false, 'error'=>$e->getMessage()]);
}
