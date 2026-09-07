<?php
header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];
$reviewsFile = __DIR__ . '/reviews.jsonl';
$rateLimitFile = __DIR__ . '/rate_limit.json';
$rateLimitDuration = 60;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $reviewerName = filter_var(trim($_POST['reviewerName'] ?? ''), FILTER_SANITIZE_STRING);
    $reviewerEmail = filter_var(trim($_POST['reviewerEmail'] ?? ''), FILTER_SANITIZE_EMAIL);
    $reviewRating = filter_var(trim($_POST['reviewRating'] ?? ''), FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 5]]);
    $reviewComment = filter_var(trim($_POST['reviewComment'] ?? ''), FILTER_SANITIZE_STRING);

    // Basic validation
    if (empty($reviewerName) || empty($reviewRating) || empty($reviewComment)) {
        $response['message'] = 'Name, rating, and comment are required.';
        echo json_encode($response);
        exit();
    }
    if ($reviewerEmail && !filter_var($reviewerEmail, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Invalid email format.';
        echo json_encode($response);
        exit();
    }

    // Rate Limitinga
    $ipAddress = $_SERVER['REMOTE_ADDR'];
    $currentTime = time();
    $rateLimits = [];

    if (file_exists($rateLimitFile)) {
        $rateLimits = json_decode(file_get_contents($rateLimitFile), true);
        if ($rateLimits === null) $rateLimits = []; // Handle malformed JSON
    }

    if (isset($rateLimits[$ipAddress]) && ($currentTime - $rateLimits[$ipAddress] < $rateLimitDuration)) {
        $response['message'] = 'Please wait before submitting another review.';
        echo json_encode($response);
        exit();
    }

    // Update rate limit
    $rateLimits[$ipAddress] = $currentTime;
    file_put_contents($rateLimitFile, json_encode($rateLimits), LOCK_EX);

    // Prepare review data
    $reviewData = [
        'name' => $reviewerName,
        'email' => $reviewerEmail, // Optional, can be empty
        'rating' => $reviewRating,
        'comment' => $reviewComment,
        'timestamp' => date('Y-m-d H:i:s'),
        'ip' => $ipAddress // For logging/debugging, not displayed
    ];

    // Append review to file
    if (file_put_contents($reviewsFile, json_encode($reviewData) . PHP_EOL, FILE_APPEND | LOCK_EX) !== false) {
        $response['success'] = true;
        $response['message'] = 'Review submitted successfully!';
    } else {
        $response['message'] = 'Failed to save review.';
    }

} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>