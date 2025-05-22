<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for CORS and JSON response
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
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

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['pdfUrl'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit();
}

$to = $data['email'];
$pdfUrl = $data['pdfUrl'];

// Email subject
$subject = 'Your JoySpan Wellness Plan';

// Email message
$message = "
<html>
<head>
    <title>Your JoySpan Wellness Plan</title>
</head>
<body>
    <h2>Thank you for using JoySpan!</h2>
    <p>Your personalized wellness plan is attached to this email.</p>
    <p>We hope this plan helps you on your wellness journey.</p>
    <br>
    <p>Best regards,<br>The JoySpan Team</p>
</body>
</html>
";

// Headers for HTML email
$headers = array(
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: JoySpan <noreply@joyspan.com>',
    'Reply-To: support@joyspan.com',
    'X-Mailer: PHP/' . phpversion()
);

// Download the PDF file
$pdfContent = file_get_contents($pdfUrl);
if ($pdfContent === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to download PDF']);
    exit();
}

// Create a temporary file for the PDF
$tempFile = tempnam(sys_get_temp_dir(), 'pdf_');
file_put_contents($tempFile, $pdfContent);

// Create email boundary
$boundary = md5(time());

// Modify headers for multipart email
$headers = array(
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
    'From: JoySpan <noreply@joyspan.com>',
    'Reply-To: support@joyspan.com',
    'X-Mailer: PHP/' . phpversion()
);

// Create email body
$body = "--" . $boundary . "\r\n";
$body .= "Content-Type: text/html; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$body .= $message . "\r\n\r\n";

// Add PDF attachment
$body .= "--" . $boundary . "\r\n";
$body .= "Content-Type: application/pdf; name=\"wellness-plan.pdf\"\r\n";
$body .= "Content-Disposition: attachment; filename=\"wellness-plan.pdf\"\r\n";
$body .= "Content-Transfer-Encoding: base64\r\n\r\n";
$body .= chunk_split(base64_encode($pdfContent)) . "\r\n\r\n";
$body .= "--" . $boundary . "--";

// Send email
$mailSent = mail($to, $subject, $body, implode("\r\n", $headers));

// Clean up temporary file
unlink($tempFile);

if ($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email']);
}
?> 