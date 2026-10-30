<?php
/**
 * The logged-in user's own scoreboard data.
 * GET  ?sport=cricket|football[&since=ms]  -> {ok, data, updatedAt} or 204 when unchanged
 * POST {sport, data}                       -> {ok, updatedAt}   (needs an active subscription)
 */
require_once __DIR__ . '/_lib.php';

$method = require_method('GET', 'POST');
$u = require_user();

$in = $method === 'POST' ? body() : [];
$sport = $method === 'POST' ? ($in['sport'] ?? '') : ($_GET['sport'] ?? '');
if (!in_array($sport, ['cricket', 'football'], true)) fail('sport must be cricket or football');

$pdo = db();

if ($method === 'GET') {
    $q = $pdo->prepare('SELECT data, updated_at FROM user_state WHERE user_id = ? AND sport = ?');
    $q->execute([$u['id'], $sport]);
    $row = $q->fetch();
    if (!$row) out(['ok' => true, 'data' => null, 'updatedAt' => 0]);
    $since = isset($_GET['since']) ? (int) $_GET['since'] : 0;
    if ($since > 0 && (int) $row['updated_at'] <= $since) {
        http_response_code(204);
        exit;
    }
    // data is already JSON text; splice it in without decoding to save CPU on every poll
    http_response_code(200);
    echo '{"ok":true,"updatedAt":' . (int) $row['updated_at'] . ',"data":' . $row['data'] . '}';
    exit;
}

if (!has_active_subscription($u)) fail('Active subscription required', 402);
if (!array_key_exists('data', $in) || !is_array($in['data'])) fail('data must be an object');

$json = json_encode($in['data'], JSON_UNESCAPED_UNICODE);
$ts = now_ms();
$stmt = $pdo->prepare(
    'INSERT INTO user_state (user_id, sport, data, updated_at) VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = VALUES(updated_at)'
);
$stmt->execute([$u['id'], $sport, $json, $ts]);
out(['ok' => true, 'updatedAt' => $ts]);
