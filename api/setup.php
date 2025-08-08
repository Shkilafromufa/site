<?php
require __DIR__.'/db.php';
$db = get_db();

$db->exec("CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    features TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

$db->exec("CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

# Seed default admin if table empty
$count = (int)$db->query("SELECT COUNT(*) AS c FROM admins")->fetch()['c'];
if ($count === 0) {
    $defaultUser = 'admin';
    $defaultPass = 'change-me-now';
    $hash = password_hash($defaultPass, PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)");
    $stmt->execute([$defaultUser, $hash]);
    echo "Created default admin: login 'admin', password 'change-me-now'\n";
}

echo "Tables created/updated\n";
