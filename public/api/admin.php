<?php
/**
 * Admin only.
 * GET  ?view=payments[&status=pending|approved|rejected|all]
 * GET  ?view=users[&q=search]
 * POST {action: approve|reject, paymentId, note?}
 * POST {action: grant, email, planId}      (give a plan without a payment, e.g. a friend or refund fix)
 * POST {action: revoke, email}             (end someone's subscription now)
 */
require_once __DIR__ . '/_lib.php';

$method = require_method('GET', 'POST');
require_admin();
$pdo = db();

function extend_plan(PDO $pdo, int $userId, string $planId): void {
    $plan = plans()[$planId];
    $q = $pdo->prepare('SELECT plan_expires_at, tickets_remaining FROM users WHERE id = ? FOR UPDATE');
    $q->execute([$userId]);
    $cur = $q->fetch();
    if (!$cur) fail('User not found', 404);
    // Renewing early stacks on top of the remaining time
    $base = max(now_ms(), (int) ($cur['plan_expires_at'] ?? 0));
    $expires = $base + $plan['days'] * 86400 * 1000;
    $pdo->prepare('UPDATE users SET plan_id = ?, plan_name = ?, plan_expires_at = ?, tickets_remaining = tickets_remaining + ? WHERE id = ?')
        ->execute([$planId, $plan['name'], $expires, $plan['tickets'], $userId]);
}

if ($method === 'GET') {
    $view = $_GET['view'] ?? 'payments';
    if ($view === 'payments') {
        $status = $_GET['status'] ?? 'pending';
        $sql = 'SELECT p.*, u.name AS user_name, u.email AS user_email, u.phone AS user_phone
                FROM payments p JOIN users u ON u.id = p.user_id';
        $args = [];
        if ($status !== 'all') {
            $sql .= ' WHERE p.status = ?';
            $args[] = $status;
        }
        $sql .= ' ORDER BY p.id DESC LIMIT 200';
        $q = $pdo->prepare($sql);
        $q->execute($args);
        out(['ok' => true, 'payments' => $q->fetchAll()]);
    }
    if ($view === 'users') {
        $search = trim((string) ($_GET['q'] ?? ''));
        $sql = 'SELECT public_id, name, email, phone, role, plan_name, plan_expires_at, tickets_remaining, created_at FROM users';
        $args = [];
        if ($search !== '') {
            $sql .= ' WHERE email LIKE ? OR name LIKE ? OR phone LIKE ?';
            $like = '%' . $search . '%';
            $args = [$like, $like, $like];
        }
        $sql .= ' ORDER BY id DESC LIMIT 200';
        $q = $pdo->prepare($sql);
        $q->execute($args);
        out(['ok' => true, 'users' => $q->fetchAll(), 'now' => now_ms()]);
    }
    fail('Unknown view');
}

$in = body();
$action = $in['action'] ?? '';

if ($action === 'approve' || $action === 'reject') {
    $id = (int) ($in['paymentId'] ?? 0);
    $pdo->beginTransaction();
    $q = $pdo->prepare('SELECT * FROM payments WHERE id = ? FOR UPDATE');
    $q->execute([$id]);
    $p = $q->fetch();
    if (!$p) { $pdo->rollBack(); fail('Payment not found', 404); }
    if ($p['status'] !== 'pending') { $pdo->rollBack(); fail('Already ' . $p['status'], 409); }
    if ($action === 'approve') {
        if (!isset(plans()[$p['plan_id']])) { $pdo->rollBack(); fail('Unknown plan'); }
        extend_plan($pdo, (int) $p['user_id'], $p['plan_id']);
    }
    $pdo->prepare('UPDATE payments SET status = ?, note = ?, reviewed_at = ? WHERE id = ?')
        ->execute([$action === 'approve' ? 'approved' : 'rejected', clean_str($in['note'] ?? '', 255) ?: null, now_ms(), $id]);
    $pdo->commit();
    out(['ok' => true]);
}

if ($action === 'grant' || $action === 'revoke') {
    $email = strtolower(clean_str($in['email'] ?? '', 190));
    $q = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $q->execute([$email]);
    $target = $q->fetch();
    if (!$target) fail('এই ইমেইলের কোনো account নেই', 404);
    if ($action === 'revoke') {
        $pdo->prepare('UPDATE users SET plan_expires_at = NULL WHERE id = ?')->execute([$target['id']]);
        out(['ok' => true]);
    }
    $planId = (string) ($in['planId'] ?? '');
    if (!isset(plans()[$planId])) fail('Unknown plan');
    $pdo->beginTransaction();
    extend_plan($pdo, (int) $target['id'], $planId);
    $pdo->commit();
    out(['ok' => true]);
}

fail('Unknown action');
