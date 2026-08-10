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
    }
    return $pdo;
}
