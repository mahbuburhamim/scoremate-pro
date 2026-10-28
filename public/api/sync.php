<?php
/**
 * IconicScorer Live Real-Time Relay Engine for Hostinger / Apache
 * Provides zero-latency match sync between Scorer Controller and OBS Studio
 */

// Enable CORS for OBS Studio CEF and cross-device scoring
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

// Handle CORS preflight options request immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Disable all server-side and browser caching
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

$dataDir = __DIR__ . '/data';
if (!file_exists($dataDir)) {
    @mkdir($dataDir, 0777, true);
}

$dataFile = $dataDir . '/live_matches.json';

// POST: Save match state from Controller
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    if (!empty($rawInput)) {
        $parsed = json_decode($rawInput, true);
        if ($parsed && is_array($parsed)) {
            // Write atomically to storage
            $tempFile = $dataFile . '.tmp.' . uniqid();
            if (@file_put_contents($tempFile, $rawInput) !== false) {
                @rename($tempFile, $dataFile);
            }
            echo json_encode([
                'success' => true,
                'timestamp' => round(microtime(true) * 1000)
            ]);
            exit;
        }
    }
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
    exit;
}

// GET: Fetch current live match state for OBS Studio
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        $content = @file_get_contents($dataFile);
        if ($content !== false && !empty($content)) {
            $data = json_decode($content, true);
            if ($data && is_array($data)) {
                $requestedMatchId = $_GET['matchId'] ?? '';
                if (!empty($requestedMatchId) && isset($data['matches']) && is_array($data['matches'])) {
                    foreach ($data['matches'] as $m) {
                        if (isset($m['id']) && $m['id'] === $requestedMatchId) {
                            $data['targetMatch'] = $m;
                            break;
                        }
                    }
                }
                echo json_encode($data, JSON_UNESCAPED_UNICODE);
                exit;
            }
        }
    }

    // Default clean state if no matches stored yet
    echo json_encode([
        'success' => true,
        'matches' => [],
        'activeMatchId' => null,
        'timestamp' => round(microtime(true) * 1000)
    ]);
    exit;
}
