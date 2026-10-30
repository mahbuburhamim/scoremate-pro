<?php
/**
 * Accounts: POST {action: signup|login|logout}, GET ?action=me
 */
require_once __DIR__ . '/_lib.php';

$method = require_method('GET', 'POST');
$action = $method === 'GET' ? ($_GET['action'] ?? 'me') : (body()['action'] ?? '');

if ($action === 'me') {
    $u = current_user();
    out(['ok' => true, 'user' => $u ? user_payload($u) : null]);
}

if ($action === 'logout') {
    $token = $_COOKIE[SESSION_COOKIE] ?? '';
    if (is_string($token) && $token !== '') {
        db()->prepare('DELETE FROM sessions WHERE token_hash = ?')->execute([hash('sha256', $token)]);
    }
    clear_session_cookie();
    out(['ok' => true]);
}

$in = body();
$email = strtolower(clean_str($in['email'] ?? '', 190));
$password = (string) ($in['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail('সঠিক ইমেইল দিন (Valid email required)');

// Brute-force guard: max 10 failed logins per email and 40 per IP in 15 minutes
function too_many_attempts(string $email): bool {
    $since = now_ms() - 15 * 60 * 1000;
    $pdo = db();
    $q = $pdo->prepare('SELECT COUNT(*) FROM login_attempts WHERE email = ? AND created_at > ?');
    $q->execute([$email, $since]);
    if ((int) $q->fetchColumn() >= 10) return true;
    $q = $pdo->prepare('SELECT COUNT(*) FROM login_attempts WHERE ip = ? AND created_at > ?');
    $q->execute([client_ip(), $since]);
    return (int) $q->fetchColumn() >= 40;
}

function record_failed(string $email): void {
    db()->prepare('INSERT INTO login_attempts (ip, email, created_at) VALUES (?, ?, ?)')
        ->execute([client_ip(), $email, now_ms()]);
    // Housekeeping: drop entries older than a day
    if (random_int(1, 50) === 1) {
        db()->prepare('DELETE FROM login_attempts WHERE created_at < ?')->execute([now_ms() - 86400000]);
    }
}

if ($action === 'signup') {
    $name = clean_str($in['name'] ?? '', 120);
    $phone = clean_str($in['phone'] ?? '', 40);
    if ($name === '') fail('নাম দিন (Name required)');
    if (strlen($password) < 8) fail('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে (Password must be at least 8 characters)');
    if (strlen($password) > 200) fail('Password too long');
    if (too_many_attempts($email)) fail('অনেকবার চেষ্টা হয়েছে, ১৫ মিনিট পরে আবার চেষ্টা করুন', 429);

    $pdo = db();
    $exists = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $exists->execute([$email]);
    if ($exists->fetch()) {
        record_failed($email);
        fail('এই ইমেইল দিয়ে আগেই account খোলা আছে। Login করুন।', 409);
    }

    $role = in_array($email, admin_emails(), true) ? 'admin' : 'user';
    $stmt = $pdo->prepare(
        'INSERT INTO users (public_id, name, email, phone, password_hash, role, overlay_key, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        random_id('usr_', 10),
        $name,
        $email,
        $phone !== '' ? $phone : null,
        password_hash($password, PASSWORD_DEFAULT),
        $role,
        bin2hex(random_bytes(16)),
        now_ms(),
    ]);
    $id = (int) $pdo->lastInsertId();
    create_session($id);
    $u = $pdo->prepare('SELECT * FROM users WHERE id = ?');
    $u->execute([$id]);
    out(['ok' => true, 'user' => user_payload($u->fetch())]);
}

if ($action === 'login') {
    if (too_many_attempts($email)) fail('অনেকবার ভুল হয়েছে, ১৫ মিনিট পরে আবার চেষ্টা করুন', 429);
    $q = db()->prepare('SELECT * FROM users WHERE email = ?');
    $q->execute([$email]);
    $u = $q->fetch();
    // Same message for unknown email and wrong password, so emails can't be probed
    if (!$u || empty($u['password_hash']) || !password_verify($password, $u['password_hash'])) {
        record_failed($email);
        fail('ইমেইল বা পাসওয়ার্ড ভুল (Wrong email or password)', 401);
    }
    if (password_needs_rehash($u['password_hash'], PASSWORD_DEFAULT)) {
        db()->prepare('UPDATE users SET password_hash = ? WHERE id = ?')
            ->execute([password_hash($password, PASSWORD_DEFAULT), $u['id']]);
    }
    // Promote configured admin emails on login too
    if (!is_admin($u) && in_array($email, admin_emails(), true)) {
        db()->prepare("UPDATE users SET role = 'admin' WHERE id = ?")->execute([$u['id']]);
        $u['role'] = 'admin';
    }
    create_session((int) $u['id']);
    out(['ok' => true, 'user' => user_payload($u)]);
}

fail('Unknown action');
