<?php
// Pressefy CMS — config & DB bootstrap.
// Zero external dependencies: SQLite lives in a single file, no MySQL quota used.

define('CMS_ROOT', __DIR__);
define('DB_PATH', CMS_ROOT . '/data/cms.sqlite');
define('UPLOADS_DIR', CMS_ROOT . '/uploads');

// Public URL the uploaded images will be served from. Adjust if the cms/
// folder is deployed somewhere other than the site root's /cms/.
define('UPLOADS_URL', '/cms/uploads');

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $isNew = !file_exists(DB_PATH);
        if (!is_dir(dirname(DB_PATH))) {
            mkdir(dirname(DB_PATH), 0755, true);
        }
        $pdo = new PDO('sqlite:' . DB_PATH);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec('PRAGMA foreign_keys = ON');
        if ($isNew) {
            $pdo->exec(file_get_contents(CMS_ROOT . '/schema.sql'));
        }
        // migrate() is idempotent but not free (PRAGMA + several statements) —
        // a marker file means it only actually runs once per deploy instead of
        // on every single request, which was adding real latency to every API
        // call and page load.
        $marker = CMS_ROOT . '/data/.migrated-v2';
        if (!file_exists($marker)) {
            migrate($pdo);
            file_put_contents($marker, date('c'));
        }
    }
    return $pdo;
}

// Idempotent (checks before altering) so it's always safe to run again —
// bump the marker filename above (e.g. .migrated-v3) if you add a new
// migration step here later, so it actually re-runs once.
function migrate(PDO $pdo): void {
    $cols = $pdo->query("PRAGMA table_info(posts)")->fetchAll(PDO::FETCH_COLUMN, 1);
    if (!in_array('scheduled_at', $cols, true)) {
        $pdo->exec('ALTER TABLE posts ADD COLUMN scheduled_at TEXT');
    }
    if (!in_array('deleted_at', $cols, true)) {
        $pdo->exec('ALTER TABLE posts ADD COLUMN deleted_at TEXT');
    }
    if (!in_array('views', $cols, true)) {
        $pdo->exec('ALTER TABLE posts ADD COLUMN views INTEGER NOT NULL DEFAULT 0');
    }

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS contacts (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT NOT NULL,
            email       TEXT NOT NULL,
            phone       TEXT,
            best_time   TEXT,
            created_at  TEXT NOT NULL DEFAULT (datetime(\'now\')),
            read_at     TEXT
        )'
    );
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS subscribers (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            email       TEXT UNIQUE NOT NULL,
            created_at  TEXT NOT NULL DEFAULT (datetime(\'now\'))
        )'
    );
}
