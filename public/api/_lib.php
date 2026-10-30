<?php
/**
 * IconicScorer API core: config, database, schema, sessions, helpers.
 * Files starting with "_" are blocked from direct web access by .htaccess.
 */

if (defined('ICONIC_LIB')) return;
define('ICONIC_LIB', 1);

const SCHEMA_VERSION = 1;
const SESSION_COOKIE = 'is_session';
const SESSION_DAYS = 30;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');

// Subscription plans (must match SUBSCRIPTION_PLANS in src/context/AuthContext.tsx)
function plans(): array {
    return [
        '1-day'      => ['name' => '1 Day', 'days' => 1, 'price' => 99, 'tickets' => 1],
        '2-day'      => ['name' => '2 Day', 'days' => 2, 'price' => 190, 'tickets' => 1],
        '3-day'      => ['name' => '3 Day', 'days' => 3, 'price' => 280, 'tickets' => 1],
        '4-day'      => ['name' => '4 Day', 'days' => 4, 'price' => 360, 'tickets' => 1],
        '4-day-v2'   => ['name' => '4 Day v2', 'days' => 4, 'price' => 390, 'tickets' => 2],
        '5-day'      => ['name' => '5 Day', 'days' => 5, 'price' => 450, 'tickets' => 2],
        'weekly-v1'  => ['name' => 'Weekly (7 Day) v1', 'days' => 7, 'price' => 600, 'tickets' => 2],
        'weekly-v2'  => ['name' => 'Weekly (7 Day) v2', 'days' => 7, 'price' => 750, 'tickets' => 3],
        '10-days'    => ['name' => '10 Days', 'days' => 10, 'price' => 950, 'tickets' => 4],
        '15-days'    => ['name' => '15 Days', 'days' => 15, 'price' => 1350, 'tickets' => 7],
        'monthly-v1' => ['name' => 'Monthly (30 Day) v1', 'days' => 30, 'price' => 2500, 'tickets' => 15],
        'monthly-v2' => ['name' => 'Monthly (30 Day) v2', 'days' => 30, 'price' => 3000, 'tickets' => 20],
        '3-months'   => ['name' => '3 Months (90 Day)', 'days' => 90, 'price' => 4500, 'tickets' => 45],
        '6-months'   => ['name' => '6 Months (180 Day)', 'days' => 180, 'price' => 6000, 'tickets' => 90],
        'yearly-v1'  => ['name' => 'Yearly (365 Day) v1', 'days' => 365, 'price' => 8000, 'tickets' => 125],
        'yearly-v2'  => ['name' => 'Yearly (365 Day) v2', 'days' => 365, 'price' => 9500, 'tickets' => 150],
    ];
}

function now_ms(): int {
    return (int) round(microtime(true) * 1000);
}

