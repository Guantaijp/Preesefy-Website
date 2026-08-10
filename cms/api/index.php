<?php
// Pressefy CMS — REST API
//
//   GET    /cms/api/posts            list published posts (public)
//   GET    /cms/api/posts/{slug}     single post (public if published; drafts need an Application Password)
//   POST   /cms/api/posts            create a post (Application Password required)
//   PATCH  /cms/api/posts/{id}       edit a post   (Application Password required)
//   DELETE /cms/api/posts/{id}       delete a post (Application Password required)
//   POST   /cms/api/media            upload an image, field name "file" (Application Password required)

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

// ---------------------------------------------------------------- posts ---
if ($resource === 'posts') {

    if ($method === 'GET' && $id === null) {
        $stmt = db()->query(
            "SELECT id, slug, title, excerpt, featured_image, category, status, created_at, updated_at
             FROM posts WHERE status = 'published' ORDER BY created_at DESC"
        );
        respond(['posts' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    if ($method === 'GET' && $id !== null) {
        $stmt = db()->prepare('SELECT * FROM posts WHERE slug = :s OR id = :i LIMIT 1');
        $stmt->execute(['s' => $id, 'i' => ctype_digit($id) ? (int)$id : -1]);
        $post = $stmt->fetch(PDO::FETCH_ASSOC);
        $authed = currentToken() && tokenIsValid(currentToken());
        if (!$post || ($post['status'] !== 'published' && !$authed)) {
            respond(['error' => 'Not found'], 404);
        }
        respond(['post' => $post]);
    }

    if ($method === 'POST') {
        requireAuth();
        $d = input();
        if (empty($d['title']) || empty($d['content'])) {
            respond(['error' => 'title and content are required'], 422);
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
            'INSERT INTO posts (slug, title, excerpt, content, featured_image, category, status)
             VALUES (:slug, :title, :excerpt, :content, :image, :category, :status)'
        );
        $stmt->execute([
            'slug' => $slug,
            'title' => $d['title'],
            'excerpt' => $d['excerpt'] ?? null,
            'content' => $d['content'],
            'image' => $d['featured_image'] ?? null,
            'category' => $d['category'] ?? null,
            'status' => in_array($d['status'] ?? 'draft', ['draft', 'published'], true) ? $d['status'] : 'draft',
        ]);
        respond(['id' => (int) db()->lastInsertId(), 'slug' => $slug], 201);
    }

    if ($method === 'PATCH' && $id !== null) {
        requireAuth();
        $d = input();
        $allowed = ['title', 'excerpt', 'content', 'featured_image', 'category', 'status'];
        $fields = []; $params = ['id' => $id];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $d)) { $fields[] = "$f = :$f"; $params[$f] = $d[$f]; }
        }
        if (!$fields) respond(['error' => 'Nothing to update'], 422);
        $fields[] = "updated_at = datetime('now')";
        $stmt = db()->prepare('UPDATE posts SET ' . implode(', ', $fields) . ' WHERE id = :id');
        $stmt->execute($params);
        respond(['updated' => $stmt->rowCount() > 0]);
    }

    if ($method === 'DELETE' && $id !== null) {
        requireAuth();
        $stmt = db()->prepare('DELETE FROM posts WHERE id = :id');
        $stmt->execute(['id' => $id]);
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

respond(['error' => 'Not found'], 404);
