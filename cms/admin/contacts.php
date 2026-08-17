<?php
require_once __DIR__ . '/bootstrap.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'delete') {
    checkCsrf();
    db()->prepare('DELETE FROM contacts WHERE id = :id')->execute(['id' => $_POST['id']]);
    header('Location: contacts.php');
    exit;
}

// viewing the list marks everything unread as read
db()->exec("UPDATE contacts SET read_at = datetime('now') WHERE read_at IS NULL");

$contacts = db()->query('SELECT * FROM contacts ORDER BY created_at DESC')->fetchAll(PDO::FETCH_ASSOC);
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Pressefy CMS — Contact requests</title><link rel="stylesheet" href="style.css"></head>
<body>
<?php $active = 'contacts'; require __DIR__ . '/_nav.php'; ?>
<main>
  <h1>Contact requests</h1>
  <p class="dim">Submissions from the homepage's "Submit a request" callback form.</p>

  <?php if (!$contacts): ?>
    <p class="dim">No submissions yet.</p>
  <?php else: ?>
  <table>
    <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Best time to call</th><th>Date</th><th></th></tr></thead>
    <tbody>
    <?php foreach ($contacts as $c): ?>
      <tr>
        <td><?= h($c['name']) ?></td>
        <td><a href="mailto:<?= h($c['email']) ?>"><?= h($c['email']) ?></a></td>
        <td><?= h($c['phone'] ?? '—') ?></td>
        <td><?= h($c['best_time'] ?? '—') ?></td>
        <td class="dim"><?= h($c['created_at']) ?></td>
        <td>
          <form method="post" onsubmit="return confirm('Delete this submission?');" style="display:inline">
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" value="<?= (int)$c['id'] ?>">
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
