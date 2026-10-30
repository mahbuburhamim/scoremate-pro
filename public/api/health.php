<?php
/** Deployment check. Reveals only yes/no flags, never config values. */
require_once __DIR__ . '/_lib.php';

$c = config();
$result = [
    'ok' => true,
    'php' => PHP_VERSION,
    'configured' => !empty($c['DB_NAME']) && !empty($c['DB_USER']),
    'adminConfigured' => count(admin_emails()) > 0,
    'database' => false,
];
if ($result['configured']) {
    try {
        $n = db()->query('SELECT COUNT(*) FROM users')->fetchColumn();
        $result['database'] = true;
        $result['schema'] = SCHEMA_VERSION;
        $result['hasUsers'] = ((int) $n) > 0;
    } catch (Throwable $e) {
        $result['ok'] = false;
    }
    $result['ms'] = (int) round((microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']) * 1000);
}
out($result);
