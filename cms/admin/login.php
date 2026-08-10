<?php
require_once __DIR__ . '/bootstrap.php';

if ((int) db()->query('SELECT COUNT(*) FROM admins')->fetchColumn() === 0) {
    header('Location: setup.php');
    exit;
}

if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$error = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $stmt = db()->prepare('SELECT id, password_hash FROM admins WHERE username = :u');
    $stmt->execute(['u' => $_POST['username'] ?? '']);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($admin && password_verify($_POST['password'] ?? '', $admin['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $admin['id'];
        header('Location: index.php');
        exit;
    }
    $error = 'Wrong username or password.';
}
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Pressefy CMS — Log in</title><link rel="stylesheet" href="style.css"></head>
<body>
<div class="auth-box">
  <h1>Pressefy CMS</h1>
  <?php if ($error): ?><p class="error"><?= h($error) ?></p><?php endif; ?>
  <form method="post">
    <label>Username<input type="text" name="username" required autofocus></label>
    <label>Password<input type="password" name="password" required></label>
    <button type="submit">Log in</button>
  </form>
</div>
</body>
</html>
