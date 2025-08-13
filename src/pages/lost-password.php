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
require_once($_SERVER['DOCUMENT_ROOT'] . '/wp/wp-load.php');

// Get request body
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Email is required']);
    exit();
}

$email = sanitize_email($data['email']);

// Check if user exists
$user = get_user_by('email', $email);

if (!$user) {
    // For security reasons, we don't want to reveal if an email exists or not
    http_response_code(200);
    echo json_encode(['message' => 'If your email is registered, you will receive password reset instructions.']);
    exit();
}

// Generate reset key
$key = get_password_reset_key($user);
if (is_wp_error($key)) {
    error_log('Error generating reset key: ' . $key->get_error_message());
    http_response_code(500);
    echo json_encode([
        'code' => 'reset_key_error',
        'message' => 'Error generating reset key',
        'data' => ['status' => 500]
    ]);
    exit();
}

// Store the reset key in user meta
update_user_meta($user->ID, 'password_reset_key', $key);

// Prepare reset link - point to our React app's reset password page
$reset_link = 'http://localhost:5173/reset-password?key=' . urlencode($key) . '&login=' . urlencode($user->user_login);

// Prepare email content
$site_name = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);
$title = sprintf(__('[%s] Password Reset'), $site_name);

$message = __('Someone has requested a password reset for the following account:') . "\r\n\r\n";
$message .= sprintf(__('Site Name: %s'), $site_name) . "\r\n\r\n";
$message .= sprintf(__('Username: %s'), $user->user_login) . "\r\n\r\n";
$message .= __('If this was a mistake, ignore this email and nothing will happen.') . "\r\n\r\n";
$message .= __('To reset your password, visit the following address:') . "\r\n\r\n";
$message .= $reset_link . "\r\n";

// Configure email headers
$headers = array(
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $site_name . ' <' . get_option('admin_email') . '>'
);

// Check if SMTP is configured
$smtp_configured = defined('SMTP_HOST') && defined('SMTP_USER') && defined('SMTP_PASS');

// Try to send email
$mail_sent = false;
if ($smtp_configured) {
    // Use SMTP configuration
    $mail_sent = wp_mail($user->user_email, $title, $message, $headers);
} else {
    // Try to use WordPress mail function
    if (function_exists('wp_mail')) {
        $mail_sent = wp_mail($user->user_email, $title, $message, $headers);
    }
}

if ($mail_sent) {
    error_log('Password reset email sent successfully to: ' . $user->user_email);
    http_response_code(200);
    echo json_encode(['message' => 'Password reset instructions have been sent to your email.']);
} else {
    error_log('Failed to send password reset email to: ' . $user->user_email);
    
    // Log detailed error information
    $error_details = array(
        'smtp_configured' => $smtp_configured,
        'wp_mail_exists' => function_exists('wp_mail'),
        'to_email' => $user->user_email,
        'from_email' => get_option('admin_email'),
        'site_name' => $site_name
    );
    
    error_log('Email sending error details: ' . print_r($error_details, true));
    
    http_response_code(500);
    echo json_encode([
        'code' => 'email_error',
        'message' => 'Failed to send reset email. Please try again or contact support.',
        'data' => [
            'status' => 500,
            'debug' => $error_details
        ]
    ]);
} 