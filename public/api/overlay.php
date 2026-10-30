<?php
/**
 * Public read for OBS overlays. OBS can't log in, so each account has a secret overlay key.
 * GET ?key=<overlay_key>&sport=cricket|football[&since=ms]
 */
require_once __DIR__ . '/_lib.php';

require_method('GET');
$key = (string) ($_GET['key'] ?? '');
$sport = (string) ($_GET['sport'] ?? '');
if (!preg_match('/^[a-f0-9]{32}$/', $key)) fail('Invalid overlay key', 404);
if (!in_array($sport, ['cricket', 'football'], true)) fail('sport must be cricket or football');

$pdo = db();
$q = $pdo->prepare('SELECT id, role, plan_expires_at FROM users WHERE overlay_key = ?');
$q->execute([$key]);
$owner = $q->fetch();
if (!$owner) fail('Invalid overlay key', 404);
if (!has_active_subscription($owner)) out(['ok' => false, 'error' => 'subscription_expired'], 402);

$q = $pdo->prepare('SELECT data, updated_at FROM user_state WHERE user_id = ? AND sport = ?');
$q->execute([$owner['id'], $sport]);
$row = $q->fetch();
if (!$row) out(['ok' => true, 'data' => null, 'updatedAt' => 0]);

$since = isset($_GET['since']) ? (int) $_GET['since'] : 0;
if ($since > 0 && (int) $row['updated_at'] <= $since) {
    http_response_code(204);
    exit;
}
http_response_code(200);
echo '{"ok":true,"updatedAt":' . (int) $row['updated_at'] . ',"data":' . $row['data'] . '}';
