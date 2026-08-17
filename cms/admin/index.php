<?php
require_once __DIR__ . '/bootstrap.php';
requireLogin();

$counts = db()->query(
    "SELECT
        SUM(CASE WHEN status='published' AND deleted_at IS NULL THEN 1 ELSE 0 END) AS published,
        SUM(CASE WHEN status='scheduled' AND deleted_at IS NULL THEN 1 ELSE 0 END) AS scheduled,
        SUM(CASE WHEN status='draft' AND deleted_at IS NULL THEN 1 ELSE 0 END) AS draft,
        SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) AS trashed,
        SUM(CASE WHEN deleted_at IS NULL THEN views ELSE 0 END) AS total_views
     FROM posts"
)->fetch(PDO::FETCH_ASSOC);

$topPosts = db()->query(
    "SELECT title, slug, views FROM posts WHERE status='published' AND deleted_at IS NULL ORDER BY views DESC LIMIT 5"
)->fetchAll(PDO::FETCH_ASSOC);

$recentContacts = db()->query('SELECT name, email, created_at FROM contacts ORDER BY created_at DESC LIMIT 5')->fetchAll(PDO::FETCH_ASSOC);
$contactCount = (int) db()->query('SELECT COUNT(*) FROM contacts')->fetchColumn();
$subscriberCount = (int) db()->query('SELECT COUNT(*) FROM subscribers')->fetchColumn();

$upcoming = db()->query(
    "SELECT title, scheduled_at FROM posts WHERE status='scheduled' AND deleted_at IS NULL ORDER BY scheduled_at ASC LIMIT 5"
)->fetchAll(PDO::FETCH_ASSOC);
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Pressefy CMS — Dashboard</title><link rel="stylesheet" href="style.css"></head>
<body>
<?php $active = 'dashboard'; require __DIR__ . '/_nav.php'; ?>
<main>
  <h1>Dashboard</h1>

  <div class="stat-grid">
    <a class="stat" href="posts.php?status=published"><b><?= (int)($counts['published'] ?? 0) ?></b><span>Published</span></a>
    <a class="stat" href="posts.php?status=scheduled"><b><?= (int)($counts['scheduled'] ?? 0) ?></b><span>Scheduled</span></a>
    <a class="stat" href="posts.php?status=draft"><b><?= (int)($counts['draft'] ?? 0) ?></b><span>Draft</span></a>
    <a class="stat" href="posts.php?status=trash"><b><?= (int)($counts['trashed'] ?? 0) ?></b><span>Trash</span></a>
    <div class="stat"><b><?= (int)($counts['total_views'] ?? 0) ?></b><span>Total views</span></div>
    <a class="stat" href="subscribers.php"><b><?= $subscriberCount ?></b><span>Subscribers</span></a>
    <a class="stat" href="contacts.php"><b><?= $contactCount ?></b><span>Contact requests</span></a>
  </div>

  <div class="dash-cols">
    <section class="panel">
      <h2>Upcoming scheduled posts</h2>
      <?php if (!$upcoming): ?>
        <p class="dim">Nothing scheduled right now.</p>
      <?php else: ?>
        <ul class="list">
          <?php foreach ($upcoming as $p): ?>
            <li><?= h($p['title']) ?> <span class="dim"><?= h($p['scheduled_at']) ?></span></li>
          <?php endforeach; ?>
        </ul>
      <?php endif; ?>
    </section>

    <section class="panel">
      <h2>Top posts by views</h2>
      <?php if (!$topPosts): ?>
        <p class="dim">No published posts yet.</p>
      <?php else: ?>
        <ul class="list">
          <?php foreach ($topPosts as $p): ?>
            <li><?= h($p['title']) ?> <span class="dim"><?= (int)$p['views'] ?> views</span></li>
          <?php endforeach; ?>
        </ul>
      <?php endif; ?>
    </section>

    <section class="panel">
      <h2>Recent contact requests</h2>
      <?php if (!$recentContacts): ?>
        <p class="dim">No submissions yet.</p>
      <?php else: ?>
        <ul class="list">
          <?php foreach ($recentContacts as $c): ?>
            <li><?= h($c['name']) ?> <span class="dim"><?= h($c['email']) ?></span></li>
          <?php endforeach; ?>
        </ul>
        <a class="link" href="contacts.php">View all &rarr;</a>
      <?php endif; ?>
    </section>
  </div>
</main>
</body>
</html>
