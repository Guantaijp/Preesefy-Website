<?php
require_once __DIR__ . '/bootstrap.php';
requireLogin();

function slugify(string $text): string {
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    return trim($text, '-') ?: bin2hex(random_bytes(4));
}

$id = isset($_GET['id']) ? (int) $_GET['id'] : null;
$post = ['id' => null, 'title' => '', 'slug' => '', 'excerpt' => '', 'content' => '', 'featured_image' => '', 'category' => '', 'status' => 'draft', 'scheduled_at' => '', 'views' => 0];
if ($id) {
    $stmt = db()->prepare('SELECT * FROM posts WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $found = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($found) $post = $found;
}

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    checkCsrf();

    $imageUrl = $post['featured_image'];
    if (!empty($_FILES['image']['name'])) {
        $file = $_FILES['image'];
        $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
        $type = $file['error'] === UPLOAD_ERR_OK ? mime_content_type($file['tmp_name']) : null;
        if ($type && isset($allowed[$type]) && $file['size'] <= 8 * 1024 * 1024) {
            $name = date('Y/m') . '/' . bin2hex(random_bytes(8)) . '.' . $allowed[$type];
            $dest = UPLOADS_DIR . '/' . $name;
            if (!is_dir(dirname($dest))) mkdir(dirname($dest), 0755, true);
            move_uploaded_file($file['tmp_name'], $dest);
            $imageUrl = UPLOADS_URL . '/' . $name;
        } else {
            $error = 'Image must be jpg/png/webp/gif and under 8MB.';
        }
    }

    if (!$error) {
        $title = trim($_POST['title'] ?? '');
        $content = trim($_POST['content'] ?? '');
        $status = in_array($_POST['status'] ?? 'draft', ['draft', 'scheduled', 'published'], true) ? $_POST['status'] : 'draft';
        $scheduledAt = trim($_POST['scheduled_at'] ?? '');
        // datetime-local gives "2026-08-20T14:30" — SQLite wants a plain space-separated string
        $scheduledAtSql = $scheduledAt !== '' ? str_replace('T', ' ', $scheduledAt) . ':00' : null;

        if ($title === '' || $content === '') {
            $error = 'Title and content are required.';
        } elseif ($status === 'scheduled' && !$scheduledAtSql) {
            $error = 'Pick a date and time to schedule this post for.';
        } else {
            $slug = trim($_POST['slug'] ?? '') !== '' ? slugify($_POST['slug']) : slugify($title);
            $category = trim($_POST['category'] ?? '');
            $excerpt = trim($_POST['excerpt'] ?? '');

            if ($id) {
                $stmt = db()->prepare(
                    'UPDATE posts SET title=:title, slug=:slug, excerpt=:excerpt, content=:content,
                     featured_image=:image, category=:category, status=:status, scheduled_at=:scheduled_at,
                     updated_at=datetime(\'now\')
                     WHERE id=:id'
                );
                $stmt->execute(['title'=>$title,'slug'=>$slug,'excerpt'=>$excerpt,'content'=>$content,'image'=>$imageUrl,'category'=>$category,'status'=>$status,'scheduled_at'=>$status==='scheduled'?$scheduledAtSql:null,'id'=>$id]);
            } else {
                $base = $slug; $n = 2;
                $check = db()->prepare('SELECT 1 FROM posts WHERE slug = :s');
                while (true) { $check->execute(['s'=>$slug]); if (!$check->fetchColumn()) break; $slug = $base.'-'.$n++; }
                $stmt = db()->prepare(
                    'INSERT INTO posts (title, slug, excerpt, content, featured_image, category, status, scheduled_at)
                     VALUES (:title,:slug,:excerpt,:content,:image,:category,:status,:scheduled_at)'
                );
                $stmt->execute(['title'=>$title,'slug'=>$slug,'excerpt'=>$excerpt,'content'=>$content,'image'=>$imageUrl,'category'=>$category,'status'=>$status,'scheduled_at'=>$status==='scheduled'?$scheduledAtSql:null]);
                $id = (int) db()->lastInsertId();
            }
            // same cache the public API serves from — clear it so the edit shows up immediately
            foreach (glob(CMS_ROOT . '/data/cache/*.json') ?: [] as $f) unlink($f);
            header('Location: posts.php');
            exit;
        }
    }
}

// for the datetime-local input's value attribute
$scheduledAtInput = '';
if (!empty($post['scheduled_at'])) {
    $scheduledAtInput = str_replace(' ', 'T', substr($post['scheduled_at'], 0, 16));
}
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Pressefy CMS — <?= $post['id'] ? 'Edit' : 'New' ?> post</title><link rel="stylesheet" href="style.css"></head>
<body>
<?php $active = 'posts'; require __DIR__ . '/_nav.php'; ?>
<main>
  <div class="row">
    <h1><?= $post['id'] ? 'Edit post' : 'New post' ?></h1>
    <?php if ($post['id']): ?><span class="dim"><?= (int)$post['views'] ?> views</span><?php endif; ?>
  </div>
  <?php if ($error): ?><p class="error"><?= h($error) ?></p><?php endif; ?>
  <form method="post" enctype="multipart/form-data" class="post-form">
    <input type="hidden" name="csrf" value="<?= h(csrfToken()) ?>">
    <label>Title<input type="text" name="title" value="<?= h($post['title']) ?>" required></label>
    <label>Slug <span class="dim">(leave blank to auto-generate)</span><input type="text" name="slug" value="<?= h($post['slug']) ?>"></label>
    <label>Category<input type="text" name="category" value="<?= h($post['category'] ?? '') ?>" placeholder="Financial, Crypto, Process..."></label>
    <label>Excerpt<textarea name="excerpt" rows="2"><?= h($post['excerpt'] ?? '') ?></textarea></label>
    <label>Content<textarea name="content" rows="14" required><?= h($post['content']) ?></textarea></label>
    <label>Featured image<input type="file" name="image" accept="image/*"></label>
    <?php if (!empty($post['featured_image'])): ?>
      <img class="preview" src="<?= h($post['featured_image']) ?>" alt="Current featured image">
    <?php endif; ?>
    <label>Status
      <select name="status" id="statusSelect" onchange="document.getElementById('scheduleRow').style.display = this.value === 'scheduled' ? 'flex' : 'none'">
        <option value="draft" <?= $post['status']==='draft'?'selected':'' ?>>Draft</option>
        <option value="scheduled" <?= $post['status']==='scheduled'?'selected':'' ?>>Scheduled</option>
        <option value="published" <?= $post['status']==='published'?'selected':'' ?>>Published</option>
      </select>
    </label>
    <label id="scheduleRow" style="<?= $post['status']==='scheduled' ? '' : 'display:none' ?>">
      Publish at
      <input type="datetime-local" name="scheduled_at" value="<?= h($scheduledAtInput) ?>">
      <span class="dim">A cron job checks every few minutes and publishes it automatically once this time passes.</span>
    </label>
    <button class="btn" type="submit">Save</button>
    <a href="posts.php">Cancel</a>
  </form>
</main>
</body>
</html>
