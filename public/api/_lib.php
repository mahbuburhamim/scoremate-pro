<?php
/**
 * IconicScorer API core: config, database, schema, sessions, helpers.
 * Files starting with "_" are blocked from direct web access by .htaccess.
 */

if (defined('ICONIC_LIB')) return;
define('ICONIC_LIB', 1);

const SCHEMA_VERSION = 2;
const SESSION_COOKIE = 'is_session';
const SESSION_DAYS = 30;

// A request must never hang: stuck PHP workers block the whole hosting account
@set_time_limit(15);

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
    // Try the configured host, then the other local form (socket vs TCP), each with a short timeout
    $hosts = array_values(array_unique([$host, $host === 'localhost' ? '127.0.0.1' : 'localhost']));
    $lastError = '';
    foreach ($hosts as $h) {
        try {
            $pdo = new PDO(
                "mysql:host={$h};dbname={$c['DB_NAME']};charset=utf8mb4",
                $c['DB_USER'],
                $c['DB_PASS'] ?? '',
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_TIMEOUT => 4,
                ]
            );
            break;
        } catch (Throwable $e) {
            $pdo = null;
            $lastError = $e->getMessage();
        }
    }
    if (!$pdo) {
        error_log('IconicScorer DB connect failed: ' . $lastError);
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

    $pdo->exec("CREATE TABLE IF NOT EXISTS password_resets (
        token_hash CHAR(64) PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        created_at BIGINT NOT NULL,
        expires_at BIGINT NOT NULL,
        used_at BIGINT NULL,
        INDEX idx_resets_user (user_id),
        INDEX idx_resets_created (created_at)
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

/** Public site address used in emails and links */
function app_url(): string {
    $u = trim((string) (config()['APP_URL'] ?? ''));
    if ($u !== '') return rtrim($u, '/');
    $host = preg_replace('/[^a-z0-9.\-:]/i', '', $_SERVER['HTTP_HOST'] ?? 'iconicscorer.com');
    return (is_https() ? 'https://' : 'http://') . $host;
}

function google_client_id(): string {
    return trim((string) (config()['GOOGLE_CLIENT_ID'] ?? ''));
}

function email_enabled(): bool {
    $c = config();
    return !empty($c['SMTP_HOST']) && !empty($c['SMTP_USER']) && !empty($c['SMTP_PASS']);
}

/** Creates a one-time password reset link (stores only a hash of the token). */
function create_reset_link(int $userId, int $validMinutes): string {
    $token = bin2hex(random_bytes(32));
    $now = now_ms();
    db()->prepare('INSERT INTO password_resets (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)')
        ->execute([hash('sha256', $token), $userId, $now, $now + $validMinutes * 60000]);
    return app_url() . '/reset-password?token=' . $token;
}

/**
 * Minimal SMTP sender (SSL on 465, STARTTLS on 587, or plain for local tests).
 * Returns true on success; logs the reason on failure. No external libraries needed.
 */
function smtp_send(string $to, string $subject, string $text, string $html): bool {
    $c = config();
    $host = (string) ($c['SMTP_HOST'] ?? '');
    $port = (int) ($c['SMTP_PORT'] ?? 465);
    $secure = strtolower((string) ($c['SMTP_SECURE'] ?? ($port === 465 ? 'ssl' : 'tls')));
    $user = (string) ($c['SMTP_USER'] ?? '');
    $pass = (string) ($c['SMTP_PASS'] ?? '');
    $from = (string) ($c['MAIL_FROM'] ?? $user);
    $fromName = (string) ($c['MAIL_FROM_NAME'] ?? 'IconicScorer');
    if ($host === '' || $user === '' || $pass === '') return false;

    $remote = ($secure === 'ssl' ? 'ssl://' : 'tcp://') . $host . ':' . $port;
    $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'SNI_enabled' => true, 'peer_name' => $host]]);
    $fp = @stream_socket_client($remote, $errno, $errstr, 8, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) {
        error_log("IconicScorer SMTP connect failed: $errstr ($errno)");
        return false;
    }
    stream_set_timeout($fp, 10);

    $read = function () use ($fp): string {
        $data = '';
        while (($line = fgets($fp, 515)) !== false) {
            $data .= $line;
            if (strlen($line) < 4 || $line[3] === ' ') break;
        }
        return $data;
    };
    $cmd = function (string $line, array $okCodes) use ($fp, $read): bool {
        if ($line !== '') fwrite($fp, $line . "\r\n");
        $resp = $read();
        $code = (int) substr($resp, 0, 3);
        if (!in_array($code, $okCodes, true)) {
            error_log('IconicScorer SMTP unexpected reply to ' . strtok($line, ' ') . ': ' . trim($resp));
            return false;
        }
        return true;
    };

    $ehloHost = preg_replace('/[^a-z0-9.\-]/i', '', parse_url(app_url(), PHP_URL_HOST) ?: 'localhost');
    $ok = $cmd('', [220]) && $cmd("EHLO $ehloHost", [250]);
    if ($ok && $secure === 'tls') {
        $ok = $cmd('STARTTLS', [220])
            && @stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)
            && $cmd("EHLO $ehloHost", [250]);
    }
    $ok = $ok
        && $cmd('AUTH LOGIN', [334])
        && $cmd(base64_encode($user), [334])
        && $cmd(base64_encode($pass), [235])
        && $cmd('MAIL FROM:<' . $from . '>', [250])
        && $cmd('RCPT TO:<' . $to . '>', [250, 251])
        && $cmd('DATA', [354]);
    if (!$ok) {
        fclose($fp);
        return false;
    }

    $boundary = 'b' . bin2hex(random_bytes(8));
    $encodedName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $headers = [
        'Date: ' . date('r'),
        'From: ' . $encodedName . ' <' . $from . '>',
        'To: <' . $to . '>',
        'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
        'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . $ehloHost . '>',
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];
    $body = '--' . $boundary . "\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($text)) . '--' . $boundary . "\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($html)) . '--' . $boundary . "--\r\n";
    fwrite($fp, implode("\r\n", $headers) . "\r\n\r\n" . $body . "\r\n.\r\n");
    $sent = $cmd('', [250]);
    $cmd('QUIT', [221]);
    fclose($fp);
    return $sent;
}
