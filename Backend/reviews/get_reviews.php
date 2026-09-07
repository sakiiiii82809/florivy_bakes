<?php
header('Content-Type: application/json');

$reviewsFile = __DIR__ . '/reviews.jsonl';
$reviews = [];

if (file_exists($reviewsFile)) {
    $lines = file($reviewsFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $review = json_decode($line, true);
        if ($review !== null) {
            // Remove sensitive or unnecessary data before sending to frontend
            unset($review['ip']); 
            $reviews[] = $review;
        }
    }
}

// Sort reviews by timestamp, newest first
usort($reviews, function($a, $b) {
    return strtotime($b['timestamp']) - strtotime($a['timestamp']);
});

echo json_encode(['success' => true, 'reviews' => $reviews]);
?>