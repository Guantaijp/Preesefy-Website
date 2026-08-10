<?php
// One-time bootstrap: create the first admin login. Locks itself once an admin exists.
require_once __DIR__ . '/bootstrap.php';

$existing = (int) db()->query('SELECT COUNT(*) FROM admins')->fetchColumn();
$error = null;

if ($existing > 0) {
    http_response_code(403);
    exit('Setup already completed — an admin account exists. Delete it from the database directly if you need to redo this.');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    if (strlen($username) < 3) {
        $error = 'Username must be at least 3 characters.';
    } elseif (strlen($password) < 8) {
        $error = 'Password must be at least 8 characters.';
    } else {
        $stmt = db()->prepare('INSERT INTO admins (username, password_hash) VALUES (:u, :p)');
        $stmt->execute(['u' => $username, 'p' => password_hash($password, PASSWORD_DEFAULT)]);
        header('Location: login.php');
        exit;
    }
}
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Pressefy CMS — Setup</title><link rel="stylesheet" href="style.css"></head>
<body>
<div class="auth-box">
  <h1>Create the admin account</h1>
  <p class="dim">This runs once. After this, delete or restrict access to setup.php.</p>
  <?php if ($error): ?><p class="error"><?= h($error) ?></p><?php endif; ?>
  <form method="post">
    <label>Username<input type="text" name="username" required></label>
    <label>Password<input type="password" name="password" required minlength="8"></label>
    <button type="submit">Create account</button>
  </form>
</div>
</body>
</html>
