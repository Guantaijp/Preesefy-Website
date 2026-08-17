<?php
require_once __DIR__ . '/bootstrap.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    checkCsrf();
    $action = $_POST['action'] ?? '';
    $id = $_POST['id'] ?? null;
    if ($action === 'trash' && $id) {
        db()->prepare("UPDATE posts SET deleted_at = datetime('now') WHERE id = :id")->execute(['id' => $id]);
    } elseif ($action === 'restore' && $id) {
        db()->prepare('UPDATE posts SET deleted_at = NULL WHERE id = :id')->execute(['id' => $id]);
    } elseif ($action === 'delete-permanent' && $id) {
        db()->prepare('DELETE FROM posts WHERE id = :id AND deleted_at IS NOT NULL')->execute(['id' => $id]);
    }
    header('Location: posts.php' . (($_GET['status'] ?? '') === 'trash' ? '?status=trash' : ''));
    exit;
}

$view = $_GET['status'] ?? 'all';
if ($view === 'trash') {
    $posts = db()->query(
        "SELECT id, title, slug, category, status, scheduled_at, views, created_at
         FROM posts WHERE deleted_at IS NOT NULL ORDER BY created_at DESC"
    )->fetchAll(PDO::FETCH_ASSOC);
} else {
    $where = 'deleted_at IS NULL';
    $params = [];
    if (in_array($view, ['draft', 'scheduled', 'published'], true)) {
        $where .= ' AND status = :status';
        $params['status'] = $view;
    }
    $stmt = db()->prepare(
        "SELECT id, title, slug, category, status, scheduled_at, views, created_at
         FROM posts WHERE {$where} ORDER BY created_at DESC"
    );
    $stmt->execute($params);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function statusPill(string $status): string {
    $labels = ['published' => 'pill-live', 'scheduled' => 'pill-sched', 'draft' => 'pill-draft'];
    return '<span class="pill ' . ($labels[$status] ?? 'pill-draft') . '">' . h($status) . '</span>';
}
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Pressefy CMS — Posts</title><link rel="stylesheet" href="style.css"></head>
<body>
<?php $active = $view === 'trash' ? 'trash' : 'posts'; require __DIR__ . '/_nav.php'; ?>
<main>
  <div class="row">
    <h1><?= $view === 'trash' ? 'Trash' : 'Posts' ?></h1>
    <a class="btn" href="edit.php">+ New post</a>
  </div>

  <?php if ($view !== 'trash'): ?>
  <div class="tabs">
    <a href="posts.php" class="<?= $view === 'all' ? 'active' : '' ?>">All</a>
    <a href="posts.php?status=published" class="<?= $view === 'published' ? 'active' : '' ?>">Published</a>
    <a href="posts.php?status=scheduled" class="<?= $view === 'scheduled' ? 'active' : '' ?>">Scheduled</a>
    <a href="posts.php?status=draft" class="<?= $view === 'draft' ? 'active' : '' ?>">Draft</a>
  </div>
  <?php endif; ?>

  <?php if (!$posts): ?>
    <p class="dim"><?= $view === 'trash' ? 'Trash is empty.' : 'No posts here yet.' ?></p>
  <?php else: ?>
  <table>
    <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Views</th><th>Date</th><th></th></tr></thead>
    <tbody>
    <?php foreach ($posts as $p): ?>
      <tr>
        <td>
          <?php if ($view === 'trash'): ?>
            <?= h($p['title']) ?>
          <?php else: ?>
            <a href="edit.php?id=<?= (int)$p['id'] ?>"><?= h($p['title']) ?></a>
          <?php endif; ?>
        </td>
        <td><?= h($p['category'] ?? '—') ?></td>
        <td>
          <?= statusPill($p['status']) ?>
          <?php if ($p['status'] === 'scheduled' && $p['scheduled_at']): ?>
            <div class="dim" style="margin-top:3px"><?= h($p['scheduled_at']) ?></div>
          <?php endif; ?>
        </td>
        <td><?= (int)$p['views'] ?></td>
        <td class="dim"><?= h($p['created_at']) ?></td>
        <td>
          <?php if ($view === 'trash'): ?>
            <form method="post" style="display:inline">
              <input type="hidden" name="action" value="restore">
              <input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
              <input type="hidden" name="csrf" value="<?= h(csrfToken()) ?>">
              <button class="link" type="submit">Restore</button>
            </form>
            <form method="post" onsubmit="return confirm('Permanently delete this post? This cannot be undone.');" style="display:inline">
              <input type="hidden" name="action" value="delete-permanent">
              <input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
              <input type="hidden" name="csrf" value="<?= h(csrfToken()) ?>">
              <button class="link-danger" type="submit">Delete permanently</button>
            </form>
          <?php else: ?>
            <form method="post" onsubmit="return confirm('Move this post to trash?');" style="display:inline">
              <input type="hidden" name="action" value="trash">
              <input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
              <input type="hidden" name="csrf" value="<?= h(csrfToken()) ?>">
              <button class="link-danger" type="submit">Trash</button>
            </form>
          <?php endif; ?>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  <?php endif; ?>
</main>
</body>
</html>
