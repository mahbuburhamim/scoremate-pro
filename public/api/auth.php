<?php
/**
 * Accounts:
 *   GET  ?action=me | ?action=config
 *   POST {action: signup|login|logout}
 *   POST {action: forgot, email}            -> emails a reset link (same reply whether or not the account exists)
 *   POST {action: reset, token, password}   -> sets a new password, logs out other devices, logs in
 *   POST {action: google, credential}       -> Sign in with Google (ID token verified on the server)
 */
require_once __DIR__ . '/_lib.php';

$method = require_method('GET', 'POST');
$action = $method === 'GET' ? ($_GET['action'] ?? 'me') : (body()['action'] ?? '');

if ($action === 'me') {
    $u = current_user();
    out(['ok' => true, 'user' => $u ? user_payload($u) : null]);
}

if ($action === 'config') {
    out([
        'ok' => true,
        'googleClientId' => google_client_id() ?: null,
        'emailEnabled' => email_enabled(),
    ]);
}

if ($action === 'reset') {
    $in = body();
    $token = (string) ($in['token'] ?? '');
    $password = (string) ($in['password'] ?? '');
    if (!preg_match('/^[a-f0-9]{64}$/', $token)) fail('লিংকটি সঠিক নয় (Invalid link)', 400);
    if (strlen($password) < 8) fail('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে (Password must be at least 8 characters)');
    if (strlen($password) > 200) fail('Password too long');
    $pdo = db();
    $pdo->beginTransaction();
    $q = $pdo->prepare('SELECT * FROM password_resets WHERE token_hash = ? FOR UPDATE');
    $q->execute([hash('sha256', $token)]);
    $r = $q->fetch();
    if (!$r || $r['used_at'] !== null || (int) $r['expires_at'] < now_ms()) {
        $pdo->rollBack();
        fail('লিংকটির মেয়াদ শেষ বা আগেই ব্যবহার হয়েছে। নতুন লিংক নিন। (Link expired or already used)', 410);
    }
    $uid = (int) $r['user_id'];
    $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([password_hash($password, PASSWORD_DEFAULT), $uid]);
    $pdo->prepare('UPDATE password_resets SET used_at = ? WHERE user_id = ? AND used_at IS NULL')->execute([now_ms(), $uid]);
    // Anyone who was logged in with the old password is signed out everywhere
    $pdo->prepare('DELETE FROM sessions WHERE user_id = ?')->execute([$uid]);
    $pdo->commit();
    create_session($uid);
    $u = $pdo->prepare('SELECT * FROM users WHERE id = ?');
    $u->execute([$uid]);
    out(['ok' => true, 'user' => user_payload($u->fetch())]);
}

