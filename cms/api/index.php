<?php
// Pressefy CMS — REST API
//
//   GET    /cms/api/posts                list published, non-trashed posts (public, cached ~60s)
//   GET    /cms/api/posts/{slug}          single post (public if published; draft/scheduled need an Application Password); increments view count on public reads
//   POST   /cms/api/posts                 create a post (Application Password required)
//   PATCH  /cms/api/posts/{id}            edit a post   (Application Password required)
//   DELETE /cms/api/posts/{id}            soft-delete (trash) a post (Application Password required)
//   POST   /cms/api/posts/{id}/restore    restore a trashed post (Application Password required)
//   DELETE /cms/api/posts/{id}/permanent  permanently delete a trashed post (Application Password required)
//   POST   /cms/api/media                 upload an image, field name "file" (Application Password required)
//   POST   /cms/api/contact               public contact/callback form submission (no auth — public form)
//   POST   /cms/api/subscribe             public newsletter signup (no auth — public form)
//   GET    /cms/api/contacts              list contact submissions (Application Password required)
//   GET    /cms/api/subscribers           list newsletter subscribers (Application Password required)

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../auth.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

function respond($data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function input(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify(string $text): string {
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    return trim($text, '-') ?: bin2hex(random_bytes(4));
}

// ---- tiny file cache for the public posts list: cheap, TTL-based, and
// explicitly cleared on any write below so edits show up immediately rather
// than waiting out the TTL ----
define('CACHE_DIR', CMS_ROOT . '/data/cache');
function cacheGet(string $key, int $ttlSeconds) {
    $file = CACHE_DIR . '/' . $key . '.json';
    if (!file_exists($file) || (time() - filemtime($file)) > $ttlSeconds) return null;
    $raw = file_get_contents($file);
    return $raw === false ? null : json_decode($raw, true);
}
function cacheSet(string $key, $data): void {
    if (!is_dir(CACHE_DIR)) mkdir(CACHE_DIR, 0755, true);
    file_put_contents(CACHE_DIR . '/' . $key . '.json', json_encode($data));
}
function cacheClear(): void {
    foreach (glob(CACHE_DIR . '/*.json') ?: [] as $f) unlink($f);
}

$method = $_SERVER['REQUEST_METHOD'];

// Works whether the server rewrites /cms/api/posts/5 into this file, or the
// caller hits index.php?path=posts/5 directly (no .htaccess rewrite needed).
$path = $_GET['path'] ?? '';
if ($path === '') {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';
    $path = preg_replace('#^.*/cms/api/?#', '', $uri);
}
$segments = array_values(array_filter(explode('/', trim($path, '/'))));
$resource = $segments[0] ?? '';
$id = $segments[1] ?? null;
$sub = $segments[2] ?? null; // e.g. "restore" / "permanent"

// ---------------------------------------------------------------- posts ---
if ($resource === 'posts') {

    if ($method === 'GET' && $id === null) {
        $cached = cacheGet('posts-list', 60);
        if ($cached !== null) respond(['posts' => $cached]);
        $stmt = db()->query(
            "SELECT id, slug, title, excerpt, featured_image, category, status, views, created_at, updated_at
             FROM posts WHERE status = 'published' AND deleted_at IS NULL ORDER BY created_at DESC"
        );
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        cacheSet('posts-list', $posts);
        respond(['posts' => $posts]);
    }

    if ($method === 'GET' && $id !== null && $sub === null) {
        $stmt = db()->prepare('SELECT * FROM posts WHERE (slug = :s OR id = :i) AND deleted_at IS NULL LIMIT 1');
        $stmt->execute(['s' => $id, 'i' => ctype_digit($id) ? (int)$id : -1]);
        $post = $stmt->fetch(PDO::FETCH_ASSOC);
        $authed = currentToken() && tokenIsValid(currentToken());
        if (!$post || ($post['status'] !== 'published' && !$authed)) {
            respond(['error' => 'Not found'], 404);
        }
        // count the view only for real public reads, not the authoring agent checking its own draft
        if (!$authed) {
            db()->prepare('UPDATE posts SET views = views + 1 WHERE id = :id')->execute(['id' => $post['id']]);
            $post['views'] = (int)$post['views'] + 1;
        }
        respond(['post' => $post]);
    }

    if ($method === 'POST' && $id === null) {
        requireAuth();
        $d = input();
        if (empty($d['title']) || empty($d['content'])) {
            respond(['error' => 'title and content are required'], 422);
        }
        $status = in_array($d['status'] ?? 'draft', ['draft', 'scheduled', 'published'], true) ? $d['status'] : 'draft';
        $scheduledAt = $d['scheduled_at'] ?? null;
        if ($status === 'scheduled' && !$scheduledAt) {
            respond(['error' => 'scheduled_at is required when status is "scheduled"'], 422);
        }
        $slug = !empty($d['slug']) ? slugify($d['slug']) : slugify($d['title']);
        // Guarantee uniqueness rather than erroring on a collision.
        $base = $slug; $n = 2;
        $check = db()->prepare('SELECT 1 FROM posts WHERE slug = :s');
        while (true) {
            $check->execute(['s' => $slug]);
            if (!$check->fetchColumn()) break;
            $slug = $base . '-' . $n++;
        }
        $stmt = db()->prepare(
            'INSERT INTO posts (slug, title, excerpt, content, featured_image, category, status, scheduled_at)
             VALUES (:slug, :title, :excerpt, :content, :image, :category, :status, :scheduled_at)'
        );
        $stmt->execute([
            'slug' => $slug,
            'title' => $d['title'],
            'excerpt' => $d['excerpt'] ?? null,
            'content' => $d['content'],
            'image' => $d['featured_image'] ?? null,
            'category' => $d['category'] ?? null,
            'status' => $status,
            'scheduled_at' => $status === 'scheduled' ? $scheduledAt : null,
        ]);
        cacheClear();
        respond(['id' => (int) db()->lastInsertId(), 'slug' => $slug], 201);
    }

    if ($method === 'PATCH' && $id !== null && $sub === null) {
        requireAuth();
        $d = input();
        $allowed = ['title', 'excerpt', 'content', 'featured_image', 'category', 'status', 'scheduled_at'];
        $fields = []; $params = ['id' => $id];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $d)) { $fields[] = "$f = :$f"; $params[$f] = $d[$f]; }
        }
        if (!$fields) respond(['error' => 'Nothing to update'], 422);
        $fields[] = "updated_at = datetime('now')";
        $stmt = db()->prepare('UPDATE posts SET ' . implode(', ', $fields) . ' WHERE id = :id');
        $stmt->execute($params);
        cacheClear();
        respond(['updated' => $stmt->rowCount() > 0]);
    }

    // DELETE /posts/{id} -> soft delete (trash)
    if ($method === 'DELETE' && $id !== null && $sub === null) {
        requireAuth();
        $stmt = db()->prepare("UPDATE posts SET deleted_at = datetime('now') WHERE id = :id AND deleted_at IS NULL");
        $stmt->execute(['id' => $id]);
        cacheClear();
        respond(['trashed' => $stmt->rowCount() > 0]);
    }

    // POST /posts/{id}/restore -> undo trash
    if ($method === 'POST' && $id !== null && $sub === 'restore') {
        requireAuth();
        $stmt = db()->prepare('UPDATE posts SET deleted_at = NULL WHERE id = :id');
        $stmt->execute(['id' => $id]);
        cacheClear();
        respond(['restored' => $stmt->rowCount() > 0]);
    }

    // DELETE /posts/{id}/permanent -> hard delete, trash only
    if ($method === 'DELETE' && $id !== null && $sub === 'permanent') {
        requireAuth();
        $stmt = db()->prepare('DELETE FROM posts WHERE id = :id AND deleted_at IS NOT NULL');
        $stmt->execute(['id' => $id]);
        cacheClear();
        respond(['deleted' => $stmt->rowCount() > 0]);
    }
}

