<?php
/**
 * Manual bKash/Nagad payments.
 * POST {planId, method, sender, trxId} -> creates a pending request for admin review
 * GET                                  -> the user's own payment requests
 */
require_once __DIR__ . '/_lib.php';

$method = require_method('GET', 'POST');
$u = require_user();
$pdo = db();

if ($method === 'GET') {
    $q = $pdo->prepare(
        'SELECT id, plan_id, plan_name, amount, method, trx_id, status, note, created_at, reviewed_at
         FROM payments WHERE user_id = ? ORDER BY id DESC LIMIT 20'
    );
    $q->execute([$u['id']]);
    out(['ok' => true, 'payments' => $q->fetchAll()]);
}

$in = body();
$planId = (string) ($in['planId'] ?? '');
$plans = plans();
if (!isset($plans[$planId])) fail('Unknown plan');
$pm = (string) ($in['method'] ?? '');
if (!in_array($pm, ['bkash', 'nagad'], true)) fail('Payment method must be bkash or nagad');
$trx = strtoupper(preg_replace('/\s+/', '', clean_str($in['trxId'] ?? '', 64)));
if (!preg_match('/^[A-Z0-9]{6,30}$/', $trx)) fail('সঠিক TrxID দিন (Transaction ID)');
$sender = clean_str($in['sender'] ?? '', 40);

// Limit open requests so the queue can't be flooded
$q = $pdo->prepare("SELECT COUNT(*) FROM payments WHERE user_id = ? AND status = 'pending'");
$q->execute([$u['id']]);
if ((int) $q->fetchColumn() >= 3) fail('আপনার ৩টি payment যাচাইয়ের অপেক্ষায় আছে। Approve হওয়া পর্যন্ত অপেক্ষা করুন।', 429);

try {
    $pdo->prepare(
        'INSERT INTO payments (user_id, plan_id, plan_name, amount, method, sender, trx_id, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, \'pending\', ?)'
    )->execute([
        $u['id'], $planId, $plans[$planId]['name'], $plans[$planId]['price'], $pm,
        $sender !== '' ? $sender : null, $trx, now_ms(),
    ]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') fail('এই TrxID আগেই জমা দেওয়া হয়েছে', 409);
    throw $e;
}
out(['ok' => true, 'status' => 'pending']);
