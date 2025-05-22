<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for CORS and JSON response
header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-WP-Nonce');
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

// Check if this is an email sending request
if (isset($_POST['action']) && $_POST['action'] === 'send_email' && isset($_POST['pdf_url'])) {
    $pdf_url = $_POST['pdf_url'];
    
    // Create a beautiful HTML email message
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0AA5C5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background-color: #0AA5C5; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Your Wellness Plan is Ready!</h1>
            </div>
            <div class='content'>
                <p>Dear " . esc_html($user_name) . ",</p>
                <p>Thank you for using JoySpan! Your personalized wellness plan has been created and is ready for you to view.</p>
                <p>We've designed this plan specifically for you based on your responses and needs. It includes:</p>
                <ul>
                    <li>Your personalized activity recommendations</li>
                    <li>Practice tips and guidance</li>
                    <li>A structured approach to your wellness journey</li>
                </ul>
                <p>You can access your wellness plan by clicking the button below:</p>
                <p style='text-align: center;'>
                    <a href='" . esc_url($pdf_url) . "' class='button'>View Your Wellness Plan</a>
                </p>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style='word-break: break-all;'>" . esc_url($pdf_url) . "</p>
                <p>Remember to practice your recommended activities regularly for the best results.</p>
                <p>Best regards,<br>The JoySpan Team</p>
            </div>
            <div class='footer'>
                <p>This email was sent to " . esc_html($user_email) . "</p>
                <p>&copy; " . date('Y') . " JoySpan. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>";

    // Set up email headers
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: JoySpan <noreply@joyspan.com>',
        'Reply-To: support@joyspan.com'
    );

    // Check if we're in a local development environment
    $is_local = strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
                strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false;

    if ($is_local) {
        // In local environment, simulate successful email sending
        // Log the email details for debugging
        error_log("Local Development - Email would be sent to: " . $user_email);
        error_log("Local Development - PDF URL: " . $pdf_url);
        
        echo json_encode([
            'success' => true,
            'email_sent' => true,
            'message' => 'Email would be sent in production environment',
            'debug_info' => [
                'recipient' => $user_email,
                'pdf_url' => $pdf_url,
                'environment' => 'local'
            ]
        ]);
    } else {
        // In production, actually send the email
        $mail_sent = wp_mail($user_email, 'Your JoySpan Wellness Plan is Ready!', $message, $headers);

        if ($mail_sent) {
            echo json_encode([
                'success' => true,
                'email_sent' => true,
                'message' => 'Email sent successfully'
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'email_sent' => false,
                'message' => 'Failed to send email. Please try again.'
            ]);
        }
    }
    exit();
}

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