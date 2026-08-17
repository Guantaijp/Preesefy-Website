<?php
require_once __DIR__ . '/bootstrap.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'delete') {
    checkCsrf();
    db()->prepare('DELETE FROM subscribers WHERE id = :id')->execute(['id' => $_POST['id']]);
    header('Location: subscribers.php');
    exit;
}

if (($_GET['export'] ?? '') === 'csv') {
    $rows = db()->query('SELECT email, created_at FROM subscribers ORDER BY created_at DESC')->fetchAll(PDO::FETCH_ASSOC);
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="pressefy-subscribers.csv"');
    $out = fopen('php://output', 'w');
    fputcsv($out, ['email', 'subscribed_at']);
    foreach ($rows as $r) fputcsv($out, [$r['email'], $r['created_at']]);
    fclose($out);
    exit;
}

$subscribers = db()->query('SELECT * FROM subscribers ORDER BY created_at DESC')->fetchAll(PDO::FETCH_ASSOC);
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Pressefy CMS — Subscribers</title><link rel="stylesheet" href="style.css"></head>
<body>
<?php $active = 'subscribers'; require __DIR__ . '/_nav.php'; ?>
<main>
  <div class="row">
    <h1>Newsletter subscribers</h1>
    <a class="btn" href="subscribers.php?export=csv">Export CSV</a>
  </div>
  <p class="dim">Emails collected from the newsletter signup box on every page.</p>

  <?php if (!$subscribers): ?>
    <p class="dim">No subscribers yet.</p>
  <?php else: ?>
  <table>
    <thead><tr><th>Email</th><th>Subscribed</th><th></th></tr></thead>
    <tbody>
    <?php foreach ($subscribers as $s): ?>
      <tr>
        <td><?= h($s['email']) ?></td>
        <td class="dim"><?= h($s['created_at']) ?></td>
        <td>
          <form method="post" onsubmit="return confirm('Remove this subscriber?');" style="display:inline">
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" value="<?= (int)$s['id'] ?>">
            <input type="hidden" name="csrf" value="<?= h(csrfToken()) ?>">
            <button class="link-danger" type="submit">Remove</button>
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
