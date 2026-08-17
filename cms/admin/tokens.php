<?php
require_once __DIR__ . '/bootstrap.php';
requireLogin();

$newToken = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    checkCsrf();

    if (($_POST['action'] ?? '') === 'create') {
        $label = trim($_POST['label'] ?? '') ?: 'unnamed';
        $raw = bin2hex(random_bytes(24)); // the Application Password, shown once
        $stmt = db()->prepare('INSERT INTO tokens (label, token_hash) VALUES (:l, :h)');
        $stmt->execute(['l' => $label, 'h' => password_hash($raw, PASSWORD_DEFAULT)]);
        $newToken = $raw;
    }

    if (($_POST['action'] ?? '') === 'revoke') {
        $stmt = db()->prepare('UPDATE tokens SET revoked = 1 WHERE id = :id');
        $stmt->execute(['id' => $_POST['id']]);
    }
}

$tokens = db()->query('SELECT id, label, created_at, revoked FROM tokens ORDER BY created_at DESC')->fetchAll(PDO::FETCH_ASSOC);
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Pressefy CMS — Application Passwords</title><link rel="stylesheet" href="style.css"></head>
<body>
<?php $active = 'tokens'; require __DIR__ . '/_nav.php'; ?>
<main>
  <h1>Application Passwords</h1>
  <p class="dim">Each one lets a single AI agent or script create/edit/delete posts and upload images through the API — without sharing your admin login. Revoke one at any time without affecting the others.</p>

  <?php if ($newToken): ?>
    <div class="callout">
      <strong>New Application Password created.</strong> Copy it now — it will not be shown again.
      <code class="token-value"><?= h($newToken) ?></code>
      <p class="dim">Use it as: <code>Authorization: Bearer <?= h($newToken) ?></code></p>
    </div>
  <?php endif; ?>

  <form method="post" class="inline-form">
    <input type="hidden" name="action" value="create">
    <input type="hidden" name="csrf" value="<?= h(csrfToken()) ?>">
    <input type="text" name="label" placeholder="Label, e.g. content-bot" required>
    <button class="btn" type="submit">Generate new Application Password</button>
  </form>

  <table>
    <thead><tr><th>Label</th><th>Created</th><th>Status</th><th></th></tr></thead>
    <tbody>
    <?php foreach ($tokens as $t): ?>
      <tr>
        <td><?= h($t['label']) ?></td>
        <td class="dim"><?= h($t['created_at']) ?></td>
        <td><span class="pill <?= $t['revoked'] ? 'pill-draft' : 'pill-live' ?>"><?= $t['revoked'] ? 'revoked' : 'active' ?></span></td>
        <td>
          <?php if (!$t['revoked']): ?>
          <form method="post" onsubmit="return confirm('Revoke this Application Password? Anything using it will stop working immediately.');" style="display:inline">
            <input type="hidden" name="action" value="revoke">
            <input type="hidden" name="id" value="<?= (int)$t['id'] ?>">
            <input type="hidden" name="csrf" value="<?= h(csrfToken()) ?>">
            <button class="link-danger" type="submit">Revoke</button>
          </form>
          <?php endif; ?>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</main>
</body>
</html>