function out($data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(string $error, int $code = 400): void {
    out(['ok' => false, 'error' => $error], $code);
}

function config(): array {
    static $cfg = null;
    if ($cfg !== null) return $cfg;
    $file = __DIR__ . '/_config.php';
    $cfg = is_file($file) ? (require $file) : [];
    if (!is_array($cfg)) $cfg = [];
    return $cfg;
}

function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $c = config();
    if (empty($c['DB_NAME']) || empty($c['DB_USER'])) {
        fail('Server is not configured', 503);
    }
    $host = $c['DB_HOST'] ?? 'localhost';
    try {
        $pdo = new PDO(
            "mysql:host={$host};dbname={$c['DB_NAME']};charset=utf8mb4",
            $c['DB_USER'],
            $c['DB_PASS'] ?? '',
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    } catch (Throwable $e) {
        error_log('IconicScorer DB connect failed: ' . $e->getMessage());
        fail('Database unavailable', 503);
    }
    migrate($pdo);
    return $pdo;
}

function migrate(PDO $pdo): void {
    // Flag file is wiped on every deploy, so migrations re-run once per deploy (all idempotent).
    $flag = __DIR__ . '/.schema_v' . SCHEMA_VERSION;
    if (is_file($flag)) return;

    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        public_id VARCHAR(32) NOT NULL UNIQUE,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(190) NOT NULL UNIQUE,
        phone VARCHAR(40) NULL,
        password_hash VARCHAR(255) NULL,
        google_sub VARCHAR(64) NULL UNIQUE,
        role VARCHAR(16) NOT NULL DEFAULT 'user',
        plan_id VARCHAR(40) NULL,
        plan_name VARCHAR(80) NULL,
        plan_expires_at BIGINT NULL,
        tickets_remaining INT NOT NULL DEFAULT 0,
        overlay_key VARCHAR(40) NOT NULL UNIQUE,
        created_at BIGINT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS sessions (
        token_hash CHAR(64) PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        created_at BIGINT NOT NULL,
        expires_at BIGINT NOT NULL,
        INDEX idx_sessions_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS user_state (
        user_id INT UNSIGNED NOT NULL,
        sport VARCHAR(16) NOT NULL,
        data LONGTEXT NOT NULL,
        updated_at BIGINT NOT NULL,
        PRIMARY KEY (user_id, sport)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS payments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        plan_id VARCHAR(40) NOT NULL,
        plan_name VARCHAR(80) NOT NULL,
        amount INT NOT NULL,
        method VARCHAR(16) NOT NULL,
        sender VARCHAR(40) NULL,
        trx_id VARCHAR(64) NOT NULL UNIQUE,
        status VARCHAR(16) NOT NULL DEFAULT 'pending',
        note VARCHAR(255) NULL,
        created_at BIGINT NOT NULL,
        reviewed_at BIGINT NULL,
        INDEX idx_payments_status (status),
        INDEX idx_payments_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS login_attempts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        ip VARCHAR(64) NOT NULL,
        email VARCHAR(190) NOT NULL,
        created_at BIGINT NOT NULL,
        INDEX idx_attempts_email (email, created_at),
        INDEX idx_attempts_ip (ip, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    @file_put_contents($flag, (string) time());
}

function body(): array {
    static $cache = null;
    if ($cache !== null) return $cache;
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') return $cache = [];
    if (strlen($raw) > 8 * 1024 * 1024) fail('Payload too large', 413);
    $data = json_decode($raw, true);
    if (!is_array($data)) fail('Invalid JSON');
    return $cache = $data;
}

function require_method(string ...$methods): string {
    $m = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($m, $methods, true)) fail('Method not allowed', 405);
    // State-changing requests must be JSON: browsers can't send that cross-site without a CORS preflight,
    // which we never allow, so this blocks CSRF together with the SameSite cookie.
    if ($m === 'POST') {
        $ct = $_SERVER['CONTENT_TYPE'] ?? '';
        if (stripos($ct, 'application/json') !== 0) fail('Content-Type must be application/json', 415);
    }
    return $m;
}

function client_ip(): string {
    return substr($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0', 0, 64);
}

function random_id(string $prefix, int $bytes = 12): string {
    return $prefix . bin2hex(random_bytes($bytes));
}

function is_https(): bool {
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') return true;
    return strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
}

function set_session_cookie(string $token, int $expiresMs): void {
    setcookie(SESSION_COOKIE, $token, [
        'expires' => (int) floor($expiresMs / 1000),
        'path' => '/',
        'secure' => is_https(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

function clear_session_cookie(): void {
    setcookie(SESSION_COOKIE, '', [
        'expires' => time() - 3600,
        'path' => '/',
        'secure' => is_https(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

function create_session(int $userId): void {
    $token = bin2hex(random_bytes(32));
    $now = now_ms();
    $expires = $now + SESSION_DAYS * 86400 * 1000;
    $stmt = db()->prepare('INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)');
    $stmt->execute([hash('sha256', $token), $userId, $now, $expires]);
    set_session_cookie($token, $expires);
}

function current_user(): ?array {
    static $cached = false;
    if ($cached !== false) return $cached;
    $token = $_COOKIE[SESSION_COOKIE] ?? '';
    if (!is_string($token) || !preg_match('/^[a-f0-9]{64}$/', $token)) {
        return $cached = null;
    }
    $stmt = db()->prepare(
        'SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?'
    );
    $stmt->execute([hash('sha256', $token), now_ms()]);
    $row = $stmt->fetch();
    return $cached = ($row ?: null);
}

function require_user(): array {
    $u = current_user();
    if (!$u) fail('Not logged in', 401);
    return $u;
}

function is_admin(array $u): bool {
    return ($u['role'] ?? '') === 'admin';
}

function has_active_subscription(array $u): bool {
    if (is_admin($u)) return true;
    return !empty($u['plan_expires_at']) && (int) $u['plan_expires_at'] > now_ms();
}

function require_admin(): array {
    $u = require_user();
    if (!is_admin($u)) fail('Admin only', 403);
    return $u;
}

function admin_emails(): array {
    $raw = (string) (config()['ADMIN_EMAILS'] ?? '');
    $list = array_filter(array_map('trim', explode(',', strtolower($raw))));
    return array_values($list);
}

/** Shape sent to the frontend; mirrors the User interface in AuthContext.tsx. Never includes secrets. */
function user_payload(array $u): array {
    $exp = $u['plan_expires_at'] ? (int) $u['plan_expires_at'] : null;
    return [
        'id' => $u['public_id'],
        'name' => $u['name'],
        'email' => $u['email'],
        'phone' => $u['phone'],
        'role' => $u['role'],
        'planId' => $u['plan_id'],
        'planName' => $u['plan_name'],
        'planExpiryTimestamp' => $exp,
        'planExpiryDate' => $exp ? gmdate('M j, Y', (int) floor($exp / 1000)) : null,
        'ticketsRemaining' => (int) $u['tickets_remaining'],
        'hasActiveSubscription' => has_active_subscription($u),
        'overlayKey' => $u['overlay_key'],
        'memberSince' => gmdate('M Y', (int) floor(((int) $u['created_at']) / 1000)),
    ];
}

function clean_str($v, int $max): string {
    $s = trim((string) $v);
    if (function_exists('mb_substr')) return mb_substr($s, 0, $max);
    return substr($s, 0, $max);
}
