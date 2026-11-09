<?php
    // Connection settings. Defaults suit a local MySQL Server on the standard port 3306.
    // Override without editing this file, e.g.:  DB_PASS=secret php -S localhost:8000 router.php
    $host     = getenv('DB_HOST') ?: '127.0.0.1';
    $port     = getenv('DB_PORT') ?: '3306';
    $dbname   = getenv('DB_NAME') ?: 'Eurovision2025CrudApp';
    $username = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '';

    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";

    try {
        $db = new PDO($dsn, $username, $password);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        header('Content-Type: application/json', true, 500);
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
        exit();
    }
?>