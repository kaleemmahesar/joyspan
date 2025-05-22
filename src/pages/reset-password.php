<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers
header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

// Get WordPress environment
require_once($_SERVER['DOCUMENT_ROOT'] . '/joyspan-server/wp-load.php');

// Get request body
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['key']) || !isset($data['login']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing required fields']);
    exit();
}

$key = sanitize_text_field($data['key']);
$login = sanitize_text_field($data['login']);
$password = sanitize_text_field($data['password']);

// Get user by login
$user = get_user_by('login', $login);

if (!$user) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid user']);
    exit();
}

// Get stored reset key
$stored_key = get_user_meta($user->ID, 'password_reset_key', true);

if (!$stored_key || $stored_key !== $key) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid or expired reset key']);
    exit();
}

// Reset the password
wp_set_password($password, $user->ID);

// Clear the reset key
delete_user_meta($user->ID, 'password_reset_key');

// Return success response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Password has been reset successfully'
]); 