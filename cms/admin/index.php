<?php
require_once __DIR__ . '/bootstrap.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'delete') {
    checkCsrf();
    $stmt = db()->prepare('DELETE FROM posts WHERE id = :id');
    $stmt->execute(['id' => $_POST['id']]);
    header('Location: index.php');
    exit;
}

$posts = db()->query('SELECT id, title, slug, category, status, created_at FROM posts ORDER BY created_at DESC')->fetchAll(PDO::FETCH_ASSOC);
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Pressefy CMS — Posts</title><link rel="stylesheet" href="style.css"></head>
<body>
<header class="bar">
  <strong>Pressefy CMS</strong>
  <nav><a href="index.php">Posts</a><a href="tokens.php">Application Passwords</a><a href="logout.php">Log out</a></nav>
</header>
<main>
  <div class="row">
    <h1>Posts</h1>
    <a class="btn" href="edit.php">+ New post</a>
  </div>

  <?php if (!$posts): ?>
    <p class="dim">No posts yet. Create one, or wait for an AI agent to publish through the API.</p>
  <?php else: ?>
  <table>
    <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Date</th><th></th></tr></thead>
    <tbody>
    <?php foreach ($posts as $p): ?>
      <tr>
        <td><a href="edit.php?id=<?= (int)$p['id'] ?>"><?= h($p['title']) ?></a></td>
        <td><?= h($p['category'] ?? '—') ?></td>
        <td><span class="pill <?= $p['status'] === 'published' ? 'pill-live' : 'pill-draft' ?>"><?= h($p['status']) ?></span></td>
        <td class="dim"><?= h($p['created_at']) ?></td>
        <td>
          <form method="post" onsubmit="return confirm('Delete this post?');" style="display:inline">
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
            <input type="hidden" name="csrf" value="<?= h(csrfToken()) ?>">
            <button class="link-danger" type="submit">Delete</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  <?php endif; ?>
</main>
</body>
</html>