// ---------------------------------------------------------------- media ---
if ($resource === 'media' && $method === 'POST') {
    requireAuth();
    if (empty($_FILES['file'])) {
        respond(['error' => 'No file uploaded — send multipart/form-data with field name "file"'], 422);
    }
    $file = $_FILES['file'];
    if ($file['error'] !== UPLOAD_ERR_OK) respond(['error' => 'Upload failed'], 422);
    if ($file['size'] > 8 * 1024 * 1024) respond(['error' => 'File too large (max 8MB)'], 422);

    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
    $type = mime_content_type($file['tmp_name']);
    if (!isset($allowed[$type])) respond(['error' => 'Only jpg, png, webp, gif images are allowed'], 422);

    if (!is_dir(UPLOADS_DIR)) mkdir(UPLOADS_DIR, 0755, true);
    $name = date('Y/m') . '/' . bin2hex(random_bytes(8)) . '.' . $allowed[$type];
    $dest = UPLOADS_DIR . '/' . $name;
    if (!is_dir(dirname($dest))) mkdir(dirname($dest), 0755, true);
    move_uploaded_file($file['tmp_name'], $dest);

    respond(['url' => UPLOADS_URL . '/' . $name], 201);
}

// -------------------------------------------------------------- contact ---
if ($resource === 'contact' && $method === 'POST') {
    $d = input();
    $name = trim($d['name'] ?? '');
    $email = trim($d['email'] ?? '');
    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(['error' => 'A valid name and email are required'], 422);
    }
    $stmt = db()->prepare('INSERT INTO contacts (name, email, phone, best_time) VALUES (:n, :e, :p, :bt)');
    $stmt->execute([
        'n' => $name,
        'e' => $email,
        'p' => trim($d['phone'] ?? '') ?: null,
        'bt' => trim($d['best_time'] ?? '') ?: null,
    ]);
    respond(['ok' => true], 201);
}

if ($resource === 'contacts' && $method === 'GET') {
    requireAuth();
    $rows = db()->query('SELECT * FROM contacts ORDER BY created_at DESC')->fetchAll(PDO::FETCH_ASSOC);
    respond(['contacts' => $rows]);
}

// ------------------------------------------------------------ subscribe ---
if ($resource === 'subscribe' && $method === 'POST') {
    $d = input();
    $email = trim($d['email'] ?? '');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(['error' => 'A valid email is required'], 422);
    }
    $stmt = db()->prepare('INSERT OR IGNORE INTO subscribers (email) VALUES (:e)');
    $stmt->execute(['e' => $email]);
    respond(['ok' => true], 201);
}

if ($resource === 'subscribers' && $method === 'GET') {
    requireAuth();
    $rows = db()->query('SELECT * FROM subscribers ORDER BY created_at DESC')->fetchAll(PDO::FETCH_ASSOC);
    respond(['subscribers' => $rows]);
}

respond(['error' => 'Not found'], 404);
