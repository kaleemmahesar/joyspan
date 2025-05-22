<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for CORS and JSON response
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
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Load WordPress
require_once('wp-load.php');

// Check if user is logged in
if (!is_user_logged_in()) {
    http_response_code(401);
    echo json_encode(['error' => 'Authentication required']);
    exit();
}

// Get current user
$current_user = wp_get_current_user();
$user_email = $current_user->user_email;
$user_name = $current_user->display_name;

// Handle PDF upload
if (!isset($_FILES['pdf'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
    exit();
}

$file = $_FILES['pdf'];

// Check for upload errors
if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'File upload failed', 'code' => $file['error']]);
    exit();
}

// Prepare file data for WordPress media library
$upload = wp_upload_bits($file['name'], null, file_get_contents($file['tmp_name']));

if (!$upload['error']) {
    // Prepare attachment data
    $wp_filetype = wp_check_filetype($file['name'], null);
    $attachment = array(
        'post_mime_type' => $wp_filetype['type'],
        'post_title' => sanitize_file_name($file['name']),
        'post_content' => '',
        'post_status' => 'inherit',
        'post_author' => $current_user->ID
    );

    // Insert the attachment
    $attach_id = wp_insert_attachment($attachment, $upload['file']);

    if (!is_wp_error($attach_id)) {
        // Include image.php for wp_generate_attachment_metadata
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        
        // Generate metadata for the attachment
        $attach_data = wp_generate_attachment_metadata($attach_id, $upload['file']);
        wp_update_attachment_metadata($attach_id, $attach_data);

        // Get the attachment URL
        $file_url = wp_get_attachment_url($attach_id);

        echo json_encode([
            'success' => true,
            'url' => $file_url,
            'filename' => $file['name'],
            'attachment_id' => $attach_id
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create attachment']);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to upload file to WordPress media library']);
}
?> 