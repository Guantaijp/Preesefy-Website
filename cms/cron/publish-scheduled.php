<?php
// Run every 5 minutes via a Hostinger cron job:
//   php /home/USER/domains/pressefy.com/public_html/cms/cron/publish-scheduled.php
// Flips any post whose scheduled_at has arrived from "scheduled" to "published".
// Safe to run as often as you like — each run only touches posts that are
// actually due, and does nothing if none are.

require_once __DIR__ . '/../config.php';

$pdo = db();
$stmt = $pdo->prepare(
    "UPDATE posts SET status = 'published', updated_at = datetime('now')
     WHERE status = 'scheduled' AND deleted_at IS NULL AND scheduled_at <= datetime('now')"
);
$stmt->execute();
$count = $stmt->rowCount();

if ($count > 0) {
    // clear the same list cache the API uses, so the newly-published posts
    // show up immediately instead of waiting out the ~60s TTL
    $cacheDir = CMS_ROOT . '/data/cache';
    foreach (glob($cacheDir . '/*.json') ?: [] as $f) unlink($f);
}

echo date('c') . " — published {$count} scheduled post(s)\n";