if ($action === 'google') {
    $clientId = google_client_id();
    if ($clientId === '') fail('Google login is not set up yet', 503);
    $credential = (string) (body()['credential'] ?? '');
    if ($credential === '' || strlen($credential) > 4096) fail('Invalid Google response');
    $claims = verify_google_id_token($credential, $clientId);
    if (!$claims) fail('Google login যাচাই করা যায়নি, আবার চেষ্টা করুন (Google verification failed)', 401);

    $sub = (string) $claims['sub'];
    $gEmail = strtolower((string) $claims['email']);
    $pdo = db();
    $q = $pdo->prepare('SELECT * FROM users WHERE google_sub = ?');
    $q->execute([$sub]);
    $u = $q->fetch();
    if (!$u) {
        // Same verified email as an existing account: link Google to it
        $q = $pdo->prepare('SELECT * FROM users WHERE email = ?');
        $q->execute([$gEmail]);
        $u = $q->fetch();
        if ($u) {
            $pdo->prepare('UPDATE users SET google_sub = ? WHERE id = ?')->execute([$sub, $u['id']]);
        } else {
            $name = clean_str($claims['name'] ?? '', 120);
            if ($name === '') $name = explode('@', $gEmail)[0];
            $role = in_array($gEmail, admin_emails(), true) ? 'admin' : 'user';
            $pdo->prepare(
                'INSERT INTO users (public_id, name, email, phone, password_hash, google_sub, role, overlay_key, created_at)
                 VALUES (?, ?, ?, NULL, NULL, ?, ?, ?, ?)'
            )->execute([random_id('usr_', 10), $name, $gEmail, $sub, $role, bin2hex(random_bytes(16)), now_ms()]);
            $q = $pdo->prepare('SELECT * FROM users WHERE id = ?');
            $q->execute([(int) $pdo->lastInsertId()]);
            $u = $q->fetch();
        }
    }
    if (!is_admin($u) && in_array(strtolower($u['email']), admin_emails(), true)) {
        $pdo->prepare("UPDATE users SET role = 'admin' WHERE id = ?")->execute([$u['id']]);
        $u['role'] = 'admin';
    }
    create_session((int) $u['id']);
    out(['ok' => true, 'user' => user_payload($u)]);
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

if ($action === 'forgot') {
    if (!email_enabled()) fail('ইমেইল পাঠানো এখনো চালু হয়নি। Contact পেজে যোগাযোগ করুন।', 503);
    // Limit: 3 requests per email and 10 per IP per hour
    $pdo = db();
    $hourAgo = now_ms() - 3600000;
    $q = $pdo->prepare('SELECT COUNT(*) FROM password_resets r JOIN users u ON u.id = r.user_id WHERE u.email = ? AND r.created_at > ?');
    $q->execute([$email, $hourAgo]);
    $tooManyForEmail = (int) $q->fetchColumn() >= 3;
    $q = $pdo->prepare('SELECT COUNT(*) FROM login_attempts WHERE ip = ? AND email = ? AND created_at > ?');
    $q->execute([client_ip(), '#reset', $hourAgo]);
    if ((int) $q->fetchColumn() >= 10) fail('অনেকবার চেষ্টা হয়েছে, ১ ঘণ্টা পরে আবার চেষ্টা করুন', 429);
    $pdo->prepare('INSERT INTO login_attempts (ip, email, created_at) VALUES (?, ?, ?)')->execute([client_ip(), '#reset', now_ms()]);

    $q = $pdo->prepare('SELECT id, name, email FROM users WHERE email = ?');
    $q->execute([$email]);
    $u = $q->fetch();
    if ($u && !$tooManyForEmail) {
        $link = create_reset_link((int) $u['id'], 30);
        $name = htmlspecialchars($u['name'], ENT_QUOTES, 'UTF-8');
        $safeLink = htmlspecialchars($link, ENT_QUOTES, 'UTF-8');
        $text = "Hi {$u['name']},\n\nIconicScorer এর পাসওয়ার্ড নতুন করে সেট করতে এই লিংকে যান (৩০ মিনিটের মধ্যে):\n$link\n\nআপনি এটা না চাইলে এই ইমেইল উপেক্ষা করুন, আপনার পাসওয়ার্ড বদলাবে না।\n\n— IconicScorer";
        $html = "<div style=\"font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#0f172a\">"
            . "<h2 style=\"color:#2563eb;margin:0 0 12px\">IconicScorer</h2>"
            . "<p>Hi {$name},</p>"
            . "<p>আপনার পাসওয়ার্ড নতুন করে সেট করতে নিচের বাটনে ক্লিক করুন। লিংকটি <b>৩০ মিনিট</b> কাজ করবে।</p>"
            . "<p style=\"margin:24px 0\"><a href=\"{$safeLink}\" style=\"background:#2563eb;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:bold\">Reset Password</a></p>"
            . "<p style=\"font-size:12px;color:#64748b\">বাটন কাজ না করলে এই লিংকটি কপি করুন:<br>{$safeLink}</p>"
            . "<p style=\"font-size:12px;color:#64748b\">আপনি এটা না চাইলে এই ইমেইল উপেক্ষা করুন, আপনার পাসওয়ার্ড বদলাবে না।</p></div>";
        if (!smtp_send($u['email'], 'IconicScorer: পাসওয়ার্ড রিসেট', $text, $html)) {
            fail('ইমেইল পাঠানো যায়নি, কিছুক্ষণ পরে আবার চেষ্টা করুন', 502);
        }
    }
    // Same answer whether or not the account exists, so emails can't be probed
    out(['ok' => true]);
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

/**
 * Verifies a Google ID token with Google's tokeninfo endpoint (which checks the signature and expiry),
 * then checks it was issued for this site and the email is verified.
 */
function verify_google_id_token(string $idToken, string $clientId): ?array {
    $url = (string) (config()['GOOGLE_TOKENINFO_URL'] ?? 'https://oauth2.googleapis.com/tokeninfo');
    $ch = curl_init($url . '?id_token=' . urlencode($idToken));
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8, CURLOPT_CONNECTTIMEOUT => 5]);
    $resp = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($resp === false || $code !== 200) {
        error_log('IconicScorer Google tokeninfo failed: HTTP ' . $code);
        return null;
    }
    $c = json_decode($resp, true);
    if (!is_array($c)) return null;
    $issOk = in_array($c['iss'] ?? '', ['accounts.google.com', 'https://accounts.google.com'], true);
    $audOk = hash_equals($clientId, (string) ($c['aud'] ?? ''));
    $expOk = (int) ($c['exp'] ?? 0) > time();
    $verified = ($c['email_verified'] ?? '') === 'true' || ($c['email_verified'] ?? false) === true;
    if (!$issOk || !$audOk || !$expOk || !$verified || empty($c['sub']) || empty($c['email'])) return null;
    return $c;
}
